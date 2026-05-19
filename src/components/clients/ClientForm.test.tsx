import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ClientForm } from './ClientForm'

describe('ClientForm', () => {
  it('renders all form fields', () => {
    render(<ClientForm onSubmit={vi.fn()} />)
    
    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Telefone')).toBeInTheDocument()
    expect(screen.getByLabelText('Endereço')).toBeInTheDocument()
    expect(screen.getByLabelText('Nome do Endereço')).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const handleSubmit = vi.fn()
    render(<ClientForm onSubmit={handleSubmit} />)
    
    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/Nome é obrigatório/i)).toBeInTheDocument()
    })
    
    expect(handleSubmit).not.toHaveBeenCalled()
  })

  it('submits valid data', async () => {
    const handleSubmit = vi.fn()
    render(<ClientForm onSubmit={handleSubmit} />)
    
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Test Client' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } })
    
    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }))
    
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Test Client',
        email: 'test@example.com',
        phone: '',
        address: '',
        addressName: ''
      }), expect.anything())
    })
  })
})