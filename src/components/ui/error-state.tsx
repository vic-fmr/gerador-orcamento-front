'use client'

import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  isRetrying?: boolean
  className?: string
}

export function ErrorState({
  title = 'Não foi possível carregar as informações',
  message = 'Ocorreu um erro ao comunicar com o servidor. Verifique sua conexão e tente novamente.',
  onRetry,
  isRetrying = false,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'p-8 text-center bg-card rounded-xl border border-destructive/20 shadow-sm space-y-4 max-w-lg mx-auto my-6',
        'motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 duration-200',
        className
      )}
    >
      <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
        <AlertCircle className="w-6 h-6" />
      </div>

      <div className="space-y-1.5">
        <h3 className="font-semibold text-base text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground break-words">{message}</p>
      </div>

      {onRetry && (
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            disabled={isRetrying}
            className="border-border hover:bg-muted"
          >
            <RefreshCw className={cn('mr-2 h-4 w-4', isRetrying && 'animate-spin')} />
            {isRetrying ? 'Tentando novamente...' : 'Tentar novamente'}
          </Button>
        </div>
      )}
    </div>
  )
}
