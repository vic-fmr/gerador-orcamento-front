import { describe, it, expect, beforeEach } from 'vitest'
import { useClientStore } from './useClientStore'

describe('useClientStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    useClientStore.setState({
      clients: [
        { id: 'cli1', name: 'Global Tech Inc.', email: 'contact@globaltech.com', address: '123 Tech Blvd, Silicon Valley', addressName: 'HQ' },
        { id: 'cli2', name: 'Home Services Ltd', email: 'info@homeservices.com', address: '456 Main St, Downtown', addressName: 'Main Office' },
        { id: 'cli3', name: 'City Apartments', email: 'management@cityapartments.com', address: '789 City Rd', addressName: 'Leasing Office' },
        { id: 'cli4', name: 'Maria Oliveira', email: 'maria@gmail.com', phone: '11999999999', address: 'Rua das Flores, 100', addressName: 'Casa' },
      ]
    })
  })

  it('should initialize with correct mock data including address fields', () => {
    const clients = useClientStore.getState().clients
    expect(clients.length).toBeGreaterThan(0)
    expect(clients[0].address).toBeDefined()
    expect(clients[0].addressName).toBeDefined()
  })

  it('should allow adding a new client with address and addressName', () => {
    const newClient = {
      id: 'new1',
      name: 'Test Client',
      email: 'test@example.com',
      phone: '1234567890',
      address: 'Test Street, 123',
      addressName: 'Work'
    }

    useClientStore.getState().addClient(newClient)

    const clients = useClientStore.getState().clients
    const addedClient = clients.find(c => c.id === 'new1')
    
    expect(addedClient).toBeDefined()
    expect(addedClient?.name).toBe('Test Client')
    expect(addedClient?.address).toBe('Test Street, 123')
    expect(addedClient?.addressName).toBe('Work')
  })
})