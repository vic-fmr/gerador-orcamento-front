import { renderHook, waitFor } from '@testing-library/react'
import { useEstimates, useCreateEstimate } from './useEstimates'
import { expect, test, beforeEach, describe } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEstimateStore } from '@/store/useEstimateStore'
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

describe('useEstimates hooks', () => {
  beforeEach(() => {
    useEstimateStore.setState({ estimates: [] })
    queryClient.clear()
  })

  test('useEstimates fetches estimates', async () => {
    useEstimateStore.setState({ 
      estimates: [
        { id: '1', title: 'T1', client: 'C1', amount: 100, status: 'pending', date: '', items: [] }
      ] 
    })
    
    const { result } = renderHook(() => useEstimates(), { wrapper })
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].title).toBe('T1')
  })

  test('useCreateEstimate adds a new estimate', async () => {
    const { result } = renderHook(() => useCreateEstimate(), { wrapper })
    
    const newEstimate = { id: '2', title: 'T2', client: 'C2', amount: 200, status: 'pending' as const, date: '', items: [] }
    
    result.current.mutate(newEstimate)
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    
    const estimates = useEstimateStore.getState().estimates
    expect(estimates).toHaveLength(1)
    expect(estimates[0].title).toBe('T2')
  })
})
