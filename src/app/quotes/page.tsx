'use client'

import React, { useState } from 'react'
import { useQuotes, useUpdateQuote, useDeleteQuote } from '@/hooks/useQuotes'
import { Search, ArrowUpDown, Download, Eye, Calendar, User, DollarSign, FileEdit, Plus, Loader2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { generateQuotePDF } from '@/lib/pdf-export'
import { generateQuoteDOCX } from '../../lib/docx-export'
import { EstimatePreview } from '@/components/estimates/EstimatePreview'
import { Quote } from '@/store/useQuoteStore'
import { cn } from '@/lib/utils'
import { useClientStore } from '@/store/useClientStore'
import { resolveEstimateClient } from '@/lib/estimate-document'
import { useClients } from '@/hooks/useClients'
import { getQuoteStatusBucket, getQuoteStatusLabel, QuoteStatus } from '@/lib/api'

export default function QuotesHistory() {
  const { data: quotes = [], isLoading } = useQuotes()
  const { mutate: updateQuote, isPending: isUpdating } = useUpdateQuote()
  const deleteQuote = useDeleteQuote()
  useClients()
  const clients = useClientStore((state) => state.clients)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedPreview, setSelectedPreview] = useState<Quote | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const getClientInfo = (client: unknown) => resolveEstimateClient(client, clients)

  const handleStatusChange = (id: number, newStatus: QuoteStatus) => {
    const quote = quotes.find(q => q.id === id)
    if (!quote) return

    setUpdatingId(id)
    updateQuote({ id, updates: { ...quote, status: newStatus } }, {
      onSettled: () => setUpdatingId(null)
    })
  }

  const handleDelete = (quote: Quote) => {
    if (window.confirm(`Tem certeza que deseja excluir o orçamento "${quote.title}"?`)) {
      deleteQuote.mutate(quote.id)
    }
  }

  const filteredQuotes = quotes.filter((q) => {
    const clientInfo = getClientInfo(q.client)
    const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientInfo.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || getQuoteStatusBucket(q.status) === statusFilter
    return matchesSearch && matchesStatus
  })

  const StatusSelect = ({ status, id }: { status: Quote['status'], id: number }) => {
    const isCurrentUpdating = updatingId === id && isUpdating
    
    return (
      <div className="relative inline-block">
        <select
          value={status}
          disabled={isCurrentUpdating}
          onChange={(e) => handleStatusChange(id, e.target.value as QuoteStatus)}
          className={cn(
            "appearance-none px-2 py-1 pr-6 rounded-full text-[10px] font-bold uppercase cursor-pointer border-none outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-colors",
            getQuoteStatusBucket(status) === 'pending' ? 'bg-yellow-100 text-yellow-700' :
              getQuoteStatusBucket(status) === 'approved' ? 'bg-green-100 text-green-700' :
                getQuoteStatusBucket(status) === 'paid' ? 'bg-blue-100 text-blue-700' :
                  'bg-red-100 text-red-700',
            isCurrentUpdating && "opacity-50 cursor-not-allowed"
          )}
        >
          <option value="DRAFT">{getQuoteStatusLabel('DRAFT')}</option>
          <option value="SENT">{getQuoteStatusLabel('SENT')}</option>
          <option value="ACCEPTED">{getQuoteStatusLabel('ACCEPTED')}</option>
          <option value="REJECTED">{getQuoteStatusLabel('REJECTED')}</option>
          <option value="PAID">{getQuoteStatusLabel('PAID')}</option>
        </select>
        {isCurrentUpdating ? (
          <Loader2 className="absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3 animate-spin text-current" />
        ) : (
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-current opacity-60">
              <path d="M1 1.5L4 4.5L7 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">

      <div className='flex justify-between items-center'>
        <div className="w-full flex justify-between items-center bg-card p-4 rounded-xl border border-border shadow-sm">
          <div className=" space-y-1.5">
            <Label htmlFor="search">Procurar</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Procurar orçamentos..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              className="w-full h-9 rounded-lg border border-input bg-transparent px-3 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Pendentes</option>
              <option value="approved">Aprovados</option>
              <option value="paid">Pagos</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor='ordem'>Ordenar</Label>
            <Button variant="outline" className="w-full" type="button">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Ordenar por Data
            </Button>
          </div>
          <Link
            href="/quotes/new"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Orçamento
          </Link>
        </div>


      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 w-full animate-pulse bg-muted rounded-lg" />
            ))}
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            Nenhum orçamento encontrado com os filtros atuais.
            <div className="mt-4">
              <Link href="/quotes/new" className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" />
                Criar novo orçamento
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border sticky top-0 z-10">
                  <th className="text-left p-4 font-medium text-sm">Título / Projeto</th>
                  <th className="text-left p-4 font-medium text-sm">Cliente</th>
                  <th className="text-right p-4 font-medium text-sm">Valor</th>
                  <th className="text-center p-4 font-medium text-sm">Status</th>
                  <th className="text-right p-4 font-medium text-sm">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-card">
                {filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-sm">{quote.title}</div>
                      <div className="text-xs text-muted-foreground">{new Date(quote.date).toLocaleDateString('pt-BR')}</div>
                    </td>
                    <td className="p-4 text-sm">{getClientInfo(quote.client).name}</td>
                    <td className="p-4 text-right text-sm font-semibold">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quote.amount)}
                    </td>
                    <td className="p-4 text-center">
                      <StatusSelect status={quote.status} id={quote.id} />
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          onClick={() => setSelectedPreview(quote)}
                          title="Ver Prévia"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          onClick={() => generateQuoteDOCX(quote, getClientInfo(quote.client))}
                          title="Download DOCX"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <FileEdit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          onClick={() => generateQuotePDF(quote, getClientInfo(quote.client))}
                          title="Download PDF"
                          className="text-primary hover:text-primary hover:bg-primary/10"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          onClick={() => handleDelete(quote)}
                          title="Excluir Orçamento"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 w-full animate-pulse bg-muted rounded-xl border border-border" />
            ))}
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground bg-card rounded-xl border border-border">
            Nenhum orçamento encontrado.
          </div>
        ) : (
          filteredQuotes.map((quote) => (
            <div key={quote.id} className="bg-card rounded-xl border border-border shadow-sm p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-bold text-base leading-tight">{quote.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(quote.date).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <div className="self-start flex items-center gap-2">
                  <StatusSelect status={quote.status} id={quote.id} />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-600"
                    onClick={() => handleDelete(quote)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <User className="h-3 w-3" />
                    Cliente
                  </div>
                  <p className="text-sm font-medium">{getClientInfo(quote.client).name}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <DollarSign className="h-3 w-3" />
                    Valor
                  </div>
                  <p className="text-sm font-bold text-primary">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quote.amount)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-9 gap-2"
                  onClick={() => setSelectedPreview(quote)}
                >
                  <Eye className="h-4 w-4" />
                  Ver Prévia
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-9 gap-2 text-blue-600 hover:bg-blue-50"
                  onClick={() => generateQuoteDOCX(quote, getClientInfo(quote.client))}
                >
                  <FileEdit className="h-4 w-4" />
                  DOCX
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-9 gap-2 text-primary hover:bg-primary/5"
                  onClick={() => generateQuotePDF(quote, getClientInfo(quote.client))}
                >
                  <Download className="h-4 w-4" />
                  PDF
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedPreview && (
        <EstimatePreview
          estimate={selectedPreview}
          onClose={() => setSelectedPreview(null)}
        />
      )}
    </div>
  )
}
