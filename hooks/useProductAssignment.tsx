import { useState } from 'react';
import { Alert } from 'react-native';

export interface ProductAssignment {
  id: string;
  sku: string;
  available: number;
  assign: number;
  assignedStaff: string[];
  split: string;
}

export interface Product {
  sku: string;
  available: number;
}

export const useProductAssignments = (availableProducts: Product[]) => {
  const [productAssignments, setProductAssignments] = useState<ProductAssignment[]>([
    {
      id: '1',
      sku: "Tito's 1.75L",
      available: 48,
      assign: 12,
      assignedStaff: ['Joy', 'Alex'],
      split: 'Joy 6 + Alex 6'
    },
    {
      id: '2',
      sku: 'Dom Pérignon 750ml',
      available: 18,
      assign: 6,
      assignedStaff: ['Soncha', 'Mia'],
      split: 'Soncha 3 + Mia 3'
    }
  ]);

  const validateAvailability = (sku: string, quantity: number, excludeId?: string) => {
    const product = availableProducts.find(p => p.sku === sku);
    if (!product) return { valid: false, message: 'Producto no encontrado' };
    
    const currentlyAssigned = productAssignments
      .filter(p => p.sku === sku && p.id !== excludeId)
      .reduce((sum, p) => sum + p.assign, 0);
    
    const availableToAssign = product.available - currentlyAssigned;
    
    if (quantity > availableToAssign) {
      return { 
        valid: false, 
        message: `Solo hay ${availableToAssign} disponibles (${product.available} total - ${currentlyAssigned} asignados)` 
      };
    }
    
    return { valid: true, message: '' };
  };

  const generateSplit = (staff: string[], quantity: number) => {
    if (staff.length === 0) return '';
    
    const perPerson = Math.floor(quantity / staff.length);
    const remainder = quantity % staff.length;
    
    return staff.map((person, index) => {
      const amount = perPerson + (index < remainder ? 1 : 0);
      return `${person} ${amount}`;
    }).join(' + ');
  };

  const addAssignment = (sku: string, quantity: number, staff: string[]) => {
    if (!sku.trim() || quantity <= 0) {
      Alert.alert('Error', 'SKU y cantidad son requeridos');
      return false;
    }

    if (staff.length === 0) {
      Alert.alert('Error', 'Selecciona al menos un empleado');
      return false;
    }

    const validation = validateAvailability(sku, quantity);
    if (!validation.valid) {
      Alert.alert('Error', validation.message);
      return false;
    }

    const product = availableProducts.find(p => p.sku === sku);
    const split = generateSplit(staff, quantity);

    const newAssignment: ProductAssignment = {
      id: Date.now().toString(),
      sku,
      available: product?.available || 0,
      assign: quantity,
      assignedStaff: [...staff],
      split
    };

    setProductAssignments(prev => [...prev, newAssignment]);
    return true;
  };

  const updateAssignment = (id: string, quantity: number, staff: string[]) => {
    const assignment = productAssignments.find(p => p.id === id);
    if (!assignment) return false;

    if (quantity <= 0 || staff.length === 0) {
      Alert.alert('Error', 'Cantidad y staff son requeridos');
      return false;
    }

    const validation = validateAvailability(assignment.sku, quantity, id);
    if (!validation.valid) {
      Alert.alert('Error', validation.message);
      return false;
    }

    const split = generateSplit(staff, quantity);

    setProductAssignments(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, assign: quantity, assignedStaff: [...staff], split }
          : p
      )
    );
    return true;
  };

  const deleteAssignment = (id: string) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar esta asignación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => setProductAssignments(prev => prev.filter(p => p.id !== id))
        }
      ]
    );
  };

  return {
    productAssignments,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    validateAvailability,
    generateSplit
  };
};