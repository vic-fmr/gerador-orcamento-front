import { renderHook, waitFor } from '@testing-library/react'
import { useClients, useCreateClient } from './useClients'
import { expect, test, beforeEach, describe } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useClientStore } from '@/store/useClientStore'
import { ReactNode } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
)

describe('useClients hooks', () => {
  beforeEach(() => {
    useClientStore.setState({ clients: [] })
    queryClient.clear()
  })

  test('useClients fetches clients', async () => {
    useClientStore.setState({ 
      clients: [
        { id: 'cli1', name: 'Test Client', email: 'test@example.com' }
      ] 
    })
    
    const { result } = renderHook(() => useClients(), { wrapper })
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].name).toBe('Test Client')
  })

  test('useCreateClient adds a new client', async () => {
    const { result } = renderHook(() => useCreateClient(), { wrapper })
    
    const newClient = { id: 'new-cli', name: 'New Test', email: 'new@example.com' }
    
    result.current.mutate(newClient)
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    
    const clients = useClientStore.getState().clients
    expect(clients).toHaveLength(1)
    expect(clients[0].name).toBe('New Test')
  })
})