import { create } from 'zustand'

export const UNIT_OPTIONS = ['un', 'm', 'm²', 'm³', 'kg', 'h', 'dia', 'mês'] as const

export type Unit = (typeof UNIT_OPTIONS)[number]

export interface ServiceItem {
  id: number
  name: string
  description: string
  unit: Unit
  defaultUnitPrice: number
}

interface ServiceState {
  services: ServiceItem[]
  items: ServiceItem[]
  setServices: (services: ServiceItem[]) => void
  addService: (service: ServiceItem) => void
  updateService: (id: number, updates: Partial<ServiceItem>) => void
  removeService: (id: number) => void
  addItem: (service: ServiceItem) => void
  updateItem: (id: number, updates: Partial<ServiceItem>) => void
  removeItem: (id: number) => void
}

export const defaultServices: ServiceItem[] = []

export const useServiceStore = create<ServiceState>((set) => ({
  services: [],
  items: [],
  setServices: (services) => set(() => ({ services, items: services })),
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