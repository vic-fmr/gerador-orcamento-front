import { renderHook, waitFor } from '@testing-library/react'
import { useClients, useCreateClient, useDeleteClient } from './useClients'
import { expect, test, beforeEach, describe, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useClientStore } from '@/store/useClientStore'
import { ReactNode } from 'react'
import * as api from '@/lib/api'

vi.mock('@/lib/api', () => ({
  getClients: vi.fn(),
  createClient: vi.fn(),
  deleteClient: vi.fn(),
}))

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const wrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = createTestQueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useClients hooks', () => {
  beforeEach(() => {
    useClientStore.setState({ clients: [] })
    vi.clearAllMocks()
  })

  test('useClients fetches clients', async () => {
    const mockClients = [{ id: 1, name: 'Test Client', email: 'test@example.com' }]
    vi.mocked(api.getClients).mockResolvedValue(mockClients)
    
    const { result } = renderHook(() => useClients(), { wrapper })
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].name).toBe('Test Client')
  })

  test('useCreateClient adds a new client', async () => {
    const newClient = { name: 'New Test', email: 'new@example.com' }
    const createdClient = { id: 2, ...newClient }
    vi.mocked(api.createClient).mockResolvedValue(createdClient)

    const { result } = renderHook(() => useCreateClient(), { wrapper })
    
    result.current.mutate(newClient)
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    
    const clients = useClientStore.getState().clients
    expect(clients).toContainEqual(createdClient)
  })

  test('useDeleteClient removes a client', async () => {
    const clientToDelete = { id: 1, name: 'To Be Deleted' }
    useClientStore.setState({ clients: [clientToDelete] })
    vi.mocked(api.deleteClient).mockResolvedValue(undefined)

    const { result } = renderHook(() => useDeleteClient(), { wrapper })
    
    result.current.mutate(1)
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    
    const clients = useClientStore.getState().clients
    expect(clients).toHaveLength(0)
    expect(api.deleteClient).toHaveBeenCalledWith(1)
  })
})
