'use client'

import React from 'react'
import { ClientsTable } from '@/components/clients/ClientsTable'
import { CreateClientSheet } from '@/components/clients/CreateClientSheet'
import { useClients } from '@/hooks/useClients'
import { Loader2, Search } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ErrorState } from '@/components/ui/error-state'
import { getErrorMessage } from '@/lib/api-client'

export default function ClientsPage() {
  const { data: clients, isLoading, isError, error, refetch, isFetching } = useClients()
  const [searchTerm, setSearchTerm] = React.useState('')

  const filteredClients = clients?.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  }) || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
          <p className="text-sm text-muted-foreground mt-1">Gerencie a lista de clientes para seus orçamentos.</p>
        </div>
      </div>

      <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div className="space-y-1.5">
            <Label htmlFor="search">Procurar</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Procurar clientes..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <CreateClientSheet />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <ErrorState
          title="Erro ao carregar clientes"
          message={getErrorMessage(error, 'Não foi possível obter a lista de clientes do servidor.')}
          onRetry={() => refetch()}
          isRetrying={isFetching}
        />
      ) : (
        <ClientsTable clients={filteredClients} />
      )}
    </div>
  )
}