import { Quote, DEFAULT_PROPOSAL_DETAILS } from '@/store/useQuoteStore'
import {
  COMPANY_INFO,
  EstimateClientInfo,
  formatAddress,
  formatCnpj,
} from './estimate-document'

export function generateQuoteHTML(quote: Quote, clientInfo?: EstimateClientInfo): string {
  const client: EstimateClientInfo = clientInfo ?? { name: String(quote.client) }
  const address = formatAddress(client)
  const proposal = { ...DEFAULT_PROPOSAL_DETAILS, ...(quote.proposalDetails || {}) }
  
  const formattedDate = new Date(quote.date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  const scopeItemsHtml = (proposal.scopeItems || [])
    .map((item) => {
      const parts = item.split(/:(.+)/)
      if (parts.length >= 2) {
        return `<li><strong>${parts[0]}:</strong>${parts[1]}</li>`
      }
      return `<li>${item}</li>`
    })
    .join('')

  const scheduleRowsHtml = (proposal.schedule || [])
    .map(
      (stage) => `
      <tr>
        <td><strong>${stage.period}</strong></td>
        <td>${stage.activities}</td>
      </tr>`
    )
    .join('')

  const itemsRowsHtml = (quote.items || []).length > 0
    ? quote.items
        .map(
          (item, index) => `
          <tr>
            <td class="text-center">${String(index + 1).padStart(2, '0')}</td>
            <td>${item.description}</td>
            <td class="text-center">${item.unit || 'un'}</td>
            <td class="text-center">${typeof item.quantity === 'number' ? item.quantity.toLocaleString('pt-BR') : item.quantity}</td>
            <td class="text-right">${currencyFormatter.format(item.unitPrice)}</td>
            <td class="text-right">${currencyFormatter.format(item.quantity * item.unitPrice)}</td>
          </tr>`
        )
        .join('')
    : `<tr><td colspan="6" class="text-center" style="padding: 12px; color: #718096; font-style: italic;">Nenhum item adicionado à planilha orçamentária.</td></tr>`

  const conditionsHtml = (proposal.conditions || [])
    .map((condition) => {
      const parts = condition.split(/:(.+)/)
      if (parts.length >= 2) {
        return `<li><strong>${parts[0]}:</strong>${parts[1]}</li>`
      }
      return `<li>${condition}</li>`
    })
    .join('')

  const quoteIdText = quote.id ? `ORÇAMENTO Nº ${String(quote.id).padStart(4, '0')}` : 'ORÇAMENTO Nº 2026/08-04.R4'

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Proposta Comercial - ${quote.title}</title>
<style>
  @page {
    size: A4;
    margin: 15mm 15mm;
    background-color: #ffffff;
    @bottom-right {
      content: "Página " counter(page) " de " counter(pages);
      font-size: 8pt;
      font-family: Arial, sans-serif;
      color: #718096;
    }
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    color: #2d3748;
    line-height: 1.4;
    font-size: 9pt;
    background-color: #ffffff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .document-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    background: #ffffff;
  }

  .header-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 15px;
    border-bottom: 2px solid #1a365d;
    padding-bottom: 10px;
  }

  .header-table td {
    vertical-align: middle;
  }

  .company-title {
    font-size: 15pt;
    font-weight: bold;
    color: #1a365d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .company-subtitle {
    font-size: 8.5pt;
    color: #4a5568;
  }

  .doc-title {
    text-align: right;
    font-size: 12pt;
    font-weight: bold;
    color: #2b6cb0;
  }

  .doc-meta {
    text-align: right;
    font-size: 8pt;
    color: #718096;
  }

  .info-box {
    background-color: #f7fafc;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    padding: 10px 14px;
    margin-bottom: 14px;
  }

  .info-grid {
    width: 100%;
    border-collapse: collapse;
  }

  .info-grid td {
    padding: 3px 0;
    font-size: 8.5pt;
  }

  .info-label {
    font-weight: bold;
    color: #2d3748;
    width: 18%;
  }

  .info-value {
    color: #4a5568;
    width: 32%;
  }

  .highlight-term {
    color: #c53030;
    font-weight: bold;
  }

  .section-title {
    font-size: 10.5pt;
    font-weight: bold;
    color: #1a365d;
    border-left: 4px solid #2b6cb0;
    padding-left: 8px;
    margin-top: 14px;
    margin-bottom: 8px;
    text-transform: uppercase;
    page-break-after: avoid;
    break-after: avoid;
  }

  p, li {
    font-size: 8.5pt;
    color: #334155;
    margin-top: 2px;
    margin-bottom: 5px;
  }

  ul {
    margin: 4px 0 8px 18px;
    padding: 0;
  }

  .table-container {
    margin-top: 8px;
    margin-bottom: 12px;
  }

  table.data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 8pt;
  }

  table.data-table th {
    background-color: #1a365d;
    color: #ffffff;
    font-weight: bold;
    text-align: left;
    padding: 6px 5px;
    border: 1px solid #1a365d;
  }

  table.data-table td {
    padding: 5px 5px;
    border: 1px solid #e2e8f0;
    color: #2d3748;
  }

  table.data-table tr:nth-child(even) {
    background-color: #f8fafc;
  }

  .text-center { text-align: center; }
  .text-right { text-align: right; }
  .font-bold { font-weight: bold; }

  .total-row td {
    background-color: #edf2f7 !important;
    font-weight: bold;
    color: #1a365d;
    font-size: 9pt;
    border-top: 2px solid #1a365d !important;
  }

  .schedule-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 8pt;
    margin-top: 6px;
    margin-bottom: 10px;
  }

  .schedule-table th {
    background-color: #2b6cb0;
    color: #ffffff;
    font-weight: bold;
    padding: 5px;
    border: 1px solid #2b6cb0;
    text-align: left;
  }

  .schedule-table td {
    padding: 5px;
    border: 1px solid #e2e8f0;
  }

  .schedule-table tr:nth-child(even) {
    background-color: #f8fafc;
  }

  .card-highlight {
    background-color: #ebf8ff;
    border: 1px solid #bee3f8;
    border-radius: 4px;
    padding: 8px 12px;
    margin-top: 10px;
    margin-bottom: 12px;
  }

  .card-highlight p {
    margin: 0;
    color: #2b6cb0;
    font-size: 8pt;
  }

  .fiscal-badge {
    display: inline-block;
    background-color: #2b6cb0;
    color: #ffffff;
    font-weight: bold;
    font-size: 7.5pt;
    padding: 2px 6px;
    border-radius: 3px;
    margin-bottom: 3px;
  }

  .conditions-box {
    background-color: #f8fafc;
    border-left: 3px solid #718096;
    padding: 8px 12px;
    margin-top: 8px;
    margin-bottom: 12px;
  }

  .conditions-box li {
    font-size: 8pt;
    margin-bottom: 3px;
  }

  .signatures-table {
    width: 100%;
    margin-top: 25px;
    page-break-inside: avoid;
    break-inside: avoid;
    border-collapse: collapse;
  }

  .signatures-table td {
    width: 50%;
    text-align: center;
    padding: 0 20px;
  }

  .signature-line {
    border-top: 1px solid #718096;
    margin-bottom: 4px;
  }

  .signature-name {
    font-weight: bold;
    font-size: 8.5pt;
    color: #1a365d;
  }

  .signature-title {
    font-size: 7.5pt;
    color: #718096;
  }

  @media print {
    body {
      background: transparent;
    }
    .document-container {
      max-width: 100%;
    }
  }
</style>
</head>
<body>

  <div class="document-container">
    <table class="header-table">
      <tr>
        <td>
          <div class="company-title">Proposta Comercial & Técnica</div>
          <div class="company-subtitle">Engenharia, Reformas Comerciais e Recuperação Estrutural</div>
        </td>
        <td>
          <div class="doc-title">${quoteIdText}</div>
          <div class="doc-meta">Data: ${formattedDate}</div>
        </td>
      </tr>
    </table>

    <div class="info-box">
      <table class="info-grid">
        <tr>
          <td class="info-label">Cliente:</td>
          <td class="info-value">${client.name}</td>
          <td class="info-label">Local da Obra:</td>
          <td class="info-value">${proposal.workLocation || address || 'Fachada Principal (95,00 m²)'}</td>
        </tr>
        <tr>
          <td class="info-label">Serviço:</td>
          <td class="info-value">${proposal.serviceSummary || quote.title}</td>
          <td class="info-label">Prazo de Execução:</td>
          <td class="info-value"><span class="highlight-term">${proposal.executionDeadline || '25 a 30 dias úteis'}</span></td>
        </tr>
        <tr>
          <td class="info-label">Regime Fiscal:</td>
          <td class="info-value">${proposal.taxRegime || 'ME - Simples Nacional'}</td>
          <td class="info-label">Faturamento:</td>
          <td class="info-value">${proposal.invoicing || 'Emissão Integral de NFS-e'}</td>
        </tr>
      </table>
    </div>

    <div class="section-title">1. Resumo do Escopo e Memorial Descritivo</div>
    ${proposal.scopeIntro ? `<p>${proposal.scopeIntro}</p>` : ''}
    <ul>
      ${scopeItemsHtml}
    </ul>

    <div class="section-title">2. Cronograma Físico de Execução (Prazo: ${proposal.executionDeadline || '25 a 30 Dias Úteis'})</div>
    <table class="schedule-table">
      <thead>
        <tr>
          <th style="width: 25%;">Etapa / Período</th>
          <th style="width: 75%;">Atividades Programadas</th>
        </tr>
      </thead>
      <tbody>
        ${scheduleRowsHtml}
      </tbody>
    </table>

    <div class="section-title">3. Planilha Orçamentária Fechada (BDI Atualizado + NFS-e)</div>
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 6%;" class="text-center">Item</th>
            <th style="width: 54%;">Descrição do Serviço / Fornecimento</th>
            <th style="width: 8%;" class="text-center">Unid.</th>
            <th style="width: 8%;" class="text-center">Qtd.</th>
            <th style="width: 12%;" class="text-right">Unitário (R$)</th>
            <th style="width: 12%;" class="text-right">Total (R$)</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRowsHtml}
          <tr class="total-row">
            <td colspan="4" class="text-right">VALOR GLOBAL DA PROPOSTA (BDI +15% / COM NFS-E):</td>
            <td colspan="2" class="text-right">${currencyFormatter.format(quote.amount)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card-highlight">
      <div class="fiscal-badge">EMISSÃO DE NOTA FISCAL INCLUSA (SIMPLES NACIONAL)</div>
      <p>${proposal.fiscalBenefitNote || `O valor global de <strong>${currencyFormatter.format(quote.amount)}</strong> contempla a <strong>emissão integral de Nota Fiscal de Serviços Eletrônica (NFS-e)</strong> sob o regime do Simples Nacional, cobrindo todos os materiais, equipamentos, caçambas, andaimes, mão de obra, alimentação, vale-transporte, despesas operacionais e margem de BDI atualizada.`}</p>
    </div>

    <div class="section-title">4. Condições Comerciais, Prazo e Garantia</div>
    <div class="conditions-box">
      <ul>
        ${conditionsHtml}
      </ul>
    </div>

    <table class="signatures-table">
      <tr>
        <td>
          <div class="signature-line"></div>
          <div class="signature-name">${client.name.toUpperCase()}</div>
          <div class="signature-title">De Acordo / Contratante</div>
        </td>
        <td>
          <div class="signature-line"></div>
          <div class="signature-name">${COMPANY_INFO.engineer.toUpperCase() || 'RESPONSÁVEL TÉCNICO'}</div>
          <div class="signature-title">Contratada (ME / Simples Nacional)</div>
        </td>
      </tr>
    </table>
  </div>

</body>
</html>`
}

export function printQuoteHTML(htmlContent: string) {
  if (typeof window === 'undefined') return

  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = '0'
  iframe.setAttribute('aria-hidden', 'true')
  document.body.appendChild(iframe)

  const doc = iframe.contentWindow?.document
  if (doc) {
    doc.open()
    doc.write(htmlContent)
    doc.close()

    iframe.contentWindow?.focus()
    setTimeout(() => {
      iframe.contentWindow?.print()
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe)
        }
      }, 1000)
    }, 250)
  }
}
