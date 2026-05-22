import { renderHook, act } from '@testing-library/react'
import { useQuoteStore } from './useQuoteStore'
import { expect, test, beforeEach } from 'vitest'

beforeEach(() => {
    useQuoteStore.setState({ quotes: [] })
})

test('Store adds a quote', () => {
  const { result } = renderHook(() => useQuoteStore())
  
  const newQuote = {
    id: '1',
    title: 'Test Quote',
    client: 'Test Client',
    amount: 1000,
    status: 'DRAFT' as const,
    date: new Date().toISOString(),
    items: [],
  }
  
  act(() => {
    result.current.addQuote(newQuote)
  })
  
  expect(result.current.quotes).toHaveLength(1)
  expect(result.current.quotes[0]).toEqual(newQuote)
})

test('Store calculates summary stats correctly', () => {
  const { result } = renderHook(() => useQuoteStore())
  
  act(() => {
    result.current.addQuote({ id: '1', amount: 1000, status: 'DRAFT', title: '', client: '', date: '', items: [] })
    result.current.addQuote({ id: '2', amount: 2000, status: 'ACCEPTED', title: '', client: '', date: '', items: [] })
    result.current.addQuote({ id: '3', amount: 3000, status: 'PAID', title: '', client: '', date: '', items: [] })
    result.current.addQuote({ id: '4', amount: 500, status: 'SENT', title: '', client: '', date: '', items: [] })
  })
  
  const stats = result.current.getStats()
  expect(stats.pending.value).toBe(1500)
  expect(stats.pending.count).toBe(2)
  expect(stats.approved.value).toBe(2000)
  expect(stats.paid.value).toBe(3000)
})