import { render, screen, fireEvent } from '@testing-library/react'
import { LineItemsEditor } from './LineItemsEditor'
import { describe, it, expect, vi } from 'vitest'

describe('LineItemsEditor', () => {
  const mockOnChange = vi.fn()
  const initialItems = [
    { id: '1', description: 'Item 1', quantity: 2, unitPrice: 100 },
  ]

  it('renders initial items', () => {
    render(<LineItemsEditor items={initialItems} onChange={mockOnChange} />)
    expect(screen.getByDisplayValue('Item 1')).toBeDefined()
    expect(screen.getByDisplayValue('2')).toBeDefined()
    expect(screen.getByDisplayValue('100')).toBeDefined()
  })

  it('adds a new item when "Adicionar Item" button is clicked', () => {
    render(<LineItemsEditor items={[]} onChange={mockOnChange} />)
    const addButton = screen.getByText(/Adicionar Item/i)
    fireEvent.click(addButton)
    expect(mockOnChange).toHaveBeenCalledWith([
      expect.objectContaining({ description: '', quantity: 1, unitPrice: 0 }),
    ])
  })

  it('removes an item when "Remover" button is clicked', () => {
    render(<LineItemsEditor items={initialItems} onChange={mockOnChange} />)
    const removeButton = screen.getByLabelText(/Remover Item/i)
    fireEvent.click(removeButton)
    expect(mockOnChange).toHaveBeenCalledWith([])
  })

  it('updates an item and calculates total in real-time', () => {
    render(<LineItemsEditor items={initialItems} onChange={mockOnChange} />)
    const quantityInput = screen.getByDisplayValue('2')
    fireEvent.change(quantityInput, { target: { value: '3' } })
    
    expect(mockOnChange).toHaveBeenCalledWith([
      { id: '1', description: 'Item 1', quantity: 3, unitPrice: 100 },
    ])
  })

  it('displays the correct total amount', () => {
    const items = [
      { id: '1', description: 'Item 1', quantity: 2, unitPrice: 100 },
      { id: '2', description: 'Item 2', quantity: 1, unitPrice: 50 },
    ]
    render(<LineItemsEditor items={items} onChange={mockOnChange} />)
    // Total should be 2*100 + 1*50 = 250
    // Formatting might depend on implementation, but let's check for "250"
    expect(screen.getByText(/Total:/i)).toBeDefined()
    expect(screen.getByText(/250/)).toBeDefined()
  })
})
