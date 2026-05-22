import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from 'docx'
import { Quote } from '../store/useQuoteStore'
import {
  COMPANY_INFO,
  DOCUMENT_PRIMARY_COLOR,
  EstimateClientInfo,
  formatAddress,
  formatCnpj,
} from './estimate-document'

const PRIMARY_COLOR = DOCUMENT_PRIMARY_COLOR

// A4 page (11906 DXA wide) with 1440 DXA margins on each side
// Content width = 11906 - 1440 - 1440 = 9026 DXA
const CONTENT_WIDTH = 9026

// Column widths in DXA — must sum to CONTENT_WIDTH
const COL = {
  // Header table: 50 / 50
  header: [4513, 4513],
  // Client table: 60 / 40
  client: [5416, 3610],
  // Items table: 45 / 10 / 10 / 17.5 / 17.5  (preserves original proportions)
  items: [4062, 903, 903, 1579, 1579],
  // Total table: 60 / 40
  total: [5416, 3610],
  // Conditions table: 100
  conditions: [9026],
  // Signature table: 45 / 10 / 45
  signature: [4062, 902, 4062],
}

const CELL_MARGINS = { top: 80, bottom: 80, left: 120, right: 120 }

function emptyCell(widthDxa: number) {
  return new TableCell({
    width: { size: widthDxa, type: WidthType.DXA },
    margins: CELL_MARGINS,
    children: [new Paragraph('')],
  })
}

function colorCell(widthDxa: number, children: Paragraph[]) {
  return new TableCell({
    width: { size: widthDxa, type: WidthType.DXA },
    shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
    verticalAlign: VerticalAlign.CENTER,
    margins: CELL_MARGINS,
    children,
  })
}

export async function generateQuoteDOCX(quote: Quote, clientInfo?: EstimateClientInfo) {
  const selectedClient: EstimateClientInfo =
    clientInfo ?? { name: String(quote.client) }
  const address = formatAddress(selectedClient)

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: [
          // ── Header: ORÇAMENTO | Company info ──────────────────────────────
          new Table({
            layout: TableLayoutType.FIXED,
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            columnWidths: COL.header,
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  colorCell(COL.header[0], [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: 'ORÇAMENTO',
                          bold: true,
                          color: 'FFFFFF',
                          size: 48,
                        }),
                      ],
                    }),
                  ]),
                  new TableCell({
                    width: { size: COL.header[1], type: WidthType.DXA },
                    verticalAlign: VerticalAlign.CENTER,
                    margins: CELL_MARGINS,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: COMPANY_INFO.name, bold: true, size: 28, color: PRIMARY_COLOR }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: `CNPJ: ${formatCnpj(COMPANY_INFO.cnpj)}`, size: 18 }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: COMPANY_INFO.engineer, size: 18 }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '' }),

          // ── Client info | Date ────────────────────────────────────────────
          new Table({
            layout: TableLayoutType.FIXED,
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            columnWidths: COL.client,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: COL.client[0], type: WidthType.DXA },
                    margins: CELL_MARGINS,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'CLIENTE: ', bold: true }),
                          new TextRun({ text: selectedClient.name }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'ENDEREÇO: ', bold: true }),
                          new TextRun({ text: address }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'EMAIL: ', bold: true }),
                          new TextRun({ text: selectedClient.email || 'Não informado' }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'TELEFONE: ', bold: true }),
                          new TextRun({ text: selectedClient.phone || 'Não informado' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: COL.client[1], type: WidthType.DXA },
                    margins: CELL_MARGINS,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'DATA: ', bold: true }),
                          new TextRun({ text: new Date(quote.date).toLocaleDateString('pt-BR') }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'VALIDADE: ', bold: true }),
                          new TextRun({ text: '15 dias' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '' }),

          // ── Items table ───────────────────────────────────────────────────
          new Table({
            layout: TableLayoutType.FIXED,
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            columnWidths: COL.items,
            rows: [
              // Header row
              new TableRow({
                children: [
                  colorCell(COL.items[0], [
                    new Paragraph({ children: [new TextRun({ text: 'DESCRIÇÃO', bold: true, color: 'FFFFFF' })] }),
                  ]),
                  colorCell(COL.items[1], [
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'UNID.', bold: true, color: 'FFFFFF' })] }),
                  ]),
                  colorCell(COL.items[2], [
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'QUANT.', bold: true, color: 'FFFFFF' })] }),
                  ]),
                  colorCell(COL.items[3], [
                    new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'V. UNITÁRIO', bold: true, color: 'FFFFFF' })] }),
                  ]),
                  colorCell(COL.items[4], [
                    new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'V. TOTAL', bold: true, color: 'FFFFFF' })] }),
                  ]),
                ],
              }),
              // Data rows
              ...quote.items.map(
                (item) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        width: { size: COL.items[0], type: WidthType.DXA },
                        margins: CELL_MARGINS,
                        children: [new Paragraph(item.description)],
                      }),
                      new TableCell({
                        width: { size: COL.items[1], type: WidthType.DXA },
                        margins: CELL_MARGINS,
                        children: [new Paragraph({ alignment: AlignmentType.CENTER, text: item.unit || 'un' })],
                      }),
                      new TableCell({
                        width: { size: COL.items[2], type: WidthType.DXA },
                        margins: CELL_MARGINS,
                        children: [new Paragraph({ alignment: AlignmentType.CENTER, text: item.quantity.toString() })],
                      }),
                      new TableCell({
                        width: { size: COL.items[3], type: WidthType.DXA },
                        margins: CELL_MARGINS,
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            text: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice),
                          }),
                        ],
                      }),
                      new TableCell({
                        width: { size: COL.items[4], type: WidthType.DXA },
                        margins: CELL_MARGINS,
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            text: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.quantity * item.unitPrice),
                          }),
                        ],
                      }),
                    ],
                  }),
              ),
            ],
          }),

          new Paragraph({ text: '' }),

          // ── Total ─────────────────────────────────────────────────────────
          new Table({
            layout: TableLayoutType.FIXED,
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            columnWidths: COL.total,
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  emptyCell(COL.total[0]),
                  colorCell(COL.total[1], [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({ text: 'TOTAL GERAL: ', bold: true, color: 'FFFFFF', size: 24 }),
                        new TextRun({
                          text: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quote.amount),
                          bold: true,
                          size: 28,
                          color: 'FFFFFF',
                        }),
                      ],
                    }),
                  ]),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '' }),

          // ── Conditions / Notes ────────────────────────────────────────────
          new Table({
            layout: TableLayoutType.FIXED,
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            columnWidths: COL.conditions,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: COL.conditions[0], type: WidthType.DXA },
                    margins: CELL_MARGINS,
                    children: [
                      new Paragraph({ children: [new TextRun({ text: 'CONDIÇÕES DE PAGAMENTO:', bold: true })] }),
                      new Paragraph({ text: '50% na entrada, 50% na entrega.' }),
                      new Paragraph({ text: '' }),
                      new Paragraph({ children: [new TextRun({ text: 'OBSERVAÇÕES:', bold: true })] }),
                      new Paragraph({ text: 'Este orçamento tem validade de 15 dias após a data de emissão.' }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '' }),
          new Paragraph({ text: '' }),

          // ── Signatures ────────────────────────────────────────────────────
          new Table({
            layout: TableLayoutType.FIXED,
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            columnWidths: COL.signature,
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: COL.signature[0], type: WidthType.DXA },
                    margins: CELL_MARGINS,
                    children: [
                      new Paragraph({
                        border: { top: { style: BorderStyle.SINGLE, size: 1 } },
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: 'Assinatura do Cliente' })],
                      }),
                    ],
                  }),
                  emptyCell(COL.signature[1]),
                  new TableCell({
                    width: { size: COL.signature[2], type: WidthType.DXA },
                    margins: CELL_MARGINS,
                    children: [
                      new Paragraph({
                        border: { top: { style: BorderStyle.SINGLE, size: 1 } },
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: 'Responsável' })],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  const url = window.URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  document.body.appendChild(anchor)
  anchor.style.display = 'none'
  anchor.href = url
  anchor.download = `orcamento-${quote.id}.docx`
  anchor.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(anchor)
}