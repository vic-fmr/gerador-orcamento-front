// src/store/useClientStore.ts
import { create } from 'zustand'

export interface Client {
  id: string
  name: string
  contact: string
  email: string
  phone: string
  status: 'active' | 'inactive'
}

interface ClientState {
  clients: Client[]
  addClient: (client: Omit<Client, 'id'>) => void
  removeClient: (id: string) => void
}

export const useClientStore = create<ClientState>((set) => ({
  // Dados iniciais para o seu app não iniciar totalmente vazio
  clients: [
    { 
      id: '1', 
      name: 'Acme Corp', 
      contact: 'João Silva', 
      email: 'joao@acme.com', 
      phone: '(11) 99999-9999', 
      status: 'active' 
    },
    { 
      id: '2', 
      name: 'TechSolutions LTDA', 
      contact: 'Maria Souza', 
      email: 'maria@techsolutions.com.br', 
      phone: '(11) 98888-8888', 
      status: 'active' 
    },
  ],
  
  // Função para adicionar novos clientes no futuro
  addClient: (newClient) => set((state) => ({
    clients: [
      ...state.clients, 
      { ...newClient, id: Math.random().toString(36).substr(2, 9) }
    ]
  })),

  // Função para remover clientes
  removeClient: (id) => set((state) => ({
    clients: state.clients.filter((client) => client.id !== id)
  })),
}))