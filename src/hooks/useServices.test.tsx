import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { beforeEach, describe, expect, test } from 'vitest'
import { useCreateService, useDeleteService, useServices, useUpdateService } from './useServices'
import { defaultServices, useServiceStore } from '@/store/useServiceStore'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('useServices hooks', () => {
  beforeEach(() => {
    useServiceStore.setState({
      services: defaultServices,
      items: defaultServices,
    })
    queryClient.clear()
  })

  test('useServices fetches services', async () => {
    const { result } = renderHook(() => useServices(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(defaultServices.length)
  })

  test('useCreateService adds a new service', async () => {
    const { result } = renderHook(() => useCreateService(), { wrapper })

    result.current.mutate({
      id: 'srv-new',
      name: 'Novo Serviço',
      description: 'Descrição nova',
      unit: 'm²',
      defaultUnitPrice: 99,
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const services = useServiceStore.getState().services
    expect(services[0].id).toBe('srv-new')
  })

  test('useUpdateService updates an existing service', async () => {
    const { result } = renderHook(() => useUpdateService(), { wrapper })

    result.current.mutate({
      id: 'srv1',
      updates: { name: 'Pintura Premium', defaultUnitPrice: 55 },
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(useServiceStore.getState().services[0].name).toBe('Pintura Premium')
  })

  test('useDeleteService removes a service', async () => {
    const { result } = renderHook(() => useDeleteService(), { wrapper })

    result.current.mutate('srv1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(useServiceStore.getState().services.find((service) => service.id === 'srv1')).toBeUndefined()
  })
})