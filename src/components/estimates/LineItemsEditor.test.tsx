import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { LineItemsEditor } from './LineItemsEditor'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useServiceStore } from '@/store/useServiceStore'

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

describe('LineItemsEditor', () => {
  const mockOnChange = vi.fn()
  const initialItems = [
    { id: '1', description: 'Pintura', quantity: 2, unitPrice: 100, unit: 'm²' },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    useServiceStore.setState({
      services: [
        {
          id: 1,
          name: 'Pintura de Parede (Látex)',
          description: 'Aplicação interna',
          unit: 'm²',
          defaultUnitPrice: 45.0,
        },
      ],
      items: [
        {
          id: 1,
          name: 'Pintura de Parede (Látex)',
          description: 'Aplicação interna',
          unit: 'm²',
          defaultUnitPrice: 45.0,
        },
      ],
    })
  })

  const renderWithClient = (ui: React.ReactElement) => {
    const queryClient = createTestQueryClient()
    return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
  }

  it('renders initial items with units', () => {
    renderWithClient(<LineItemsEditor items={initialItems} onChange={mockOnChange} />)
    expect(screen.getByDisplayValue(/Pintura/)).toBeDefined()
    expect(screen.getAllByText(/m²/).length).toBeGreaterThan(0)
    expect(screen.getByDisplayValue('2')).toBeDefined()
  })

  it('adds an item from catalog when selected', () => {
    renderWithClient(<LineItemsEditor items={[]} onChange={mockOnChange} />)
    const catalogItemButton = screen.getByText(/Pintura de Parede/i)
    fireEvent.click(catalogItemButton)

    expect(mockOnChange).toHaveBeenCalledWith([
      expect.objectContaining({
        description: 'Pintura de Parede (Látex)',
        unit: 'm²',
        unitPrice: 45.0,
        quantity: 1,
      }),
    ])
  })

  it('updates quantity and calculates total', () => {
    renderWithClient(<LineItemsEditor items={initialItems} onChange={mockOnChange} />)
    const quantityInput = screen.getByDisplayValue('2')
    fireEvent.change(quantityInput, { target: { value: '3' } })

    expect(mockOnChange).toHaveBeenCalledWith([
      { id: '1', description: 'Pintura', quantity: 3, unitPrice: 100, unit: 'm²' },
    ])
  })
})
