import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEstimateStore, Estimate } from '@/store/useEstimateStore'

export function useEstimates() {
  const estimates = useEstimateStore((state) => state.estimates)
  
  return useQuery({
    queryKey: ['estimates'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      return estimates
    },
  })
}

export function useCreateEstimate() {
  const queryClient = useQueryClient()
  const addEstimate = useEstimateStore((state) => state.addEstimate)

  return useMutation({
    mutationFn: async (newEstimate: Estimate) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))
      addEstimate(newEstimate)
      return newEstimate
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estimates'] })
    },
  })
}
