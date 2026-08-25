import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import {
  getClients,
  createClient as apiCreateClient,
  updateClient as apiUpdateClient,
  deleteClient as apiDeleteClient,
  Client,
} from '@/lib/api'
import { useClientStore } from '@/store/useClientStore'
import { toast } from '@/lib/toast'

export function useClients() {
  const setClients = useClientStore((s) => s.setClients)

  const query = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: async () => {
      return await getClients()
    },
  })

  useEffect(() => {
    const data = query.data
    if (data && Array.isArray(data)) setClients(data)
  }, [query.data, setClients])

  return query
}

export function useCreateClient() {
  const queryClient = useQueryClient()
  const addClient = useClientStore((state) => state.addClient)

  return useMutation({
    mutationFn: async (newClient: Omit<Client, 'id'>) => {
      const created = await apiCreateClient(newClient)
      addClient(created)
      return created
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Cliente cadastrado com sucesso!')
    },
  })
}

export function useUpdateClient() {
  const queryClient = useQueryClient()
  const updateClient = useClientStore((state) => state.updateClient)

  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Client> }) => {
      const updated = await apiUpdateClient(id, updates)
      updateClient(id, updates)
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Cliente atualizado com sucesso!')
    },
  })
}

export function useDeleteClient() {
  const queryClient = useQueryClient()
  const removeClient = useClientStore((state) => state.removeClient)

  return useMutation({
    mutationFn: async (id: number) => {
      await apiDeleteClient(id)
      removeClient(id)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Cliente excluído com sucesso!')
    },
  })
}
