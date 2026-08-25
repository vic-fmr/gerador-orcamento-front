'use client'

import { QueryClient, QueryClientProvider, MutationCache } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { ApiError, getErrorMessage } from './api-client'
import { toast } from './toast'

/**
 * Global QueryClient instance
 * Configured with smart retry policies and global mutation error notifications
 */
export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      // If caller explicitly handles or opts out, don't duplicate
      if (mutation.meta?.suppressToast) {
        return
      }
      // If mutation doesn't have an inline onError, notify user
      if (!mutation.options.onError) {
        toast.error(getErrorMessage(error))
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Never retry client errors (400, 401, 403, 404, 409, 422)
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false
        }
        // Retry network or server errors at most 2 times
        return failureCount < 2
      },
    },
  },
})

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
