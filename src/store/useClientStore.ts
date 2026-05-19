import { create } from 'zustand'

export interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  addressName?: string
}

interface ClientState {
  clients: Client[]
  addClient: (client: Client) => void
}

export const useClientStore = create<ClientState>((set) => ({
  clients: [
    { id: 'cli1', name: 'Global Tech Inc.', email: 'contact@globaltech.com', address: 'Av. Paulista, 1000', addressName: 'Escritório SP' },
    { id: 'cli2', name: 'Home Services Ltd', email: 'info@homeservices.com', phone: '(11) 99999-9999', address: 'Rua Direita, 20', addressName: 'Sede' },
    { id: 'cli3', name: 'City Apartments', email: 'management@cityapartments.com', address: 'Rua das Flores, 50', addressName: 'Condomínio' },
    { id: 'cli4', name: 'Maria Oliveira', email: 'maria@gmail.com', phone: '(21) 98888-8888', address: 'Av. Rio Branco, 200', addressName: 'Trabalho' },
  ],
  addClient: (client) => set((state) => ({ 
    clients: [client, ...state.clients] 
  })),
}))
