'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller, Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, Save, Download, FileEdit, AlertCircle, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Quote, DEFAULT_PROPOSAL_DETAILS } from '@/store/useQuoteStore'
import Link from 'next/link'
import { useCreateQuote, useGenerateQuoteAI } from '@/hooks/useQuotes'
import { ClientSelect } from '@/components/estimates/ClientSelect'
import { useClientStore } from '@/store/useClientStore'
import { generateQuotePDF } from '@/lib/pdf-export'
import { generateQuoteDOCX } from '@/lib/docx-export'
import { resolveEstimateClient } from '@/lib/estimate-document'
import { getErrorMessage } from '@/lib/api-client'
import { ProposalDetailsEditor } from '@/components/estimates/ProposalDetailsEditor'

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
  proposalDetails: z.object({
    workLocation: z.string().optional(),
    serviceSummary: z.string().optional(),
    executionDeadline: z.string().optional(),
    taxRegime: z.string().optional(),
    invoicing: z.string().optional(),
    scopeIntro: z.string().optional(),
    scopeItems: z.array(z.string()).optional(),
    schedule: z.array(z.object({
      period: z.string(),
      activities: z.string(),
    })).optional(),
    fiscalBenefitNote: z.string().optional(),
    conditions: z.array(z.string()).optional(),
  }).optional(),
})

type QuoteFormValues = z.infer<typeof quoteSchema>

export function NewQuotePage() {
  const router = useRouter()
  const [step, setStep] = React.useState(1)
  const [saveError, setSaveError] = React.useState<string | null>(null)
  const createQuote = useCreateQuote()
  
  const [creationMode, setCreationMode] = React.useState<'manual' | 'ai'>('manual')
  const [prompt, setPrompt] = React.useState('')
  const [isAIGenerated, setIsAIGenerated] = React.useState(false)
  const generateAI = useGenerateQuoteAI()

  const {
    register,
    handleSubmit,
    control,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      items: [],
      client: 0,
      proposalDetails: DEFAULT_PROPOSAL_DETAILS,
    },
  })

  const items = watch('items')
  const title = watch('title')
  const clientId = watch('client')
  const proposalDetails = watch('proposalDetails') || DEFAULT_PROPOSAL_DETAILS

  const onSubmit = (data: QuoteFormValues) => {
    if (step < 3) {
      nextStep()
      return
    }

    setSaveError(null)
    const totalAmount = data.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0)

    const newQuote = {
      title: data.title,
      client: data.client,
      amount: totalAmount,
      status: 'DRAFT' as const,
      date: new Date().toISOString(),
      items: data.items,
      proposalDetails: data.proposalDetails || DEFAULT_PROPOSAL_DETAILS,
    }

    createQuote.mutate(newQuote, {
      onSuccess: () => {
        setSaveError(null)
        router.push('/')
      },
      onError: (error) => {
        setSaveError(getErrorMessage(error, 'Erro ao salvar o orçamento. Tente novamente.'))
      },
    })
  }

  const nextStep = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    setSaveError(null)
    
    if (step === 1) {
      if (creationMode === 'ai') {
        const isClientValid = await trigger('client')
        if (!isClientValid) return
        if (!prompt.trim()) {
          setSaveError('Descreva o projeto para a IA gerar o orçamento.')
          return
        }

        generateAI.mutate({ prompt, clientId }, {
          onSuccess: (data) => {
            setValue('title', data.title)
            setValue('items', data.items)
            if (data.proposalDetails) {
              setValue('proposalDetails', data.proposalDetails)
            }
            setIsAIGenerated(true)
            setStep(2)
          },
          onError: (error) => {
            setSaveError(getErrorMessage(error, 'Erro ao gerar o orçamento por IA.'))
          }
        })
      } else {
        const result = await trigger(['title', 'client'])
        if (result) setStep(2)
      }
    } else if (step === 2) {
      const result = await trigger(['items'])
      if (result) setStep(3)
    }
  }

  const prevStep = (e: React.MouseEvent) => {
    e.preventDefault()
    setSaveError(null)
    setStep(step - 1)
  }

  const totalAmount = (items || []).reduce((acc, item) => acc + item.quantity * item.unitPrice, 0)

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
    items: items || [],
    proposalDetails: proposalDetails,
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
          <span className={step === 2 ? 'text-primary font-bold' : ''}>2. Itens & Detalhes</span>
          <span className="w-4 h-px bg-border"></span>
          <span className={step === 3 ? 'text-primary font-bold' : ''}>3. Revisão</span>
        </div>
      </div>

      {saveError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive animate-in fade-in duration-200"
        >
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Erro ao salvar</p>
            <p className="mt-0.5 leading-snug">{saveError}</p>
          </div>
        </div>
      )}

      <form
        onSubmit={step === 3 ? handleSubmit(onSubmit) : (e) => e.preventDefault()}
        className="space-y-8 bg-card p-6 rounded-xl shadow-sm border border-border"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && step < 3 && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
            e.preventDefault()
            nextStep()
          }
        }}
      >
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
            
            <div className="flex bg-muted/50 p-1 rounded-lg w-full max-w-sm mx-auto mb-6">
              <button
                type="button"
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${creationMode === 'manual' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setCreationMode('manual')}
              >
                Preenchimento Manual
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${creationMode === 'ai' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setCreationMode('ai')}
              >
                <Sparkles className="w-4 h-4" />
                Gerar com IA
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              {creationMode === 'manual' ? (
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Projeto</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Reforma de Fachada Comercial"
                    {...register('title')}
                  />
                  {errors.title && (
                    <p className="text-sm font-medium text-destructive">{errors.title.message}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
                  <Label htmlFor="prompt">Descrição do Projeto</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Ex: Reforma de fachada de delicatessen com 15m2, pintura nova..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px] resize-y"
                  />
                  <p className="text-xs text-muted-foreground">
                    A IA vai gerar o título, itens do orçamento e a proposta técnica.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            {isAIGenerated && (
              <div className="flex items-start gap-3 bg-primary/10 border border-primary/20 text-primary-foreground p-4 rounded-lg mb-4 text-sm text-primary">
                <Sparkles className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Rascunho gerado por IA</p>
                  <p className="opacity-90 leading-relaxed">
                    Verifique as quantidades, valores e detalhes propostos. Edite o que for necessário antes de avançar para a revisão.
                  </p>
                </div>
              </div>
            )}
            <Controller
              control={control}
              name="items"
              render={({ field: itemsField }) => (
                <Controller
                  control={control}
                  name="proposalDetails"
                  render={({ field: detailsField }) => (
                    <ProposalDetailsEditor
                      items={itemsField.value || []}
                      onChangeItems={itemsField.onChange}
                      proposalDetails={detailsField.value || DEFAULT_PROPOSAL_DETAILS}
                      onChangeProposalDetails={detailsField.onChange}
                    />
                  )}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
              <div>
                <Label className="text-muted-foreground">Projeto</Label>
                <p className="font-semibold text-lg">{title}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Cliente</Label>
                <p className="font-semibold text-lg">{clientNameForPreview}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Prazo de Execução</Label>
                <p className="font-semibold text-sm">{proposalDetails.executionDeadline || '25 a 30 dias úteis'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Local da Obra</Label>
                <p className="font-semibold text-sm">{proposalDetails.workLocation || 'Fachada Principal'}</p>
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
                    {(items || []).map((item) => (
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
              <Button 
                type="button" 
                onClick={nextStep}
                disabled={generateAI.isPending}
                className="bg-primary hover:bg-primary/90 flex-1 sm:flex-initial h-11 sm:h-9"
              >
                {generateAI.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  'Próximo'
                )}
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
                  {createQuote.isPending ? 'Salvando...' : 'Salvar Orçamento'}
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
