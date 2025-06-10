import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from './formatters';

interface Invoice {
  invoice_id: string;
  invoice_date: string;
  due_date: string | null;
  subtotal: number;
  discount: number | null;
  tax_amount: number | null;
  total_amount: number;
  customers: {
    name: string | null;
    phone: string | null;
    address: string | null;
  } | null;
  sales: {
    sale_id: string;
    sale_date: string;
    payment_method: string;
    inventory: {
      brand: string;
      model: string;
      variant: string;
      color: string;
      imei: string;
    } | null;
  } | null;
}

export const generatePDF = async (invoice: Invoice): Promise<Blob> => {
  // Create new PDF document
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Add company logo and details
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text('Shopkeeper', 20, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('Mobile Phone Sales & Service', 20, 27);
  doc.text('123 Main Street, City - 123456', 20, 32);
  doc.text('Phone: +91 1234567890', 20, 37);
  doc.text('Email: contact@shopkeeper.com', 20, 42);

  // Add invoice details
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text('INVOICE', pageWidth - 20, 20, { align: 'right' });
  
  doc.setFontSize(10);
  doc.text(`Invoice #: ${invoice.invoice_id}`, pageWidth - 20, 27, { align: 'right' });
  doc.text(`Date: ${new Date(invoice.invoice_date).toLocaleDateString('en-IN')}`, pageWidth - 20, 32, { align: 'right' });
  if (invoice.due_date) {
    doc.text(`Due Date: ${new Date(invoice.due_date).toLocaleDateString('en-IN')}`, pageWidth - 20, 37, { align: 'right' });
  }

  // Add customer details
  doc.setFontSize(11);
  doc.text('Bill To:', 20, 55);
  doc.setFontSize(10);
  doc.text(invoice.customers?.name || 'Walk-in Customer', 20, 62);
  if (invoice.customers?.phone) {
    doc.text(invoice.customers.phone, 20, 67);
  }
  if (invoice.customers?.address) {
    const addressLines = doc.splitTextToSize(invoice.customers.address, 80);
    addressLines.forEach((line: string, index: number) => {
      doc.text(line, 20, 72 + (index * 5));
    });
  }

  // Add product details table
  const tableData = [[
    invoice.sales?.inventory?.brand || '',
    invoice.sales?.inventory?.model || '',
    invoice.sales?.inventory?.variant || '',
    invoice.sales?.inventory?.color || '',
    invoice.sales?.inventory?.imei || '',
    formatCurrency(invoice.subtotal),
  ]];

  autoTable(doc, {
    startY: 90,
    head: [['Brand', 'Model', 'Variant', 'Color', 'IMEI', 'Amount']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      5: { halign: 'right' },
    },
  });

  // Add payment details
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(10);
  doc.text('Payment Details:', 20, finalY);
  doc.text(`Method: ${invoice.sales?.payment_method || 'N/A'}`, 20, finalY + 7);
  
  // Add totals
  doc.text('Subtotal:', pageWidth - 80, finalY);
  doc.text(formatCurrency(invoice.subtotal), pageWidth - 20, finalY, { align: 'right' });

  if (invoice.discount && invoice.discount > 0) {
    doc.text('Discount:', pageWidth - 80, finalY + 7);
    doc.text(formatCurrency(invoice.discount), pageWidth - 20, finalY + 7, { align: 'right' });
  }

  if (invoice.tax_amount && invoice.tax_amount > 0) {
    doc.text('Tax:', pageWidth - 80, finalY + 14);
    doc.text(formatCurrency(invoice.tax_amount), pageWidth - 20, finalY + 14, { align: 'right' });
  }

  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Total:', pageWidth - 80, finalY + 25);
  doc.text(formatCurrency(invoice.total_amount), pageWidth - 20, finalY + 25, { align: 'right' });

  // Add footer
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.text('Thank you for your business!', pageWidth / 2, doc.internal.pageSize.height - 20, { align: 'center' });

  // Return the PDF as a blob
  return doc.output('blob');
}; 