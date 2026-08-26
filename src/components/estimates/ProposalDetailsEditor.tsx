import React, { useState } from 'react'
import { QuoteTechnicalProposal, ScheduleItem, DEFAULT_PROPOSAL_DETAILS } from '@/store/useQuoteStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, RotateCcw, FileText, Calendar, ShieldCheck, ListOrdered } from 'lucide-react'
import { LineItemsEditor } from './LineItemsEditor'
import { LineItem } from '@/store/useQuoteStore'

interface ProposalDetailsEditorProps {
  items: LineItem[]
  onChangeItems: (items: LineItem[]) => void
  proposalDetails: QuoteTechnicalProposal
  onChangeProposalDetails: (details: QuoteTechnicalProposal) => void
}

export function ProposalDetailsEditor({
  items,
  onChangeItems,
  proposalDetails,
  onChangeProposalDetails,
}: ProposalDetailsEditorProps) {
  const [activeTab, setActiveTab] = useState<'items' | 'scope' | 'schedule' | 'conditions'>('items')

  const details = { ...DEFAULT_PROPOSAL_DETAILS, ...proposalDetails }

  const updateField = <K extends keyof QuoteTechnicalProposal>(key: K, value: QuoteTechnicalProposal[K]) => {
    onChangeProposalDetails({
      ...details,
      [key]: value,
    })
  }

  // Schedule helpers
  const handleScheduleChange = (index: number, field: keyof ScheduleItem, val: string) => {
    const updated = [...(details.schedule || [])]
    updated[index] = { ...updated[index], [field]: val }
    updateField('schedule', updated)
  }

  const addScheduleRow = () => {
    const updated = [...(details.schedule || []), { period: 'Nova Etapa', activities: 'Descrição das atividades' }]
    updateField('schedule', updated)
  }

  const removeScheduleRow = (index: number) => {
    const updated = (details.schedule || []).filter((_, i) => i !== index)
    updateField('schedule', updated)
  }

  // Scope items helpers
  const handleScopeItemChange = (index: number, val: string) => {
    const updated = [...(details.scopeItems || [])]
    updated[index] = val
    updateField('scopeItems', updated)
  }

  const addScopeItem = () => {
    const updated = [...(details.scopeItems || []), 'Novo Tópico: Descrição do serviço a ser executado.']
    updateField('scopeItems', updated)
  }

  const removeScopeItem = (index: number) => {
    const updated = (details.scopeItems || []).filter((_, i) => i !== index)
    updateField('scopeItems', updated)
  }

  // Conditions helpers
  const handleConditionChange = (index: number, val: string) => {
    const updated = [...(details.conditions || [])]
    updated[index] = val
    updateField('conditions', updated)
  }

  const addCondition = () => {
    const updated = [...(details.conditions || []), 'Nova Condição: Detalhes da condição comercial.']
    updateField('conditions', updated)
  }

  const removeCondition = (index: number) => {
    const updated = (details.conditions || []).filter((_, i) => i !== index)
    updateField('conditions', updated)
  }

  const resetToDefaults = () => {
    if (window.confirm('Deseja restaurar todos os textos e cronograma para o modelo padrão?')) {
      onChangeProposalDetails(DEFAULT_PROPOSAL_DETAILS)
    }
  }

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('items')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'items'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <ListOrdered className="h-4 w-4" />
            Planilha de Itens
            {items.length > 0 && (
              <span className="ml-1 rounded-full bg-background/20 px-1.5 py-0.2 text-[10px] font-bold">
                {items.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('scope')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'scope'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <FileText className="h-4 w-4" />
            Escopo & Memorial
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'schedule'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Calendar className="h-4 w-4" />
            Cronograma
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('conditions')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'conditions'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Condições & Faturamento
          </button>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={resetToDefaults}
          className="text-xs text-muted-foreground hover:text-foreground h-8"
          title="Restaurar dados padrão do modelo"
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          Restaurar Padrões
        </Button>
      </div>

      {/* Tab 1: Line Items */}
      {activeTab === 'items' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <LineItemsEditor items={items} onChange={onChangeItems} />
        </div>
      )}

      {/* Tab 2: Scope & Memorial */}
      {activeTab === 'scope' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl border border-border">
            <div className="space-y-1.5">
              <Label htmlFor="workLocation" className="text-xs font-semibold">Local da Obra / Especificação</Label>
              <Input
                id="workLocation"
                value={details.workLocation || ''}
                onChange={(e) => updateField('workLocation', e.target.value)}
                placeholder="Ex: Fachada Principal (95,00 m²)"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="serviceSummary" className="text-xs font-semibold">Resumo do Serviço</Label>
              <Input
                id="serviceSummary"
                value={details.serviceSummary || ''}
                onChange={(e) => updateField('serviceSummary', e.target.value)}
                placeholder="Ex: Demolição, Reboco e Recuperação de Viga"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="executionDeadline" className="text-xs font-semibold">Prazo de Execução</Label>
              <Input
                id="executionDeadline"
                value={details.executionDeadline || ''}
                onChange={(e) => updateField('executionDeadline', e.target.value)}
                placeholder="Ex: 25 a 30 dias úteis"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="taxRegime" className="text-xs font-semibold">Regime Fiscal</Label>
              <Input
                id="taxRegime"
                value={details.taxRegime || ''}
                onChange={(e) => updateField('taxRegime', e.target.value)}
                placeholder="Ex: ME - Simples Nacional"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scopeIntro" className="text-xs font-semibold">Introdução do Memorial Descritivo</Label>
            <textarea
              id="scopeIntro"
              rows={2}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={details.scopeIntro || ''}
              onChange={(e) => updateField('scopeIntro', e.target.value)}
              placeholder="Texto introdutório antes da listagem do escopo..."
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tópicos do Memorial Descritivo
              </Label>
              <Button type="button" size="sm" variant="outline" onClick={addScopeItem} className="h-8 text-xs">
                <Plus className="mr-1 h-3.5 w-3.5" />
                Adicionar Tópico
              </Button>
            </div>

            <div className="space-y-2.5">
              {(details.scopeItems || []).map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <textarea
                    rows={2}
                    className="flex-1 rounded-md border border-input bg-transparent px-3 py-1.5 text-xs sm:text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={item}
                    onChange={(e) => handleScopeItemChange(idx, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeScopeItem(idx)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Schedule */}
      {activeTab === 'schedule' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Configure as etapas e os períodos estimados para a execução dos serviços.
            </p>
            <Button type="button" size="sm" variant="outline" onClick={addScheduleRow} className="h-8 text-xs">
              <Plus className="mr-1 h-3.5 w-3.5" />
              Adicionar Etapa
            </Button>
          </div>

          <div className="border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="p-3 text-left w-1/3 font-semibold text-xs">Etapa / Período</th>
                  <th className="p-3 text-left w-2/3 font-semibold text-xs">Atividades Programadas</th>
                  <th className="p-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(details.schedule || []).map((stage, idx) => (
                  <tr key={idx} className="hover:bg-muted/20">
                    <td className="p-2.5 align-top">
                      <Input
                        value={stage.period}
                        onChange={(e) => handleScheduleChange(idx, 'period', e.target.value)}
                        placeholder="Ex: Dias 01 a 05"
                        className="text-xs sm:text-sm font-semibold"
                      />
                    </td>
                    <td className="p-2.5 align-top">
                      <textarea
                        rows={2}
                        value={stage.activities}
                        onChange={(e) => handleScheduleChange(idx, 'activities', e.target.value)}
                        placeholder="Descrição detalhada das atividades desta etapa..."
                        className="w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-xs sm:text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      />
                    </td>
                    <td className="p-2.5 align-top text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeScheduleRow(idx)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Conditions & Fiscal */}
      {activeTab === 'conditions' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="space-y-2">
            <Label htmlFor="fiscalBenefitNote" className="text-xs font-semibold">
              Nota de Benefício Fiscal / Faturamento
            </Label>
            <textarea
              id="fiscalBenefitNote"
              rows={3}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs sm:text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={details.fiscalBenefitNote || ''}
              onChange={(e) => updateField('fiscalBenefitNote', e.target.value)}
              placeholder="Texto descritivo sobre a nota fiscal e encargos..."
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Condições Comerciais, Prazo e Garantia
              </Label>
              <Button type="button" size="sm" variant="outline" onClick={addCondition} className="h-8 text-xs">
                <Plus className="mr-1 h-3.5 w-3.5" />
                Adicionar Condição
              </Button>
            </div>

            <div className="space-y-2.5">
              {(details.conditions || []).map((cond, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <textarea
                    rows={2}
                    className="flex-1 rounded-md border border-input bg-transparent px-3 py-1.5 text-xs sm:text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={cond}
                    onChange={(e) => handleConditionChange(idx, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCondition(idx)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
