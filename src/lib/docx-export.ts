import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, AlignmentType, TextRun, BorderStyle, HeadingLevel, VerticalAlign } from 'docx'
import { Estimate } from '@/store/useEstimateStore'

const PRIMARY_COLOR = "006699"; // Blue from screenshots

export async function generateEstimateDOCX(estimate: Estimate) {
  const FULL_WIDTH = 9500; // DXA for full width A4 minus margins

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
          // Header Table (ORÇAMENTO | Company Info)
          new Table({
            width: { size: FULL_WIDTH, type: WidthType.DXA },
            columnWidths: [FULL_WIDTH / 2, FULL_WIDTH / 2],
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
                    width: { size: FULL_WIDTH / 2, type: WidthType.DXA },
                    shading: { fill: PRIMARY_COLOR },
                    verticalAlign: VerticalAlign.CENTER,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "ORÇAMENTO",
                            bold: true,
                            color: "FFFFFF",
                            size: 48,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: FULL_WIDTH / 2, type: WidthType.DXA },
                    verticalAlign: VerticalAlign.CENTER,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: "Gesso e Pintura", bold: true, size: 28, color: PRIMARY_COLOR }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: "CNPJ: 00.000.000/0001-00", size: 18 }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: "Telefone: (00) 00000-0000", size: 18 }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: "" }), // Spacer

          // Client Info Box
          new Table({
            width: { size: FULL_WIDTH, type: WidthType.DXA },
            columnWidths: [FULL_WIDTH / 2, FULL_WIDTH / 2],
            alignment: AlignmentType.CENTER,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: FULL_WIDTH / 2, type: WidthType.DXA },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: "CLIENTE: ", bold: true }),
                          new TextRun({ text: estimate.client }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: "ENDEREÇO: ", bold: true }),
                          new TextRun({ text: "Não informado" }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: FULL_WIDTH / 2, type: WidthType.DXA },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: "DATA: ", bold: true }),
                          new TextRun({ text: new Date(estimate.date).toLocaleDateString('pt-BR') }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: "VALIDADE: ", bold: true }),
                          new TextRun({ text: "15 dias" }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: "" }), // Spacer

          // Items Table
          new Table({
            width: { size: FULL_WIDTH, type: WidthType.DXA },
            columnWidths: [FULL_WIDTH * 0.4, FULL_WIDTH * 0.1, FULL_WIDTH * 0.1, FULL_WIDTH * 0.2, FULL_WIDTH * 0.2],
            alignment: AlignmentType.CENTER,
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ 
                    width: { size: FULL_WIDTH * 0.4, type: WidthType.DXA },
                    shading: { fill: PRIMARY_COLOR },
                    children: [new Paragraph({ children: [new TextRun({ text: "DESCRIÇÃO", bold: true, color: "FFFFFF" })] })] 
                  }),
                  new TableCell({ 
                    width: { size: FULL_WIDTH * 0.1, type: WidthType.DXA },
                    shading: { fill: PRIMARY_COLOR },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "UNID.", bold: true, color: "FFFFFF" })] })] 
                  }),
                  new TableCell({ 
                    width: { size: FULL_WIDTH * 0.1, type: WidthType.DXA },
                    shading: { fill: PRIMARY_COLOR },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "QUANT.", bold: true, color: "FFFFFF" })] })] 
                  }),
                  new TableCell({ 
                    width: { size: FULL_WIDTH * 0.2, type: WidthType.DXA },
                    shading: { fill: PRIMARY_COLOR },
                    children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "V. UNITÁRIO", bold: true, color: "FFFFFF" })] })] 
                  }),
                  new TableCell({ 
                    width: { size: FULL_WIDTH * 0.2, type: WidthType.DXA },
                    shading: { fill: PRIMARY_COLOR },
                    children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "V. TOTAL", bold: true, color: "FFFFFF" })] })] 
                  }),
                ],
              }),
              ...estimate.items.map(item => new TableRow({
                children: [
                  new TableCell({ width: { size: FULL_WIDTH * 0.4, type: WidthType.DXA }, children: [new Paragraph(item.description)] }),
                  new TableCell({ width: { size: FULL_WIDTH * 0.1, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, text: item.unit || "un" })] }),
                  new TableCell({ width: { size: FULL_WIDTH * 0.1, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, text: item.quantity.toString() })] }),
                  new TableCell({ width: { size: FULL_WIDTH * 0.2, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, text: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice) })] }),
                  new TableCell({ width: { size: FULL_WIDTH * 0.2, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, text: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.quantity * item.unitPrice) })] }),
                ],
              })),
            ],
          }),
          
          new Paragraph({ text: "" }), // Spacer

          // Total Section
          new Table({
            width: { size: FULL_WIDTH, type: WidthType.DXA },
            columnWidths: [FULL_WIDTH * 0.6, FULL_WIDTH * 0.4],
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
                  new TableCell({ width: { size: FULL_WIDTH * 0.6, type: WidthType.DXA }, children: [] }),
                  new TableCell({
                    width: { size: FULL_WIDTH * 0.4, type: WidthType.DXA },
                    shading: { fill: PRIMARY_COLOR },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: "TOTAL GERAL: ", bold: true, color: "FFFFFF", size: 24 }),
                          new TextRun({ 
                            text: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(estimate.amount), 
                            bold: true, 
                            size: 28, 
                            color: "FFFFFF" 
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: "" }), // Spacer

          // Payment and Observations
          new Table({
            width: { size: FULL_WIDTH, type: WidthType.DXA },
            columnWidths: [FULL_WIDTH],
            alignment: AlignmentType.CENTER,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: FULL_WIDTH, type: WidthType.DXA },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: "CONDIÇÕES DE PAGAMENTO:", bold: true })] }),
                      new Paragraph({ text: "A combinar" }),
                      new Paragraph({ text: "" }),
                      new Paragraph({ children: [new TextRun({ text: "OBSERVAÇÕES:", bold: true })] }),
                      new Paragraph({ text: "Este orçamento tem validade de 15 dias após a data de emissão." }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: "" }), // Spacer
          new Paragraph({ text: "" }), // Spacer

          // Signatures
          new Table({
            width: { size: FULL_WIDTH, type: WidthType.DXA },
            columnWidths: [FULL_WIDTH * 0.45, FULL_WIDTH * 0.1, FULL_WIDTH * 0.45],
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
                    width: { size: FULL_WIDTH * 0.45, type: WidthType.DXA },
                    children: [
                      new Paragraph({ border: { top: { style: BorderStyle.SINGLE, size: 1 } }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Assinatura do Cliente" })] }),
                    ],
                  }),
                  new TableCell({ width: { size: FULL_WIDTH * 0.1, type: WidthType.DXA }, children: [] }),
                  new TableCell({
                    width: { size: FULL_WIDTH * 0.45, type: WidthType.DXA },
                    children: [
                      new Paragraph({ border: { top: { style: BorderStyle.SINGLE, size: 1 } }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Responsável" })] }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style.display = "none";
  a.href = url;
  a.download = `orcamento-${estimate.id}.docx`;
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
