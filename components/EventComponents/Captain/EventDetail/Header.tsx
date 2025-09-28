/**
 * Header del evento con información principal y botones de acción
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { EventDetails } from '@/types/events';

interface EventHeaderProps {
  eventDetails: EventDetails;
  onStartService?: () => void;
  onPrintBEO?: () => void;
  onShare?: () => void;
}

export default function EventHeader({ 
  eventDetails, 
  onStartService, 
  onPrintBEO, 
  onShare 
}: EventHeaderProps) {
  const getStatusColor = (status: string) => {
    return status === 'LIVE' ? '#4CAF50' : '#FF9800';
  };

  return (
    <View style={styles.eventHeader}>
      <Text style={styles.eventTitle}>{eventDetails.title}</Text>
      <Text style={styles.eventLocation}>{eventDetails.venue} - {eventDetails.location}</Text>
      <Text style={styles.eventDateTime}>
        {eventDetails.date} • {eventDetails.startTime}-{eventDetails.endTime}
      </Text>
      
      <View style={styles.eventMetrics}>
        <View style={[styles.liveIndicator, { backgroundColor: getStatusColor(eventDetails.status) }]}>
          <Text style={styles.liveText}>{eventDetails.status}</Text>
        </View>
        <View style={styles.guestCount}>
          <Text style={styles.guestText}>{eventDetails.guestCount} Guests</Text>
        </View>
        <View style={styles.captainInfo}>
          <Text style={styles.captainText}>Captain: {eventDetails.captain}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.startServiceBtn} onPress={onStartService}>
          <Text style={styles.startServiceText}>
            {eventDetails.status === 'LIVE' ? 'In Service' : 'Start Service'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.printBeoBtn} onPress={onPrintBEO}>
          <Text style={styles.printBeoText}>Print BEO</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareBtn} onPress={onShare}>
          <Text style={styles.shareText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  eventHeader: {
    backgroundColor: '#0B1220',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#0B1220',
  },
  eventTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventLocation: {
    color: '#B0BEC5',
    fontSize: 14,
    marginBottom: 2,
  },
  eventDateTime: {
    color: '#B0BEC5',
    fontSize: 14,
    marginBottom: 12,
  },
  eventMetrics: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  liveIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  guestCount: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  guestText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  captainInfo: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  captainText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  startServiceBtn: {
    backgroundColor: '#00BCD4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
  },
  startServiceText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  printBeoBtn: {
    backgroundColor: '#455A64',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  printBeoText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  shareBtn: {
    backgroundColor: '#455A64',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  shareText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
