'use client'

import React from 'react'
import { Plus, Loader2, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useDeleteService, useServices } from '@/hooks/useServices'
import { ServicesTable } from '@/components/services/ServicesTable'
import { ServiceItem } from '@/store/useServiceStore'
import { ServiceSheet } from '@/components/services/ServiceSheet'

export default function ServicesPage() {
  const { data: services = [], isLoading } = useServices()
  const deleteService = useDeleteService()
  const [searchTerm, setSearchTerm] = React.useState('')
  const [editorOpen, setEditorOpen] = React.useState(false)
  const [selectedService, setSelectedService] = React.useState<ServiceItem | null>(null)

  const filteredServices = services.filter((service) => {
    const query = searchTerm.toLowerCase()
    return (
      service.name.toLowerCase().includes(query) ||
      service.description.toLowerCase().includes(query) ||
      service.unit.toLowerCase().includes(query)
    )
  })

  const handleCreate = () => {
    setSelectedService(null)
    setEditorOpen(true)
  }

  const handleEdit = (service: ServiceItem) => {
    setSelectedService(service)
    setEditorOpen(true)
  }

  const handleDelete = (service: ServiceItem) => {
    const confirmed = window.confirm(`Excluir o serviço "${service.name}"?`)
    if (!confirmed) {
      return
    }

    deleteService.mutate(service.id)
  }

  return (
    <div className="space-y-6">

      <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div className="space-y-1.5">
            <Label htmlFor="search">Procurar</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Procurar serviços..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleCreate} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Novo Serviço
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ServicesTable services={filteredServices} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <ServiceSheet
        open={editorOpen}
        onOpenChange={(open) => {
          setEditorOpen(open)
          if (!open) {
            setSelectedService(null)
          }
        }}
        service={selectedService}
      />
    </div>
  )
}