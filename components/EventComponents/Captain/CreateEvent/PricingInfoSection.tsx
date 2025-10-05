import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { EventFormData } from '@/hooks/useEventForm';

export type PackName =
  | 'Superior'
  | 'Premium'
  | 'Superior Cash'
  | 'Premium Cash'
  | 'San Destin'
  | 'San Destin Cash'
  | 'Personalizado';

interface PricingSectionProps {
  form: EventFormData;
  onChangeText: (key: keyof EventFormData, value: string) => void;

  // NUEVO: controlar pack + liquorPaid desde el modal
  pack: PackName;
  onChangePack: (p: PackName) => void;
  liquorPaid: string;
  onChangeLiquorPaid: (v: string) => void;
}

const PACKS: PackName[] = [
  'Superior',
  'Premium',
  'Superior Cash',
  'Premium Cash',
  'San Destin',
  'San Destin Cash',
  'Personalizado',
];

export default function PricingSection({
  form,
  onChangeText,
  pack,
  onChangePack,
  liquorPaid,
  onChangeLiquorPaid,
}: PricingSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>C) Pricing & Headcount</Text>

      {/* Pack selector */}
      <Text style={styles.label}>Type Pack</Text>
      <View style={styles.packRow}>
        {PACKS.map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.packBtn, pack === p && styles.packBtnActive]}
            onPress={() => onChangePack(p)}
          >
            <Text style={[styles.packText, pack === p && styles.packTextActive]}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Headcount y service (ya existentes) */}
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

      {/* Liquor package paid */}
      <TextInput
        style={styles.input}
        placeholder="Liquor package paid (USD)"
        placeholderTextColor="#888"
        value={liquorPaid}
        onChangeText={onChangeLiquorPaid}
        keyboardType="numeric"
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
  label: {
    color: '#9CA3AF',
    marginBottom: 6,
    fontSize: 12,
    fontWeight: '600',
  },
  packRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  packBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  packBtnActive: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  packText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
  },
  packTextActive: {
    color: '#FFF',
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
