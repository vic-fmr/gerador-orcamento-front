import { Client } from '@/store/useClientStore'

export const COMPANY_INFO = {
  name: 'WM Engenharia',
  cnpj: '47711488000129',
  engineer: 'Eng Macerlo Marques de Morais',
}

export const DOCUMENT_PRIMARY_COLOR = '006699'
export const DOCUMENT_PRIMARY_COLOR_RGB: [number, number, number] = [0, 102, 153]

export interface EstimateClientInfo {
  name: string
  address?: string
  addressName?: string
  email?: string
  phone?: string
}

function isClientObject(client: unknown): client is Partial<Client> {
  return Boolean(client && typeof client === 'object')
}

export function resolveEstimateClient(client: unknown, clients: Client[]): EstimateClientInfo {
  if (typeof client === 'number') {
    const matchedClient = clients.find((item) => item.id === client)

    if (!matchedClient) {
      return { name: 'Não informado' }
    }

    return {
      name: matchedClient.name,
      address: matchedClient.address,
      addressName: matchedClient.addressName,
      email: matchedClient.email,
      phone: matchedClient.phone,
    }
  }

  if (typeof client === 'string') {
    const normalizedClient = client.trim()
    const numericClientId = Number(normalizedClient)

    if (normalizedClient && !Number.isNaN(numericClientId)) {
      const matchedById = clients.find((item) => item.id === numericClientId)
      if (matchedById) {
        return {
          name: matchedById.name,
          address: matchedById.address,
          addressName: matchedById.addressName,
          email: matchedById.email,
          phone: matchedById.phone,
        }
      }
    }

    const matchedByName = clients.find(
      (item) => item.name.trim().toLowerCase() === normalizedClient.toLowerCase()
    )

    if (!matchedByName) {
      return { name: normalizedClient || 'Não informado' }
    }

    return {
      name: matchedByName.name,
      address: matchedByName.address,
      addressName: matchedByName.addressName,
      email: matchedByName.email,
      phone: matchedByName.phone,
    }
  }

  if (isClientObject(client)) {
    const objectWithId = client.id
    if (typeof objectWithId === 'number') {
      const matchedById = clients.find((item) => item.id === objectWithId)

      if (matchedById) {
        return {
          name: matchedById.name,
          address: matchedById.address,
          addressName: matchedById.addressName,
          email: matchedById.email,
          phone: matchedById.phone,
        }
      }
    }

    const objectName = typeof client.name === 'string' ? client.name : ''

    return {
      name: objectName || 'Não informado',
      address: client.address,
      addressName: client.addressName,
      email: client.email,
      phone: client.phone,
    }
  }

  return { name: 'Não informado' }
}

export function formatCnpj(cnpj: string) {
  const digits = cnpj.replace(/\D/g, '')

  if (digits.length !== 14) {
    return cnpj
  }

  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`
}

export function formatAddress(client: EstimateClientInfo) {
  if (!client.address) {
    return 'Não informado'
  }

  return client.addressName ? `${client.address} - ${client.addressName}` : client.address
}