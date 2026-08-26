import jsPDF from 'jspdf'
import { Quote } from '@/lib/api'
import {
  COMPANY_INFO,
  DOCUMENT_PRIMARY_COLOR_RGB,
  DOCUMENT_SECONDARY_COLOR_RGB,
  EstimateClientInfo,
  formatAddress,
} from '@/lib/estimate-document'
import { DEFAULT_PROPOSAL_DETAILS } from '@/store/useQuoteStore'
import { generateQuoteHTML, printQuoteHTML } from './html-template'

// ─── Layout constants (A4: 210×297mm, margins 15mm) ────────────────────────
const L   = 15    // left margin
const R   = 195   // right margin
const CW  = 180   // content width (R - L)

// Column widths matching proportions:
const COLS = {
  item:      { x: L,          w: 12   }, // 6.6%
  desc:      { x: L + 12,     w: 80   }, // 44.4%
  unit:      { x: L + 92,     w: 16   }, // 8.8%
  qty:       { x: L + 108,    w: 16   }, // 8.8%
  unitPrice: { x: L + 124,    w: 28   }, // 15.5%
  total:     { x: L + 152,    w: 28   }, // 15.5%
}

function setPrimary(doc: jsPDF) {
  const [r, g, b] = DOCUMENT_PRIMARY_COLOR_RGB
  doc.setTextColor(r, g, b)
}

function setSecondary(doc: jsPDF) {
  const [r, g, b] = DOCUMENT_SECONDARY_COLOR_RGB
  doc.setTextColor(r, g, b)
}

function setFillPrimary(doc: jsPDF) {
  const [r, g, b] = DOCUMENT_PRIMARY_COLOR_RGB
  doc.setFillColor(r, g, b)
}

function setFillSecondary(doc: jsPDF) {
  const [r, g, b] = DOCUMENT_SECONDARY_COLOR_RGB
  doc.setFillColor(r, g, b)
}

function safeFormatDate(d: unknown): string {
  if (!d) return 'Não informado'
  const date = new Date(d as string)
  return isNaN(date.getTime())
    ? 'Não informado'
    : date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function truncate(doc: jsPDF, text: string, maxWidth: number): string {
  return (doc.splitTextToSize(text, maxWidth)[0] as string) || ''
}

export function generateQuotePDF(estimate: Quote, clientInfo?: EstimateClientInfo) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const selectedClient: EstimateClientInfo =
    clientInfo ?? {
      name:
        typeof estimate.client === 'object' &&
        estimate.client !== null &&
        'name' in estimate.client
          ? String((estimate.client as { name?: unknown }).name ?? 'Não informado')
          : String(estimate.client),
    }
  const address = formatAddress(selectedClient)
  const proposal = { ...DEFAULT_PROPOSAL_DETAILS, ...(estimate.proposalDetails || {}) }
  const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

  // ── HEADER ─────────────────────────────────────────────────────────────────
  setPrimary(doc)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('PROPOSTA COMERCIAL & TÉCNICA', L, 19)

  doc.setTextColor(74, 85, 104)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('Engenharia, Reformas Comerciais e Recuperação Estrutural', L, 24)

  setSecondary(doc)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  const quoteId = estimate.id ? `ORÇAMENTO Nº ${String(estimate.id).padStart(4, '0')}` : 'ORÇAMENTO Nº 2026/08-04.R4'
  doc.text(quoteId, R, 19, { align: 'right' })

  doc.setTextColor(113, 128, 150)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text(`Data: ${safeFormatDate(estimate.date)}`, R, 24, { align: 'right' })

  // Divider Line
  const [pr, pg, pb] = DOCUMENT_PRIMARY_COLOR_RGB
  doc.setDrawColor(pr, pg, pb)
  doc.setLineWidth(0.6)
  doc.line(L, 27, R, 27)
  doc.setLineWidth(0.2)

  // ── INFO BOX ───────────────────────────────────────────────────────────────
  const cY = 31
  const cH = 23
  const c1W = 100
  const c2X = L + c1W

  doc.setFillColor(247, 250, 252)
  doc.setDrawColor(226, 232, 240)
  doc.rect(L, cY, CW, cH, 'FD')

  const labelX1 = L + 3
  const valX1   = L + 24
  const labelX2 = c2X + 3
  const valX2   = c2X + 30

  doc.setFontSize(8)

  // Left col
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(45, 55, 72)
  doc.text('Cliente:', labelX1, cY + 5.5)
  doc.text('Serviço:', labelX1, cY + 11.5)
  doc.text('Regime Fiscal:', labelX1, cY + 17.5)

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(74, 85, 104)
  doc.text(truncate(doc, selectedClient.name, c1W - 28), valX1, cY + 5.5)
  doc.text(truncate(doc, proposal.serviceSummary || estimate.title, c1W - 28), valX1, cY + 11.5)
  doc.text(proposal.taxRegime || 'ME - Simples Nacional', valX1, cY + 17.5)

  // Right col
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(45, 55, 72)
  doc.text('Local da Obra:', labelX2, cY + 5.5)
  doc.text('Prazo de Execução:', labelX2, cY + 11.5)
  doc.text('Faturamento:', labelX2, cY + 17.5)

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(74, 85, 104)
  doc.text(truncate(doc, proposal.workLocation || address || 'Fachada Principal (95,00 m²)', CW - c1W - 34), valX2, cY + 5.5)

  // Highlight deadline in red
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(197, 48, 48)
  doc.text(proposal.executionDeadline || '25 a 30 dias úteis', valX2, cY + 11.5)

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(74, 85, 104)
  doc.text(proposal.invoicing || 'Emissão Integral de NFS-e', valX2, cY + 17.5)

  let y = cY + cH + 7

  // Helper function to draw section titles
  const drawSectionTitle = (title: string) => {
    const [sr, sg, sb] = DOCUMENT_SECONDARY_COLOR_RGB
    doc.setFillColor(sr, sg, sb)
    doc.rect(L, y, 1.2, 5, 'F')
    setPrimary(doc)
    doc.setFontSize(9.5)
    doc.setFont('helvetica', 'bold')
    doc.text(title.toUpperCase(), L + 3.5, y + 4)
    y += 7.5
  }

  // ── SEÇÃO 1: RESUMO DO ESCOPO E MEMORIAL DESCRITIVO ────────────────────────
  drawSectionTitle('1. Resumo do Escopo e Memorial Descritivo')

  if (proposal.scopeIntro) {
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(51, 65, 85)
    doc.setFontSize(8)
    const introLines = doc.splitTextToSize(proposal.scopeIntro, CW)
    doc.text(introLines, L, y)
    y += introLines.length * 4 + 1
  }

  const scopeItems = proposal.scopeItems || []
  scopeItems.forEach((item) => {
    doc.setFontSize(7.5)
    doc.setTextColor(51, 65, 85)
    const parts = item.split(/:(.+)/)
    const bullet = '• '
    const titlePart = parts.length >= 2 ? `${parts[0]}:` : ''
    const descPart = parts.length >= 2 ? parts[1] : item

    const fullText = `${bullet}${titlePart} ${descPart.trim()}`
    const lines = doc.splitTextToSize(fullText, CW - 4)
    doc.text(lines, L + 2, y)
    y += lines.length * 3.6 + 1.2
  })

  y += 3

  // ── SEÇÃO 2: CRONOGRAMA FÍSICO DE EXECUÇÃO ──────────────────────────────────
  drawSectionTitle(`2. Cronograma Físico de Execução (Prazo: ${proposal.executionDeadline || '25 a 30 Dias Úteis'})`)

  const schedH = 6.5
  setFillSecondary(doc)
  doc.rect(L, y, CW, schedH, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.text('Etapa / Período', L + 3, y + 4.5)
  doc.text('Atividades Programadas', L + 45, y + 4.5)

  y += schedH

  const scheduleList = proposal.schedule || []
  scheduleList.forEach((stage, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252)
      doc.rect(L, y, CW, schedH + 1, 'F')
    }
    doc.setDrawColor(226, 232, 240)
    doc.rect(L, y, CW, schedH + 1)

    doc.setFont('helvetica', 'bold')
    doc.setTextColor(45, 55, 72)
    doc.setFontSize(7.5)
    doc.text(stage.period, L + 3, y + 4.8)

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(74, 85, 104)
    doc.text(truncate(doc, stage.activities, CW - 50), L + 45, y + 4.8)

    y += schedH + 1
  })

  y += 5

  // ── SEÇÃO 3: PLANILHA ORÇAMENTÁRIA FECHADA ─────────────────────────────────
  if (y > 220) {
    doc.addPage()
    y = 18
  }

  drawSectionTitle('3. Planilha Orçamentária Fechada (BDI Atualizado + NFS-e)')

  const rowH = 7
  setFillPrimary(doc)
  doc.rect(L, y, CW, rowH, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)

  doc.text('Item', COLS.item.x + COLS.item.w / 2, y + 4.8, { align: 'center' })
  doc.text('Descrição do Serviço / Fornecimento', COLS.desc.x + 2, y + 4.8)
  doc.text('Unid.', COLS.unit.x + COLS.unit.w / 2, y + 4.8, { align: 'center' })
  doc.text('Qtd.', COLS.qty.x + COLS.qty.w / 2, y + 4.8, { align: 'center' })
  doc.text('Unitário (R$)', COLS.unitPrice.x + COLS.unitPrice.w - 2, y + 4.8, { align: 'right' })
  doc.text('Total (R$)', COLS.total.x + COLS.total.w - 2, y + 4.8, { align: 'right' })

  y += rowH

  const estimateItems = estimate.items || []
  if (estimateItems.length === 0) {
    doc.setDrawColor(226, 232, 240)
    doc.rect(L, y, CW, rowH)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(113, 128, 150)
    doc.setFontSize(7.5)
    doc.text('Nenhum item adicionado à planilha orçamentária.', L + CW / 2, y + 4.8, { align: 'center' })
    y += rowH
  } else {
    estimateItems.forEach((item, index) => {
      if (y > 265) {
        doc.addPage()
        y = 18
      }

      if (index % 2 === 1) {
        doc.setFillColor(248, 250, 252)
        doc.rect(L, y, CW, rowH, 'F')
      }
      doc.setDrawColor(226, 232, 240)
      doc.rect(L, y, CW, rowH)

      doc.setFont('helvetica', 'normal')
      doc.setTextColor(45, 55, 72)
      doc.setFontSize(7.5)

      doc.text(String(index + 1).padStart(2, '0'), COLS.item.x + COLS.item.w / 2, y + 4.8, { align: 'center' })
      doc.text(truncate(doc, item.description, COLS.desc.w - 4), COLS.desc.x + 2, y + 4.8)
      doc.text(item.unit || 'un', COLS.unit.x + COLS.unit.w / 2, y + 4.8, { align: 'center' })
      doc.text(item.quantity.toString(), COLS.qty.x + COLS.qty.w / 2, y + 4.8, { align: 'center' })
      doc.text(currencyFormatter.format(item.unitPrice), COLS.unitPrice.x + COLS.unitPrice.w - 2, y + 4.8, { align: 'right' })
      doc.text(currencyFormatter.format(item.quantity * item.unitPrice), COLS.total.x + COLS.total.w - 2, y + 4.8, { align: 'right' })

      y += rowH
    })
  }

  // Total Row
  doc.setFillColor(237, 242, 247)
  doc.setDrawColor(pr, pg, pb)
  doc.setLineWidth(0.4)
  doc.rect(L, y, CW, rowH + 1, 'FD')
  doc.setLineWidth(0.2)

  setPrimary(doc)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.text('VALOR GLOBAL DA PROPOSTA (BDI +15% / COM NFS-E):', COLS.unitPrice.x + COLS.unitPrice.w - 2, y + 5.5, { align: 'right' })
  doc.text(currencyFormatter.format(estimate.amount), COLS.total.x + COLS.total.w - 2, y + 5.5, { align: 'right' })

  y += rowH + 6

  // ── CARD HIGHLIGHT FISCAL ──────────────────────────────────────────────────
  if (y > 230) {
    doc.addPage()
    y = 18
  }

  const cardH = 18
  doc.setFillColor(235, 248, 255)
  doc.setDrawColor(190, 227, 248)
  doc.rect(L, y, CW, cardH, 'FD')

  // Badge
  setFillSecondary(doc)
  doc.rect(L + 3, y + 2.5, 78, 4.5, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'bold')
  doc.text('EMISSÃO DE NOTA FISCAL INCLUSA (SIMPLES NACIONAL)', L + 5, y + 5.8)

  doc.setTextColor(43, 108, 176)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  const fiscalText = proposal.fiscalBenefitNote || `O valor global de ${currencyFormatter.format(estimate.amount)} contempla a emissão integral de Nota Fiscal de Serviços Eletrônica (NFS-e) sob o regime do Simples Nacional, cobrindo materiais, equipamentos, andaimes, mão de obra e BDI atualizado.`
  const fiscalLines = doc.splitTextToSize(fiscalText, CW - 8)
  doc.text(fiscalLines, L + 3, y + 10.5)

  y += cardH + 6

  // ── SEÇÃO 4: CONDIÇÕES COMERCIAIS, PRAZO E GARANTIA ─────────────────────────
  if (y > 215) {
    doc.addPage()
    y = 18
  }

  drawSectionTitle('4. Condições Comerciais, Prazo e Garantia')

  const conditionList = proposal.conditions || []
  const condH = conditionList.length * 4.8 + 5
  doc.setFillColor(248, 250, 252)
  doc.setDrawColor(226, 232, 240)
  doc.rect(L, y, CW, condH, 'FD')

  doc.setFillColor(113, 128, 150)
  doc.rect(L, y, 1.2, condH, 'F')

  let cItemY = y + 4.5
  conditionList.forEach((cond) => {
    doc.setFontSize(7.5)
    doc.setTextColor(51, 65, 85)
    doc.text(`• ${cond}`, L + 4, cItemY)
    cItemY += 4.8
  })

  y += condH + 16

  // ── ASSINATURAS ────────────────────────────────────────────────────────────
  if (y > 265) {
    doc.addPage()
    y = 35
  }

  const sigW = 65
  doc.setDrawColor(113, 128, 150)
  doc.setLineWidth(0.3)

  // Cliente
  doc.line(L + 10, y, L + 10 + sigW, y)
  setPrimary(doc)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.text(truncate(doc, selectedClient.name.toUpperCase(), sigW), L + 10 + sigW / 2, y + 4, { align: 'center' })
  doc.setTextColor(113, 128, 150)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.text('De Acordo / Contratante', L + 10 + sigW / 2, y + 7.5, { align: 'center' })

  // Empresa
  const sigRX = R - 10 - sigW
  doc.line(sigRX, y, sigRX + sigW, y)
  setPrimary(doc)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.text(COMPANY_INFO.engineer.toUpperCase() || 'RESPONSÁVEL TÉCNICO', sigRX + sigW / 2, y + 4, { align: 'center' })
  doc.setTextColor(113, 128, 150)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.text('Contratada (ME / Simples Nacional)', sigRX + sigW / 2, y + 7.5, { align: 'center' })

  // Numeração de páginas
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(7.5)
    doc.setTextColor(113, 128, 150)
    doc.setFont('helvetica', 'normal')
    doc.text(`Página ${i} de ${pageCount}`, R, 290, { align: 'right' })
  }

  doc.save(`orcamento-${estimate.id || 'novo'}.pdf`)
}

export function printQuotePDFDocument(estimate: Quote, clientInfo?: EstimateClientInfo) {
  const html = generateQuoteHTML(estimate, clientInfo)
  printQuoteHTML(html)
}