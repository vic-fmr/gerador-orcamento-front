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

export function resolveEstimateClient(clientName: string, clients: Client[]): EstimateClientInfo {
  const matchedClient = clients.find((client) => client.name === clientName)

  if (!matchedClient) {
    return { name: clientName }
  }

  return {
    name: matchedClient.name,
    address: matchedClient.address,
    addressName: matchedClient.addressName,
    email: matchedClient.email,
    phone: matchedClient.phone,
  }
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