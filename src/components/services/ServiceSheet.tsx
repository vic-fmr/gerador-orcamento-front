'use client'

import React, { useState } from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ServiceForm, ServiceFormValues } from './ServiceForm'
import { ServiceItem } from '@/store/useServiceStore'
import { useCreateService, useUpdateService } from '@/hooks/useServices'
import { getErrorMessage } from '@/lib/api-client'

interface ServiceSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  service?: ServiceItem | null
}

export function ServiceSheet({ open, onOpenChange, service }: ServiceSheetProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const createService = useCreateService()
  const updateService = useUpdateService()

  const isEditing = Boolean(service)
  const isSubmitting = createService.isPending || updateService.isPending

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setServerError(null)
    }
    onOpenChange(nextOpen)
  }

  const handleSubmit = (data: ServiceFormValues) => {
    setServerError(null)
    if (service) {
      updateService.mutate(
        {
          id: service.id,
          updates: data,
        },
        {
          onSuccess: () => {
            setServerError(null)
            onOpenChange(false)
          },
          onError: (error) => {
            setServerError(getErrorMessage(error, 'Erro ao atualizar serviço.'))
          },
        }
      )
      return
    }

    createService.mutate(
      data,
      {
        onSuccess: () => {
          setServerError(null)
          onOpenChange(false)
        },
        onError: (error) => {
          setServerError(getErrorMessage(error, 'Erro ao criar serviço.'))
        },
      }
    )
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full p-2 sm:max-w-md overflow-y-auto lg:px-6">
        <SheetHeader className="mb-6">
          <SheetTitle>{isEditing ? 'Editar Serviço' : 'Adicionar Novo Serviço'}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Atualize os dados do serviço e salve para reutilizá-lo nos próximos orçamentos.'
              : 'Preencha os dados do serviço. Ele ficará disponível no editor de itens do orçamento.'}
          </SheetDescription>
        </SheetHeader>
        <ServiceForm
          key={service?.id ?? 'new-service'}
          defaultValues={service ?? undefined}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel={isEditing ? 'Salvar Alterações' : 'Salvar Serviço'}
          errorMessage={serverError}
        />
      </SheetContent>
    </Sheet>
  )
}