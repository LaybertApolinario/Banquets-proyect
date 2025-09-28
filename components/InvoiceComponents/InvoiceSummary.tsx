import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { InvoiceSummary as ISummary, InvoiceDetailData } from '@/types/events';
import { formatCurrency } from '@/utils/calculations';

interface InvoiceSummaryProps {
  summary: ISummary;
  invoiceData: InvoiceDetailData;
}

export default function InvoiceSummary({ summary, invoiceData }: InvoiceSummaryProps) {
  return (
    <View style={styles.summaryContainer}>
      <Text style={styles.summaryTitle}>💰 Summary (Auto-calculated)</Text>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal</Text>
        <Text style={styles.summaryValue}>{formatCurrency(summary.subtotal)}</Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>
          Service Charge ({(invoiceData.serviceChargeRate * 100).toFixed(0)}%)
        </Text>
        <Text style={styles.summaryValue}>{formatCurrency(summary.serviceCharge)}</Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>
          Tax ({(invoiceData.taxRate * 100).toFixed(1)}%)
        </Text>
        <Text style={styles.summaryValue}>{formatCurrency(summary.tax)}</Text>
      </View>
      
      <View style={[styles.summaryRow, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatCurrency(summary.total)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryContainer: {
    backgroundColor: "#132A4A",
    padding: 14,
    borderRadius: 8,
    marginBottom: 20,
  },
  summaryTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    color: '#A0AEC0',
    fontSize: 13,
  },
  summaryValue: {
    color: '#ffffffff',
    fontSize: 13,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#4A5568',
    marginTop: 6,
    paddingTop: 8,
  },
  totalLabel: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  totalValue: {
    color: '#ffffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});