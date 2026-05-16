import { render, screen } from '@testing-library/react'
import Home from '@/app/page'
import { expect, test, vi } from 'vitest'

// Mock Shell to avoid testing it here
vi.mock('@/components/layout/Shell', () => ({
  Shell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

test('Dashboard Home renders summary cards and new estimate button', () => {
  render(<Home />)
  
  expect(screen.getAllByText('Pending').length).toBeGreaterThan(0)
  expect(screen.getByText('Approved')).toBeInTheDocument()
  expect(screen.getByText('Paid')).toBeInTheDocument()
  expect(screen.getByText(/new estimate/i)).toBeInTheDocument()
})