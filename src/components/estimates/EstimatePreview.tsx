import React from 'react'
import { Estimate } from '@/store/useEstimateStore'
import { Button } from '@/components/ui/button'
import { X, Download } from 'lucide-react'
import { generateEstimatePDF } from '@/lib/pdf-export'

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-background w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between z-10 shrink-0">
          <h3 className="text-xl font-bold">Visualização do Orçamento</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => generateEstimatePDF(estimate)}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-8 space-y-8 bg-white text-slate-900 flex-1">
          {/* Branded Header */}
          <div className="flex justify-between items-start border-b-2 border-primary/20 pb-6">
            <div>
              <h2 className="text-3xl font-extrabold text-primary">EstimatePro</h2>
              <p className="text-sm text-slate-500 font-medium">Orçamentos Profissionais</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">ORÇAMENTO</p>
              <p className="text-sm text-slate-500">#{estimate.id.toUpperCase()}</p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div className="space-y-1">
              <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Cliente</p>
              <p className="font-bold text-lg">{estimate.client}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Data de Emissão</p>
              <p className="font-medium">{new Date(estimate.date).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>

          <div className="space-y-2">
             <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Projeto</p>
             <p className="font-semibold text-lg">{estimate.title}</p>
          </div>

          {/* Items Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-slate-500 border-b border-slate-200">
                  <th className="text-left p-3">Descrição</th>
                  <th className="text-right p-3">Qtd</th>
                  <th className="text-right p-3">Unit.</th>
                  <th className="text-right p-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {estimate.items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 last:border-0">
                    <td className="p-3">{item.description}</td>
                    <td className="p-3 text-right">{item.quantity} {item.unit}</td>
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
          <div className="flex justify-end pt-4">
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 text-right min-w-[200px]">
              <p className="text-xs font-bold text-primary uppercase tracking-widest">Valor Total</p>
              <p className="text-3xl font-black text-primary">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(estimate.amount)}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-12 text-[10px] text-slate-400 font-medium italic border-t border-slate-100">
            Este documento é um orçamento válido por 15 dias. Gerado por EstimatePro.
          </div>
        </div>
      </div>
    </div>
  )
}
