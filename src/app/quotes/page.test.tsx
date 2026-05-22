import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import QuotesHistory from '@/app/quotes/page'
import { expect, test, beforeEach, describe, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useQuoteStore } from '@/store/useQuoteStore'
import { ReactNode } from 'react'
import * as api from '@/lib/api'
import * as useQuotesHook from '@/hooks/useQuotes'

vi.mock('@/lib/api', async () => {
  const actual = await vi.importActual<typeof import('@/lib/api')>('@/lib/api')
  return {
    ...actual,
    getQuotes: vi.fn(),
    updateQuote: vi.fn(),
  }
})

vi.mock('@/hooks/useQuotes', async () => {
  const actual = await vi.importActual<typeof import('@/hooks/useQuotes')>('@/hooks/useQuotes')
  return {
    ...actual,
    useUpdateQuote: vi.fn(),
    useDeleteQuote: vi.fn(),
  }
})

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

describe('QuotesHistory Page', () => {
  const mockUpdateQuote = vi.fn()
  const mockDeleteQuote = vi.fn()

  beforeEach(() => {
    const mockQuotes = [
      { id: 1, title: 'Reforma Cozinha', client: { name: 'João' }, amount: 1000, status: 'DRAFT', date: '2026-05-16', items: [] },
      { id: 2, title: 'Pintura Sala', client: { name: 'Maria' }, amount: 2000, status: 'ACCEPTED', date: '2026-05-17', items: [] },
    ]
    useQuoteStore.setState({ quotes: mockQuotes as any })
    vi.mocked(api.getQuotes).mockResolvedValue(mockQuotes as any)
    
    vi.mocked(useQuotesHook.useUpdateQuote).mockReturnValue({
      mutate: mockUpdateQuote,
      isPending: false,
    } as any)

    vi.mocked(useQuotesHook.useDeleteQuote).mockReturnValue({
      mutate: mockDeleteQuote,
      isPending: false,
    } as any)

    queryClient.clear()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  test('renders list of quotes', async () => {
    render(<QuotesHistory />, { wrapper })

    expect((await screen.findAllByText(/Reforma Cozinha/i)).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Pintura Sala/i).length).toBeGreaterThan(0)
  })

  test('changes quote status', async () => {
    render(<QuotesHistory />, { wrapper })

    await screen.findAllByText(/Reforma Cozinha/i)

    const selects = await screen.findAllByRole('combobox')
    // The first one is the global filter, the rest are for each quote (Desktop view)
    // Actually, mobile view also has selects now.
    const quoteSelect = selects[1] 

    fireEvent.change(quoteSelect, { target: { value: 'PAID' } })

    expect(mockUpdateQuote).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        updates: expect.objectContaining({ status: 'PAID' })
      }),
      expect.any(Object)
    )
  })

  test('deletes a quote', async () => {
    render(<QuotesHistory />, { wrapper })

    await screen.findAllByText(/Reforma Cozinha/i)

    const deleteButtons = screen.getAllByTitle(/Excluir Orçamento/i)
    fireEvent.click(deleteButtons[0])

    expect(window.confirm).toHaveBeenCalled()
    expect(mockDeleteQuote).toHaveBeenCalledWith(1)
  })

  test('filters by search term', async () => {
    render(<QuotesHistory />, { wrapper })

    expect((await screen.findAllByText(/Reforma Cozinha/i)).length).toBeGreaterThan(0)

    const searchInput = screen.getByPlaceholderText(/procurar orçamentos/i)
    fireEvent.change(searchInput, { target: { value: 'Cozinha' } })

    expect(screen.getAllByText(/Reforma Cozinha/i).length).toBeGreaterThan(0)
    expect(screen.queryByText(/Pintura Sala/i)).not.toBeInTheDocument()
  })

  test('filters by status', async () => {
    render(<QuotesHistory />, { wrapper })

    expect((await screen.findAllByText(/Pintura Sala/i)).length).toBeGreaterThan(0)

    const statusSelect = screen.getByLabelText(/status/i)
    fireEvent.change(statusSelect, { target: { value: 'approved' } })

    expect(screen.getAllByText(/Pintura Sala/i).length).toBeGreaterThan(0)
    expect(screen.queryByText(/Reforma Cozinha/i)).not.toBeInTheDocument()
  })
})
