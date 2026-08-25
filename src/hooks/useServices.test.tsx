import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { useCreateService, useDeleteService, useServices, useUpdateService } from './useServices'
import { defaultServices, useServiceStore } from '@/store/useServiceStore'
import * as api from '@/lib/api'

vi.mock('@/lib/api', () => ({
  getServices: vi.fn(),
  createService: vi.fn(),
  updateService: vi.fn(),
  deleteService: vi.fn(),
}))

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

const wrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = createTestQueryClient()
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('useServices hooks', () => {
  beforeEach(() => {
    useServiceStore.setState({
      services: defaultServices,
      items: defaultServices,
    })
    vi.clearAllMocks()
  })

  test('useServices fetches services', async () => {
    vi.mocked(api.getServices).mockResolvedValue(defaultServices)
    const { result } = renderHook(() => useServices(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(defaultServices.length)
  })

  test('useCreateService adds a new service', async () => {
    const newServiceData = {
      name: 'Novo Serviço',
      description: 'Descrição nova',
      unit: 'm²' as const,
      defaultUnitPrice: 99,
    }
    const createdService = { id: 2, ...newServiceData }
    vi.mocked(api.createService).mockResolvedValue(createdService)

    const { result } = renderHook(() => useCreateService(), { wrapper })

    result.current.mutate(newServiceData)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const services = useServiceStore.getState().services
    expect(services[0].id).toBe(2)
  })

  test('useUpdateService updates an existing service', async () => {
    const updatedService = {
      id: 1,
      name: 'Pintura Premium',
      description: 'Aplicação interna',
      unit: 'm²' as const,
      defaultUnitPrice: 55,
    }
    vi.mocked(api.updateService).mockResolvedValue(updatedService)

    const { result } = renderHook(() => useUpdateService(), { wrapper })

    result.current.mutate({
      id: 1,
      updates: { name: 'Pintura Premium', defaultUnitPrice: 55 },
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(useServiceStore.getState().services[0].name).toBe('Pintura Premium')
  })

  test('useDeleteService removes a service', async () => {
    vi.mocked(api.deleteService).mockResolvedValue(undefined)

    const { result } = renderHook(() => useDeleteService(), { wrapper })

    result.current.mutate(1)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(useServiceStore.getState().services.find((service) => service.id === 1)).toBeUndefined()
  })
})