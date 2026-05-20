'use client'

import React from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ServiceForm, ServiceFormValues } from './ServiceForm'
import { ServiceItem } from '@/store/useServiceStore'
import { useCreateService, useUpdateService } from '@/hooks/useServices'

interface ServiceSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  service?: ServiceItem | null
}

export function ServiceSheet({ open, onOpenChange, service }: ServiceSheetProps) {
  const createService = useCreateService()
  const updateService = useUpdateService()

  const isEditing = Boolean(service)
  const isSubmitting = createService.isPending || updateService.isPending

  const handleSubmit = (data: ServiceFormValues) => {
    if (service) {
      updateService.mutate(
        {
          id: service.id,
          updates: data,
        },
        {
          onSuccess: () => onOpenChange(false),
        }
      )
      return
    }

    createService.mutate(
      {
        id: crypto.randomUUID(),
        ...data,
      },
      {
        onSuccess: () => onOpenChange(false),
      }
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
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
        />
      </SheetContent>
    </Sheet>
  )
}