import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import ServicesPage from './page'

vi.mock('@/hooks/useServices', () => ({
  useServices: () => ({
    data: [
      {
        id: 'srv1',
        name: 'Pintura de Parede (Látex)',
        description: 'Aplicação de pintura interna',
        unit: 'm²',
        defaultUnitPrice: 45,
      },
    ],
    isLoading: false,
  }),
  useDeleteService: () => ({ mutate: vi.fn(), isPending: false }),
  useCreateService: () => ({ mutate: vi.fn(), isPending: false }),
  useUpdateService: () => ({ mutate: vi.fn(), isPending: false }),
}))

vi.mock('@/components/services/ServiceSheet', () => ({
  ServiceSheet: () => null,
}))

describe('ServicesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders the services management view', () => {
    render(<ServicesPage />)

    expect(screen.getByRole('heading', { name: /serviços/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /novo serviço/i })).toBeInTheDocument()
    expect(screen.getAllByText(/Pintura de Parede/i).length).toBeGreaterThan(0)
  })
})