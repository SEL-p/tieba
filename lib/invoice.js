import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoice = (order) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString('fr-FR');
  const invoiceNumber = `INV-${order.id.substring(0, 8).toUpperCase()}`;

  // Design elements
  doc.setFillColor(30, 41, 59); // Slate-800
  doc.rect(0, 0, 210, 40, 'F');

  // Header
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('TIEBA MARKET', 20, 25);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Le meilleur du marché ivoirien', 20, 32);

  doc.setTextColor(255, 255, 255);
  doc.text('FACTURE', 170, 25);
  doc.setFontSize(8);
  doc.text(invoiceNumber, 170, 32);

  // Content
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);

  // Billing Info
  doc.setFont('helvetica', 'bold');
  doc.text('Facturé à:', 20, 55);
  doc.setFont('helvetica', 'normal');
  doc.text(order.userName || 'Client Tiéba', 20, 62);
  doc.text(order.userEmail || '', 20, 67);
  doc.text('Côte d\'Ivoire', 20, 72);

  // Order Info
  doc.setFont('helvetica', 'bold');
  doc.text('Détails commande:', 140, 55);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${date}`, 140, 62);
  doc.text(`Statut: Payée`, 140, 67);
  doc.text(`Méthode: ${order.paymentMethod || 'Mobile Money'}`, 140, 72);

  // Table
  const tableRows = order.items.map(item => [
    item.product.name,
    `${item.quantity}`,
    `${(item.product.price || 0).toLocaleString()} CFA`,
    `${((item.product.price || 0) * item.quantity).toLocaleString()} CFA`
  ]);

  autoTable(doc, {
    startY: 85,
    head: [['Produit', 'Qté', 'Prix Unitaire', 'Total']],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: [30, 41, 59] },
    styles: { fontSize: 9 },
  });

  // Totals
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Total:', 140, finalY);
  doc.text(`${(order.total || 0).toLocaleString()} CFA`, 175, finalY, { align: 'right' });

  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  doc.text('Merci de votre confiance sur Tiéba Market !', 105, 280, { align: 'center' });
  doc.text('www.tieba-market.ci', 105, 285, { align: 'center' });

  // Save the PDF
  doc.save(`Facture-Tieba-${order.id.substring(0, 8)}.pdf`);
};
