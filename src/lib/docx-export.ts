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
import { Quote, DEFAULT_PROPOSAL_DETAILS } from '../store/useQuoteStore'
import {
  COMPANY_INFO,
  DOCUMENT_PRIMARY_COLOR,
  DOCUMENT_SECONDARY_COLOR,
  EstimateClientInfo,
  formatAddress,
} from './estimate-document'

const PRIMARY_COLOR = DOCUMENT_PRIMARY_COLOR // 1A365D
const SECONDARY_COLOR = DOCUMENT_SECONDARY_COLOR // 2B6CB0

// A4 page content width
const CONTENT_WIDTH = 9638

const COL = {
  header: [5783, 3855],
  client: [4819, 4819],
  schedule: [2409, 7229],
  items: [675, 4530, 964, 964, 1252, 1253],
  full: [9638],
  signature: [4337, 964, 4337],
}

const CELL_MARGINS = { top: 70, bottom: 70, left: 100, right: 100 }

function colorCell(widthDxa: number, children: Paragraph[], bgColor: string = PRIMARY_COLOR) {
  return new TableCell({
    width: { size: widthDxa, type: WidthType.DXA },
    shading: { fill: bgColor, type: ShadingType.CLEAR },
    verticalAlign: VerticalAlign.CENTER,
    margins: CELL_MARGINS,
    children,
  })
}

export async function generateQuoteDOCX(quote: Quote, clientInfo?: EstimateClientInfo) {
  const selectedClient: EstimateClientInfo =
    clientInfo ?? { name: String(quote.client) }
  const address = formatAddress(selectedClient)
  const proposal = { ...DEFAULT_PROPOSAL_DETAILS, ...(quote.proposalDetails || {}) }
  const formattedDate = new Date(quote.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
  const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1134,
              right: 1134,
              bottom: 1134,
              left: 1134,
            },
          },
        },
        children: [
          // ── Header: Proposta Comercial & Técnica | Orçamento Nº ───────────
          new Table({
            layout: TableLayoutType.FIXED,
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            columnWidths: COL.header,
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.SINGLE, size: 12, color: PRIMARY_COLOR },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: COL.header[0], type: WidthType.DXA },
                    verticalAlign: VerticalAlign.CENTER,
                    margins: CELL_MARGINS,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'PROPOSTA COMERCIAL & TÉCNICA', bold: true, size: 26, color: PRIMARY_COLOR }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Engenharia, Reformas Comerciais e Recuperação Estrutural', size: 17, color: '4A5568' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: COL.header[1], type: WidthType.DXA },
                    verticalAlign: VerticalAlign.CENTER,
                    margins: CELL_MARGINS,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: quote.id ? `ORÇAMENTO Nº ${String(quote.id).padStart(4, '0')}` : 'ORÇAMENTO Nº 2026/08-04.R4', bold: true, size: 22, color: SECONDARY_COLOR }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: `Data: ${formattedDate}`, size: 16, color: '718096' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '' }),

          // ── Info Box ───────────────────────────────────────────────────────
          new Table({
            layout: TableLayoutType.FIXED,
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            columnWidths: COL.client,
            borders: {
              top: { style: BorderStyle.SINGLE, size: 2, color: 'E2E8F0' },
              bottom: { style: BorderStyle.SINGLE, size: 2, color: 'E2E8F0' },
              left: { style: BorderStyle.SINGLE, size: 2, color: 'E2E8F0' },
              right: { style: BorderStyle.SINGLE, size: 2, color: 'E2E8F0' },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: COL.client[0], type: WidthType.DXA },
                    shading: { fill: 'F7FAFC', type: ShadingType.CLEAR },
                    margins: CELL_MARGINS,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Cliente: ', bold: true, size: 17, color: '2D3748' }),
                          new TextRun({ text: selectedClient.name, size: 17, color: '4A5568' }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Serviço: ', bold: true, size: 17, color: '2D3748' }),
                          new TextRun({ text: proposal.serviceSummary || quote.title, size: 17, color: '4A5568' }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Regime Fiscal: ', bold: true, size: 17, color: '2D3748' }),
                          new TextRun({ text: proposal.taxRegime || 'ME - Simples Nacional', size: 17, color: '4A5568' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: COL.client[1], type: WidthType.DXA },
                    shading: { fill: 'F7FAFC', type: ShadingType.CLEAR },
                    margins: CELL_MARGINS,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Local da Obra: ', bold: true, size: 17, color: '2D3748' }),
                          new TextRun({ text: proposal.workLocation || address || 'Fachada Principal (95,00 m²)', size: 17, color: '4A5568' }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Prazo de Execução: ', bold: true, size: 17, color: '2D3748' }),
                          new TextRun({ text: proposal.executionDeadline || '25 a 30 dias úteis', bold: true, size: 17, color: 'C53030' }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Faturamento: ', bold: true, size: 17, color: '2D3748' }),
                          new TextRun({ text: proposal.invoicing || 'Emissão Integral de NFS-e', size: 17, color: '4A5568' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '' }),

          // ── Seção 1: Resumo do Escopo ─────────────────────────────────────
          new Paragraph({
            children: [
              new TextRun({ text: '1. RESUMO DO ESCOPO E MEMORIAL DESCRITIVO', bold: true, size: 20, color: PRIMARY_COLOR }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({ text: proposal.scopeIntro || '', size: 17, color: '334155' }),
            ],
          }),

          ...(proposal.scopeItems || []).map((item) => {
            const parts = item.split(/:(.+)/)
            if (parts.length >= 2) {
              return new Paragraph({
                bullet: { level: 0 },
                children: [
                  new TextRun({ text: `${parts[0]}: `, bold: true, size: 16, color: '2D3748' }),
                  new TextRun({ text: parts[1], size: 16, color: '334155' }),
                ],
              })
            }
            return new Paragraph({
              bullet: { level: 0 },
              children: [new TextRun({ text: item, size: 16, color: '334155' })],
            })
          }),

          new Paragraph({ text: '' }),

          // ── Seção 2: Cronograma Físico ─────────────────────────────────────
          new Paragraph({
            children: [
              new TextRun({ text: `2. CRONOGRAMA FÍSICO DE EXECUÇÃO (PRAZO: ${proposal.executionDeadline?.toUpperCase() || '25 A 30 DIAS ÚTEIS'})`, bold: true, size: 20, color: PRIMARY_COLOR }),
            ],
          }),

          new Table({
            layout: TableLayoutType.FIXED,
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            columnWidths: COL.schedule,
            rows: [
              new TableRow({
                children: [
                  colorCell(COL.schedule[0], [new Paragraph({ children: [new TextRun({ text: 'Etapa / Período', bold: true, color: 'FFFFFF', size: 16 })] })], SECONDARY_COLOR),
                  colorCell(COL.schedule[1], [new Paragraph({ children: [new TextRun({ text: 'Atividades Programadas', bold: true, color: 'FFFFFF', size: 16 })] })], SECONDARY_COLOR),
                ],
              }),
              ...(proposal.schedule || []).map((stage, idx) => new TableRow({
                children: [
                  new TableCell({
                    width: { size: COL.schedule[0], type: WidthType.DXA },
                    shading: idx % 2 === 1 ? { fill: 'F8FAFC', type: ShadingType.CLEAR } : undefined,
                    margins: CELL_MARGINS,
                    children: [new Paragraph({ children: [new TextRun({ text: stage.period, bold: true, size: 16, color: '2D3748' })] })],
                  }),
                  new TableCell({
                    width: { size: COL.schedule[1], type: WidthType.DXA },
                    shading: idx % 2 === 1 ? { fill: 'F8FAFC', type: ShadingType.CLEAR } : undefined,
                    margins: CELL_MARGINS,
                    children: [new Paragraph({ children: [new TextRun({ text: stage.activities, size: 16, color: '4A5568' })] })],
                  }),
                ],
              })),
            ],
          }),

          new Paragraph({ text: '' }),

          // ── Seção 3: Planilha Orçamentária ────────────────────────────────
          new Paragraph({
            children: [
              new TextRun({ text: '3. PLANILHA ORÇAMENTÁRIA FECHADA (BDI ATUALIZADO + NFS-E)', bold: true, size: 20, color: PRIMARY_COLOR }),
            ],
          }),

          new Table({
            layout: TableLayoutType.FIXED,
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            columnWidths: COL.items,
            rows: [
              new TableRow({
                children: [
                  colorCell(COL.items[0], [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Item', bold: true, color: 'FFFFFF', size: 16 })] })]),
                  colorCell(COL.items[1], [new Paragraph({ children: [new TextRun({ text: 'Descrição do Serviço / Fornecimento', bold: true, color: 'FFFFFF', size: 16 })] })]),
                  colorCell(COL.items[2], [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Unid.', bold: true, color: 'FFFFFF', size: 16 })] })]),
                  colorCell(COL.items[3], [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Qtd.', bold: true, color: 'FFFFFF', size: 16 })] })]),
                  colorCell(COL.items[4], [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Unitário', bold: true, color: 'FFFFFF', size: 16 })] })]),
                  colorCell(COL.items[5], [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Total', bold: true, color: 'FFFFFF', size: 16 })] })]),
                ],
              }),
              ...(quote.items || []).map((item, index) => new TableRow({
                children: [
                  new TableCell({
                    width: { size: COL.items[0], type: WidthType.DXA },
                    shading: index % 2 === 1 ? { fill: 'F8FAFC', type: ShadingType.CLEAR } : undefined,
                    margins: CELL_MARGINS,
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, text: String(index + 1).padStart(2, '0') })],
                  }),
                  new TableCell({
                    width: { size: COL.items[1], type: WidthType.DXA },
                    shading: index % 2 === 1 ? { fill: 'F8FAFC', type: ShadingType.CLEAR } : undefined,
                    margins: CELL_MARGINS,
                    children: [new Paragraph(item.description)],
                  }),
                  new TableCell({
                    width: { size: COL.items[2], type: WidthType.DXA },
                    shading: index % 2 === 1 ? { fill: 'F8FAFC', type: ShadingType.CLEAR } : undefined,
                    margins: CELL_MARGINS,
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, text: item.unit || 'un' })],
                  }),
                  new TableCell({
                    width: { size: COL.items[3], type: WidthType.DXA },
                    shading: index % 2 === 1 ? { fill: 'F8FAFC', type: ShadingType.CLEAR } : undefined,
                    margins: CELL_MARGINS,
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, text: item.quantity.toString() })],
                  }),
                  new TableCell({
                    width: { size: COL.items[4], type: WidthType.DXA },
                    shading: index % 2 === 1 ? { fill: 'F8FAFC', type: ShadingType.CLEAR } : undefined,
                    margins: CELL_MARGINS,
                    children: [new Paragraph({ alignment: AlignmentType.RIGHT, text: currencyFormatter.format(item.unitPrice) })],
                  }),
                  new TableCell({
                    width: { size: COL.items[5], type: WidthType.DXA },
                    shading: index % 2 === 1 ? { fill: 'F8FAFC', type: ShadingType.CLEAR } : undefined,
                    margins: CELL_MARGINS,
                    children: [new Paragraph({ alignment: AlignmentType.RIGHT, text: currencyFormatter.format(item.quantity * item.unitPrice) })],
                  }),
                ],
              })),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: COL.items[0] + COL.items[1] + COL.items[2] + COL.items[3], type: WidthType.DXA },
                    shading: { fill: 'EDF2F7', type: ShadingType.CLEAR },
                    columnSpan: 4,
                    margins: CELL_MARGINS,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: 'VALOR GLOBAL DA PROPOSTA (BDI +15% / COM NFS-E): ', bold: true, color: PRIMARY_COLOR, size: 17 }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: COL.items[4] + COL.items[5], type: WidthType.DXA },
                    shading: { fill: 'EDF2F7', type: ShadingType.CLEAR },
                    columnSpan: 2,
                    margins: CELL_MARGINS,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: currencyFormatter.format(quote.amount), bold: true, size: 18, color: PRIMARY_COLOR }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '' }),

          // ── Card Highlight Fiscal ─────────────────────────────────────────
          new Table({
            layout: TableLayoutType.FIXED,
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            columnWidths: COL.full,
            borders: {
              top: { style: BorderStyle.SINGLE, size: 2, color: 'BEE3F8' },
              bottom: { style: BorderStyle.SINGLE, size: 2, color: 'BEE3F8' },
              left: { style: BorderStyle.SINGLE, size: 2, color: 'BEE3F8' },
              right: { style: BorderStyle.SINGLE, size: 2, color: 'BEE3F8' },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: COL.full[0], type: WidthType.DXA },
                    shading: { fill: 'EBF8FF', type: ShadingType.CLEAR },
                    margins: CELL_MARGINS,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'EMISSÃO DE NOTA FISCAL INCLUSA (SIMPLES NACIONAL)', bold: true, color: SECONDARY_COLOR, size: 16 }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: proposal.fiscalBenefitNote || `O valor global de ${currencyFormatter.format(quote.amount)} contempla a emissão integral de Nota Fiscal de Serviços Eletrônica (NFS-e) sob o regime do Simples Nacional, cobrindo materiais, equipamentos, andaimes e mão de obra.`, size: 15, color: SECONDARY_COLOR }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '' }),

          // ── Seção 4: Condições Comerciais ─────────────────────────────────
          new Paragraph({
            children: [
              new TextRun({ text: '4. CONDIÇÕES COMERCIAIS, PRAZO E GARANTIA', bold: true, size: 20, color: PRIMARY_COLOR }),
            ],
          }),

          new Table({
            layout: TableLayoutType.FIXED,
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            columnWidths: COL.full,
            borders: {
              top: { style: BorderStyle.SINGLE, size: 2, color: 'E2E8F0' },
              bottom: { style: BorderStyle.SINGLE, size: 2, color: 'E2E8F0' },
              left: { style: BorderStyle.SINGLE, size: 8, color: '718096' },
              right: { style: BorderStyle.SINGLE, size: 2, color: 'E2E8F0' },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: COL.full[0], type: WidthType.DXA },
                    shading: { fill: 'F8FAFC', type: ShadingType.CLEAR },
                    margins: CELL_MARGINS,
                    children: (proposal.conditions || []).map((cond) => {
                      const parts = cond.split(/:(.+)/)
                      if (parts.length >= 2) {
                        return new Paragraph({
                          children: [
                            new TextRun({ text: `• ${parts[0]}: `, bold: true, size: 16, color: '2D3748' }),
                            new TextRun({ text: parts[1], size: 16, color: '4A5568' }),
                          ],
                        })
                      }
                      return new Paragraph({
                        children: [new TextRun({ text: `• ${cond}`, size: 16, color: '4A5568' })],
                      })
                    }),
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '' }),
          new Paragraph({ text: '' }),

          // ── Assinaturas ───────────────────────────────────────────────────
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
                        border: { top: { style: BorderStyle.SINGLE, size: 2, color: '718096' } },
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: selectedClient.name.toUpperCase(), bold: true, size: 16, color: PRIMARY_COLOR }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: 'De Acordo / Contratante', size: 15, color: '718096' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: COL.signature[1], type: WidthType.DXA },
                    margins: CELL_MARGINS,
                    children: [new Paragraph('')],
                  }),
                  new TableCell({
                    width: { size: COL.signature[2], type: WidthType.DXA },
                    margins: CELL_MARGINS,
                    children: [
                      new Paragraph({
                        border: { top: { style: BorderStyle.SINGLE, size: 2, color: '718096' } },
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: COMPANY_INFO.engineer.toUpperCase() || 'RESPONSÁVEL TÉCNICO', bold: true, size: 16, color: PRIMARY_COLOR }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: 'Contratada (ME / Simples Nacional)', size: 15, color: '718096' }),
                        ],
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
  anchor.download = `orcamento-${quote.id || 'novo'}.docx`
  anchor.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(anchor)
}