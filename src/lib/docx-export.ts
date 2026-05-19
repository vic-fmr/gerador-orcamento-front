import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, AlignmentType, TextRun, BorderStyle } from 'docx'
import { Estimate } from '@/store/useEstimateStore'

export async function generateEstimateDOCX(estimate: Estimate) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: "EstimatePro", bold: true, color: "FF6600", size: 48 }),
            ],
          }),
          new Paragraph({
            text: "Seu parceiro em orçamentos profissionais",
            style: "Subtitle",
          }),
          new Paragraph({ text: "" }), // Spacer
          
          new Paragraph({
            border: {
              bottom: { color: "DDDDDD", space: 1, style: BorderStyle.SINGLE, size: 6 },
            },
            children: [
              new TextRun({ text: `Orçamento: ${estimate.title}`, bold: true, size: 32 }),
            ],
          }),
          new Paragraph({ text: "" }), // Spacer
          new Paragraph({ text: `Cliente: ${estimate.client}` }),
          new Paragraph({ text: `Data de Emissão: ${new Date(estimate.date).toLocaleDateString('pt-BR')}` }),
          new Paragraph({ text: "" }), // Spacer
          
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ 
                    shading: { fill: "F5F5F5" },
                    children: [new Paragraph({ text: "Descrição", bold: true })] 
                  }),
                  new TableCell({ 
                    shading: { fill: "F5F5F5" },
                    children: [new Paragraph({ text: "Qtd", bold: true })] 
                  }),
                  new TableCell({ 
                    shading: { fill: "F5F5F5" },
                    children: [new Paragraph({ text: "Unit.", bold: true })] 
                  }),
                  new TableCell({ 
                    shading: { fill: "F5F5F5" },
                    children: [new Paragraph({ text: "Total", bold: true })] 
                  }),
                ],
              }),
              ...estimate.items.map(item => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(item.description)] }),
                  new TableCell({ children: [new Paragraph(`${item.quantity} ${item.unit}`)] }),
                  new TableCell({ children: [new Paragraph(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice))] }),
                  new TableCell({ children: [new Paragraph(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.quantity * item.unitPrice))] }),
                ],
              })),
            ],
          }),
          
          new Paragraph({ text: "" }), // Spacer
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({ text: "Total Geral: ", bold: true, size: 28 }),
              new TextRun({ 
                text: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(estimate.amount), 
                bold: true, 
                size: 32, 
                color: "FF6600" 
              }),
            ],
          }),
          
          new Paragraph({ text: "" }), // Spacer
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Este documento é um orçamento válido por 15 dias.", italics: true, color: "888888", size: 16 }),
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
