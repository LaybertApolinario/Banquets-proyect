/**
 * Componente reutilizable para cada sección del acordeón
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AccordionSection as AccordionSectionType } from '@/types/events';

interface AccordionSectionProps {
  section: AccordionSectionType;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function AccordionSection({ 
  section, 
  isExpanded, 
  onToggle 
}: AccordionSectionProps) {
  return (
    <View style={styles.accordionSection}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => section.isExpandable && onToggle()}
        activeOpacity={0.7}
      >
        <View style={styles.sectionHeaderContent}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
        </View>
        {section.isExpandable && (
          <Text style={[
            styles.expandIcon,
            isExpanded && styles.expandIconRotated
          ]}>
            ▼
          </Text>
        )}
      </TouchableOpacity>
      
      {section.isExpandable && isExpanded && (
        <View style={styles.sectionContentWrapper}>
          {section.content}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  accordionSection: {
    borderBottomWidth: 1,
    borderBottomColor:  '#0B1220',
  },
  sectionHeader: {
    backgroundColor: '#2A3F5F',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeaderContent: {
    flex: 1,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  sectionSubtitle: {
    color: '#B0BEC5',
    fontSize: 13,
  },
  expandIcon: {
    color: '#B0BEC5',
    fontSize: 12,
    marginLeft: 8,
  },
  expandIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  sectionContentWrapper: {
    backgroundColor: '#1E2A4A',
  },
});