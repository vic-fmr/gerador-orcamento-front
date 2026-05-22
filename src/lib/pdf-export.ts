import jsPDF from 'jspdf'
import { Quote } from '@/lib/api'
import {
  COMPANY_INFO,
  DOCUMENT_PRIMARY_COLOR_RGB,
  EstimateClientInfo,
  formatAddress,
  formatCnpj,
} from '@/lib/estimate-document'

// ─── Layout constants (A4: 210×297mm, margins 15mm) ────────────────────────
const L   = 15    // left margin
const R   = 195   // right margin
const CW  = 180   // content width (R - L)

// Column widths matching DOCX proportions exactly
// Items: 45% / 10% / 10% / 17.5% / 17.5% of CW
const COLS = {
  desc:      { x: L,         w: 81   },   // 45%
  unit:      { x: L + 81,    w: 18   },   // 10%
  qty:       { x: L + 99,    w: 18   },   // 10%
  unitPrice: { x: L + 117,   w: 31.5 },   // 17.5%
  total:     { x: L + 148.5, w: 31.5 },   // 17.5%
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function setPrimary(doc: jsPDF) {
  const [r, g, b] = DOCUMENT_PRIMARY_COLOR_RGB
  doc.setTextColor(r, g, b)
}

function setFillPrimary(doc: jsPDF) {
  const [r, g, b] = DOCUMENT_PRIMARY_COLOR_RGB
  doc.setFillColor(r, g, b)
}

function safeFormatDate(d: unknown): string {
  if (!d) return 'Não informado'
  const date = new Date(d as string)
  return isNaN(date.getTime()) ? 'Não informado' : date.toLocaleDateString('pt-BR')
}

function truncate(doc: jsPDF, text: string, maxWidth: number): string {
  return doc.splitTextToSize(text, maxWidth)[0] as string
}

// ─── Main ────────────────────────────────────────────────────────────────────
export function generateQuotePDF(estimate: Quote, clientInfo?: EstimateClientInfo) {
  const doc = new jsPDF()
  const [pr, pg, pb] = DOCUMENT_PRIMARY_COLOR_RGB

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

  // ── HEADER ─────────────────────────────────────────────────────────────────
  // Left block (50% = 90mm): colored rectangle + "ORÇAMENTO"
  setFillPrimary(doc)
  doc.rect(L, 15, 90, 20, 'F')
  doc.setFontSize(22)
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.text('ORÇAMENTO', L + 45, 27.5, { align: 'center' })

  // Right block (50%): company info right-aligned
  setPrimary(doc)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(COMPANY_INFO.name, R, 21, { align: 'right' })
  doc.setTextColor(80, 80, 80)
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'normal')
  doc.text(`CNPJ: ${formatCnpj(COMPANY_INFO.cnpj)}`, R, 27, { align: 'right' })
  doc.text(COMPANY_INFO.engineer, R, 32, { align: 'right' })

  // ── CLIENT INFO (60% | 40%, with outer border + divider) ──────────────────
  const cY  = 42    // top of box
  const cH  = 26    // box height
  const c1W = 108   // left col = 60% of 180
  const c2X = L + c1W

  doc.setDrawColor(200, 200, 200)
  doc.rect(L, cY, CW, cH)
  doc.line(c2X, cY, c2X, cY + cH)

  const labelX1 = L + 3
  const valX1   = L + 26   // after longest label "ENDEREÇO: "
  const labelX2 = c2X + 3
  const valX2   = c2X + 24

  doc.setFontSize(9)
  doc.setTextColor(0, 0, 0)

  // Left column — labels
  doc.setFont('helvetica', 'bold')
  doc.text('CLIENTE:',   labelX1, cY + 7)
  doc.text('ENDEREÇO:', labelX1, cY + 14)
  doc.text('EMAIL:',    labelX1, cY + 21)

  // Left column — values (truncated to avoid overflow)
  doc.setFont('helvetica', 'normal')
  doc.text(truncate(doc, selectedClient.name, c1W - 30),                          valX1, cY + 7)
  doc.text(truncate(doc, address, c1W - 30),                                       valX1, cY + 14)
  doc.text(truncate(doc, selectedClient.email || 'Não informado', c1W - 30),       valX1, cY + 21)

  // Right column — labels
  doc.setFont('helvetica', 'bold')
  doc.text('DATA:',      labelX2, cY + 7)
  doc.text('VALIDADE:',  labelX2, cY + 14)
  doc.text('TELEFONE:',  labelX2, cY + 21)

  // Right column — values
  doc.setFont('helvetica', 'normal')
  doc.text(safeFormatDate(estimate.date),                          valX2, cY + 7)
  doc.text('15 dias',                                               valX2, cY + 14)
  doc.text(selectedClient.phone || 'Não informado',                 valX2, cY + 21)

  // ── ITEMS TABLE ────────────────────────────────────────────────────────────
  const tY   = cY + cH + 8
  const rowH = 10

  // Header row
  setFillPrimary(doc)
  doc.rect(L, tY, CW, rowH, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)

  doc.text('DESCRIÇÃO',   COLS.desc.x + 3,                              tY + 6.5)
  doc.text('UNID.',       COLS.unit.x + COLS.unit.w / 2,               tY + 6.5, { align: 'center' })
  doc.text('QUANT.',      COLS.qty.x  + COLS.qty.w  / 2,               tY + 6.5, { align: 'center' })
  doc.text('V. UNITÁRIO', COLS.unitPrice.x + COLS.unitPrice.w - 3,     tY + 6.5, { align: 'right'  })
  doc.text('V. TOTAL',    COLS.total.x     + COLS.total.w     - 3,     tY + 6.5, { align: 'right'  })

  // Data rows
  let y = tY + rowH
  doc.setFont('helvetica', 'normal')

  estimate.items.forEach((item) => {
    if (y > 255) {
      doc.addPage()
      y = 20
    }

    // Row border + vertical dividers
    doc.setDrawColor(220, 220, 220)
    doc.rect(L, y, CW, rowH)
    doc.line(COLS.unit.x,      y, COLS.unit.x,      y + rowH)
    doc.line(COLS.qty.x,       y, COLS.qty.x,        y + rowH)
    doc.line(COLS.unitPrice.x, y, COLS.unitPrice.x, y + rowH)
    doc.line(COLS.total.x,     y, COLS.total.x,     y + rowH)

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(9)

    doc.text(truncate(doc, item.description, COLS.desc.w - 5), COLS.desc.x + 3, y + 6.5)
    doc.text(item.unit || 'un',        COLS.unit.x + COLS.unit.w / 2,           y + 6.5, { align: 'center' })
    doc.text(item.quantity.toString(), COLS.qty.x  + COLS.qty.w  / 2,           y + 6.5, { align: 'center' })
    doc.text(
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice),
      COLS.unitPrice.x + COLS.unitPrice.w - 3, y + 6.5, { align: 'right' }
    )
    doc.text(
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.quantity * item.unitPrice),
      COLS.total.x + COLS.total.w - 3, y + 6.5, { align: 'right' }
    )

    y += rowH
  })

  // ── TOTAL (right-aligned colored box, 40% width) ──────────────────────────
  const totalW = 72   // 40% of 180
  const totalH = 12
  const totalX = R - totalW

  setFillPrimary(doc)
  doc.rect(totalX, y + 4, totalW, totalH, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('TOTAL GERAL:', totalX + 4, y + 12)
  doc.setFontSize(11)
  doc.text(
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(estimate.amount),
    R - 3, y + 12, { align: 'right' }
  )

  // ── CONDITIONS / OBSERVATIONS ─────────────────────────────────────────────
  y += totalH + 12
  const condH = 28

  doc.setDrawColor(200, 200, 200)
  doc.rect(L, y, CW, condH)
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(9)

  doc.setFont('helvetica', 'bold')
  doc.text('CONDIÇÕES DE PAGAMENTO:', L + 3, y + 7)
  doc.setFont('helvetica', 'normal')
  doc.text('50% na entrada, 50% na entrega.', L + 3, y + 13)

  doc.setFont('helvetica', 'bold')
  doc.text('OBSERVAÇÕES:', L + 3, y + 20)
  doc.setFont('helvetica', 'normal')
  doc.text('Este orçamento tem validade de 15 dias após a data de emissão.', L + 3, y + 26)

  // ── SIGNATURES ────────────────────────────────────────────────────────────
  y += condH + 20
  const sigW = 70

  doc.setDrawColor(0, 0, 0)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(0, 0, 0)

  // Left: Assinatura do Cliente
  doc.line(L, y, L + sigW, y)
  doc.text('Assinatura do Cliente', L + sigW / 2, y + 5, { align: 'center' })

  // Right: Responsável
  const sigRX = R - sigW
  doc.line(sigRX, y, R, y)
  doc.text('Responsável', sigRX + sigW / 2, y + 5, { align: 'center' })

  doc.save(`orcamento-${estimate.id}.pdf`)
}