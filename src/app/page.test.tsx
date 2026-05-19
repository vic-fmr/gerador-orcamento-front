import { render, screen } from '@testing-library/react'
import Home from '@/app/page'
import { expect, test, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

// Mock Shell to avoid testing it here
vi.mock('@/components/layout/Shell', () => ({
  Shell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

test('Dashboard Home renders summary cards and new estimate button', () => {
  render(
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  )
  
  expect(screen.getAllByText('Pendentes').length).toBeGreaterThan(0)
  expect(screen.getByText('Aprovados')).toBeInTheDocument()
  expect(screen.getByText('Pagos')).toBeInTheDocument()
  expect(screen.getByText(/novo orçamento/i)).toBeInTheDocument()
})