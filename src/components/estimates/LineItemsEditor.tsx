import React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LineItem } from '@/store/useQuoteStore'

import { ServiceItem, useServiceStore } from '@/store/useServiceStore'
import { useServices } from '@/hooks/useServices'
import { ServiceSheet } from '@/components/services/ServiceSheet'

interface LineItemsEditorProps {
  items: LineItem[]
  onChange: (items: LineItem[]) => void
}

export function LineItemsEditor({ items, onChange }: LineItemsEditorProps) {
  // ensure services are fetched from API and stored in the service store
  const { data: servicesData } = useServices()
  const servicesFromStore = useServiceStore((state) => state.services)
  const services = React.useMemo(() => {
    const queriedServices = Array.isArray(servicesData) ? servicesData : []
    const byId = new Map<number, (typeof servicesFromStore)[number]>()

    for (const service of queriedServices) {
      byId.set(service.id, service)
    }

    for (const service of servicesFromStore) {
      byId.set(service.id, service)
    }

    return Array.from(byId.values())
  }, [servicesData, servicesFromStore])
  const [isCreateServiceOpen, setIsCreateServiceOpen] = React.useState(false)

  const addItemFromService = React.useCallback((service: ServiceItem) => {
    const newItem: LineItem = {
      id: crypto.randomUUID(),
      description: service.name,
      quantity: 1,
      unitPrice: service.defaultUnitPrice,
      unit: service.unit,
      serviceId: service.id,
    }
    onChange([...items, newItem])
  }, [onChange, items])

  const addCustomItem = React.useCallback(() => {
    onChange([
      ...items,
      {
        id: crypto.randomUUID(),
        description: '',
        quantity: 1,
        unitPrice: 0,
        unit: 'un',
      },
    ])
  }, [onChange, items])

  const removeItem = React.useCallback((id: string) => {
    onChange(items.filter((item) => item.id !== id))
  }, [onChange, items])

  const updateItem = React.useCallback((id: string, updates: Partial<LineItem>) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...updates } : item)))
  }, [onChange, items])

  const total = React.useMemo(() => items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0), [items])

  const ServiceButton = React.memo(function ServiceButton({ service }: { service: ServiceItem }) {
    return (
      <Button
        key={service.id}
        type="button"
        variant="outline"
        size="sm"
        onClick={() => addItemFromService(service)}
        className="h-auto min-h-20 py-2 px-3 flex flex-col items-start gap-1 justify-start text-left"
      >
        <span className="text-sm font-medium">{service.name}</span>
        {service.description && (
          <span className="text-xs text-muted-foreground text-left line-clamp-2">{service.description}</span>
        )}
        <span className="text-xs text-muted-foreground">{service.defaultUnitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} / {service.unit}</span>
      </Button>
    )
  })

  const LineItemRow = React.memo(function LineItemRow({ item }: { item: LineItem }) {
    return (
      <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end border-b border-border pb-3 last:border-0">
        <div className="md:col-span-6 space-y-1.5">
          <Label>Descrição</Label>
          <Input
            value={item.description}
            onChange={(e) => updateItem(item.id, { description: e.target.value })}
            placeholder="Descrição do item"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 md:col-span-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Qtd ({item.unit})</Label>
            <Input
              type="number"
              min="0.01"
              step="0.01"
              value={item.quantity}
              onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Preço Unit.</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={item.unitPrice}
              onChange={(e) => updateItem(item.id, { unitPrice: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 md:col-span-2">
          <div className="flex-1 text-left md:text-right font-medium">{(item.quantity * item.unitPrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeItem(item.id)}
            aria-label="Remover Item"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  })

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Serviços Cadastrados</h3>
        {services.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-6 text-center space-y-3">
            <p className="text-sm text-muted-foreground">Nenhum serviço cadastrado ainda.</p>
            <Button type="button" onClick={() => setIsCreateServiceOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Cadastrar Serviço
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <ServiceButton key={service.id} service={service} />
            ))}

          </div>
        )}
        {services.length > 0 && (
          <div className="pt-2">
            <Button type="button" onClick={() => setIsCreateServiceOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Cadastrar Serviço
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Itens do Orçamento</h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addCustomItem}
          >
            <Plus className="mr-2 h-4 w-4" />
            Item Personalizado
          </Button>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end border-b border-border pb-3 last:border-0">
              <div className="md:col-span-6 space-y-1.5">
                <Label>Descrição</Label>
                <Input
                  value={item.description}
                  onChange={(e) => updateItem(item.id, { description: e.target.value })}
                  placeholder="Descrição do item"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 md:col-span-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Qtd ({item.unit})</Label>
                  <Input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Preço Unit.</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, { unitPrice: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 md:col-span-2">
                <div className="flex-1 text-left md:text-right font-medium">
                  {(item.quantity * item.unitPrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  aria-label="Remover Item"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {items.length > 0 && (
        <div className="flex justify-end pt-4 border-t border-border">
          <div className="text-xl font-bold">
            Total: {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
        </div>
      )}

      <ServiceSheet
        open={isCreateServiceOpen}
        onOpenChange={setIsCreateServiceOpen}
        service={null}
      />
    </div>
  )
}
