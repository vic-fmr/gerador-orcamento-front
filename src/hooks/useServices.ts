import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ServiceItem, useServiceStore } from '@/store/useServiceStore'

export function useServices() {
  const services = useServiceStore((state) => state.services)

  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return services
    },
  })
}

export function useCreateService() {
  const queryClient = useQueryClient()
  const addService = useServiceStore((state) => state.addService)

  return useMutation({
    mutationFn: async (newService: ServiceItem) => {
      await new Promise((resolve) => setTimeout(resolve, 800))
      addService(newService)
      return newService
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })
}

export function useUpdateService() {
  const queryClient = useQueryClient()
  const updateService = useServiceStore((state) => state.updateService)

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ServiceItem> }) => {
      await new Promise((resolve) => setTimeout(resolve, 800))
      updateService(id, updates)
      return { id, updates }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })
}

export function useDeleteService() {
  const queryClient = useQueryClient()
  const removeService = useServiceStore((state) => state.removeService)

  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      removeService(id)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })
}