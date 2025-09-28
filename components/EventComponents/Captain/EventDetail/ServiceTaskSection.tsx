// components/EventAccordion/sections/ServiceTasksSection.tsx
/**
 * Sección de tareas de servicio
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const defaultTasks = [
  'Set up bar stations and inventory check',
  'Arrange glassware and service tools',
  'Prepare specialty items and accompaniments',
  'Brief team on menu and service standards',
  'Test POS systems and payment processing',
  'Coordinate with kitchen and event staff',
  'Final venue walkthrough and setup verification'
];

interface ServiceTasksSectionProps {
  tasks?: string[];
}

export default function ServiceTasksSection({ tasks = defaultTasks }: ServiceTasksSectionProps) {
  return (
    <View style={styles.sectionContent}>
      {tasks.map((task, index) => (
        <View key={index} style={styles.taskItem}>
          <View style={styles.taskBullet} />
          <Text style={styles.taskText}>{task}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContent: {
    padding: 16,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  taskBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00BCD4',
    marginTop: 6,
    marginRight: 10,
  },
  taskText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
});
