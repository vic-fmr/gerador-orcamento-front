import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CreateClientSheet } from './CreateClientSheet'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock the hook to avoid actual zustand/react-query logic
const mockMutate = vi.fn()
vi.mock('@/hooks/useClients', () => ({
  useCreateClient: () => ({
    mutate: mockMutate,
    isPending: false
  })
}))

const queryClient = new QueryClient()
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
)

describe('CreateClientSheet', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('opens sheet when trigger is clicked', () => {
    render(<CreateClientSheet />, { wrapper })
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    
    fireEvent.click(screen.getByRole('button', { name: /Novo Cliente/i }))
    
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/Adicionar Novo Cliente/i)).toBeInTheDocument()
  })

  it('calls create client mutation on successful form submission', async () => {
    render(<CreateClientSheet />, { wrapper })
    
    // Open sheet
    fireEvent.click(screen.getByRole('button', { name: /Novo Cliente/i }))
    
    // Fill required form fields
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'John Doe' } })
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Salvar Cliente/i }))
    
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
        }),
        expect.anything()
      )
    })
  })
})