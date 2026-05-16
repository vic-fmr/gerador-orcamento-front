import { render, screen, fireEvent } from '@testing-library/react'
import NewEstimate from '@/app/estimates/new/page'
import { expect, test, vi } from 'vitest'

// Mock usePathname and useRouter
vi.mock('next/navigation', () => ({
  usePathname: () => '/estimates/new',
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

test('New Estimate page renders form fields', () => {
  render(<NewEstimate />)
  
  expect(screen.getByLabelText(/título/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/cliente/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument()
})