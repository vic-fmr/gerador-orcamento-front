import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  ApiError,
  extractApiErrorMessage,
  getErrorMessage,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  setUnauthorizedHandler,
} from './api-client'

describe('extractApiErrorMessage', () => {
  it('extracts string errorData directly', () => {
    expect(extractApiErrorMessage('Erro customizado do backend')).toBe('Erro customizado do backend')
  })

  it('ignores HTML error strings and falls back to status message', () => {
    expect(extractApiErrorMessage('<html><body>502 Bad Gateway</body></html>', 502)).toBe(
      'Serviço temporariamente indisponível. Tente novamente em instantes.'
    )
  })

  it('extracts message array from NestJS/validation responses', () => {
    const errorData = {
      message: ['O nome é obrigatório', 'O e-mail deve ser válido'],
      error: 'Bad Request',
      statusCode: 400,
    }
    expect(extractApiErrorMessage(errorData)).toBe('O nome é obrigatório. O e-mail deve ser válido')
  })

  it('extracts string message from standard object response', () => {
    expect(extractApiErrorMessage({ message: 'Credenciais inválidas' })).toBe('Credenciais inválidas')
  })

  it('extracts error field from object', () => {
    expect(extractApiErrorMessage({ error: 'Acesso negado' })).toBe('Acesso negado')
  })

  it('extracts detail field from RFC 7807 problem details', () => {
    expect(extractApiErrorMessage({ detail: 'Orçamento não encontrado' })).toBe('Orçamento não encontrado')
  })

  it('extracts title field from RFC 7807 when detail is missing', () => {
    expect(extractApiErrorMessage({ title: 'Entidade não processável' })).toBe('Entidade não processável')
  })

  it('extracts formatted field errors from errors object dictionary', () => {
    const errorData = {
      errors: {
        email: ['E-mail já está em uso'],
        password: ['Senha muito fraca'],
      },
    }
    expect(extractApiErrorMessage(errorData)).toBe('email: E-mail já está em uso. password: Senha muito fraca')
  })

  it('extracts formatted errors from errors array', () => {
    const errorData = {
      errors: ['Campo obrigatório ausente', 'Valor deve ser numérico'],
    }
    expect(extractApiErrorMessage(errorData)).toBe('Campo obrigatório ausente. Valor deve ser numérico')
  })

  it('returns Portuguese status fallbacks for known HTTP status codes', () => {
    expect(extractApiErrorMessage(null, 0)).toBe(
      'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.'
    )
    expect(extractApiErrorMessage(null, 400)).toBe('Requisição inválida. Verifique as informações fornecidas.')
    expect(extractApiErrorMessage(null, 401)).toBe('Sessão expirada ou não autorizada. Faça login novamente.')
    expect(extractApiErrorMessage(null, 403)).toBe('Você não tem permissão para realizar esta ação.')
    expect(extractApiErrorMessage(null, 404)).toBe('O recurso solicitado não foi encontrado no servidor.')
    expect(extractApiErrorMessage(null, 409)).toBe(
      'Conflito de dados (o registro já existe ou está vinculado a outros dados).'
    )
    expect(extractApiErrorMessage(null, 422)).toBe('Dados inválidos. Verifique os campos preenchidos.')
    expect(extractApiErrorMessage(null, 500)).toBe('Erro interno no servidor. Tente novamente mais tarde.')
    expect(extractApiErrorMessage(null, 503)).toBe(
      'Serviço temporariamente indisponível. Tente novamente em instantes.'
    )
  })

  it('uses fallbackMessage when provided and no specific backend message is present', () => {
    expect(extractApiErrorMessage(null, undefined, 'Mensagem customizada')).toBe('Mensagem customizada')
  })
})

describe('getErrorMessage helper', () => {
  it('extracts message from ApiError', () => {
    const apiError = new ApiError(400, { message: 'Erro de validação' })
    expect(getErrorMessage(apiError)).toBe('Erro de validação')
  })

  it('extracts message from standard Error', () => {
    const error = new Error('Falha genérica')
    expect(getErrorMessage(error)).toBe('Falha genérica')
  })

  it('extracts raw string error', () => {
    expect(getErrorMessage('Erro em formato texto')).toBe('Erro em formato texto')
  })

  it('returns fallback for unknown error types', () => {
    expect(getErrorMessage(null, 'Erro padrão')).toBe('Erro padrão')
  })
})

describe('ApiError class', () => {
  it('identifies network errors (status 0)', () => {
    const error = new ApiError(0, null)
    expect(error.isNetworkError).toBe(true)
    expect(error.isAuthError).toBe(false)
  })

  it('identifies auth errors (status 401/403)', () => {
    const err401 = new ApiError(401, null)
    const err403 = new ApiError(403, null)
    expect(err401.isAuthError).toBe(true)
    expect(err403.isAuthError).toBe(true)
    expect(err401.isNetworkError).toBe(false)
  })
})

describe('API request functions with error handling', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    global.fetch = originalFetch
    setUnauthorizedHandler(null)
  })

  it('apiGet returns json data on 200 OK', async () => {
    const mockData = [{ id: 1, name: 'Client 1' }]
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => mockData,
    })

    const result = await apiGet('/api/clients')
    expect(result).toEqual(mockData)
  })

  it('apiGet handles 204 No Content without error', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
      headers: new Headers(),
    })

    const result = await apiGet('/api/clients/1')
    expect(result).toBeUndefined()
  })

  it('throws ApiError with extracted message when backend returns 400 Bad Request', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ message: 'Nome é obrigatório' }),
    })

    await expect(apiGet('/api/clients')).rejects.toThrow('Nome é obrigatório')
  })

  it('triggers unauthorizedHandler on 401 response', async () => {
    const unauthorizedMock = vi.fn()
    setUnauthorizedHandler(unauthorizedMock)

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ message: 'Token expirado' }),
    })

    await expect(apiGet('/api/quotes')).rejects.toThrow(ApiError)
    expect(unauthorizedMock).toHaveBeenCalled()
  })

  it('catches network fetch errors and converts to ApiError with status 0', async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))

    try {
      await apiGet('/api/quotes')
      expect.unreachable('Should have thrown an error')
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError)
      expect((err as ApiError).status).toBe(0)
      expect((err as ApiError).isNetworkError).toBe(true)
      expect((err as ApiError).message).toContain('Não foi possível conectar ao servidor')
    }
  })

  it('apiPost sends JSON stringified body and handles response', async () => {
    const newClient = { name: 'Cliente Teste' }
    const createdClient = { id: 1, name: 'Cliente Teste' }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => createdClient,
    })

    const result = await apiPost('/api/clients', newClient)
    expect(result).toEqual(createdClient)
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(newClient),
      })
    )
  })

  it('apiPut sends JSON stringified body', async () => {
    const updateData = { name: 'Nome Atualizado' }
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ id: 1, ...updateData }),
    })

    const result = await apiPut('/api/clients/1', updateData)
    expect(result).toEqual({ id: 1, name: 'Nome Atualizado' })
  })

  it('apiDelete executes DELETE request', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
      headers: new Headers(),
    })

    const result = await apiDelete('/api/clients/1')
    expect(result).toBeUndefined()
  })
})
