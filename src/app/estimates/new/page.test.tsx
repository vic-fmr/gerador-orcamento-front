import { render, screen, fireEvent } from '@testing-library/react'
import NewEstimate from '@/app/estimates/new/page'
import { expect, test, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

// Mock usePathname and useRouter
vi.mock('next/navigation', () => ({
  usePathname: () => '/estimates/new',
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

test('New Estimate page follows a wizard flow', async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <NewEstimate />
    </QueryClientProvider>
  )
  
  // Step 1: Project Details
  expect(screen.getByLabelText(/título/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/cliente/i)).toBeInTheDocument()
  expect(screen.queryByText(/Itens do Orçamento/i)).not.toBeInTheDocument()

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
  expect(screen.queryByLabelText(/título/i)).not.toBeInTheDocument()

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
  expect(screen.getByRole('button', { name: /salvar orçamento/i })).toBeInTheDocument()
})