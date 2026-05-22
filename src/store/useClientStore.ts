import { create } from 'zustand'

export interface Client {
  id: number
  name: string
  email?: string
  phone?: string
  address?: string
  addressName?: string
}

interface ClientState {
  clients: Client[]
  setClients: (clients: Client[]) => void
  addClient: (client: Client) => void
  updateClient: (id: number, updates: Partial<Client>) => void
  removeClient: (id: number) => void
}

export const useClientStore = create<ClientState>((set) => ({
  clients: [],
  setClients: (clients) => set(() => ({ clients })),
  addClient: (client) => set((state) => ({ 
    clients: [client, ...state.clients] 
  })),
  updateClient: (id, updates) => set((state) => ({
    clients: state.clients.map((c) => c.id === id ? { ...c, ...updates } : c)
  })),
  removeClient: (id) => set((state) => ({
    clients: state.clients.filter((c) => c.id !== id)
  })),
}))
