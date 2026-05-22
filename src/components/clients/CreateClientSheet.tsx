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

interface CreateClientSheetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactElement | null
  onSuccess?: (client: Client) => void
}

export function CreateClientSheet({ open, onOpenChange, trigger, onSuccess }: CreateClientSheetProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const createClient = useCreateClient()
  const isControlled = typeof open === 'boolean'
  const sheetOpen = isControlled ? open : internalOpen

  const handleOpenChange = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen)
    }
    onOpenChange?.(nextOpen)
  }

  const handleSubmit = (data: ClientFormValues) => {
    createClient.mutate(
      data,
      {
        onSuccess: (createdClient) => {
          onSuccess?.(createdClient)
          handleOpenChange(false)
        },
      }
    )
  }

  return (
    <Sheet open={sheetOpen} onOpenChange={handleOpenChange}>
      {trigger !== null && (
        <SheetTrigger
          render={
            trigger ?? <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          }
        />
      )}
      <SheetContent className="w-full p-2 sm:max-w-md overflow-y-auto lg:px-6 ">
        <SheetHeader className="mb-6">
          <SheetTitle>Adicionar Novo Cliente</SheetTitle>
          <SheetDescription>
            Preencha os dados do cliente abaixo. As informações serão salvas imediatamente.
          </SheetDescription>
        </SheetHeader>
        <ClientForm
          onSubmit={handleSubmit}
          isSubmitting={createClient.isPending}
        />
      </SheetContent>
    </Sheet>
  )
}