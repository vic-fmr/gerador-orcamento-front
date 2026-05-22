import React from 'react'
import { Quote } from '@/store/useQuoteStore'
import { Button } from '@/components/ui/button'
import { X, Download, FileEdit } from 'lucide-react'
import { generateQuotePDF } from '@/lib/pdf-export'
import { generateQuoteDOCX } from '../../lib/docx-export'
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

  const PRIMARY_COLOR_CLASS = "bg-primary"
  const PRIMARY_TEXT_CLASS = "text-primary"
  const clientInfo = React.useMemo(() => resolveEstimateClient(estimate.client, clients), [estimate.client, clients])
  const clientAddress = formatAddress(clientInfo)

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-background w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
        <div className="sticky top-0 bg-background/95 backdrop-blur border-b border-border px-4 py-3 sm:p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between z-10 shrink-0">
          <div>
            <h3 className="text-lg sm:text-xl font-bold">Visualização do Orçamento</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Prévia adaptada para leitura no desktop e no mobile.</p>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button variant="outline" size="sm" onClick={() => generateQuoteDOCX(estimate, clientInfo)} className="hidden sm:flex">
              <FileEdit className="mr-2 h-4 w-4" />
              DOCX
            </Button>
            <Button variant="outline" size="sm" onClick={() => generateQuotePDF(estimate, clientInfo)}>
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-12 space-y-6 sm:space-y-8 bg-white text-slate-900 flex-1 min-h-0 overflow-y-auto">
          {/* Header Bar */}
          <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-stretch">
            <div className={`${PRIMARY_COLOR_CLASS} text-primary-foreground px-6 py-4 sm:px-8 flex items-center justify-center rounded-xl lg:min-w-[280px]`}>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tighter">ORÇAMENTO</h2>
            </div>
            <div className="text-left lg:text-right flex flex-col justify-center gap-1">
              <p className={`text-xl sm:text-2xl font-bold ${PRIMARY_TEXT_CLASS}`}>{COMPANY_INFO.name}</p>
              <p className="text-sm text-slate-500 font-medium">CNPJ: {formatCnpj(COMPANY_INFO.cnpj)}</p>
              <p className="text-sm text-slate-500 font-medium">{COMPANY_INFO.engineer}</p>
            </div>
          </div>

          {/* Details Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 border border-slate-200 rounded-xl overflow-hidden text-sm">
            <div className="p-4 space-y-2 border-b sm:border-b-0 sm:border-r border-slate-200">
              <p><span className="font-bold">CLIENTE:</span> {clientInfo.name}</p>
              <p><span className="font-bold">ENDEREÇO:</span> {clientAddress}</p>
              <p><span className="font-bold">EMAIL:</span> {clientInfo.email || 'Não informado'}</p>
              <p><span className="font-bold">TELEFONE:</span> {clientInfo.phone || 'Não informado'}</p>
            </div>
            <div className="p-4 space-y-2">
              <p><span className="font-bold">DATA:</span> {new Date(estimate.date).toLocaleDateString('pt-BR')}</p>
              <p><span className="font-bold">VALIDADE:</span> 15 dias</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead className={`${PRIMARY_COLOR_CLASS} text-primary-foreground`}>
                  <tr>
                    <th className="text-left p-3 font-bold">DESCRIÇÃO</th>
                    <th className="text-center p-3 font-bold">UNID.</th>
                    <th className="text-center p-3 font-bold">QUANT.</th>
                    <th className="text-right p-3 font-bold">V. UNITÁRIO</th>
                    <th className="text-right p-3 font-bold">V. TOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {estimate.items.map((item) => (
                    <tr key={item.id}>
                      <td className="p-3">{item.description}</td>
                      <td className="p-3 text-center">{item.unit || 'un'}</td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-right">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice)}
                      </td>
                      <td className="p-3 text-right font-bold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.quantity * item.unitPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-end">
            <div className={`${PRIMARY_COLOR_CLASS} text-primary-foreground p-4 flex items-center gap-6 w-full max-w-sm rounded-xl`}>
              <p className="text-lg font-bold">TOTAL GERAL</p>
              <p className="text-2xl font-black flex-1 text-right">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(estimate.amount)}
              </p>
            </div>
          </div>

          {/* Payment and Observations */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-4 text-sm">
            <div>
              <p className="font-bold uppercase mb-1">Condições de Pagamento:</p>
              <p>A combinar</p>
            </div>
            <div>
              <p className="font-bold uppercase mb-1">Observações:</p>
              <p>Este orçamento tem validade de 15 dias após a data de emissão.</p>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-20 pt-8 sm:pt-16">
            <div className="text-center">
              <div className="border-t border-slate-400 pt-2">
                <p className="text-sm font-medium">Assinatura do Cliente</p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-slate-400 pt-2">
                <p className="text-sm font-medium">Responsável</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
