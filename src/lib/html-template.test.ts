import { describe, it, expect } from 'vitest'
import { generateQuoteHTML } from './html-template'
import { Quote } from '@/store/useQuoteStore'

describe('generateQuoteHTML', () => {
  const mockQuote: Quote = {
    id: 101,
    title: 'Reforma de Fachada Comercial',
    client: 1,
    amount: 47725.0,
    status: 'ACCEPTED',
    date: '2026-08-25T12:00:00.000Z',
    items: [
      {
        id: '1',
        description: 'Locação, montagem e desmontagem de andaimes',
        quantity: 95,
        unitPrice: 52.9,
        unit: 'm²',
      },
      {
        id: '2',
        description: 'Demolição pesada de reboco antigo',
        quantity: 95,
        unitPrice: 66.7,
        unit: 'm²',
      },
    ],
  }

  const mockClient = {
    name: 'Delicatessen Parque do Trigo',
    address: 'Av. Principal, 1000',
    addressName: 'Centro Comercial',
    email: 'contato@parquedotrigo.com.br',
    phone: '(11) 98765-4321',
  }

  it('renders the HTML document with client, quote and proposal sections', () => {
    const html = generateQuoteHTML(mockQuote, mockClient)

    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('Delicatessen Parque do Trigo')
    expect(html).toContain('ORÇAMENTO Nº 0101')
    expect(html).toContain('Locação, montagem e desmontagem de andaimes')
    expect(html).toContain('47.725,00')
    expect(html).toContain('5.025,50')
    expect(html).toContain('@page')
    expect(html).toContain('Resumo do Escopo e Memorial Descritivo')
    expect(html).toContain('Cronograma Físico de Execução')
    expect(html).toContain('Planilha Orçamentária Fechada')
    expect(html).toContain('Condições Comerciais, Prazo e Garantia')
    expect(html).toContain('SIMPLES NACIONAL')
  })

  it('handles fallback client information gracefully', () => {
    const html = generateQuoteHTML({ ...mockQuote, id: 0, client: 0 }, { name: 'Cliente Não Informado' })

    expect(html).toContain('ORÇAMENTO Nº 2026/08-04.R4')
    expect(html).toContain('Cliente Não Informado')
  })
})
