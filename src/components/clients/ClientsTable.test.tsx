import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ClientsTable } from './ClientsTable'

const mockClients = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main St', addressName: 'Home' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
]

describe('ClientsTable', () => {
  it('renders correct headers', () => {
    render(<ClientsTable clients={mockClients} />)
    
    expect(screen.getByText('Nome')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Telefone')).toBeInTheDocument()
    expect(screen.getByText('Endereço')).toBeInTheDocument()
  })

  it('renders client data rows correctly', () => {
    render(<ClientsTable clients={mockClients} />)
    
    // John Doe should have all fields rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('1234567890')).toBeInTheDocument()
    
    // Check if address cell contains both address and addressName logic
    const addressElement = screen.getByText(/123 Main St/i)
    expect(addressElement).toBeInTheDocument()
    
    // Jane Smith has missing fields, should render fallbacks or be empty
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
  })

  it('renders empty state when no clients provided', () => {
    render(<ClientsTable clients={[]} />)
    expect(screen.getByText(/Nenhum cliente encontrado/i)).toBeInTheDocument()
  })
})