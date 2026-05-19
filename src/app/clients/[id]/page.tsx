'use client'

import React, { use } from 'react'
import Link from 'next/link'
import { ArrowLeft, User, Mail, Phone, ShieldCheck, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useClientStore } from '@/store/useClientStore'
import { cn } from '@/lib/utils'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ClientDetailsPage({ params }: PageProps) {
  // Captura o id da URL de forma assíncrona (Padrão Next.js)
  const resolvedParams = use(params)
  const { clients } = useClientStore()

  // Busca o cliente correspondente no seu Store global do Zustand
  const client = clients.find((c) => c.id === resolvedParams.id)

  // Caso o cliente não seja encontrado no Store
  if (!client) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-foreground">Cliente não encontrado</h2>
        <p className="text-sm text-muted-foreground mt-2">O cliente solicitado não existe ou foi removido.</p>
        <Link href="/clients" passHref>
          <Button variant="outline" className="mt-4">
            Voltar para a lista
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho com botão de Voltar */}
      <div className="flex items-center gap-4">
        <Link href="/clients" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{client.name}</h2>
          <p className="text-sm text-muted-foreground">Código do Cliente: #{client.id}</p>
        </div>
      </div>

      {/* Grid de Informações Rápidas */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Card Contato Principal */}
        <Card className="border border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contato Responsável</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-foreground">{client.contact}</div>
          </CardContent>
        </Card>

        {/* Card Informações de Comunicação */}
        <Card className="border border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canais de Contato</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-center text-sm font-medium text-foreground">
              <Mail className="w-3.5 h-3.5 mr-2 text-muted-foreground shrink-0" />
              <span className="truncate">{client.email}</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Phone className="w-3.5 h-3.5 mr-2 shrink-0" />
              <span>{client.phone}</span>
            </div>
          </CardContent>
        </Card>

        {/* Card Status cadastral */}
        <Card className="border border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Situação Comercial</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <span className={cn(
              "text-xs font-medium px-2.5 py-1 rounded-full inline-flex items-center capitalize mt-1",
              client.status === 'active' 
                ? "text-emerald-700 bg-emerald-100 border border-emerald-200" 
                : "text-slate-600 bg-slate-100 border border-slate-200"
            )}>
              {client.status === 'active' ? 'Ativo' : 'Inativo'}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Histórico ou Notas sobre o Cliente */}
      <Card className="border border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Histórico de Projetos e Notas</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground leading-relaxed">
          Nesta seção, você poderá integrar futuramente uma listagem contendo todos os orçamentos vinculados a este cliente específico (`{client.name}`), notas de reuniões ou histórico de faturamento para ter um CRM completo dentro do EstimatePro.
        </CardContent>
      </Card>
    </div>
  )
}