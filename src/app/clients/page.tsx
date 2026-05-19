'use client'

import React from 'react'
import { ClientsTable } from '@/components/clients/ClientsTable'
import { CreateClientSheet } from '@/components/clients/CreateClientSheet'
import { useClients } from '@/hooks/useClients'
import { Loader2 } from 'lucide-react'

export default function ClientsPage() {
  const { data: clients, isLoading } = useClients()

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

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ClientsTable clients={clients || []} />
      )}
    </div>
  )
}