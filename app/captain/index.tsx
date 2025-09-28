/**
 * Pantalla principal sin modals - LIMPIA
 */
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EventCaptain from '@/components/EventComponents/Captain/EventCaptain';
import { mockEventsCaptain } from '@/data/mockEvents';
import { TabOption, EventsCaptain } from '@/types/events';
import { filterEventsByTab } from '@/utils/dateHelper';
import CreateEventModal from '@/components/EventComponents/Captain/CreateEvent/CreateEventModal';

const tabOptions: TabOption[] = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'Week' },
  { key: 'all', label: 'All' },
];

export default function Events() {
  const [activeTab, setActiveTab] = useState<string>('today');
  const [events, setEvents] = useState<EventsCaptain[]>(mockEventsCaptain);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filtrar eventos según tab activo
  const filteredEvents = useMemo(() => {
    return filterEventsByTab(events, activeTab);
  }, [events, activeTab]);

  const handleCreateEvent = (eventData: any) => {
    const newEvent: EventsCaptain = {
      id: eventData.id,
      title: eventData.name,
      // location: eventData.venue,
      // time: eventData.start,
      room: eventData.room,
      status: 'PLANNED',
      beo: eventData.beo,
      date: eventData.date,
      startTime: eventData.start,
      endTime: eventData.end,
      venue: eventData.venue,
      headcount: Number(eventData.headcount),
      tier: eventData.tier,
      service: eventData.service,
      stations: eventData.stations,
    };

    setEvents(prev => [...prev, newEvent]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} backgroundColor={'#0B1220'} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Events</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Text style={styles.createButtonText}>Create Event</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs con contador */}
      <View style={styles.tabsContainer}>
        {tabOptions.map(tab => {
          const isActive = activeTab === tab.key;
          const eventCount = filterEventsByTab(events, tab.key).length;
          
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, isActive && styles.activeTabButton]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab.label} ({eventCount})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Lista filtrada */}
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventCaptain event={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No hay eventos para {
                activeTab === 'today' ? 'hoy' : 
                activeTab === 'week' ? 'esta semana' : 
                'mostrar'
              }
            </Text>
          </View>
        }
      />

      {/* Modal separado */}
      <CreateEventModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateEvent={handleCreateEvent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1220' },
  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  createButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  createButtonText: { fontSize: 14, fontWeight: 'bold', color: '#FFF' },
  tabsContainer: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 8,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeTabButton: { backgroundColor: '#0EA5E9' },
  tabText: { fontSize: 14, fontWeight: '500', color: '#9CA3AF' },
  activeTabText: { color: '#ffffff' },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 18,
    textAlign: 'center',
  },
});