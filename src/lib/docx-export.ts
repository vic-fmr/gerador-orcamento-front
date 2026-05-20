import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from 'docx'
import { Estimate } from '@/store/useEstimateStore'
import {
  COMPANY_INFO,
  DOCUMENT_PRIMARY_COLOR,
  EstimateClientInfo,
  formatAddress,
  formatCnpj,
} from '@/lib/estimate-document'

const PRIMARY_COLOR = DOCUMENT_PRIMARY_COLOR

function emptyCell(width: number) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    children: [new Paragraph('')],
  })
}

export async function generateEstimateDOCX(estimate: Estimate, clientInfo?: EstimateClientInfo) {
  const fullWidth = 9500
  const selectedClient = clientInfo ?? { name: estimate.client }
  const address = formatAddress(selectedClient)

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1080,
              bottom: 1440,
              left: 1080,
            },
          },
        },
        children: [
          new Table({
            width: { size: fullWidth, type: WidthType.DXA },
            alignment: AlignmentType.CENTER,
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
                    width: { size: fullWidth / 2, type: WidthType.DXA },
                    shading: { fill: PRIMARY_COLOR },
                    verticalAlign: VerticalAlign.CENTER,
                    children: [
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
                    ],
                  }),
                  new TableCell({
                    width: { size: fullWidth / 2, type: WidthType.DXA },
                    verticalAlign: VerticalAlign.CENTER,
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

          new Table({
            width: { size: fullWidth, type: WidthType.DXA },
            alignment: AlignmentType.CENTER,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: fullWidth / 2, type: WidthType.DXA },
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
                    width: { size: fullWidth / 2, type: WidthType.DXA },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'DATA: ', bold: true }),
                          new TextRun({ text: new Date(estimate.date).toLocaleDateString('pt-BR') }),
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

          new Table({
            width: { size: fullWidth, type: WidthType.DXA },
            alignment: AlignmentType.CENTER,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: fullWidth * 0.4, type: WidthType.DXA },
                    shading: { fill: PRIMARY_COLOR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'DESCRIÇÃO', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    width: { size: fullWidth * 0.1, type: WidthType.DXA },
                    shading: { fill: PRIMARY_COLOR },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'UNID.', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    width: { size: fullWidth * 0.1, type: WidthType.DXA },
                    shading: { fill: PRIMARY_COLOR },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'QUANT.', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    width: { size: fullWidth * 0.2, type: WidthType.DXA },
                    shading: { fill: PRIMARY_COLOR },
                    children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'V. UNITÁRIO', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    width: { size: fullWidth * 0.2, type: WidthType.DXA },
                    shading: { fill: PRIMARY_COLOR },
                    children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'V. TOTAL', bold: true, color: 'FFFFFF' })] })],
                  }),
                ],
              }),
              ...estimate.items.map(
                (item) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        width: { size: fullWidth * 0.4, type: WidthType.DXA },
                        children: [new Paragraph(item.description)],
                      }),
                      new TableCell({
                        width: { size: fullWidth * 0.1, type: WidthType.DXA },
                        children: [new Paragraph({ alignment: AlignmentType.CENTER, text: item.unit || 'un' })],
                      }),
                      new TableCell({
                        width: { size: fullWidth * 0.1, type: WidthType.DXA },
                        children: [new Paragraph({ alignment: AlignmentType.CENTER, text: item.quantity.toString() })],
                      }),
                      new TableCell({
                        width: { size: fullWidth * 0.2, type: WidthType.DXA },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            text: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice),
                          }),
                        ],
                      }),
                      new TableCell({
                        width: { size: fullWidth * 0.2, type: WidthType.DXA },
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

          new Table({
            width: { size: fullWidth, type: WidthType.DXA },
            alignment: AlignmentType.CENTER,
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
                  emptyCell(fullWidth * 0.6),
                  new TableCell({
                    width: { size: fullWidth * 0.4, type: WidthType.DXA },
                    shading: { fill: PRIMARY_COLOR },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: 'TOTAL GERAL: ', bold: true, color: 'FFFFFF', size: 24 }),
                          new TextRun({
                            text: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(estimate.amount),
                            bold: true,
                            size: 28,
                            color: 'FFFFFF',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '' }),

          new Table({
            width: { size: fullWidth, type: WidthType.DXA },
            alignment: AlignmentType.CENTER,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: fullWidth, type: WidthType.DXA },
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

          new Table({
            width: { size: fullWidth, type: WidthType.DXA },
            alignment: AlignmentType.CENTER,
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
                    width: { size: fullWidth * 0.45, type: WidthType.DXA },
                    children: [
                      new Paragraph({
                        border: { top: { style: BorderStyle.SINGLE, size: 1 } },
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: 'Assinatura do Cliente' })],
                      }),
                    ],
                  }),
                  emptyCell(fullWidth * 0.1),
                  new TableCell({
                    width: { size: fullWidth * 0.45, type: WidthType.DXA },
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
  anchor.download = `orcamento-${estimate.id}.docx`
  anchor.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(anchor)
}