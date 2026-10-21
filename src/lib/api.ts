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

export type { ScheduleItem, QuoteTechnicalProposal } from '@/store/useQuoteStore'
export { DEFAULT_PROPOSAL_DETAILS } from '@/store/useQuoteStore'

export interface Quote {
  id: number
  title: string
  client: number
  amount: number
  status: QuoteStatus
  date: string
  items: LineItem[]
  proposalDetails?: import('@/store/useQuoteStore').QuoteTechnicalProposal
}

// Auth API
export async function login(data: { email: string; password: string }): Promise<string> {
  const response = await apiPost<{ token?: string } | string>('/api/auth/login', data)
  if (typeof response === 'string') return response
  return response.token || ''
}

export async function register(data: { name: string; email: string; password: string; phone?: string }): Promise<string> {
  const response = await apiPost<{ token?: string } | string>('/api/auth/register', data)
  if (typeof response === 'string') return response
  return response.token || ''
}

export async function forgotPassword(data: { email: string }): Promise<void> {
  return apiPost<void>('/api/auth/forgot-password', data)
}

export async function resetPassword(data: { token: string; password: string }): Promise<void> {
  return apiPost<void>('/api/auth/reset-password', data)
}

// Clients API
export async function getClients(): Promise<Client[]> {
  return apiGet<Client[]>('/api/clients')
}

export async function getClient(id: number): Promise<Client> {
  return apiGet<Client>(`/api/clients/${id}`)
}

export async function createClient(data: Omit<Client, 'id'>): Promise<Client> {
  return apiPost<Client>('/api/clients', data)
}

export async function updateClient(id: number, data: Partial<Client>): Promise<Client> {
  return apiPut<Client>(`/api/clients/${id}`, data)
}

export async function deleteClient(id: number): Promise<void> {
  return apiDelete<void>(`/api/clients/${id}`)
}

// Services API
export async function getServices(): Promise<ServiceItem[]> {
  return apiGet<ServiceItem[]>('/api/services')
}

export async function getService(id: number): Promise<ServiceItem> {
  return apiGet<ServiceItem>(`/api/services/${id}`)
}

export async function createService(data: Omit<ServiceItem, 'id'>): Promise<ServiceItem> {
  return apiPost<ServiceItem>('/api/services', data)
}

export async function updateService(id: number, data: Partial<ServiceItem>): Promise<ServiceItem> {
  return apiPut<ServiceItem>(`/api/services/${id}`, data)
}

export async function deleteService(id: number): Promise<void> {
  return apiDelete<void>(`/api/services/${id}`)
}

// Quotes API (renamed from estimates)
export async function getQuotes(): Promise<Quote[]> {
  return apiGet<Quote[]>('/api/quotes')
}

export async function getQuote(id: number): Promise<Quote> {
  return apiGet<Quote>(`/api/quotes/${id}`)
}

export async function createQuote(data: Omit<Quote, 'id'>): Promise<Quote> {
  return apiPost<Quote>('/api/quotes', data)
}

export async function updateQuote(id: number, data: Partial<Quote>): Promise<Quote> {
  return apiPut<Quote>(`/api/quotes/${id}`, data)
}

export async function deleteQuote(id: number): Promise<void> {
  return apiDelete<void>(`/api/quotes/${id}`)
}

export interface AIGeneratedQuoteResponse {
  title: string
  items: LineItem[]
  proposalDetails: import('@/store/useQuoteStore').QuoteTechnicalProposal
}

export async function generateQuoteFromAI(prompt: string, clientId?: number): Promise<AIGeneratedQuoteResponse> {
  return apiPost<AIGeneratedQuoteResponse>('/api/quotes/generate-ai', { prompt, clientId })
}
