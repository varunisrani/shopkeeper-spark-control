import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { generatePDF } from '@/utils/pdfGenerator';

export const useInvoiceOperations = () => {
  const viewInvoice = async (invoiceId: string) => {
    try {
      // Fetch complete invoice data
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .select(`
          *,
          customers (
            name,
            phone,
            address
          ),
          sales (
            sale_id,
            sale_date,
            payment_method,
            inventory (
              brand,
              model,
              variant,
              color,
              imei
            )
          )
        `)
        .eq('invoice_id', invoiceId)
        .single();

      if (invoiceError) throw invoiceError;
      if (!invoice) throw new Error('Invoice not found');

      // Generate PDF in memory
      const pdfBlob = await generatePDF(invoice);
      
      // Create a URL for the PDF blob
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      // Open PDF in new tab
      window.open(pdfUrl, '_blank');
      
      // Clean up the URL after a delay
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 30000);
    } catch (error) {
      console.error('Error viewing invoice:', error);
      toast.error('Failed to view invoice. Please try again.');
    }
  };

  const downloadInvoice = async (invoiceId: string) => {
    try {
      // Fetch complete invoice data
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .select(`
          *,
          customers (
            name,
            phone,
            address
          ),
          sales (
            sale_id,
            sale_date,
            payment_method,
            inventory (
              brand,
              model,
              variant,
              color,
              imei
            )
          )
        `)
        .eq('invoice_id', invoiceId)
        .single();

      if (invoiceError) throw invoiceError;
      if (!invoice) throw new Error('Invoice not found');

      // Generate PDF
      const pdfBlob = await generatePDF(invoice);
      
      // Create download link
      const downloadUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `Invoice-${invoiceId}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 30000);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice. Please try again.');
    }
  };

  return {
    viewInvoice,
    downloadInvoice,
  };
}; 