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

export function CreateClientSheet() {
  const [open, setOpen] = useState(false)
  const createClient = useCreateClient()

  const handleSubmit = (data: ClientFormValues) => {
    createClient.mutate(
      {
        id: crypto.randomUUID(),
        ...data,
      },
      {
        onSuccess: () => {
          setOpen(false)
        },
      }
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        }
      />
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