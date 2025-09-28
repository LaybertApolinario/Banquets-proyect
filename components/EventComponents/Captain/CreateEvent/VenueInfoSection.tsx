import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { EventFormData } from '@/hooks/useEventForm';

interface VenueSectionProps {
  form: EventFormData;
  onChangeText: (key: keyof EventFormData, value: string) => void;
}

export default function VenueSection({ form, onChangeText }: VenueSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>B) Venue / Stations</Text>
      <TextInput
        style={styles.input}
        placeholder="Venue"
        placeholderTextColor="#888"
        value={form.venue}
        onChangeText={(text) => onChangeText('venue', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Room / Area"
        placeholderTextColor="#888"
        value={form.room}
        onChangeText={(text) => onChangeText('room', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Stations (multi-select)"
        placeholderTextColor="#888"
        value={form.stations}
        onChangeText={(text) => onChangeText('stations', text)}
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