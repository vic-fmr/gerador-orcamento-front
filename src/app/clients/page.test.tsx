import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ClientsPage from './page'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const mockClients = [
  { id: '1', name: 'John Doe', email: 'john@example.com' }
]

vi.mock('@/hooks/useClients', () => ({
  useClients: () => ({
    data: mockClients,
    isLoading: false
  }),
  useCreateClient: () => ({
    mutate: vi.fn(),
    isPending: false
  })
}))

const queryClient = new QueryClient()
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
)

describe('ClientsPage', () => {
  it('renders page title and new client button', () => {
    render(<ClientsPage />, { wrapper })
    
    expect(screen.getByText('Clientes')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Novo Cliente/i })).toBeInTheDocument()
  })

  it('renders clients table with data', () => {
    render(<ClientsPage />, { wrapper })
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })
})