import { InvoiceItem, InvoiceSummary } from '@/types/events';
import { invoicesDatabase } from '@/data/mockEvents';

export const calculateItemValues = (item: Omit<InvoiceItem, 'sales' | 'net'>): InvoiceItem => {
  const sales = item.unitPrice * item.quantity;
  const compValue = item.unitPrice * item.comp;
  const net = sales - compValue;
  
  return {
    ...item,
    sales,
    net
  };
};

/**
 * Calcula el resumen financiero completo
 */
export const calculateSummary = (
  items: InvoiceItem[], 
  serviceChargeRate: number, 
  taxRate: number
): InvoiceSummary => {
  const subtotal = items.reduce((sum, item) => sum + item.net, 0);
  const serviceCharge = subtotal * serviceChargeRate;
  const taxableAmount = subtotal + serviceCharge;
  const tax = taxableAmount * taxRate;
  const total = taxableAmount + tax;
  
  return {
    subtotal,
    serviceCharge,
    tax,
    total
  };
};

/**
 * Formatea números como moneda
 */
export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

/**
 * Calcula y actualiza el total de una factura en la lista principal
 */
export const calculateInvoiceTotal = (invoiceId: string): string => {
  const detailData = invoicesDatabase[invoiceId];
  if (!detailData) return "$0.00";
  
  const calculatedItems = detailData.items.map(calculateItemValues);
  const summary = calculateSummary(
    calculatedItems,
    detailData.serviceChargeRate,
    detailData.taxRate
  );
  
  return formatCurrency(summary.total);
};