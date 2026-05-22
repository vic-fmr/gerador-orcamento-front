'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UNIT_OPTIONS, Unit } from '@/store/useServiceStore'

const serviceSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  description: z.string().max(240, 'A descrição deve ter no máximo 240 caracteres').or(z.literal('')),
  unit: z.enum(UNIT_OPTIONS),
  defaultUnitPrice: z.coerce.number().min(0, 'O preço precisa ser maior ou igual a zero'),
})

export type ServiceFormValues = z.infer<typeof serviceSchema>

interface ServiceFormProps {
  defaultValues?: Partial<ServiceFormValues>
  onSubmit: (data: ServiceFormValues) => void
  isSubmitting?: boolean
  submitLabel?: string
}

export function ServiceForm({ defaultValues, onSubmit, isSubmitting, submitLabel = 'Salvar Serviço' }: ServiceFormProps) {
  const mergedDefaultValues: ServiceFormValues = {
    name: defaultValues?.name ?? '',
    description: defaultValues?.description ?? '',
    unit: defaultValues?.unit ?? 'un',
    defaultUnitPrice: defaultValues?.defaultUnitPrice ?? 0,
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof serviceSchema>, unknown, ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: mergedDefaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Serviço</Label>
        <Input id="name" {...register('name')} placeholder="Ex: Pintura de Parede" />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input id="description" {...register('description')} placeholder="Detalhes do serviço" />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="unit">Unidade</Label>
          <select
            id="unit"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            {...register('unit')}
          >
            {UNIT_OPTIONS.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
          {errors.unit && <p className="text-sm text-destructive">{errors.unit.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="defaultUnitPrice">Preço Padrão</Label>
          <Input id="defaultUnitPrice" type="number" min="0" step="0.01" {...register('defaultUnitPrice')} />
          {errors.defaultUnitPrice && <p className="text-sm text-destructive">{errors.defaultUnitPrice.message}</p>}
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
