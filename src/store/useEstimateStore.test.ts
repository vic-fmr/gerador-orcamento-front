import { renderHook, act } from '@testing-library/react'
import { useEstimateStore } from './useEstimateStore'
import { expect, test, beforeEach } from 'vitest'

beforeEach(() => {
  useEstimateStore.setState({ estimates: [] })
})

test('Store adds an estimate', () => {
  const { result } = renderHook(() => useEstimateStore())
  
  const newEstimate = {
    id: '1',
    title: 'Test Estimate',
    client: 'Test Client',
    amount: 1000,
    status: 'pending' as const,
    date: new Date().toISOString(),
    items: [],
  }
  
  act(() => {
    result.current.addEstimate(newEstimate)
  })
  
  expect(result.current.estimates).toHaveLength(1)
  expect(result.current.estimates[0]).toEqual(newEstimate)
})

test('Store calculates summary stats correctly', () => {
  const { result } = renderHook(() => useEstimateStore())
  
  act(() => {
    result.current.addEstimate({ id: '1', amount: 1000, status: 'pending', title: '', client: '', date: '', items: [] })
    result.current.addEstimate({ id: '2', amount: 2000, status: 'approved', title: '', client: '', date: '', items: [] })
    result.current.addEstimate({ id: '3', amount: 3000, status: 'paid', title: '', client: '', date: '', items: [] })
    result.current.addEstimate({ id: '4', amount: 500, status: 'pending', title: '', client: '', date: '', items: [] })
  })
  
  const stats = result.current.getStats()
  expect(stats.pending.value).toBe(1500)
  expect(stats.pending.count).toBe(2)
  expect(stats.approved.value).toBe(2000)
  expect(stats.paid.value).toBe(3000)
})