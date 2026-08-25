import { render, screen } from '@testing-library/react'
import { Shell } from './Shell'
import { expect, test, vi, beforeEach } from 'vitest'
import { useAuthStore } from '@/store/useAuthStore'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

describe('Shell Component', () => {
  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: { id: '1', name: 'Test User', email: 'test@example.com' },
      token: 'mock-token',
    })
  })

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

    // Check for navigation links
    expect(screen.getByRole('link', { name: /Painel/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Orçamentos/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Clientes/i })).toBeInTheDocument()
  })
})