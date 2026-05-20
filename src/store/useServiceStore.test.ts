import { describe, it, expect, beforeEach } from 'vitest'
import { useServiceStore, defaultServices } from './useServiceStore'

describe('useServiceStore', () => {
  beforeEach(() => {
    useServiceStore.setState({
      services: defaultServices,
      items: defaultServices,
    })
  })

  it('initializes with the default services and keeps the legacy items alias', () => {
    const state = useServiceStore.getState()

    expect(state.services).toHaveLength(defaultServices.length)
    expect(state.items).toHaveLength(defaultServices.length)
    expect(state.services[0].name).toBe('Pintura de Parede (Látex)')
  })

  it('adds, updates and removes a service', () => {
    useServiceStore.getState().addService({
      id: 'srv-new',
      name: 'Teste Serviço',
      description: 'Descrição de teste',
      unit: 'un',
      defaultUnitPrice: 10,
    })

    expect(useServiceStore.getState().services[0].id).toBe('srv-new')

    useServiceStore.getState().updateService('srv-new', {
      name: 'Serviço Atualizado',
      defaultUnitPrice: 12,
    })

    expect(useServiceStore.getState().services[0].name).toBe('Serviço Atualizado')
    expect(useServiceStore.getState().items[0].defaultUnitPrice).toBe(12)

    useServiceStore.getState().removeService('srv-new')

    expect(useServiceStore.getState().services.find((service) => service.id === 'srv-new')).toBeUndefined()
  })
})