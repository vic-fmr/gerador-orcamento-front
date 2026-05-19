'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const clientSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('Email inválido').or(z.literal('')),
  phone: z.string().or(z.literal('')),
  address: z.string().or(z.literal('')),
  addressName: z.string().or(z.literal('')),
})

export type ClientFormValues = z.infer<typeof clientSchema>

interface ClientFormProps {
  onSubmit: (data: ClientFormValues) => void
  isSubmitting?: boolean
}

export function ClientForm({ onSubmit, isSubmitting }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      addressName: '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register('email')} />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input id="phone" {...register('phone')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Endereço</Label>
        <Input id="address" {...register('address')} placeholder="Rua, Número, Bairro, Cidade - UF" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="addressName">Nome do Endereço</Label>
        <Input id="addressName" {...register('addressName')} placeholder="Ex: Sede, Obra 1, Matriz" />
      </div>

      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Cliente'}
        </Button>
      </div>
    </form>
  )
}