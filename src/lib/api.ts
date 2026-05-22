/**
 * Typed API service layer
 * Provides strongly-typed functions for all backend operations
 */

import { apiDelete, apiGet, apiPost, apiPut } from './api-client'

// Types matching the backend API
export interface Client {
  id: number
  name: string
  email?: string
  phone?: string
  address?: string
  addressName?: string
}

export interface ServiceItem {
  id: number
  name: string
  description: string
  unit: Unit
  defaultUnitPrice: number
}

export type Unit = 'un' | 'm' | 'm²' | 'm³' | 'kg' | 'h' | 'dia' | 'mês'

export type QuoteStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'PAID'

export type QuoteStatusBucket = 'pending' | 'approved' | 'rejected' | 'paid'

export function normalizeQuoteStatus(value: unknown): QuoteStatus {
  if (typeof value !== 'string') {
    return 'DRAFT'
  }

  const normalized = value.trim().toUpperCase()

  if (normalized === 'DRAFT' || normalized === 'SENT' || normalized === 'ACCEPTED' || normalized === 'REJECTED' || normalized === 'PAID') {
    return normalized
  }

  if (normalized === 'PENDING') return 'DRAFT'
  if (normalized === 'APPROVED') return 'ACCEPTED'
  if (normalized === 'PAID') return 'PAID'

  return 'DRAFT'
}

export function getQuoteStatusBucket(status: QuoteStatus): QuoteStatusBucket {
  switch (status) {
    case 'DRAFT':
    case 'SENT':
      return 'pending'
    case 'ACCEPTED':
      return 'approved'
    case 'REJECTED':
      return 'rejected'
    case 'PAID':
      return 'paid'
  }
}

export function getQuoteStatusLabel(status: QuoteStatus) {
  switch (status) {
    case 'DRAFT':
      return 'Rascunho'
    case 'SENT':
      return 'Enviado'
    case 'ACCEPTED':
      return 'Aprovado'
    case 'REJECTED':
      return 'Rejeitado'
    case 'PAID':
      return 'Pago'
  }
}

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

// Auth API
export async function login(data: { email: string; password: string }): Promise<string> {
  // Assuming the backend returns the token directly as a string or in an object { token: "..." }
  // If it returns only the token string, the apiPost might need adjustment if it expects JSON object
  // But usually it's an object. Let's assume the apiPost handles it.
  const response = await apiPost<{ token?: string } | string>('/api/auth/login', data)
  if (typeof response === 'string') return response
  return response.token || ''
}

// Clients API
export async function getClients(): Promise<Client[]> {
  return apiGet<Client[]>('/clients')
}

export async function getClient(id: number): Promise<Client> {
  return apiGet<Client>(`/clients/${id}`)
}

export async function createClient(data: Omit<Client, 'id'>): Promise<Client> {
  return apiPost<Client>('/clients', data)
}

export async function updateClient(id: number, data: Partial<Client>): Promise<Client> {
  return apiPut<Client>(`/clients/${id}`, data)
}

export async function deleteClient(id: number): Promise<void> {
  return apiDelete<void>(`/clients/${id}`)
}

// Services API
export async function getServices(): Promise<ServiceItem[]> {
  return apiGet<ServiceItem[]>('/services')
}

export async function getService(id: number): Promise<ServiceItem> {
  return apiGet<ServiceItem>(`/services/${id}`)
}

export async function createService(data: Omit<ServiceItem, 'id'>): Promise<ServiceItem> {
  return apiPost<ServiceItem>('/services', data)
}

export async function updateService(id: number, data: Partial<ServiceItem>): Promise<ServiceItem> {
  return apiPut<ServiceItem>(`/services/${id}`, data)
}

export async function deleteService(id: number): Promise<void> {
  return apiDelete<void>(`/services/${id}`)
}

// Quotes API (renamed from estimates)
export async function getQuotes(): Promise<Quote[]> {
  return apiGet<Quote[]>('/quotes')
}

export async function getQuote(id: number): Promise<Quote> {
  return apiGet<Quote>(`/quotes/${id}`)
}

export async function createQuote(data: Omit<Quote, 'id'>): Promise<Quote> {
  return apiPost<Quote>('/quotes', data)
}

export async function updateQuote(id: number, data: Partial<Quote>): Promise<Quote> {
  return apiPut<Quote>(`/quotes/${id}`, data)
}

export async function deleteQuote(id: number): Promise<void> {
  return apiDelete<void>(`/quotes/${id}`)
}
