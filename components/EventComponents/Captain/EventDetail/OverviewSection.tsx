/**
 * Sección de Overview con información general del evento
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EventDetails } from '@/types/events';

interface OverviewSectionProps {
  eventDetails: EventDetails;
}

export default function OverviewSection({ eventDetails }: OverviewSectionProps) {
  return (
    <View style={styles.sectionContent}>
      <View style={styles.contentRow}>
        <Text style={styles.contentLabel}>Event Type:</Text>
        <Text style={styles.contentValue}>{eventDetails.eventType || 'Special Event'}</Text>
      </View>
      <View style={styles.contentRow}>
        <Text style={styles.contentLabel}>Venue:</Text>
        <Text style={styles.contentValue}>{eventDetails.venue} - {eventDetails.location}</Text>
      </View>
      <View style={styles.contentRow}>
        <Text style={styles.contentLabel}>Expected Duration:</Text>
        <Text style={styles.contentValue}>{eventDetails.duration || 'TBD'}</Text>
      </View>
      <View style={styles.contentRow}>
        <Text style={styles.contentLabel}>Service Style:</Text>
        <Text style={styles.contentValue}>{eventDetails.serviceStyle || 'Premium Bar Service'}</Text>
      </View>
      <View style={styles.contentRow}>
        <Text style={styles.contentLabel}>Guest Count:</Text>
        <Text style={styles.contentValue}>{eventDetails.guestCount} guests</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContent: {
    padding: 16,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  contentLabel: {
    color: '#B0BEC5',
    fontSize: 14,
    flex: 1,
  },
  contentValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
});