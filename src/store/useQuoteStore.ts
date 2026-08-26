import { create } from 'zustand'
import { QuoteStatus, getQuoteStatusBucket } from '@/lib/api'

export interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  unit: string
  serviceId?: string | number
}

export interface ScheduleItem {
  period: string
  activities: string
}

export interface QuoteTechnicalProposal {
  workLocation?: string
  serviceSummary?: string
  executionDeadline?: string
  taxRegime?: string
  invoicing?: string
  scopeIntro?: string
  scopeItems?: string[]
  schedule?: ScheduleItem[]
  fiscalBenefitNote?: string
  conditions?: string[]
}

export const DEFAULT_PROPOSAL_DETAILS: QuoteTechnicalProposal = {
  workLocation: 'Fachada Principal (95,00 m²)',
  serviceSummary: 'Demolição, Reboco e Recuperação de Viga',
  executionDeadline: '25 a 30 dias úteis',
  taxRegime: 'ME - Simples Nacional',
  invoicing: 'Emissão Integral de NFS-e',
  scopeIntro: 'Execução completa de serviços na fachada comercial com área de 95,00 m² e recuperação estrutural de viga de 15,00 m x 0,50 m (7,50 m²):',
  scopeItems: [
    'Segurança e Andaimes: Locação, montagem, desmontagem e envelopamento de andaime fachadeiro com telas protetoras (95,00 m²).',
    'Demolição Pesada: Remoção integral do reboco deteriorado com 10 cm de espessura (~9,5 m³ sólido / ~12,5 m³ solto) e descarte credenciado.',
    'Tratamento de Patologias: Abertura e selamento de trincas/fissuras em alvenaria com mástique de PU elastomérico e tela sintética.',
    'Recuperação Estrutural da Viga: Escarificação, limpeza mecânica das armaduras, proteção anticorrosiva (primer de zinco), ponte de aderência e recomposição com argamassa tixotrópica estrutural (7,50 m²).',
    'Novo Reboco de Alta Espessura (10 cm): Chapisco aditivado, fixação mecânica de tela soldada galvanizada estruturante e aplicação de argamassa impermeabilizada em camadas sucessivas de enchimento com cura técnica (95,00 m²).',
  ],
  schedule: [
    { period: 'Dias 01 a 05', activities: 'Montagem e envelopamento de andaimes com tela, isolamento da calçada e demolição integral do reboco espesso (e = 10 cm).' },
    { period: 'Dias 06 a 10', activities: 'Remoção de entulho em caçambas credenciadas, limpeza da alvenaria base e selamento elástico de trincas/rachaduras.' },
    { period: 'Dias 11 a 16', activities: 'Recuperação estrutural da viga: escarificação, tratamento químico/anticorrosivo das armaduras e argamassa tixotrópica.' },
    { period: 'Dias 17 a 26', activities: 'Aplicação de chapisco rolado aditivado, fixação da tela galvanizada e execução do reboco (10 cm) em camadas sucessivas com cura técnica.' },
    { period: 'Dias 27 a 30', activities: 'Acabamento sarrafeado/desempenado fino, limpeza pesada da calçada, desmobilização dos andaimes e entrega final da obra.' },
  ],
  fiscalBenefitNote: 'O valor global contempla a emissão integral de Nota Fiscal de Serviços Eletrônica (NFS-e) sob o regime do Simples Nacional, cobrindo todos os materiais, equipamentos, caçambas, andaimes, mão de obra, alimentação, vale-transporte, despesas operacionais e margem de BDI atualizada.',
  conditions: [
    'Prazo Total de Execução: 25 a 30 dias úteis, contados a partir da assinatura do contrato e liberação da área.',
    'Faturamento / NFS-e: Emissão de Nota Fiscal de Serviços correspondente a cada medição financeira contratada.',
    'Forma de Pagamento: 30% no ato do contrato (mobilização/insumos), 40% na conclusão da demolição/viga e 30% na entrega final do reboco.',
    'Validade da Proposta: 15 dias a contar da data de emissão.',
    'Garantia dos Serviços: 5 (cinco) anos para a estabilidade do reboco e integridade da recuperação estrutural conforme Código Civil e normas da ABNT.',
  ],
}

export interface Quote {
  id: number
  title: string
  client: number
  amount: number
  status: QuoteStatus
  date: string
  items: LineItem[]
  proposalDetails?: QuoteTechnicalProposal
}

interface QuoteState {
  quotes: Quote[]
  setQuotes: (quotes: Quote[]) => void
  addQuote: (quote: Quote) => void
  updateQuote: (id: number, updates: Partial<Quote>) => void
  removeQuote: (id: number) => void
  getStats: () => {
    pending: { value: number; count: number }
    approved: { value: number; count: number }
    paid: { value: number; count: number }
  }
  reset: () => void
}

export const useQuoteStore = create<QuoteState>((set, get) => ({
  quotes: [],
  setQuotes: (quotes) => set(() => ({ quotes })),
  addQuote: (quote) => set((state) => ({ 
    quotes: [quote, ...state.quotes] 
  })),
  updateQuote: (id, updates) => set((state) => ({
    quotes: state.quotes.map((q) => q.id === id ? { ...q, ...updates } : q)
  })),
  removeQuote: (id) => set((state) => ({
    quotes: state.quotes.filter((q) => q.id !== id)
  })),
  getStats: () => {
    const { quotes } = get()
    return quotes.reduce(
      (acc, curr) => {
        const bucket = getQuoteStatusBucket(curr.status)

        if (bucket === 'pending') {
          acc.pending.value += curr.amount
          acc.pending.count += 1
        } else if (bucket === 'approved') {
          acc.approved.value += curr.amount
          acc.approved.count += 1
        } else if (bucket === 'paid') {
          acc.paid.value += curr.amount
          acc.paid.count += 1
        }
        return acc
      },
      {
        pending: { value: 0, count: 0 },
        approved: { value: 0, count: 0 },
        paid: { value: 0, count: 0 },
      }
    )
  },
  reset: () => set({ quotes: [] }),
}))
