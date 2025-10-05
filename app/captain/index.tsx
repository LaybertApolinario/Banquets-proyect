/**
 * Pantalla principal con botón Back y modal CreateEvent
 * FIX: quitamos safe area top (edges), reducimos paddings/márgenes
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
import { useRouter } from 'expo-router';
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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('today');
  const [events, setEvents] = useState<EventsCaptain[]>(mockEventsCaptain);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredEvents = useMemo(
    () => filterEventsByTab(events, activeTab),
    [events, activeTab]
  );

  const handleCreateEvent = (eventData: any) => {
    const newEvent: EventsCaptain = {
      id: eventData.id,
      title: eventData.name,
      room: eventData.room,
      status: 'PLANNED',
      beo: eventData.beo,
      date: eventData.date,
      startTime: eventData.start,
      endTime: eventData.end,
      venue: eventData.venue,
      headcount: Number(eventData.headcount),
      tier: eventData.pack ?? eventData.tier,
      service: eventData.service,
      stations: eventData.stations,
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const handleBack = () => {
    if (showCreateModal) {
      setShowCreateModal(false);
      return;
    }
    try {
      router.back();
    } catch {}
  };

  return (
    // 👇 IMPORTANT: no aplicamos padding top porque el header nativo ya lo hace
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle={'light-content'} backgroundColor={'#0B1220'} />

      {/* Header compacto */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Text style={styles.backTxt}>◀</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Events</Text>

        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Text style={styles.createButtonText}>Create Event</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs (menos espacio arriba) */}
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

      {/* Modal */}
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

  // Header más arriba y más “tight”
  header: {
    paddingHorizontal: 16,
    paddingTop: 6,      // pequeño
    paddingBottom: 6,   // pequeño
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backTxt: { color: '#FFF', fontWeight: '900' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },

  createButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  createButtonText: { fontSize: 14, fontWeight: 'bold', color: '#FFF' },

  // Tabs con menos separación del header
  tabsContainer: {
    flexDirection: 'row',
    paddingTop: 10,       // antes 20
    paddingHorizontal: 16,
    marginBottom: 14,     // antes 20
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 8,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeTabButton: { backgroundColor: '#0EA5E9' },
  tabText: { fontSize: 14, fontWeight: '500', color: '#9CA3AF' },
  activeTabText: { color: '#ffffff' },

  listContent: { paddingHorizontal: 16, paddingBottom: 20 },
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
