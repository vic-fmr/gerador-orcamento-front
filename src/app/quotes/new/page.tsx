'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Quote } from '@/store/useQuoteStore'
import Link from 'next/link'
import { LineItemsEditor } from '@/components/estimates/LineItemsEditor'
import { Controller, Path } from 'react-hook-form'
import { useCreateQuote } from '@/hooks/useQuotes'
import { ClientSelect } from '@/components/estimates/ClientSelect'
import { useClientStore } from '@/store/useClientStore'
import { generateQuotePDF } from '@/lib/pdf-export'
import { generateQuoteDOCX } from '@/lib/docx-export'
import { resolveEstimateClient } from '@/lib/estimate-document'
import { Download, FileEdit } from 'lucide-react'

const quoteSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  client: z.number().int().min(1, 'O cliente é obrigatório'),
  items: z.array(z.object({
    id: z.string(),
    description: z.string().min(1, 'Descrição é obrigatória'),
    quantity: z.number().min(0.01),
    unitPrice: z.number().min(0),
    unit: z.string(),
  })).min(1, 'Adicione pelo menos um item'),
})

type QuoteFormValues = z.infer<typeof quoteSchema>

export function NewQuotePage() {
  const router = useRouter()
  const [step, setStep] = React.useState(1)
  const createQuote = useCreateQuote()

  const {
    register,
    handleSubmit,
    control,
    trigger,
    watch,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      items: [],
      client: 0,
    },
  })

  const items = watch('items')
  const title = watch('title')
  const clientId = watch('client')

  const onSubmit = (data: QuoteFormValues) => {
    if (step < 3) {
      nextStep()
      return
    }

    const totalAmount = data.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0)

    const newQuote = {
      title: data.title,
      client: data.client,
      amount: totalAmount,
      status: 'DRAFT' as const,
      date: new Date().toISOString(),
      items: data.items,
    }

    createQuote.mutate(newQuote, {
      onSuccess: () => {
        router.push('/')
      }
    })
  }

  const nextStep = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    const fieldsToValidate: Path<QuoteFormValues>[] = step === 1 ? ['title', 'client'] : ['items']
    const result = await trigger(fieldsToValidate)
    if (result) setStep(step + 1)
  }

  const prevStep = (e: React.MouseEvent) => {
    e.preventDefault()
    setStep(step - 1)
  }

  const totalAmount = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0)

  const clients = useClientStore((s) => s.clients)
  const clientData = clients.find((c) => c.id === clientId)
  const clientNameForPreview = clientData?.name || ''

  const currentQuoteForPreview: Quote = {
    id: 0,
    title,
    client: clientId,
    amount: totalAmount,
    status: 'DRAFT' as const,
    date: new Date().toISOString(),
    items: items,
  }

  const handleExportPDF = (e: React.MouseEvent) => {
    e.preventDefault()
    generateQuotePDF(currentQuoteForPreview, resolveEstimateClient(clientId, clients))
  }

  const handleExportDOCX = (e: React.MouseEvent) => {
    e.preventDefault()
    generateQuoteDOCX(currentQuoteForPreview, resolveEstimateClient(clientId, clients))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
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
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <span className={step === 1 ? 'text-primary font-bold' : ''}>1. Detalhes</span>
          <span className="w-4 h-px bg-border"></span>
          <span className={step === 2 ? 'text-primary font-bold' : ''}>2. Itens</span>
          <span className="w-4 h-px bg-border"></span>
          <span className={step === 3 ? 'text-primary font-bold' : ''}>3. Revisão</span>
        </div>
      </div>

      <form
        onSubmit={step === 3 ? handleSubmit(onSubmit) : (e) => e.preventDefault()}
        className="space-y-8 bg-card p-6 rounded-xl shadow-sm border border-border"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && step < 3) {
            e.preventDefault()
            nextStep()
          }
        }}
      >
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-left-4 duration-300">
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
              <Controller
                control={control}
                name="client"
                render={({ field }) => (
                  <ClientSelect
                    id="client"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.client && (
                <p className="text-sm font-medium text-destructive">{errors.client.message}</p>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
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
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Resumo do Orçamento</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
              <div>
                <Label className="text-muted-foreground">Projeto</Label>
                <p className="font-semibold text-lg">{title}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Cliente</Label>
                <p className="font-semibold text-lg">{clientNameForPreview}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Resumo dos Itens</Label>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-2">Descrição</th>
                      <th className="text-right p-2">Qtd</th>
                      <th className="text-right p-2">Unit.</th>
                      <th className="text-right p-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-t border-border">
                        <td className="p-2">{item.description}</td>
                        <td className="p-2 text-right">{item.quantity}</td>
                        <td className="p-2 text-right">
                          {item.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                        <td className="p-2 text-right font-medium">
                          {(item.quantity * item.unitPrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end p-4 bg-primary/5 rounded-lg border border-primary/10">
              <div className="text-right">
                <p className="text-sm text-muted-foreground font-medium">Total do Orçamento</p>
                <p className="text-3xl font-bold text-primary">
                  {totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 pt-4 border-t border-border">
          <div className="flex gap-4">
            {step > 1 ? (
              <Button variant="outline" type="button" onClick={prevStep} className="flex-1 sm:flex-initial h-11 sm:h-9">
                Anterior
              </Button>
            ) : (
              <Button variant="outline" type="button" onClick={() => router.push('/')} className="flex-1 sm:flex-initial h-11 sm:h-9">
                Cancelar
              </Button>
            )}
          </div>

          <div className="flex gap-4">
            {step < 3 ? (
              <Button type="button" onClick={nextStep} className="bg-primary hover:bg-primary/90 flex-1 sm:flex-initial h-11 sm:h-9">
                Próximo
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleExportDOCX}
                  className="flex-1 sm:flex-initial h-11 sm:h-9 text-blue-600 hover:bg-blue-50"
                >
                  <FileEdit className="mr-2 h-4 w-4" />
                  DOCX
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleExportPDF}
                  className="flex-1 sm:flex-initial h-11 sm:h-9 text-primary hover:bg-primary/5"
                >
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </Button>
                <Button type="submit" disabled={createQuote.isPending} className="bg-primary hover:bg-primary/90 flex-1 sm:flex-initial h-11 sm:h-9">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Orçamento
                </Button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default NewQuotePage
