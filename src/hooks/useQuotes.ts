import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import {
  getQuotes,
  createQuote as apiCreateQuote,
  updateQuote as apiUpdateQuote,
  deleteQuote as apiDeleteQuote,
  Quote,
  normalizeQuoteStatus,
} from '@/lib/api'
import { useQuoteStore } from '@/store/useQuoteStore'

function normalizeAmount(value: unknown) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return 0

    // Remove any currency symbols or non-numeric characters except decimal separators
    const cleaned = trimmed.replace(/[^0-9.,-]/g, '')

    // If there is a comma, assume Brazilian-style formatting (thousands '.' and decimal ',')
    const normalized = cleaned.includes(',')
      ? cleaned.replace(/\./g, '').replace(',', '.')
      : cleaned

    const parsed = Number(normalized)
    return Number.isFinite(parsed) ? parsed : 0
  }

  return 0
}

function normalizeStatus(value: unknown) {
  return normalizeQuoteStatus(value)
}

function normalizeQuote(quote: Quote) {
  // Try to find the amount in various possible fields that might come from different backend versions
  const rawAmount = (quote as any).amount ?? 
                   (quote as any).total ?? 
                   (quote as any).totalAmount ?? 
                   (quote as any).valor

  let amount = normalizeAmount(rawAmount)

  // Fallback: If amount is 0 but we have items, calculate it from the items
  if (amount === 0 && Array.isArray(quote.items) && quote.items.length > 0) {
    amount = quote.items.reduce((acc, item) => {
      const q = normalizeAmount(item.quantity)
      const p = normalizeAmount(item.unitPrice)
      return acc + (q * p)
    }, 0)
  }

  return {
    ...quote,
    amount,
    status: normalizeStatus((quote as any).status),
  }
}

export function useQuotes() {
  const setQuotes = useQuoteStore((state) => state.setQuotes)
  const storeQuotes = useQuoteStore((state) => state.quotes)

  const query = useQuery({
    queryKey: ['quotes'],
    queryFn: async () => {
      const quotes = await getQuotes()
      return Array.isArray(quotes) ? quotes.map(normalizeQuote) : []
    },
  })

  useEffect(() => {
    const data = query.data
    if (data && Array.isArray(data)) setQuotes(data)
  }, [query.data, setQuotes])

  const mergedQuotes = React.useMemo(() => {
    const queriedQuotes = Array.isArray(query.data) ? query.data : []
    const byId = new Map<number, (typeof storeQuotes)[number]>()

    for (const quote of queriedQuotes) {
      byId.set(quote.id, quote)
    }

    for (const quote of storeQuotes) {
      byId.set(quote.id, quote)
    }

    return Array.from(byId.values())
  }, [query.data, storeQuotes])

  return {
    ...query,
    data: mergedQuotes,
  }
}

export function useCreateQuote() {
  const queryClient = useQueryClient()
  const addQuote = useQuoteStore((state) => state.addQuote)

  return useMutation({
    mutationFn: async (newQuote: Omit<Quote, 'id'>) => {
      // strip local-only fields (like client-side generated item ids) and map client -> clientId
      const mappedItems = newQuote.items.map((it) => ({
        description: it.description,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        unit: it.unit,
        ...(it as any).serviceId ? { serviceId: (it as any).serviceId } : {},
      }))

      const payload = {
        title: newQuote.title,
        clientId: (newQuote as any).client,
        amount: newQuote.amount,
        status: newQuote.status,
        date: newQuote.date,
        items: mappedItems,
      }

      const created = await apiCreateQuote(payload as any)
      const createdClient = (created as any).client
      const normalizedClientId =
        typeof createdClient === 'number'
          ? createdClient
          : typeof createdClient === 'string' && createdClient.trim() !== '' && !Number.isNaN(Number(createdClient))
            ? Number(createdClient)
            : typeof createdClient === 'object' && createdClient !== null && 'id' in createdClient && typeof (createdClient as { id?: unknown }).id === 'number'
              ? (createdClient as { id: number }).id
              : (payload as any).clientId

      const normalizedAmount = normalizeAmount((created as any).amount ?? (payload as any).amount)
      const normalizedStatus = normalizeStatus((created as any).status ?? (payload as any).status)

      const normalizedQuote = {
        ...created,
        client: normalizedClientId,
        amount: normalizedAmount,
        status: normalizedStatus,
      }

      addQuote(normalizedQuote as any)
      return normalizedQuote as any
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] })
    },
  })
}

export function useUpdateQuote() {
  const queryClient = useQueryClient()
  const updateQuote = useQuoteStore((state) => state.updateQuote)

  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Quote> }) => {
      // If we are doing a partial update from the UI, we might need to fetch the current state
      // or assume the caller provides enough data. 
      // For the status change feature, we'll ensure the caller passes the full quote or we merge it.
      
      const mappedItems = updates.items ? updates.items.map((it) => ({
        description: it.description,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        unit: it.unit,
        ...(it as any).serviceId ? { serviceId: (it as any).serviceId } : {},
      })) : undefined

      const payload: any = {}

      if (updates.title) payload.title = updates.title
      
      if ((updates as any).client) {
        const rawClient = (updates as any).client
        payload.clientId = typeof rawClient === 'object' && rawClient !== null ? rawClient.id : rawClient
      }
      
      if (updates.amount !== undefined) payload.amount = updates.amount
      if (updates.status) payload.status = updates.status
      if (updates.date) payload.date = updates.date
      if (mappedItems) payload.items = mappedItems

      const updated = await apiUpdateQuote(id, payload)
      updateQuote(id, updates)
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] })
    },
  })
}

export function useDeleteQuote() {
  const queryClient = useQueryClient()
  const removeQuote = useQuoteStore((state) => state.removeQuote)

  return useMutation({
    mutationFn: async (id: number) => {
      await apiDeleteQuote(id)
      removeQuote(id)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] })
    },
  })
}
