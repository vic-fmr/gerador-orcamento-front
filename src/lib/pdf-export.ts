import jsPDF from 'jspdf'
import { Estimate } from '@/store/useEstimateStore'

const PRIMARY_COLOR = [0, 102, 153] // Blue from screenshots

export function generateEstimatePDF(estimate: Estimate) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()

  // Header Bar
  doc.setFillColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2])
  doc.rect(15, 15, 90, 20, 'F')
  doc.setFontSize(22)
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.text('ORÇAMENTO', 60, 28, { align: 'center' })

  // Company Info
  doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2])
  doc.setFontSize(16)
  doc.text('Gesso e Pintura', 195, 22, { align: 'right' })
  doc.setTextColor(100)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('CNPJ: 00.000.000/0001-00', 195, 28, { align: 'right' })
  doc.text('Telefone: (00) 00000-0000', 195, 33, { align: 'right' })

  // Client Info Box
  doc.setDrawColor(200)
  doc.rect(15, 45, 180, 25)
  doc.line(105, 45, 105, 70)
  
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0)
  doc.text('CLIENTE:', 20, 53)
  doc.text('ENDEREÇO:', 20, 63)
  doc.text('DATA:', 110, 53)
  doc.text('VALIDADE:', 110, 63)

  doc.setFont('helvetica', 'normal')
  doc.text(estimate.client, 45, 53)
  doc.text('Não informado', 45, 63)
  doc.text(new Date(estimate.date).toLocaleDateString('pt-BR'), 130, 53)
  doc.text('15 dias', 135, 63)

  // Table Header
  doc.setFillColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2])
  doc.rect(15, 80, 180, 10, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('DESCRIÇÃO', 20, 86)
  doc.text('UNID.', 110, 86)
  doc.text('QUANT.', 130, 86)
  doc.text('V. UNITÁRIO', 150, 86)
  doc.text('V. TOTAL', 180, 86)

  // Items
  doc.setTextColor(0)
  doc.setFont('helvetica', 'normal')
  let y = 97
  estimate.items.forEach((item) => {
    // Draw borders for cells
    doc.setDrawColor(230)
    doc.line(15, y + 2, 195, y + 2)
    
    const desc = item.description.length > 50 ? item.description.substring(0, 47) + '...' : item.description
    doc.text(desc, 20, y)
    doc.text(item.unit || 'un', 110, y)
    doc.text(item.quantity.toString(), 130, y)
    doc.text(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice), 150, y)
    doc.text(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.quantity * item.unitPrice), 180, y)
    y += 8
    
    if (y > 250) {
      doc.addPage()
      y = 20
    }
  })

  // Total Geral
  doc.setFillColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2])
  doc.rect(120, y + 5, 75, 12, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('TOTAL GERAL:', 125, y + 13)
  doc.text(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(estimate.amount), 190, y + 13, { align: 'right' })

  // Payment and Observations
  y += 30
  doc.setDrawColor(200)
  doc.rect(15, y, 180, 30)
  doc.setTextColor(0)
  doc.setFontSize(10)
  doc.text('CONDIÇÕES DE PAGAMENTO:', 20, y + 7)
  doc.setFont('helvetica', 'normal')
  doc.text('A combinar', 20, y + 12)
  
  doc.setFont('helvetica', 'bold')
  doc.text('OBSERVAÇÕES:', 20, y + 22)
  doc.setFont('helvetica', 'normal')
  doc.text('Este orçamento tem validade de 15 dias após a data de emissão.', 20, y + 27)

  // Signatures
  y += 50
  doc.line(20, y, 90, y)
  doc.text('Assinatura do Cliente', 55, y + 5, { align: 'center' })
  
  doc.line(120, y, 190, y)
  doc.text('Responsável', 155, y + 5, { align: 'center' })

  doc.save(`orcamento-${estimate.id}.pdf`)
}
