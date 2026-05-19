import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useClientStore, Client } from '@/store/useClientStore'

export function useClients() {
  const clients = useClientStore((state) => state.clients)
  
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      return clients
    },
  })
}

export function useCreateClient() {
  const queryClient = useQueryClient()
  const addClient = useClientStore((state) => state.addClient)

  return useMutation({
    mutationFn: async (newClient: Client) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))
      addClient(newClient)
      return newClient
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })
}
