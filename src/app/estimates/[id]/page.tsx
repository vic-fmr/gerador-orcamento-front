'use client'

import React, { use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, DollarSign, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEstimateStore } from '@/store/useEstimateStore'
import { cn } from '@/lib/utils'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EstimateDetailsPage({ params }: PageProps) {
  // Captura o id da URL de forma assíncrona (Padrão Next.js recente)
  const resolvedParams = use(params)
  const { estimates } = useEstimateStore()

  // Busca o orçamento correspondente no seu Store global
  const estimate = estimates.find((e) => e.id === resolvedParams.id)

  // Caso o orçamento não seja encontrado
  if (!estimate) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold">Orçamento não encontrado</h2>
        <Link href="/estimates" passHref>
          <Button variant="outline" className="mt-4">Voltar para a lista</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Botão Voltar */}
      <div className="flex items-center gap-4">
        <Link href="/estimates" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{estimate.title}</h2>
          <p className="text-sm text-muted-foreground">ID do Orçamento: #{estimate.id}</p>
        </div>
      </div>

      {/* Grid de Informações */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cliente</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{estimate.client}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(estimate.amount)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Atual</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <span className={cn(
              "text-xs font-medium px-2.5 py-1 rounded-full inline-flex items-center capitalize mt-1",
              estimate.status === 'pending' && "text-yellow-700 bg-yellow-100",
              estimate.status === 'approved' && "text-green-700 bg-green-100",
              estimate.status === 'paid' && "text-blue-700 bg-blue-100"
            )}>
              {estimate.status === 'pending' ? 'Pendente' : estimate.status === 'approved' ? 'Aprovado' : 'Pago'}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Detalhamento do Escopo (Simulação de conteúdo extra) */}
      <Card className="border border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Descrição do Projeto / Escopo</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground leading-relaxed">
          Este espaço pode ser alimentado futuramente com as descrições detalhadas, itens de linha de preço, materiais e prazos estipulados para este orçamento específico.
        </CardContent>
      </Card>
    </div>
  )
}