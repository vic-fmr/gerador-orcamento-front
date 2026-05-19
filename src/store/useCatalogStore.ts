import { create } from 'zustand'

export type Unit = 'un' | 'm' | 'm²' | 'm³' | 'kg' | 'h' | 'dia' | 'mês'

export interface CatalogItem {
  id: string
  description: string
  unit: Unit
  defaultUnitPrice: number
}

interface CatalogState {
  items: CatalogItem[]
  addItem: (item: CatalogItem) => void
  removeItem: (id: string) => void
}

export const useCatalogStore = create<CatalogState>((set) => ({
  items: [
    { id: 'c1', description: 'Pintura de Parede (Látex)', unit: 'm²', defaultUnitPrice: 45.00 },
    { id: 'c2', description: 'Instalação de Piso Cerâmico', unit: 'm²', defaultUnitPrice: 65.00 },
    { id: 'c3', description: 'Mão de Obra Pedreiro', unit: 'dia', defaultUnitPrice: 250.00 },
    { id: 'c4', description: 'Cimento (Saco 50kg)', unit: 'un', defaultUnitPrice: 38.00 },
    { id: 'c5', description: 'Tubulação PVC 1/2"', unit: 'm', defaultUnitPrice: 12.50 },
    { id: 'c6', description: 'Consultoria Técnica', unit: 'h', defaultUnitPrice: 150.00 },
  ],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
}))
