import React from 'react'
import { Quote, DEFAULT_PROPOSAL_DETAILS } from '@/store/useQuoteStore'
import { Button } from '@/components/ui/button'
import { X, Download, FileEdit, Printer } from 'lucide-react'
import { generateQuotePDF, printQuotePDFDocument } from '@/lib/pdf-export'
import { generateQuoteDOCX } from '@/lib/docx-export'
import { useClientStore } from '@/store/useClientStore'
import { COMPANY_INFO, formatAddress, formatCnpj, resolveEstimateClient } from '@/lib/estimate-document'
import { useClients } from '@/hooks/useClients'

interface QuotePreviewProps {
  estimate: Quote
  onClose: () => void
}

export function EstimatePreview({ estimate, onClose }: QuotePreviewProps) {
  useClients()
  const clients = useClientStore((state) => state.clients)

  // Close on Escape key
  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const clientInfo = React.useMemo(() => resolveEstimateClient(estimate.client, clients), [estimate.client, clients])
  const clientAddress = formatAddress(clientInfo)
  const proposal = { ...DEFAULT_PROPOSAL_DETAILS, ...(estimate.proposalDetails || {}) }
  const formattedDate = new Date(estimate.date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
  const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-background w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
        <div className="sticky top-0 bg-background/95 backdrop-blur border-b border-border px-4 py-3 sm:p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between z-10 shrink-0">
          <div>
            <h3 className="text-lg sm:text-xl font-bold">Visualização da Proposta Comercial</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Prévia formatada para impressão, PDF e DOCX.</p>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => printQuotePDFDocument(estimate, clientInfo)}
              className="text-slate-700 hover:text-slate-900"
              title="Imprimir ou Salvar PDF via Navegador"
            >
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => generateQuoteDOCX(estimate, clientInfo)}
              className="hidden sm:flex text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <FileEdit className="mr-2 h-4 w-4" />
              DOCX
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => generateQuotePDF(estimate, clientInfo)}
              className="text-primary hover:text-primary hover:bg-primary/10"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-4 sm:p-8 md:p-12 space-y-6 bg-white text-slate-800 flex-1 min-h-0 overflow-y-auto font-sans text-sm">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b-2 border-[#1a365d] gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1a365d] tracking-wide uppercase">PROPOSTA COMERCIAL & TÉCNICA</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Engenharia, Reformas Comerciais e Recuperação Estrutural</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-base sm:text-lg font-bold text-[#2b6cb0]">
                {estimate.id ? `ORÇAMENTO Nº ${String(estimate.id).padStart(4, '0')}` : 'ORÇAMENTO Nº 2026/08-04.R4'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Data: {formattedDate}</p>
            </div>
          </div>

          {/* Client & Project Info Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-md p-4 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-xs sm:text-sm">
            <div className="flex">
              <span className="w-32 font-bold text-slate-800 shrink-0">Cliente:</span>
              <span className="text-slate-600 font-medium">{clientInfo.name}</span>
            </div>
            <div className="flex">
              <span className="w-32 font-bold text-slate-800 shrink-0">Local da Obra:</span>
              <span className="text-slate-600 font-medium">{proposal.workLocation || clientAddress || 'Fachada Principal (95,00 m²)'}</span>
            </div>
            <div className="flex">
              <span className="w-32 font-bold text-slate-800 shrink-0">Serviço:</span>
              <span className="text-slate-600">{proposal.serviceSummary || estimate.title}</span>
            </div>
            <div className="flex">
              <span className="w-32 font-bold text-slate-800 shrink-0">Prazo de Execução:</span>
              <span className="text-red-700 font-bold">{proposal.executionDeadline || '25 a 30 dias úteis'}</span>
            </div>
            <div className="flex">
              <span className="w-32 font-bold text-slate-800 shrink-0">Regime Fiscal:</span>
              <span className="text-slate-600">{proposal.taxRegime || 'ME - Simples Nacional'}</span>
            </div>
            <div className="flex">
              <span className="w-32 font-bold text-slate-800 shrink-0">Faturamento:</span>
              <span className="text-slate-600">{proposal.invoicing || 'Emissão Integral de NFS-e'}</span>
            </div>
          </div>

          {/* Seção 1: Resumo do Escopo */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-[#2b6cb0]"></div>
              <h3 className="font-bold text-[#1a365d] uppercase text-sm sm:text-base">1. Resumo do Escopo e Memorial Descritivo</h3>
            </div>
            {proposal.scopeIntro && <p className="text-xs sm:text-sm text-slate-700">{proposal.scopeIntro}</p>}
            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-700 pl-1">
              {(proposal.scopeItems || []).map((item, idx) => {
                const parts = item.split(/:(.+)/)
                if (parts.length >= 2) {
                  return (
                    <li key={idx}>
                      <strong className="text-slate-900">{parts[0]}:</strong>
                      <span>{parts[1]}</span>
                    </li>
                  )
                }
                return <li key={idx}>{item}</li>
              })}
            </ul>
          </div>

          {/* Seção 2: Cronograma Físico */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-[#2b6cb0]"></div>
              <h3 className="font-bold text-[#1a365d] uppercase text-sm sm:text-base">
                2. Cronograma Físico de Execução (Prazo: {proposal.executionDeadline || '25 a 30 Dias Úteis'})
              </h3>
            </div>
            <div className="border border-slate-200 rounded-md overflow-hidden">
              <table className="w-full text-xs sm:text-sm">
                <thead className="bg-[#2b6cb0] text-white">
                  <tr>
                    <th className="p-2.5 text-left w-1/4 font-bold">Etapa / Período</th>
                    <th className="p-2.5 text-left w-3/4 font-bold">Atividades Programadas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {(proposal.schedule || []).map((stage, idx) => (
                    <tr key={idx} className={idx % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'}>
                      <td className="p-2.5 font-bold text-slate-800">{stage.period}</td>
                      <td className="p-2.5 text-slate-700">{stage.activities}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Seção 3: Planilha Orçamentária */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-[#2b6cb0]"></div>
              <h3 className="font-bold text-[#1a365d] uppercase text-sm sm:text-base">3. Planilha Orçamentária Fechada (BDI Atualizado + NFS-e)</h3>
            </div>

            <div className="border border-slate-200 rounded-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-xs sm:text-sm">
                  <thead className="bg-[#1a365d] text-white">
                    <tr>
                      <th className="p-2.5 text-center w-12 font-bold">Item</th>
                      <th className="p-2.5 text-left font-bold">Descrição do Serviço / Fornecimento</th>
                      <th className="p-2.5 text-center w-16 font-bold">Unid.</th>
                      <th className="p-2.5 text-center w-16 font-bold">Qtd.</th>
                      <th className="p-2.5 text-right w-28 font-bold">Unitário (R$)</th>
                      <th className="p-2.5 text-right w-28 font-bold">Total (R$)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {(estimate.items || []).length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-slate-400 italic">
                          Nenhum item adicionado à planilha orçamentária.
                        </td>
                      </tr>
                    ) : (
                      estimate.items.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'}>
                          <td className="p-2.5 text-center font-medium text-slate-600">{String(index + 1).padStart(2, '0')}</td>
                          <td className="p-2.5 text-slate-800">{item.description}</td>
                          <td className="p-2.5 text-center text-slate-600">{item.unit || 'un'}</td>
                          <td className="p-2.5 text-center text-slate-600">{item.quantity}</td>
                          <td className="p-2.5 text-right text-slate-700">
                            {currencyFormatter.format(item.unitPrice)}
                          </td>
                          <td className="p-2.5 text-right font-medium text-slate-800">
                            {currencyFormatter.format(item.quantity * item.unitPrice)}
                          </td>
                        </tr>
                      ))
                    )}
                    <tr className="bg-slate-100 font-bold border-t-2 border-[#1a365d] text-[#1a365d]">
                      <td colSpan={4} className="p-3 text-right">VALOR GLOBAL DA PROPOSTA (BDI +15% / COM NFS-E):</td>
                      <td colSpan={2} className="p-3 text-right text-base sm:text-lg">
                        {currencyFormatter.format(estimate.amount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Card Highlight Fiscal */}
          <div className="bg-[#ebf8ff] border border-[#bee3f8] rounded-md p-3.5 space-y-1">
            <span className="inline-block bg-[#2b6cb0] text-white text-[11px] font-bold px-2 py-0.5 rounded">
              EMISSÃO DE NOTA FISCAL INCLUSA (SIMPLES NACIONAL)
            </span>
            <p className="text-xs sm:text-sm text-[#2b6cb0] leading-relaxed">
              {proposal.fiscalBenefitNote || `O valor global de ${currencyFormatter.format(estimate.amount)} contempla a emissão integral de Nota Fiscal de Serviços Eletrônica (NFS-e) sob o regime do Simples Nacional, cobrindo todos os materiais, equipamentos, caçambas, andaimes, mão de obra, alimentação, vale-transporte, despesas operacionais e margem de BDI atualizada.`}
            </p>
          </div>

          {/* Seção 4: Condições Comerciais */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-[#2b6cb0]"></div>
              <h3 className="font-bold text-[#1a365d] uppercase text-sm sm:text-base">4. Condições Comerciais, Prazo e Garantia</h3>
            </div>

            <div className="bg-slate-50 border-l-4 border-slate-500 p-3.5 rounded-r-md text-xs sm:text-sm text-slate-700">
              <ul className="list-disc list-inside space-y-1.5">
                {(proposal.conditions || []).map((cond, idx) => {
                  const parts = cond.split(/:(.+)/)
                  if (parts.length >= 2) {
                    return (
                      <li key={idx}>
                        <strong className="text-slate-800">{parts[0]}:</strong>
                        <span>{parts[1]}</span>
                      </li>
                    )
                  }
                  return <li key={idx}>{cond}</li>
                })}
              </ul>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-20 pt-8 sm:pt-14 text-center">
            <div>
              <div className="border-t border-slate-400 pt-2">
                <p className="font-bold text-xs sm:text-sm text-[#1a365d] uppercase">{clientInfo.name}</p>
                <p className="text-xs text-slate-500">De Acordo / Contratante</p>
              </div>
            </div>
            <div>
              <div className="border-t border-slate-400 pt-2">
                <p className="font-bold text-xs sm:text-sm text-[#1a365d] uppercase">{COMPANY_INFO.engineer}</p>
                <p className="text-xs text-slate-500">Contratada (ME / Simples Nacional)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
