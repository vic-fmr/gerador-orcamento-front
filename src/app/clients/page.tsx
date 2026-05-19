// src/app/clients/page.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { 
  UserPlus, 
  User,
  MoreHorizontal,
  Search,
  Mail,
  Phone,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
// 1. Importe o seu novo store aqui:
import { useClientStore } from '@/store/useClientStore'

export default function ClientsPage() {
  // 2. Conecte os clientes do estado global
  const { clients, removeClient } = useClientStore()

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Meus Clientes</h2>
          <p className="text-muted-foreground mt-1">
            Gerencie sua carteira de clientes, contatos e informações da empresa.
          </p>
        </div>
        <Link href="/clients/new" passHref>
          <Button className="w-full md:w-auto">
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </Link>
      </div>

      {/* Tabela / Lista de Clientes */}
      <div className="bg-card text-card-foreground shadow-sm border border-border/50 rounded-xl overflow-hidden">
        
        {/* Cabeçalho da Lista */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-border/50 bg-muted/20 text-sm font-medium text-muted-foreground">
          <div className="col-span-5">Empresa / Contato</div>
          <div className="col-span-4">Informações de Contato</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-right">Ações</div>
        </div>

        {/* Corpo da Lista */}
        <div className="divide-y divide-border/50">
          {clients.map((client) => (
            // Dentro do seu clients.map((client) => ...) em src/app/clients/page.tsx

<Link 
  href={`/clients/${client.id}`} 
  key={client.id} 
  className="p-4 hover:bg-muted/30 transition-colors flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 group cursor-pointer"
>
  {/* Info principal (Nome/Empresa) */}
  <div className="col-span-5 flex items-center gap-4">
    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
      <User className="w-5 h-5 text-primary" />
    </div>
    <div>
      {/* O nome ganha destaque de cor no hover da linha */}
      <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
        {client.name}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">Contato: {client.contact}</p>
    </div>
  </div>

  {/* Informações de Contato */}
  <div className="col-span-4 flex flex-col gap-1">
    <div className="flex items-center text-sm text-muted-foreground">
      <Mail className="w-3.5 h-3.5 mr-2 shrink-0" />
      <span className="truncate">{client.email}</span>
    </div>
    <div className="flex items-center text-xs text-muted-foreground">
      <Phone className="w-3.5 h-3.5 mr-2 shrink-0" />
      <span>{client.phone}</span>
    </div>
  </div>

  {/* Status */}
  <div className="col-span-2 mt-2 md:mt-0">
    <span className={cn(
      "text-[11px] font-medium px-2.5 py-1 rounded-full inline-flex items-center capitalize",
      client.status === 'active' 
        ? "text-emerald-700 bg-emerald-100 border border-emerald-200" 
        : "text-slate-600 bg-slate-100 border border-slate-200"
    )}>
      {client.status === 'active' ? 'Ativo' : 'Inativo'}
    </span>
  </div>

  {/* Botão de Deletar (Adicionado stopPropagation para o clique na lixeira não abrir os detalhes da página) */}
  <div className="col-span-1 flex justify-end">
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={(e) => {
        e.preventDefault(); // Previne o comportamento do Link
        e.stopPropagation(); // Evita que o clique se propague para a linha inteira
        removeClient(client.id);
      }}
      className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  </div>
</Link>
          ))}

          {/* Estado Vazio (Empty State) */}
          {clients.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Nenhum cliente cadastrado</h3>
              <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
                Sua carteira de clientes está vazia. Adicione seu primeiro cliente para começar a gerar orçamentos.
              </p>
              <Link href="/clients/new" passHref>
                <Button variant="outline">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Cadastrar Cliente
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}