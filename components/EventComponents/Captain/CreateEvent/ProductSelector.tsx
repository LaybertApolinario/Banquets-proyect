import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
import { Product, ProductAssignment } from '@/hooks/useProductAssignment';

interface ProductSelectorProps {
  availableProducts: Product[];
  productAssignments: ProductAssignment[];
  selectedSku: string;
  searchText: string;
  onSelectSku: (sku: string) => void;
  onSearchChange: (text: string) => void;
}

export default function ProductSelector({
  availableProducts,
  productAssignments,
  selectedSku,
  searchText,
  onSelectSku,
  onSearchChange
}: ProductSelectorProps) {
  const filteredProducts = availableProducts.filter(product =>
    product.sku.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <Text style={styles.subTitle}>Add Product Assignment:</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        placeholderTextColor="#888"
        value={searchText}
        onChangeText={onSearchChange}
      />
      
      <View style={styles.productSelectorContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productSelector}>
          {filteredProducts.map((product, index) => {
            const assignedQuantity = productAssignments
              .filter(p => p.sku === product.sku)
              .reduce((sum, p) => sum + p.assign, 0);
            const available = product.available - assignedQuantity;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.productOption,
                  selectedSku === product.sku && styles.productOptionActive,
                ]}
                onPress={() => onSelectSku(product.sku)}
              >
                <Text style={[
                  styles.productOptionText,
                  selectedSku === product.sku && styles.productOptionTextActive,
                ]}>
                  {product.sku}
                </Text>
                <Text style={styles.productAvailableText}>
                  ({available} available)
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  subTitle: {
    color: '#FFF',
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 10,
    fontSize: 14,
  },
  searchInput: {
    backgroundColor: '#0B1220',
    color: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2D3748',
    fontSize: 14,
  },
  productSelectorContainer: {
    marginBottom: 15,
  },
  productSelector: {
    maxHeight: 120,
  },
  productOption: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 10,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2D3748',
    minWidth: 150,
  },
  productOptionActive: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  productOptionText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  productOptionTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  productAvailableText: {
    color: '#9CA3AF',
    fontSize: 10,
    marginTop: 2,
  },
});