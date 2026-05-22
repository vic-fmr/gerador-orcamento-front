import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import NewQuotePage from '@/app/quotes/new/page'
import { expect, test, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useClientStore } from '@/store/useClientStore'
import { useServiceStore } from '@/store/useServiceStore'
import * as api from '@/lib/api'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

// Mock usePathname and useRouter
vi.mock('next/navigation', () => ({
  usePathname: () => '/quotes/new',
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

vi.mock('@/lib/api', async () => {
  const actual = await vi.importActual<typeof import('@/lib/api')>('@/lib/api')
  return {
    ...actual,
    getClients: vi.fn(),
    getServices: vi.fn(),
    createQuote: vi.fn(),
  }
})

describe('NewQuotePage Wizard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    queryClient.clear()
    
    // Setup initial data
    const mockClients = [{ id: 1, name: 'Maria Oliveira' }]
    const mockServices = [{ id: 1, name: 'Pintura de Parede', description: 'Pintura interna', unit: 'm²', defaultUnitPrice: 25 }]
    
    useClientStore.setState({ clients: mockClients })
    useServiceStore.setState({ services: mockServices, items: mockServices })
    
    vi.mocked(api.getClients).mockResolvedValue(mockClients)
    vi.mocked(api.getServices).mockResolvedValue(mockServices as any)
  })

  test('New Estimate page follows a wizard flow and allows export', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <NewQuotePage />
      </QueryClientProvider>
    )

    // Step 1: Project Details
    expect(screen.getByLabelText(/título/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/cliente/i)).toBeInTheDocument()

    // Fill Step 1
    fireEvent.change(screen.getByLabelText(/título/i), { target: { value: 'Test Title' } })

    // Searchable dropdown selection
    const clientButton = screen.getByRole('combobox')
    fireEvent.click(clientButton)
    const searchInput = screen.getByPlaceholderText(/procurar cliente/i)
    fireEvent.change(searchInput, { target: { value: 'Maria' } })
    const mariaOption = screen.getByText(/Maria Oliveira/i)
    fireEvent.click(mariaOption)

    // Go to Step 2
    const nextButton = screen.getByRole('button', { name: /próximo/i })
    fireEvent.click(nextButton)

    // Step 2: Line Items
    expect(await screen.findByText(/Itens do Orçamento/i)).toBeInTheDocument()

    // Fill Step 2 (Add an item)
    const catalogItemButton = screen.getByText(/Pintura de Parede/i)
    fireEvent.click(catalogItemButton)

    // Go to Step 3
    const nextButtonStep2 = screen.getByRole('button', { name: /próximo/i })
    fireEvent.click(nextButtonStep2)

    // Step 3: Review
    expect(await screen.findByText(/Resumo dos Itens/i)).toBeInTheDocument()
    expect(screen.getByText(/Test Title/i)).toBeInTheDocument()
    expect(screen.getByText(/Maria Oliveira/i)).toBeInTheDocument()
    
    // Verify export buttons are present
    expect(screen.getByRole('button', { name: /pdf/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /docx/i })).toBeInTheDocument()
    
    // Verify save button is present
    expect(screen.getByRole('button', { name: /salvar orçamento/i })).toBeInTheDocument()
    
    // Verify preview button is NOT present
    expect(screen.queryByText(/Ver Prévia/i)).not.toBeInTheDocument()
  })
})
