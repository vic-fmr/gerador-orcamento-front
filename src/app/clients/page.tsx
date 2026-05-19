'use client'

import React from 'react'
import { ClientsTable } from '@/components/clients/ClientsTable'
import { CreateClientSheet } from '@/components/clients/CreateClientSheet'
import { useClients } from '@/hooks/useClients'
import { ArrowUpDown, Loader2, Search } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function ClientsPage() {
  const { data: clients, isLoading } = useClients()
  const [searchTerm, setSearchTerm] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')

  const filteredClients = clients?.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all'
    return matchesSearch && matchesStatus
  }) || []

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
          <p className="text-muted-foreground mt-1">
            Gerencie o cadastro de clientes e as informações de contato.
          </p>
        </div>
        <CreateClientSheet />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="md:col-span-2 space-y-1.5">
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
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ClientsTable clients={filteredClients} />
      )}
    </div>
  )
}