// components/EventAccordion/sections/InventorySection.tsx
/**
 * Sección de inventario y pares
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { InventoryItem } from '@/types/events';

interface InventorySectionProps {
  items?: InventoryItem[];
}

const defaultItems: InventoryItem[] = [
  { name: 'Glassware (Wine)', status: 'in-stock', category: 'Critical Items' },
  { name: 'Cocktail Napkins', status: 'in-stock', category: 'Critical Items' },
  { name: 'Ice', status: 'under-par', category: 'Critical Items' },
  { name: 'Specialty Garnishes', status: 'under-par', category: 'Critical Items' },
];

export default function InventorySection({ items = defaultItems }: InventorySectionProps) {
  const categories = items.reduce((acc, item) => {
    const category = item.category || 'General Items';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, InventoryItem[]>);

  return (
    <View style={styles.sectionContent}>
      {Object.entries(categories).map(([categoryName, categoryItems]) => (
        <View key={categoryName} style={styles.inventorySection}>
          <Text style={styles.inventoryTitle}>{categoryName}</Text>
          {categoryItems.map((item, index) => (
            <View key={index} style={styles.inventoryItem}>
              <Text style={styles.itemName}>{item.name}</Text>
              {item.status === 'in-stock' ? (
                <Text style={styles.itemStatus}>✓ In Stock</Text>
              ) : (
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Under Par</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContent: {
    padding: 16,
  },
  inventorySection: {
    marginBottom: 16,
  },
  inventoryTitle: {
    color: '#00BCD4',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  inventoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 8,
  },
  itemName: {
    color: 'white',
    fontSize: 14,
    flex: 1,
  },
  itemStatus: {
    color: '#4CAF50',
    fontSize: 12,
  },
  statusBadge: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
});