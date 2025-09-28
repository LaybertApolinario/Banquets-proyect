import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { EventFormData } from '@/hooks/useEventForm';

interface PricingSectionProps {
  form: EventFormData;
  onChangeText: (key: keyof EventFormData, value: string) => void;
}

export default function PricingSection({ form, onChangeText }: PricingSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>C) Pricing & Headcount</Text>
      <TextInput
        style={styles.input}
        placeholder="Tier"
        placeholderTextColor="#888"
        value={form.tier}
        onChangeText={(text) => onChangeText('tier', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Headcount (GTD)"
        placeholderTextColor="#888"
        value={form.headcount}
        onChangeText={(text) => onChangeText('headcount', text)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Service type"
        placeholderTextColor="#888"
        value={form.service}
        onChangeText={(text) => onChangeText('service', text)}
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
