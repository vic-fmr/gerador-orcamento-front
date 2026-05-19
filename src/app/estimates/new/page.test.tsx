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
  fireEvent.change(screen.getByLabelText(/cliente/i), { target: { value: 'Test Client' } })

  // Go to Step 2
  const nextButton = screen.getByRole('button', { name: /próximo/i })
  fireEvent.click(nextButton)

  // Step 2: Line Items
  expect(await screen.findByText(/Itens do Orçamento/i)).toBeInTheDocument()
  expect(screen.queryByLabelText(/título/i)).not.toBeInTheDocument()
})