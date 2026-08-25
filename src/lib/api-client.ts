/**
 * Base HTTP client for all API requests
 * Centralizes fetch logic, intelligent error extraction, and base URL management
 */

const baseUrl = process.env.NODE_ENV === 'development' 
  ? '' 
  : (process.env.NEXT_PUBLIC_API_BASE_URL || '')

type UnauthorizedHandler = () => void
let unauthorizedHandler: UnauthorizedHandler | null = null

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  try {
    if (typeof window !== 'undefined') {
      const authStorage = localStorage.getItem('auth-storage')
      if (authStorage) {
        const { state } = JSON.parse(authStorage)
        if (state?.token) {
          headers['Authorization'] = `Bearer ${state.token}`
        }
      }
    }
  } catch (error) {
    console.error('Error reading auth token from localStorage', error)
  }

  return headers
}

/**
 * Extracts a user-friendly error message from any backend error response structure.
 * Supports string bodies, NestJS validation arrays, Spring/ASP Problem Details, FastAPI detail, etc.
 */
export function extractApiErrorMessage(errorData: unknown, status?: number, fallbackMessage?: string): string {
  // If errorData is a string (e.g. plain text response)
  if (typeof errorData === 'string' && errorData.trim().length > 0) {
    const trimmed = errorData.trim()
    // Ignore HTML error pages (e.g. 502/504 HTML gateways)
    if (!trimmed.startsWith('<')) {
      return trimmed
    }
  }

  // If errorData is an object
  if (errorData && typeof errorData === 'object') {
    const record = errorData as Record<string, unknown>

    // NestJS / class-validator style array in message: { message: ["email must be valid", "name is required"] }
    if (Array.isArray(record.message) && record.message.length > 0) {
      const validMessages = record.message.filter((m) => typeof m === 'string' && m.trim().length > 0)
      if (validMessages.length > 0) {
        return validMessages.join('. ')
      }
    }

    // Standard message string: { message: "..." }
    if (typeof record.message === 'string' && record.message.trim().length > 0) {
      return record.message.trim()
    }

    // Standard error string: { error: "..." }
    if (typeof record.error === 'string' && record.error.trim().length > 0) {
      return record.error.trim()
    }

    // RFC 7807 problem details: { detail: "..." }
    if (typeof record.detail === 'string' && record.detail.trim().length > 0) {
      return record.detail.trim()
    }

    // RFC 7807 problem details: { title: "..." }
    if (typeof record.title === 'string' && record.title.trim().length > 0) {
      return record.title.trim()
    }

    // Validation errors object or array: { errors: { field: ["error"] } } or { errors: ["..."] }
    if (record.errors) {
      if (Array.isArray(record.errors) && record.errors.length > 0) {
        const errorStrings = record.errors
          .map((e) => {
            if (typeof e === 'string') return e
            if (typeof e === 'object' && e !== null && 'message' in e) {
              return String((e as { message: unknown }).message)
            }
            return null
          })
          .filter(Boolean) as string[]
        if (errorStrings.length > 0) {
          return errorStrings.join('. ')
        }
      } else if (typeof record.errors === 'object' && record.errors !== null) {
        const errorList: string[] = []
        for (const [field, messages] of Object.entries(record.errors)) {
          if (Array.isArray(messages)) {
            errorList.push(`${field}: ${messages.join(', ')}`)
          } else if (typeof messages === 'string') {
            errorList.push(`${field}: ${messages}`)
          }
        }
        if (errorList.length > 0) {
          return errorList.join('. ')
        }
      }
    }
  }

  if (fallbackMessage) {
    return fallbackMessage
  }

  // Friendly Portuguese defaults for common HTTP status codes
  if (status !== undefined) {
    switch (status) {
      case 0:
        return 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.'
      case 400:
        return 'Requisição inválida. Verifique as informações fornecidas.'
      case 401:
        return 'Sessão expirada ou não autorizada. Faça login novamente.'
      case 403:
        return 'Você não tem permissão para realizar esta ação.'
      case 404:
        return 'O recurso solicitado não foi encontrado no servidor.'
      case 409:
        return 'Conflito de dados (o registro já existe ou está vinculado a outros dados).'
      case 422:
        return 'Dados inválidos. Verifique os campos preenchidos.'
      case 500:
        return 'Erro interno no servidor. Tente novamente mais tarde.'
      case 502:
      case 503:
      case 504:
        return 'Serviço temporariamente indisponível. Tente novamente em instantes.'
      default:
        if (status >= 400 && status < 500) return `Erro na requisição (${status}).`
        if (status >= 500) return `Erro no servidor (${status}).`
    }
  }

  return 'Ocorreu um erro inesperado ao comunicar com o servidor.'
}

/**
 * Universal helper to extract a message from an unknown error
 */
export function getErrorMessage(error: unknown, fallback = 'Ocorreu um erro inesperado.'): string {
  if (error instanceof ApiError) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message || fallback
  }
  if (typeof error === 'string' && error.trim().length > 0) {
    return error.trim()
  }
  return fallback
}

export class ApiError extends Error {
  public isNetworkError: boolean
  public isAuthError: boolean

  constructor(
    public status: number,
    public data: unknown,
    customMessage?: string
  ) {
    const resolvedMessage = customMessage || extractApiErrorMessage(data, status)
    super(resolvedMessage)
    this.name = 'ApiError'
    this.isNetworkError = status === 0
    this.isAuthError = status === 401 || status === 403
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: unknown
    try {
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json()
      } else {
        errorData = await response.text()
      }
    } catch {
      errorData = null
    }

    // Trigger unauthorized callback if session expired
    if (response.status === 401 && unauthorizedHandler) {
      unauthorizedHandler()
    }

    throw new ApiError(response.status, errorData)
  }

  // Handle 204 No Content or empty responses
  if (response.status === 204) {
    return undefined as T
  }

  const contentType = response.headers.get('content-type')
  if (!contentType || !contentType.includes('application/json')) {
    return undefined as T
  }

  try {
    return (await response.json()) as T
  } catch (parseError) {
    console.warn('Failed to parse JSON response despite application/json header', parseError)
    return undefined as T
  }
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${baseUrl}${path}`
  const headers = {
    ...getHeaders(),
    ...(options.headers as Record<string, string>),
  }

  let response: Response
  try {
    response = await fetch(url, {
      ...options,
      headers,
    })
  } catch (error) {
    // Network failures (offline, connection refused, CORS, DNS failure)
    console.error(`Network error requesting ${path}:`, error)
    throw new ApiError(0, null, 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.')
  }

  return handleResponse<T>(response)
}

export async function apiGet<T>(path: string): Promise<T> {
  return apiFetch<T>(path, { method: 'GET' })
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: 'POST',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
}

export async function apiPut<T>(path: string, body?: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: 'PUT',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
}

export async function apiDelete<T>(path: string): Promise<T> {
  return apiFetch<T>(path, { method: 'DELETE' })
}
