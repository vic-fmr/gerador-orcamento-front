import { render, screen, fireEvent } from '@testing-library/react'
import EstimatesHistory from '@/app/estimates/page'
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

describe('EstimatesHistory Page', () => {
  beforeEach(() => {
    useEstimateStore.setState({
      estimates: [
        { id: '1', title: 'Reforma Cozinha', client: 'João', amount: 1000, status: 'pending', date: '2026-05-16', items: [] },
        { id: '2', title: 'Pintura Sala', client: 'Maria', amount: 2000, status: 'approved', date: '2026-05-17', items: [] },
      ]
    })
    queryClient.clear()
  })

  test('renders list of estimates', async () => {
    render(<EstimatesHistory />, { wrapper })
    
    expect((await screen.findAllByText(/Reforma Cozinha/i)).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Pintura Sala/i).length).toBeGreaterThan(0)
  })

  test('filters by search term', async () => {
    render(<EstimatesHistory />, { wrapper })
    
    expect((await screen.findAllByText(/Reforma Cozinha/i)).length).toBeGreaterThan(0)
    
    const searchInput = screen.getByPlaceholderText(/procurar orçamentos/i)
    fireEvent.change(searchInput, { target: { value: 'Cozinha' } })
    
    expect(screen.getAllByText(/Reforma Cozinha/i).length).toBeGreaterThan(0)
    expect(screen.queryByText(/Pintura Sala/i)).not.toBeInTheDocument()
  })

  test('filters by status', async () => {
    render(<EstimatesHistory />, { wrapper })
    
    expect((await screen.findAllByText(/Pintura Sala/i)).length).toBeGreaterThan(0)
    
    const statusSelect = screen.getByLabelText(/status/i)
    fireEvent.change(statusSelect, { target: { value: 'approved' } })
    
    expect(screen.getAllByText(/Pintura Sala/i).length).toBeGreaterThan(0)
    expect(screen.queryByText(/Reforma Cozinha/i)).not.toBeInTheDocument()
  })
})
