import { create } from 'zustand'

export type EstimateStatus = 'pending' | 'approved' | 'paid'

export interface Estimate {
  id: string
  title: string
  client: string
  amount: number
  status: EstimateStatus
  date: string
}

interface EstimateState {
  estimates: Estimate[]
  addEstimate: (estimate: Estimate) => void
  updateEstimate: (id: string, updates: Partial<Estimate>) => void
  removeEstimate: (id: string) => void
  getStats: () => {
    pending: { value: number; count: number }
    approved: { value: number; count: number }
    paid: { value: number; count: number }
  }
}

export const useEstimateStore = create<EstimateState>((set, get) => ({
  estimates: [
    {
      id: '1',
      title: 'Kitchen Renovation',
      client: 'Global Tech Inc.',
      amount: 5200,
      status: 'pending',
      date: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Bathroom Tiling',
      client: 'Home Services Ltd',
      amount: 2400,
      status: 'approved',
      date: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Electrical Rewiring',
      client: 'City Apartments',
      amount: 7800,
      status: 'paid',
      date: new Date().toISOString(),
    }
  ],
  addEstimate: (estimate) => set((state) => ({ 
    estimates: [estimate, ...state.estimates] 
  })),
  updateEstimate: (id, updates) => set((state) => ({
    estimates: state.estimates.map((e) => e.id === id ? { ...e, ...updates } : e)
  })),
  removeEstimate: (id) => set((state) => ({
    estimates: state.estimates.filter((e) => e.id !== id)
  })),
  getStats: () => {
    const { estimates } = get()
    return estimates.reduce(
      (acc, curr) => {
        if (curr.status === 'pending') {
          acc.pending.value += curr.amount
          acc.pending.count += 1
        } else if (curr.status === 'approved') {
          acc.approved.value += curr.amount
          acc.approved.count += 1
        } else if (curr.status === 'paid') {
          acc.paid.value += curr.amount
          acc.paid.count += 1
        }
        return acc
      },
      {
        pending: { value: 0, count: 0 },
        approved: { value: 0, count: 0 },
        paid: { value: 0, count: 0 },
      }
    )
  },
}))