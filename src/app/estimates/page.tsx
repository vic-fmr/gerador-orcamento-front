'use client'

import React, { useState } from 'react'
import { useEstimates } from '@/hooks/useEstimates'
import { Search, Filter, ArrowUpDown, FileText, Download, Eye, Calendar, User, DollarSign, FileEdit } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { generateEstimatePDF } from '@/lib/pdf-export'
import { generateEstimateDOCX } from '@/lib/docx-export'
import { EstimatePreview } from '@/components/estimates/EstimatePreview'
import { Estimate } from '@/store/useEstimateStore'
import { cn } from '@/lib/utils'

export default function EstimatesHistory() {
  const { data: estimates = [], isLoading } = useEstimates()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedPreview, setSelectedPreview] = useState<Estimate | null>(null)

  const filteredEstimates = estimates.filter((e) => {
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const StatusBadge = ({ status }: { status: Estimate['status'] }) => (
    <span className={cn(
      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
      status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
      status === 'approved' ? 'bg-green-100 text-green-700' :
      'bg-blue-100 text-blue-700'
    )}>
      {status === 'pending' ? 'Pendente' : 
       status === 'approved' ? 'Aprovado' : 'Pago'}
    </span>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Histórico de Orçamentos</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="md:col-span-2 space-y-1.5">
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
        <div className="flex items-end">
           <Button variant="outline" className="w-full" type="button">
             <ArrowUpDown className="mr-2 h-4 w-4" />
             Ordenar por Data
           </Button>
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
        ) : filteredEstimates.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            Nenhum orçamento encontrado com os filtros atuais.
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left p-4 font-medium text-sm">Título / Projeto</th>
                <th className="text-left p-4 font-medium text-sm">Cliente</th>
                <th className="text-right p-4 font-medium text-sm">Valor</th>
                <th className="text-center p-4 font-medium text-sm">Status</th>
                <th className="text-right p-4 font-medium text-sm">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredEstimates.map((estimate) => (
                <tr key={estimate.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-sm">{estimate.title}</div>
                    <div className="text-xs text-muted-foreground">{new Date(estimate.date).toLocaleDateString('pt-BR')}</div>
                  </td>
                  <td className="p-4 text-sm">{estimate.client}</td>
                  <td className="p-4 text-right text-sm font-semibold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(estimate.amount)}
                  </td>
                  <td className="p-4 text-center">
                     <StatusBadge status={estimate.status} />
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        type="button"
                        onClick={() => setSelectedPreview(estimate)}
                        title="Ver Prévia"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        type="button"
                        onClick={() => generateEstimateDOCX(estimate)}
                        title="Download DOCX"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        type="button"
                        onClick={() => generateEstimatePDF(estimate)}
                        title="Download PDF"
                        className="text-primary hover:text-primary hover:bg-primary/10"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
        ) : filteredEstimates.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground bg-card rounded-xl border border-border">
            Nenhum orçamento encontrado.
          </div>
        ) : (
          filteredEstimates.map((estimate) => (
            <div key={estimate.id} className="bg-card rounded-xl border border-border shadow-sm p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-bold text-base leading-tight">{estimate.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(estimate.date).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <StatusBadge status={estimate.status} />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                     <User className="h-3 w-3" />
                     Cliente
                   </div>
                   <p className="text-sm font-medium">{estimate.client}</p>
                </div>
                <div className="space-y-1">
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                     <DollarSign className="h-3 w-3" />
                     Valor
                   </div>
                   <p className="text-sm font-bold text-primary">
                     {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(estimate.amount)}
                   </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1 h-9 gap-2" 
                  onClick={() => setSelectedPreview(estimate)}
                >
                  <Eye className="h-4 w-4" />
                  Ver Prévia
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1 h-9 gap-2 text-blue-600 hover:bg-blue-50"
                  onClick={() => generateEstimateDOCX(estimate)}
                >
                  <FileEdit className="h-4 w-4" />
                  DOCX
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1 h-9 gap-2 text-primary hover:bg-primary/5"
                  onClick={() => generateEstimatePDF(estimate)}
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
