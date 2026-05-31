import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useClientStore } from './useClientStore'
import { useServiceStore } from './useServiceStore'
import { useQuoteStore } from './useQuoteStore'

import { queryClient } from '@/lib/query-provider'

interface User {
  id: string
  name: string
  email: string
  phone?: string
  token?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => {
        // Clear all stores on logout
        useClientStore.getState().reset()
        useServiceStore.getState().reset()
        useQuoteStore.getState().reset()
        
        // Clear React Query cache to prevent stale data between accounts
        queryClient.clear()
        
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
