/**
 * Base HTTP client for all API requests
 * Centralizes fetch logic, error handling, and base URL management
 */

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api'

export class ApiError extends Error {
  constructor(
    public status: number,
    public data: unknown,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: unknown
    try {
      errorData = await response.json()
    } catch {
      errorData = await response.text()
    }
    throw new ApiError(response.status, errorData, `API error: ${response.status}`)
  }

  // Handle empty responses
  const contentType = response.headers.get('content-type')
  if (!contentType || !contentType.includes('application/json')) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return handleResponse<T>(response)
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  return handleResponse<T>(response)
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  return handleResponse<T>(response)
}

export async function apiDelete<T>(path: string): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return handleResponse<T>(response)
}
