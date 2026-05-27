'use client'

import React from 'react'
import { Client } from '@/store/useClientStore'
import { User, Mail, Phone, MapPin, Trash2 } from 'lucide-react'
import { useDeleteClient } from '@/hooks/useClients'
import { Button } from '@/components/ui/button'

interface ClientsTableProps {
  clients: Client[]
}

const ClientRow = React.memo(function ClientRow({ 
  client, 
  onDelete 
}: { 
  client: Client
  onDelete: (id: number) => void
}) {
  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja excluir o cliente "${client.name}"?`)) {
      onDelete(client.id)
    }
  }

  return (
    <tr key={client.id} className="border-b border-border hover:bg-muted/30 transition-colors">
      <td className="p-4">
        <div className="font-medium text-sm">{client.name}</div>
        <div className="text-xs text-muted-foreground">ID: {client.id}</div>
      </td>
      <td className="p-4">
        <div className="flex flex-col gap-0.5">
          <div className="text-sm flex items-center gap-1.5">
            <Mail className="h-3 w-3 text-muted-foreground" />
            {client.email || 'N/A'}
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Phone className="h-3 w-3" />
            {client.phone || 'N/A'}
          </div>
        </div>
      </td>
      <td className="p-4 text-sm">
        {client.address ? (
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span>{client.address}</span>
            </div>
            {client.addressName && (
              <span className="text-xs text-muted-foreground ml-4.5">{client.addressName}</span>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground italic">Sem endereço</span>
        )}
      </td>
      <td className="p-4 text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={handleDelete} className="text-destructive hover:text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  )
})

export function ClientsTable({ clients }: ClientsTableProps) {
  const { mutate: deleteClient } = useDeleteClient()

  if (clients.length === 0) {
    return (
      <div className="p-12 text-center text-muted-foreground bg-card rounded-xl border border-border shadow-sm">
        Nenhum cliente encontrado.
      </div>
    )
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left p-4 font-medium text-sm">Cliente / Nome</th>
              <th className="text-left p-4 font-medium text-sm">Contato</th>
              <th className="text-left p-4 font-medium text-sm">Endereço</th>
              <th className="text-right p-4 font-medium text-sm">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <ClientRow key={client.id} client={client} onDelete={(id) => deleteClient(id)} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {clients.map((client) => (
          <div key={client.id} className="bg-card rounded-xl border border-border shadow-sm p-4 space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-bold text-base leading-tight">{client.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  ID: {client.id}
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  if (confirm(`Tem certeza que deseja excluir o cliente "${client.name}"?`)) {
                    deleteClient(client.id)
                  }
                }} 
                className="text-destructive hover:text-destructive hover:bg-destructive/10 -mt-2 -mr-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  <Mail className="h-3 w-3" />
                  Contato
                </div>
                <p className="text-sm font-medium">{client.email || 'N/A'}</p>
                <p className="text-xs text-muted-foreground">{client.phone || 'N/A'}</p>
              </div>

              {client.address && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <MapPin className="h-3 w-3" />
                    Endereço
                  </div>
                  <p className="text-sm font-medium">{client.address}</p>
                  {client.addressName && (
                    <p className="text-xs text-muted-foreground">{client.addressName}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
