import { render, screen, fireEvent } from '@testing-library/react'
import { LineItemsEditor } from './LineItemsEditor'
import { describe, it, expect, vi } from 'vitest'

describe('LineItemsEditor', () => {
  const mockOnChange = vi.fn()
  const initialItems = [
    { id: '1', description: 'Pintura', quantity: 2, unitPrice: 100, unit: 'm²' },
  ]

  it('renders initial items with units', () => {
    render(<LineItemsEditor items={initialItems} onChange={mockOnChange} />)
    expect(screen.getByDisplayValue(/Pintura/)).toBeDefined()
    expect(screen.getAllByText(/m²/).length).toBeGreaterThan(0)
    expect(screen.getByDisplayValue('2')).toBeDefined()
  })

  it('adds an item from catalog when selected', () => {
    render(<LineItemsEditor items={[]} onChange={mockOnChange} />)
    // Assuming we have buttons or a select for catalog items
    const catalogItemButton = screen.getByText(/Pintura de Parede/i)
    fireEvent.click(catalogItemButton)
    
    expect(mockOnChange).toHaveBeenCalledWith([
      expect.objectContaining({ 
        description: 'Pintura de Parede (Látex)', 
        unit: 'm²', 
        unitPrice: 45.00,
        quantity: 1 
      }),
    ])
  })

  it('updates quantity and calculates total', () => {
    render(<LineItemsEditor items={initialItems} onChange={mockOnChange} />)
    const quantityInput = screen.getByDisplayValue('2')
    fireEvent.change(quantityInput, { target: { value: '3' } })
    
    expect(mockOnChange).toHaveBeenCalledWith([
      { id: '1', description: 'Pintura', quantity: 3, unitPrice: 100, unit: 'm²' },
    ])
  })
})
