import React from 'react'
import { Estimate } from '@/store/useEstimateStore'
import { Button } from '@/components/ui/button'
import { X, Download, FileEdit } from 'lucide-react'
import { generateEstimatePDF } from '@/lib/pdf-export'
import { generateEstimateDOCX } from '@/lib/docx-export'

interface EstimatePreviewProps {
  estimate: Estimate
  onClose: () => void
}

export function EstimatePreview({ estimate, onClose }: EstimatePreviewProps) {
  // Close on Escape key
  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const PRIMARY_COLOR_CLASS = "bg-[#006699]"
  const PRIMARY_TEXT_CLASS = "text-[#006699]"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-background w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between z-10 shrink-0">
          <h3 className="text-xl font-bold">Visualização do Orçamento</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => generateEstimateDOCX(estimate)} className="hidden sm:flex">
              <FileEdit className="mr-2 h-4 w-4" />
              DOCX
            </Button>
            <Button variant="outline" size="sm" onClick={() => generateEstimatePDF(estimate)}>
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-12 space-y-8 bg-white text-slate-900 flex-1 min-h-[800px]">
          {/* Header Bar */}
          <div className="flex justify-between items-stretch">
            <div className={`${PRIMARY_COLOR_CLASS} text-white px-12 py-4 flex items-center justify-center min-w-[300px]`}>
              <h2 className="text-3xl font-black tracking-tighter">ORÇAMENTO</h2>
            </div>
            <div className="text-right flex flex-col justify-center">
              <p className={`text-2xl font-bold ${PRIMARY_TEXT_CLASS}`}>Gesso e Pintura</p>
              <p className="text-sm text-slate-500 font-medium">CNPJ: 00.000.000/0001-00</p>
              <p className="text-sm text-slate-500 font-medium">Telefone: (00) 00000-0000</p>
            </div>
          </div>

          {/* Details Box */}
          <div className="grid grid-cols-2 border border-slate-200 text-sm">
            <div className="p-4 space-y-2 border-r border-slate-200">
              <p><span className="font-bold">CLIENTE:</span> {estimate.client}</p>
              <p><span className="font-bold">ENDEREÇO:</span> Não informado</p>
            </div>
            <div className="p-4 space-y-2">
              <p><span className="font-bold">DATA:</span> {new Date(estimate.date).toLocaleDateString('pt-BR')}</p>
              <p><span className="font-bold">VALIDADE:</span> 15 dias</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className={`${PRIMARY_COLOR_CLASS} text-white`}>
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

          {/* Total */}
          <div className="flex justify-end">
            <div className={`${PRIMARY_COLOR_CLASS} text-white p-4 flex items-center gap-8 min-w-[300px]`}>
              <p className="text-lg font-bold">TOTAL GERAL</p>
              <p className="text-2xl font-black flex-1 text-right">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(estimate.amount)}
              </p>
            </div>
          </div>

          {/* Payment and Observations */}
          <div className="border border-slate-200 p-4 space-y-4 text-sm">
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
          <div className="grid grid-cols-2 gap-20 pt-16">
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
