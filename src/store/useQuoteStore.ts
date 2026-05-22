import { create } from 'zustand'
import { QuoteStatus, getQuoteStatusBucket } from '@/lib/api'

export interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  unit: string
  serviceId?: string | number
}

export interface Quote {
  id: number
  title: string
  client: number
  amount: number
  status: QuoteStatus
  date: string
  items: LineItem[]
}

interface QuoteState {
  quotes: Quote[]
  setQuotes: (quotes: Quote[]) => void
  addQuote: (quote: Quote) => void
  updateQuote: (id: number, updates: Partial<Quote>) => void
  removeQuote: (id: number) => void
  getStats: () => {
    pending: { value: number; count: number }
    approved: { value: number; count: number }
    paid: { value: number; count: number }
  }
}

export const useQuoteStore = create<QuoteState>((set, get) => ({
  quotes: [],
  setQuotes: (quotes) => set(() => ({ quotes })),
  addQuote: (quote) => set((state) => ({ 
    quotes: [quote, ...state.quotes] 
  })),
  updateQuote: (id, updates) => set((state) => ({
    quotes: state.quotes.map((q) => q.id === id ? { ...q, ...updates } : q)
  })),
  removeQuote: (id) => set((state) => ({
    quotes: state.quotes.filter((q) => q.id !== id)
  })),
  getStats: () => {
    const { quotes } = get()
    return quotes.reduce(
      (acc, curr) => {
        const bucket = getQuoteStatusBucket(curr.status)

        if (bucket === 'pending') {
          acc.pending.value += curr.amount
          acc.pending.count += 1
        } else if (bucket === 'approved') {
          acc.approved.value += curr.amount
          acc.approved.count += 1
        } else if (bucket === 'paid') {
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
