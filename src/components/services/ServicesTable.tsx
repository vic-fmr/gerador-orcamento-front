'use client'

import React from 'react'
import { Pencil, Trash2, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ServiceItem } from '@/store/useServiceStore'

interface ServicesTableProps {
  services: ServiceItem[]
  onEdit: (service: ServiceItem) => void
  onDelete: (service: ServiceItem) => void
}

const ServiceRow = React.memo(function ServiceRow({ service, onEdit, onDelete }: { service: ServiceItem, onEdit: (s: ServiceItem)=>void, onDelete: (s: ServiceItem)=>void }) {
  return (
    <tr key={service.id} className="border-b border-border hover:bg-muted/30 transition-colors">
      <td className="p-4">
        <div className="font-medium text-sm">{service.name}</div>
        <div className="text-xs text-muted-foreground">ID: {service.id.slice(0, 8)}</div>
      </td>
      <td className="p-4 text-sm text-muted-foreground">{service.description || 'Sem descrição'}</td>
      <td className="p-4 text-sm">{service.unit}</td>
      <td className="p-4 text-right text-sm font-semibold">{service.defaultUnitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
      <td className="p-4 text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" type="button" onClick={() => onEdit(service)} title="Editar serviço">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => onDelete(service)}
            title="Excluir serviço"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  )
})

export function ServicesTable({ services, onEdit, onDelete }: ServicesTableProps) {
  if (services.length === 0) {
    return (
      <div className="p-12 text-center text-muted-foreground bg-card rounded-xl border border-border shadow-sm">
        Nenhum serviço encontrado.
      </div>
    )
  }

  return (
    <>
      <div className="hidden md:block bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left p-4 font-medium text-sm">Serviço</th>
              <th className="text-left p-4 font-medium text-sm">Descrição</th>
              <th className="text-left p-4 font-medium text-sm">Unidade</th>
              <th className="text-right p-4 font-medium text-sm">Preço Padrão</th>
              <th className="text-right p-4 font-medium text-sm">Ações</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <ServiceRow key={service.id} service={service} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {services.map((service) => (
          <div key={service.id} className="bg-card rounded-xl border border-border shadow-sm p-4 space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-base leading-tight">{service.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                ID: {service.id.slice(0, 8)}
              </div>
            </div>

            <p className="text-sm text-muted-foreground">{service.description || 'Sem descrição'}</p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Unidade</div>
                <p className="text-sm font-medium">{service.unit}</p>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Preço</div>
                <p className="text-sm font-bold text-primary">
                  {service.defaultUnitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
              <Button variant="outline" size="sm" className="flex-1 h-9 gap-2" onClick={() => onEdit(service)}>
                <Pencil className="h-4 w-4" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-9 gap-2 text-destructive hover:bg-destructive/5"
                onClick={() => onDelete(service)}
              >
                <Trash2 className="h-4 w-4" />
                Excluir
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}