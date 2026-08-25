'use client'

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ClientForm, ClientFormValues } from './ClientForm'
import { useCreateClient } from '@/hooks/useClients'
import { Client } from '@/lib/api'
import { getErrorMessage } from '@/lib/api-client'

interface CreateClientSheetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactElement | null
  onSuccess?: (client: Client) => void
}

export function CreateClientSheet({ open, onOpenChange, trigger, onSuccess }: CreateClientSheetProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const createClient = useCreateClient()
  const isControlled = typeof open === 'boolean'
  const sheetOpen = isControlled ? open : internalOpen

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setServerError(null)
    }
    if (!isControlled) {
      setInternalOpen(nextOpen)
    }
    onOpenChange?.(nextOpen)
  }

  const handleSubmit = (data: ClientFormValues) => {
    setServerError(null)
    createClient.mutate(
      data,
      {
        onSuccess: (createdClient) => {
          setServerError(null)
          onSuccess?.(createdClient)
          handleOpenChange(false)
        },
        onError: (error) => {
          setServerError(getErrorMessage(error, 'Erro ao criar cliente. Verifique os dados e tente novamente.'))
        },
      }
    )
  }

  return (
    <Sheet open={sheetOpen} onOpenChange={handleOpenChange}>
      {trigger !== null && (
        <SheetTrigger
          render={
            trigger ?? (
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Cliente
              </Button>
            )
          }
        />
      )}
      <SheetContent className="w-full p-2 sm:max-w-md overflow-y-auto lg:px-6">
        <SheetHeader className="mb-6">
          <SheetTitle>Adicionar Novo Cliente</SheetTitle>
          <SheetDescription>
            Preencha os dados do cliente abaixo. As informações serão salvas imediatamente.
          </SheetDescription>
        </SheetHeader>
        <ClientForm
          onSubmit={handleSubmit}
          isSubmitting={createClient.isPending}
          errorMessage={serverError}
        />
      </SheetContent>
    </Sheet>
  )
}