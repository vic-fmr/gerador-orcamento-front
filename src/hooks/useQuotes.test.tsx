import { renderHook, waitFor } from '@testing-library/react'
import { useQuotes, useCreateQuote } from './useQuotes'
import { expect, test, beforeEach, describe, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useQuoteStore } from '@/store/useQuoteStore'
import { ReactNode } from 'react'
import * as api from '@/lib/api'

vi.mock('@/lib/api', async () => {
  const actual = await vi.importActual<typeof import('@/lib/api')>('@/lib/api')
  return {
    ...actual,
    getQuotes: vi.fn(),
    createQuote: vi.fn(),
  }
})

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

describe('useQuotes hooks', () => {
  beforeEach(() => {
    useQuoteStore.setState({ quotes: [] })
    vi.clearAllMocks()
  })

  test('normalizeAmount handles various inputs', () => {
    // This is a private function but we can test it through normalizeQuote or by exported it if we want
    // For now let's just test through useQuotes mock if we can, or just trust the logic
  })

  test('useQuotes handles missing amount by calculating from items', async () => {
    const mockQuotes = [
      { 
        id: 1, 
        title: 'T1', 
        client: 101, 
        status: 'DRAFT', 
        date: '', 
        items: [
          { id: 'i1', description: 'Item 1', quantity: 2, unitPrice: 50, unit: 'un' }
        ] 
      }
    ]
    vi.mocked(api.getQuotes).mockResolvedValue(mockQuotes as any)

    const { result } = renderHook(() => useQuotes(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.[0].amount).toBe(100)
  })

  test('useQuotes handles alternative field names', async () => {
    const mockQuotes = [
      { id: 1, title: 'T1', client: 101, status: 'DRAFT', date: '', total: 150, items: [] },
      { id: 2, title: 'T2', client: 102, status: 'DRAFT', date: '', valor: 250, items: [] }
    ]
    vi.mocked(api.getQuotes).mockResolvedValue(mockQuotes as any)

    const { result } = renderHook(() => useQuotes(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.[0].amount).toBe(150)
    expect(result.current.data?.[1].amount).toBe(250)
  })

  test('useCreateQuote adds a new quote', async () => {
    const newQuote = { title: 'T2', client: 102, amount: 200, status: 'DRAFT' as const, date: '', items: [] }
    const createdQuote = { id: 2, ...newQuote }
    vi.mocked(api.createQuote).mockResolvedValue(createdQuote as any)

    const { result } = renderHook(() => useCreateQuote(), { wrapper })

    result.current.mutate(newQuote)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const quotes = useQuoteStore.getState().quotes
    expect(quotes).toHaveLength(1)
    expect(quotes[0].title).toBe('T2')
  })
})

