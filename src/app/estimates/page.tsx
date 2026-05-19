'use client'

import React from 'react'
import Link from 'next/link'
import { 
  Plus, 
  FileText as LucideFileText,
  MoreHorizontal,
  Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEstimateStore } from '@/store/useEstimateStore'
import { cn } from '@/lib/utils'

export default function EstimatesPage() {
  const { estimates } = useEstimateStore()

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Meus Orçamentos</h2>
          <p className="text-muted-foreground mt-1">
            Gerencie, visualize e acompanhe o status de todas as suas estimativas.
          </p>
        </div>
        <Link href="/estimates/new" passHref>
          <Button className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Novo Orçamento
          </Button>
        </Link>
      </div>

      {/* Tabela / Lista de Orçamentos */}
      <div className="bg-card text-card-foreground shadow-sm border border-border/50 rounded-xl overflow-hidden">
        
        {/* Cabeçalho da Lista (Escondido em telas muito pequenas) */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-border/50 bg-muted/20 text-sm font-medium text-muted-foreground">
          <div className="col-span-5">Detalhes do Orçamento</div>
          <div className="col-span-3">Valor Total</div>
          <div className="col-span-3">Status</div>
          <div className="col-span-1 text-right">Ações</div>
        </div>

        {/* Corpo da Lista */}
        <div className="divide-y divide-border/50">
          {estimates.map((estimate) => (
            <Link 
                href={`/estimates/${estimate.id}`}
              key={estimate.id} 
              className="p-4 hover:bg-muted/30 transition-colors flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 group"
            >
              {/* Info principal */}
              <div className="col-span-5 flex items-center gap-4">
    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
      <LucideFileText className="w-5 h-5 text-primary" />
    </div>
    <div>
      <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
        {estimate.title}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">Cliente: {estimate.client}</p>
    </div>
  </div>

              {/* Valor */}
              <div className="col-span-3">
                <p className="text-sm font-semibold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(estimate.amount)}
                </p>
                <span className="text-[11px] text-muted-foreground md:hidden">Valor Total</span>
              </div>

              {/* Status */}
              <div className="col-span-3">
                <span className={cn(
                  "text-[11px] font-medium px-2.5 py-1 rounded-full inline-flex items-center capitalize",
                  estimate.status === 'pending' && "text-yellow-700 bg-yellow-100 border border-yellow-200",
                  estimate.status === 'approved' && "text-green-700 bg-green-100 border border-green-200",
                  estimate.status === 'paid' && "text-blue-700 bg-blue-100 border border-blue-200"
                )}>
                  {estimate.status === 'pending' ? 'Pendente' : estimate.status === 'approved' ? 'Aprovado' : 'Pago'}
                </span>
              </div>

              {/* Ações */}
              <div className="col-span-1 flex justify-end">
                <Button variant="ghost" size="icon" className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            </Link>
          ))}

          {/* Estado Vazio (Empty State) */}
          {estimates.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Nenhum orçamento encontrado</h3>
              <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
                Você ainda não criou nenhum orçamento. Clique no botão acima para começar a estimar seus projetos.
              </p>
              <Link href="/estimates/new" passHref>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar meu primeiro orçamento
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}