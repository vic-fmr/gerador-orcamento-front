import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ClientsTable } from './ClientsTable'

// Mock the hook
const mockMutate = vi.fn()
vi.mock('@/hooks/useClients', () => ({
  useDeleteClient: () => ({
    mutate: mockMutate
  })
}))

const mockClients = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main St', addressName: 'Home' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
]

describe('ClientsTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correct headers', () => {
    render(<ClientsTable clients={mockClients} />)
    
    expect(screen.getByText('Cliente / Nome')).toBeInTheDocument()
    expect(screen.getAllByText('Contato').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Endereço').length).toBeGreaterThan(0)
    expect(screen.getByText('Ações')).toBeInTheDocument()
  })

  it('renders client data rows correctly', () => {
    render(<ClientsTable clients={mockClients} />)
    
    // John Doe should have all fields rendered (in both views)
    expect(screen.getAllByText('John Doe').length).toBeGreaterThan(0)
    expect(screen.getAllByText('john@example.com').length).toBeGreaterThan(0)
    expect(screen.getAllByText('1234567890').length).toBeGreaterThan(0)
    
    // Check if address cell contains both address and addressName logic
    const addressElements = screen.getAllByText(/123 Main St/i)
    expect(addressElements.length).toBeGreaterThan(0)
    expect(screen.getAllByText('Home').length).toBeGreaterThan(0)
    
    // Jane Smith has missing fields, should render fallbacks
    expect(screen.getAllByText('Jane Smith').length).toBeGreaterThan(0)
    expect(screen.getAllByText('jane@example.com').length).toBeGreaterThan(0)
    // Check for N/A for missing phone
    expect(screen.getAllByText('N/A').length).toBeGreaterThan(0)
  })

  it('renders empty state when no clients provided', () => {
    render(<ClientsTable clients={[]} />)
    expect(screen.getByText(/Nenhum cliente encontrado/i)).toBeInTheDocument()
  })

  it('calls deleteClient when trash icon is clicked and confirmed', () => {
    // Mock window.confirm
    const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true)
    
    render(<ClientsTable clients={mockClients} />)
    
    // Find trash buttons (one for desktop, one for mobile per client)
    const deleteButtons = screen.getAllByRole('button').filter(btn => btn.querySelector('svg.lucide-trash2'))
    
    // Click the first one (John Doe desktop)
    fireEvent.click(deleteButtons[0])
    
    expect(confirmSpy).toHaveBeenCalled()
    expect(mockMutate).toHaveBeenCalledWith(1)
    
    confirmSpy.mockRestore()
  })

  it('does not call deleteClient when trash icon is clicked but cancelled', () => {
    // Mock window.confirm
    const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => false)
    
    render(<ClientsTable clients={mockClients} />)
    
    const deleteButtons = screen.getAllByRole('button').filter(btn => btn.querySelector('svg.lucide-trash2'))
    
    fireEvent.click(deleteButtons[0])
    
    expect(confirmSpy).toHaveBeenCalled()
    expect(mockMutate).not.toHaveBeenCalled()
    
    confirmSpy.mockRestore()
  })
})