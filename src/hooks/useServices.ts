import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import {
  getServices,
  createService as apiCreateService,
  updateService as apiUpdateService,
  deleteService as apiDeleteService,
  ServiceItem,
} from '@/lib/api'
import { useServiceStore } from '@/store/useServiceStore'

export function useServices() {
  const setServices = useServiceStore((s) => s.setServices)

  const query = useQuery<ServiceItem[]>({
    queryKey: ['services'],
    queryFn: async () => {
      return await getServices()
    },
  })

  useEffect(() => {
    const data = query.data
    if (data && Array.isArray(data)) setServices(data)
  }, [query.data, setServices])

  return query
}

export function useCreateService() {
  const queryClient = useQueryClient()
  const addService = useServiceStore((state) => state.addService)

  return useMutation({
    mutationFn: async (newService: Omit<ServiceItem, 'id'>) => {
      const created = await apiCreateService(newService)
      addService(created)
      return created
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
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<ServiceItem> }) => {
      const updated = await apiUpdateService(id, updates)
      updateService(id, updates)
      return updated
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
    mutationFn: async (id: number) => {
      await apiDeleteService(id)
      removeService(id)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })
}