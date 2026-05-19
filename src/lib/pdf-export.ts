import jsPDF from 'jspdf'
import { Estimate } from '@/store/useEstimateStore'

export function generateEstimatePDF(estimate: Estimate) {
  const doc = new jsPDF()

  // Branding/Header
  doc.setFontSize(22)
  doc.setTextColor(255, 102, 0) // Safety Orange
  doc.text('EstimatePro', 20, 20)
  
  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text('Seu parceiro em orçamentos profissionais', 20, 26)

  // Divider
  doc.setDrawColor(200)
  doc.line(20, 32, 190, 32)

  // Estimate Info
  doc.setFontSize(16)
  doc.setTextColor(0)
  doc.text(`Orçamento: ${estimate.title}`, 20, 45)
  
  doc.setFontSize(12)
  doc.text(`Cliente: ${estimate.client}`, 20, 52)
  doc.text(`Data: ${new Date(estimate.date).toLocaleDateString('pt-BR')}`, 20, 59)
  
  const statusLabels = {
    pending: 'Pendente',
    approved: 'Aprovado',
    paid: 'Pago'
  }
  doc.text(`Status: ${statusLabels[estimate.status]}`, 20, 66)

  // Items Table Header
  doc.setFillColor(240)
  doc.rect(20, 75, 175, 8, 'F')
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Descrição', 25, 80)
  doc.text('Qtd', 110, 80)
  doc.text('Unit.', 140, 80)
  doc.text('Total', 170, 80)

  // Items
  doc.setFont('helvetica', 'normal')
  let y = 88
  estimate.items.forEach((item) => {
    // Truncate description if too long
    const desc = item.description.length > 40 ? item.description.substring(0, 37) + '...' : item.description
    doc.text(desc, 25, y)
    doc.text(`${item.quantity} ${item.unit}`, 110, y)
    doc.text(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice), 140, y)
    doc.text(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.quantity * item.unitPrice), 170, y)
    y += 8
    
    // Page break check
    if (y > 270) {
      doc.addPage()
      y = 20
    }
  })

  // Total
  doc.line(20, y + 2, 195, y + 2)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Total Geral:', 130, y + 12)
  doc.text(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(estimate.amount), 170, y + 12)

  // Footer
  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(150)
  doc.text('Gerado por EstimatePro - O futuro dos orçamentos', 105, 285, { align: 'center' })

  doc.save(`orcamento-${estimate.id}.pdf`)
}
