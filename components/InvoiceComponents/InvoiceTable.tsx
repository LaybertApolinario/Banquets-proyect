import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { InvoiceItem } from '@/types/events';
import { formatCurrency } from '@/utils/calculations';

interface InvoiceTableProps {
  items: InvoiceItem[];
  isEditable: boolean;
  onUpdateItem: (id: string, field: keyof Omit<InvoiceItem, 'id' | 'sales' | 'net'>, value: string | number) => void;
  onAddNewItem: () => void;
}

export default function InvoiceTable({
  items,
  isEditable,
  onUpdateItem,
  onAddNewItem
}: InvoiceTableProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.tableScrollView}
    >
      <View style={styles.tableWrapper}>
        {/* Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.categoryHeaderCell]}>Category</Text>
          <Text style={[styles.headerCell, styles.skuHeaderCell]}>SKU</Text>
          <Text style={[styles.headerCell, styles.numberHeaderCell]}>Unit Price</Text>
          <Text style={[styles.headerCell, styles.numberHeaderCell]}>Quantity</Text>
          <Text style={[styles.headerCell, styles.numberHeaderCell]}>Sales</Text>
          <Text style={[styles.headerCell, styles.numberHeaderCell]}>Comp</Text>
          <Text style={[styles.headerCell, styles.numberHeaderCell]}>Net</Text>
        </View>

        {/* Items */}
        <View style={styles.itemsContainer}>
          {items.map(item => (
            <InvoiceTableRow
              key={item.id}
              item={item}
              isEditable={isEditable}
              onUpdateItem={onUpdateItem}
            />
          ))}
          
          {isEditable && (
            <TouchableOpacity 
              style={styles.addRowButton}
              onPress={onAddNewItem}
              activeOpacity={0.7}
            >
              <Text style={styles.addRowButtonText}>+ Add New Item</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

// Componente individual para cada fila de la tabla
interface InvoiceTableRowProps {
  item: InvoiceItem;
  isEditable: boolean;
  onUpdateItem: (id: string, field: keyof Omit<InvoiceItem, 'id' | 'sales' | 'net'>, value: string | number) => void;
}

function InvoiceTableRow({ item, isEditable, onUpdateItem }: InvoiceTableRowProps) {
  return (
    <View style={styles.itemRowHorizontal}>
      {isEditable ? (
        <TextInput
          style={[styles.cellInput, styles.categoryCell]}
          value={item.category}
          onChangeText={(text) => onUpdateItem(item.id, 'category', text)}
          returnKeyType="next"
        />
      ) : (
        <Text style={[styles.cellValue, styles.categoryCell]}>{item.category}</Text>
      )}
      
      {isEditable ? (
        <TextInput
          style={[styles.cellInput, styles.skuCell]}
          value={item.sku}
          onChangeText={(text) => onUpdateItem(item.id, 'sku', text)}
          returnKeyType="next"
        />
      ) : (
        <Text style={[styles.cellValue, styles.skuCell]}>{item.sku || '-'}</Text>
      )}
      
      {isEditable ? (
        <TextInput
          style={[styles.cellInput, styles.numberCell]}
          value={item.unitPrice.toString()}
          onChangeText={(text) => onUpdateItem(item.id, 'unitPrice', parseFloat(text) || 0)}
          keyboardType="numeric"
          selectTextOnFocus
          returnKeyType="next"
        />
      ) : (
        <Text style={[styles.cellValue, styles.numberCell]}>{formatCurrency(item.unitPrice)}</Text>
      )}
      
      {isEditable ? (
        <TextInput
          style={[styles.cellInput, styles.numberCell]}
          value={item.quantity.toString()}
          onChangeText={(text) => onUpdateItem(item.id, 'quantity', parseInt(text) || 0)}
          keyboardType="numeric"
          selectTextOnFocus
          returnKeyType="next"
        />
      ) : (
        <Text style={[styles.cellValue, styles.numberCell]}>{item.quantity}</Text>
      )}
      
      <Text style={[styles.cellValue, styles.numberCell, styles.calculatedValue]}>
        {formatCurrency(item.sales)}
      </Text>
      
      {isEditable ? (
        <TextInput
          style={[styles.cellInput, styles.numberCell]}
          value={item.comp.toString()}
          onChangeText={(text) => onUpdateItem(item.id, 'comp', parseInt(text) || 0)}
          keyboardType="numeric"
          selectTextOnFocus
          returnKeyType="done"
        />
      ) : (
        <Text style={[styles.cellValue, styles.numberCell]}>{item.comp}</Text>
      )}
      
      <Text style={[styles.cellValue, styles.numberCell, styles.calculatedValue]}>
        {formatCurrency(item.net)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tableScrollView: {
    marginBottom: 16,
  },
  tableWrapper: {
    minWidth: 600,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#132A4A",
    backgroundColor: "#132A4A",
    paddingHorizontal: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerCell: {
    color: '#A0AEC0',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  categoryHeaderCell: {
    width: 120,
    textAlign: 'left',
  },
  skuHeaderCell: {
    width: 80,
  },
  numberHeaderCell: {
    width: 85,
  },
  itemsContainer: {
    backgroundColor: '#132A4A',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  itemRowHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#4A5568',
  },
  cellValue: {
    color: 'white',
    fontSize: 13,
    paddingHorizontal: 4,
  },
  calculatedValue: {
    color: '#ffffffff',
    fontWeight: '500',
  },
  cellInput: {
    backgroundColor: '#4A5568',
    color: 'white',
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    fontSize: 13,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#6B7280',
  },
  categoryCell: {
    width: 120,
    textAlign: 'left',
  },
  skuCell: {
    width: 80,
    textAlign: 'center',
  },
  numberCell: {
    width: 85,
    textAlign: 'center',
  },
  addRowButton: {
    backgroundColor: '#38A169',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  addRowButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});