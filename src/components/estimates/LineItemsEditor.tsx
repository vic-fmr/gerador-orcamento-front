import React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LineItem } from '@/store/useEstimateStore'

import { useCatalogStore, CatalogItem } from '@/store/useCatalogStore'

interface LineItemsEditorProps {
  items: LineItem[]
  onChange: (items: LineItem[]) => void
}

export function LineItemsEditor({ items, onChange }: LineItemsEditorProps) {
  const catalogItems = useCatalogStore((state) => state.items)

  const addItemFromCatalog = (catalogItem: CatalogItem) => {
    const newItem: LineItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: catalogItem.description,
      quantity: 1,
      unitPrice: catalogItem.defaultUnitPrice,
      unit: catalogItem.unit,
    }
    onChange([...items, newItem])
  }

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, updates: Partial<LineItem>) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, ...updates } : item))
    )
  }

  const total = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0)

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Catálogo de Itens</h3>
        <div className="flex flex-wrap gap-2">
          {catalogItems.map((catalogItem) => (
            <Button
              key={catalogItem.id}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addItemFromCatalog(catalogItem)}
              className="h-auto py-2 px-3 flex flex-col items-start gap-1"
            >
              <span className="text-sm font-medium">{catalogItem.description}</span>
              <span className="text-xs text-muted-foreground">
                {catalogItem.defaultUnitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} / {catalogItem.unit}
              </span>
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Itens do Orçamento</h3>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={() => addItemFromCatalog({ id: '', description: '', unit: 'un', defaultUnitPrice: 0 })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Item Personalizado
          </Button>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-3 items-end border-b border-border pb-3 last:border-0">
              <div className="col-span-12 md:col-span-6 space-y-1.5">
                <Label>Descrição</Label>
                <Input
                  value={item.description}
                  onChange={(e) => updateItem(item.id, { description: e.target.value })}
                  placeholder="Descrição do item"
                />
              </div>
              <div className="col-span-4 md:col-span-2 space-y-1.5">
                <Label>Qtd ({item.unit})</Label>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) })}
                />
              </div>
              <div className="col-span-4 md:col-span-2 space-y-1.5">
                <Label>Preço Unit.</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(item.id, { unitPrice: Number(e.target.value) })}
                />
              </div>
              <div className="col-span-4 md:col-span-2 flex items-center gap-2">
                <div className="flex-1 text-right font-medium">
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
    </div>
  )
}
