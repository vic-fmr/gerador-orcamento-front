import { render, screen } from '@testing-library/react'
import { Shell } from './Shell'
import { expect, test, vi } from 'vitest'

// Mock next/navigation if needed
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

test('Shell renders sidebar and navbar', () => {
  render(
    <Shell>
      <div>Main Content</div>
    </Shell>
  )
  
  // Check for Sidebar
  expect(screen.getByRole('navigation', { name: 'Barra Lateral' })).toBeInTheDocument()
  // Check for Header/Navbar
  expect(screen.getByRole('banner')).toBeInTheDocument()
  // Check for Main Content
  expect(screen.getByText('Main Content')).toBeInTheDocument()
})