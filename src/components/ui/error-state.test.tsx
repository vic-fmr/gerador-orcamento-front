import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ErrorState } from './error-state'

describe('ErrorState Component', () => {
  it('renders default title and message when none are provided', () => {
    render(<ErrorState />)
    expect(screen.getByText('Não foi possível carregar as informações')).toBeInTheDocument()
    expect(
      screen.getByText('Ocorreu um erro ao comunicar com o servidor. Verifique sua conexão e tente novamente.')
    ).toBeInTheDocument()
  })

  it('renders custom title and message', () => {
    render(
      <ErrorState
        title="Falha ao carregar clientes"
        message="Erro 500: Falha no banco de dados."
      />
    )
    expect(screen.getByText('Falha ao carregar clientes')).toBeInTheDocument()
    expect(screen.getByText('Erro 500: Falha no banco de dados.')).toBeInTheDocument()
  })

  it('calls onRetry callback when button is clicked', () => {
    const handleRetry = vi.fn()
    render(<ErrorState onRetry={handleRetry} />)

    const retryButton = screen.getByRole('button', { name: /tentar novamente/i })
    fireEvent.click(retryButton)

    expect(handleRetry).toHaveBeenCalledTimes(1)
  })

  it('disables button when isRetrying is true', () => {
    render(<ErrorState onRetry={vi.fn()} isRetrying={true} />)
    const button = screen.getByRole('button', { name: /tentando novamente/i })
    expect(button).toBeDisabled()
  })
})
