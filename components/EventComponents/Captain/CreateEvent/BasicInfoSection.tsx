import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { EventFormData } from '@/hooks/useEventForm';

interface BasicInfoSectionProps {
  form: EventFormData;
  onChangeText: (key: keyof EventFormData, value: string) => void;
}

export default function BasicInfoSection({ form, onChangeText }: BasicInfoSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>A) Basic info</Text>
      <TextInput
        style={styles.input}
        placeholder="BEO #"
        placeholderTextColor="#888"
        value={form.beo}
        onChangeText={(text) => onChangeText('beo', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Event name"
        placeholderTextColor="#888"
        value={form.name}
        onChangeText={(text) => onChangeText('name', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Date (YYYY-MM-DD)"
        placeholderTextColor="#888"
        value={form.date}
        onChangeText={(text) => onChangeText('date', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Start time"
        placeholderTextColor="#888"
        value={form.start}
        onChangeText={(text) => onChangeText('start', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="End time"
        placeholderTextColor="#888"
        value={form.end}
        onChangeText={(text) => onChangeText('end', text)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#132A4A',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#0B1220',
    color: '#FFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
});