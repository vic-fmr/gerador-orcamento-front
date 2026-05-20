import { create } from 'zustand'

export const UNIT_OPTIONS = ['un', 'm', 'm²', 'm³', 'kg', 'h', 'dia', 'mês'] as const

export type Unit = (typeof UNIT_OPTIONS)[number]

export interface ServiceItem {
  id: string
  name: string
  description: string
  unit: Unit
  defaultUnitPrice: number
}

interface ServiceState {
  services: ServiceItem[]
  items: ServiceItem[]
  addService: (service: ServiceItem) => void
  updateService: (id: string, updates: Partial<ServiceItem>) => void
  removeService: (id: string) => void
  addItem: (service: ServiceItem) => void
  updateItem: (id: string, updates: Partial<ServiceItem>) => void
  removeItem: (id: string) => void
}

export const defaultServices: ServiceItem[] = [
  {
    id: 'srv1',
    name: 'Pintura de Parede (Látex)',
    description: 'Aplicação de pintura interna com acabamento padrão',
    unit: 'm²',
    defaultUnitPrice: 45,
  },
  {
    id: 'srv2',
    name: 'Instalação de Piso Cerâmico',
    description: 'Assentamento e nivelamento de revestimento cerâmico',
    unit: 'm²',
    defaultUnitPrice: 65,
  },
  {
    id: 'srv3',
    name: 'Mão de Obra Pedreiro',
    description: 'Serviço de execução e apoio em obra',
    unit: 'dia',
    defaultUnitPrice: 250,
  },
  {
    id: 'srv4',
    name: 'Cimento (Saco 50kg)',
    description: 'Fornecimento de material para execução de obra',
    unit: 'un',
    defaultUnitPrice: 38,
  },
  {
    id: 'srv5',
    name: 'Tubulação PVC 1/2"',
    description: 'Fornecimento de tubulação para instalação hidráulica',
    unit: 'm',
    defaultUnitPrice: 12.5,
  },
  {
    id: 'srv6',
    name: 'Consultoria Técnica',
    description: 'Acompanhamento técnico e orientação especializada',
    unit: 'h',
    defaultUnitPrice: 150,
  },
]

export const useServiceStore = create<ServiceState>((set) => ({
  services: defaultServices,
  items: defaultServices,
  addService: (service) => set((state) => ({
    services: [service, ...state.services],
    items: [service, ...state.items],
  })),
  updateService: (id, updates) => set((state) => ({
    services: state.services.map((service) => (service.id === id ? { ...service, ...updates } : service)),
    items: state.items.map((service) => (service.id === id ? { ...service, ...updates } : service)),
  })),
  removeService: (id) => set((state) => ({
    services: state.services.filter((service) => service.id !== id),
    items: state.items.filter((service) => service.id !== id),
  })),
  addItem: (service) => set((state) => ({
    services: [service, ...state.services],
    items: [service, ...state.items],
  })),
  updateItem: (id, updates) => set((state) => ({
    services: state.services.map((service) => (service.id === id ? { ...service, ...updates } : service)),
    items: state.items.map((service) => (service.id === id ? { ...service, ...updates } : service)),
  })),
  removeItem: (id) => set((state) => ({
    services: state.services.filter((service) => service.id !== id),
    items: state.items.filter((service) => service.id !== id),
  })),
}))