import { describe, it, expect, beforeEach, vi } from 'vitest'
import { toast, useToastStore } from './toast'

describe('toast store and helpers', () => {
  beforeEach(() => {
    useToastStore.getState().clearToasts()
    vi.clearAllTimers()
  })

  it('adds success toast', () => {
    toast.success('Operação realizada')
    const toasts = useToastStore.getState().toasts
    expect(toasts).toHaveLength(1)
    expect(toasts[0].type).toBe('success')
    expect(toasts[0].message).toBe('Operação realizada')
  })

  it('adds error toast with default title', () => {
    toast.error('Algo deu errado')
    const toasts = useToastStore.getState().toasts
    expect(toasts).toHaveLength(1)
    expect(toasts[0].type).toBe('error')
    expect(toasts[0].title).toBe('Erro')
    expect(toasts[0].message).toBe('Algo deu errado')
  })

  it('adds warning toast', () => {
    toast.warning('Aviso importante')
    const toasts = useToastStore.getState().toasts
    expect(toasts[0].type).toBe('warning')
    expect(toasts[0].title).toBe('Atenção')
  })

  it('adds info toast', () => {
    toast.info('Informação útil')
    const toasts = useToastStore.getState().toasts
    expect(toasts[0].type).toBe('info')
  })

  it('dismisses toast by id', () => {
    const id = toast.success('Mensagem')
    expect(useToastStore.getState().toasts).toHaveLength(1)
    toast.dismiss(id)
    expect(useToastStore.getState().toasts).toHaveLength(0)
  })

  it('clears all toasts', () => {
    toast.success('Mensagem 1')
    toast.error('Mensagem 2')
    expect(useToastStore.getState().toasts).toHaveLength(2)
    toast.clear()
    expect(useToastStore.getState().toasts).toHaveLength(0)
  })
})
