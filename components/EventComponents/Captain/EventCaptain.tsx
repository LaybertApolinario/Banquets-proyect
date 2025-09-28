import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { EventsCaptain } from '@/types/events';
import { useRouter } from "expo-router";
import StatusBadge from '@/components/StatusBadge';

type Props = {
  event: EventsCaptain;
};

export default function EventCaptain({ event }: Props) {
  const router = useRouter();
  return (
    <View style={styles.card}>
      {/* 🔹 Encabezado con título + estado */}
      <View style={styles.row}>
        <Text style={styles.title}>{event.title}</Text>
        {/* <View style={[styles.badge, event.status === 'LIVE' ? styles.badgeLive : styles.badgePlanned]}>
          <Text style={styles.badgeText}>{event.status}</Text>
        </View> */}
        <StatusBadge status={event.status}/>
      </View>

      {/* 🔹 Detalles */}
      <Text style={styles.details}>{event.venue} • {event.startTime} • {event.room}</Text>

      {/* 🔹 Botones */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={()=> router.push({ pathname: '/captain/event/eventDetails/[id]', params: { id: event.id } })}><Text style={styles.actionText}>Open</Text></TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={()=>{
          router.push({ pathname: '/captain/event/requestData/[id]', params: { id: event.id } })
        }}><Text style={styles.actionText}>Requests</Text></TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={()=>{router.push({ pathname: '/captain/event/closeout/[id]', params: { id: event.id } })}}><Text style={styles.actionText}>Closeout</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#132A4A",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  details: { color: '#9CA3AF', fontSize: 13, marginTop: 4 },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  badgeLive: { backgroundColor: '#22C55E' },
  badgePlanned: { backgroundColor: '#3B82F6' },
  badgeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 6,
  },
  actionText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
});
