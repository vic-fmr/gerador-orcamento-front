import { create } from 'zustand'

export interface Client {
  id: string
  name: string
  email?: string
  phone?: string
}

interface ClientState {
  clients: Client[]
  addClient: (client: Client) => void
}

export const useClientStore = create<ClientState>((set) => ({
  clients: [
    { id: 'cli1', name: 'Global Tech Inc.', email: 'contact@globaltech.com' },
    { id: 'cli2', name: 'Home Services Ltd', email: 'info@homeservices.com' },
    { id: 'cli3', name: 'City Apartments', email: 'management@cityapartments.com' },
    { id: 'cli4', name: 'Maria Oliveira', email: 'maria@gmail.com' },
  ],
  addClient: (client) => set((state) => ({ 
    clients: [...state.clients, client] 
  })),
}))
