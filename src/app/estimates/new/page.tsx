'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEstimateStore, LineItem } from '@/store/useEstimateStore'
import Link from 'next/link'
import { LineItemsEditor } from '@/components/estimates/LineItemsEditor'
import { Controller } from 'react-hook-form'

const estimateSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  client: z.string().min(2, 'O nome do cliente é obrigatório'),
  items: z.array(z.object({
    id: z.string(),
    description: z.string().min(1, 'Descrição é obrigatória'),
    quantity: z.number().min(1),
    unitPrice: z.number().min(0),
  })).min(1, 'Adicione pelo menos um item'),
})

type EstimateFormValues = z.infer<typeof estimateSchema>

export default function NewEstimatePage() {
  const router = useRouter()
  const addEstimate = useEstimateStore((state) => state.addEstimate)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EstimateFormValues>({
    resolver: zodResolver(estimateSchema),
    defaultValues: {
      items: [],
    },
  })

  const items = watch('items')

  const onSubmit = (data: EstimateFormValues) => {
    const totalAmount = data.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0)
    
    const newEstimate = {
      id: Math.random().toString(36).substr(2, 9),
      title: data.title,
      client: data.client,
      amount: totalAmount,
      status: 'pending' as const,
      date: new Date().toISOString(),
      items: data.items,
    }
    
    addEstimate(newEstimate)
    router.push('/')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/" 
          className="inline-flex items-center justify-center size-8 rounded-md hover:bg-muted transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Novo Orçamento</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-card p-6 rounded-xl shadow-sm border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Projeto</Label>
            <Input
              id="title"
              placeholder="Ex: Reforma de Cozinha"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-sm font-medium text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="client">Cliente</Label>
            <Input
              id="client"
              placeholder="Ex: João da Silva"
              {...register('client')}
            />
            {errors.client && (
              <p className="text-sm font-medium text-destructive">{errors.client.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Controller
            control={control}
            name="items"
            render={({ field }) => (
              <LineItemsEditor
                items={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {errors.items && (
            <p className="text-sm font-medium text-destructive">{errors.items.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.push('/')}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
            <Save className="mr-2 h-4 w-4" />
            Salvar Orçamento
          </Button>
        </div>
      </form>
    </div>
  )
}