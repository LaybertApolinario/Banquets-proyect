import { useState, useEffect, useMemo } from 'react';
import { InvoiceItem, InvoiceDetailData, InvoiceSummary } from '@/types/events';
import { invoicesDatabase } from '@/data/mockEvents';
import { calculateItemValues, calculateSummary } from '@/utils/calculations';

export const useInvoiceCalculator = (invoiceId: string) => {
  const [invoiceData, setInvoiceData] = useState<InvoiceDetailData | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInvoiceData = () => {
      setLoading(true);
      setError(null);
      
      // Simular llamada a API
      setTimeout(() => {
        const data = invoicesDatabase[invoiceId];
        if (data) {
          setInvoiceData(data);
          const calculatedItems = data.items.map(calculateItemValues);
          setItems(calculatedItems);
        } else {
          setError(`Factura ${invoiceId} no encontrada`);
        }
        setLoading(false);
      }, 300);
    };

    loadInvoiceData();
  }, [invoiceId]);

  const recalculateItems = () => {
    setItems(prevItems => prevItems.map(calculateItemValues));
  };

  const summary: InvoiceSummary = useMemo(() => {
    if (!invoiceData) {
      return { subtotal: 0, serviceCharge: 0, tax: 0, total: 0 };
    }
    return calculateSummary(items, invoiceData.serviceChargeRate, invoiceData.taxRate);
  }, [items, invoiceData]);

  const updateItem = (
    id: string, 
    field: keyof Omit<InvoiceItem, 'id' | 'sales' | 'net'>, 
    value: string | number
  ) => {
    setItems(prevItems => {
      return prevItems.map(item => {
        if (item.id !== id) return item;
        const updatedItem = { ...item, [field]: value };
        return calculateItemValues(updatedItem);
      });
    });
  };

  const addNewItem = () => {
    const newId = Date.now().toString();
    const newItem: InvoiceItem = calculateItemValues({
      id: newId,
      category: 'New Category',
      sku: '',
      unitPrice: 0,
      quantity: 0,
      comp: 0
    });
    
    setItems(prevItems => [...prevItems, newItem]);
  };

  return {
    invoiceData,
    items,
    summary,
    loading,
    error,
    updateItem,
    addNewItem,
    recalculateItems
  };
};