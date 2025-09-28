import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Botón de tab memoizado
const TabButton = memo(({ 
  title, 
  isActive, 
  onPress 
}: { 
  title: string; 
  isActive: boolean; 
  onPress: () => void; 
}) => (
  <TouchableOpacity 
    style={[styles.headerButton, isActive && styles.activeHeaderButton]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[styles.headerButtonText, isActive && styles.activeHeaderButtonText]}>
      {title}
    </Text>
  </TouchableOpacity>
));

export default TabButton;
const styles = StyleSheet.create({
  headerButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 6,
    borderRadius: 6,
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4A5568',
  },
  activeHeaderButton: {
    backgroundColor: '#3182CE',
    borderColor: '#3182CE',
  },
  headerButtonText: {
    color: '#A0AEC0',
    fontSize: 13,
    fontWeight: '500',
  },
  activeHeaderButtonText: {
    color: 'white',
  },
});
