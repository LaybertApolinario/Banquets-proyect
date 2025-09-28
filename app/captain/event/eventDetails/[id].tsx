// screens/EventDetail.tsx - COMPONENTE PRINCIPAL REFACTORIZADO
/**
 * Pantalla de detalle del evento con acordeón
 * Recibe el evento desde la navegación y muestra su información detallada
 */
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, StatusBar, Alert, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { EventsCaptain } from '@/types/events';
import { AccordionSection as AccordionSectionType } from '@/types/events';
import { useEventAccordion } from '@/hooks/useEventAccordion';
import { mapEventToDetails } from '@/utils/eventDataMapper';
import { useNavigation } from 'expo-router';
// Componentes
import EventHeader from '@/components/EventComponents/Captain/EventDetail/Header';
import AccordionSection from '@/components/EventComponents/Captain/EventDetail/AccordionSection';
import OverviewSection from '@/components/EventComponents/Captain/EventDetail/OverviewSection';
import ServiceTasksSection from '@/components/EventComponents/Captain/EventDetail/ServiceTaskSection';
import TeamShiftsSection from '@/components/EventComponents/Captain/EventDetail/TeamShiftSection';
import InventorySection from '@/components/EventComponents/Captain/EventDetail/InventorySection';

// Mock data - en producción vendría de la API
import { mockEventsCaptain } from '@/data/mockEvents';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/build/Ionicons';

export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isExpanded, toggleSection } = useEventAccordion();

  // Buscar el evento por ID
  const event = mockEventsCaptain.find(e => e.id === id);
  
  if (!event) {
    // En producción, mostrar loading o error state
    return null;
  }

  const eventDetails = mapEventToDetails(event);

  const handleStartService = () => {
    if (eventDetails.status === 'LIVE') {
      Alert.alert('Service Active', 'Event is currently in service');
    } else {
      Alert.alert('Start Service', 'Starting event service...');
    }
  };

  const handlePrintBEO = () => {
    Alert.alert('Print BEO', 'Generating BEO document...');
  };

  const handleShare = () => {
    Alert.alert('Share Event', 'Sharing event details...');
  };

  // Definir las secciones del acordeón
  const sections: AccordionSectionType[] = [
    {
      id: 'overview',
      title: 'Overview',
      subtitle: 'At-a-glance details for quick briefing.',
      isExpandable: true,
      content: <OverviewSection eventDetails={eventDetails} />
    },
    {
      id: 'service-tasks',
      title: 'Service Tasks',
      subtitle: 'Pre-shift checklist & run-ups',
      isExpandable: true,
      content: <ServiceTasksSection />
    },
    {
      id: 'team-shifts',
      title: 'Team & Shifts',
      subtitle: 'Assignments & check-in',
      isExpandable: true,
      content: <TeamShiftsSection captain={eventDetails.captain} />
    },
    {
      id: 'drink-program',
      title: 'Drink Program',
      subtitle: 'Simplified specs for the shift',
      isExpandable: true,
      content: (
        <View style={{ padding: 16 }}>
          <Text style={{ color: 'white' }}>Drink program details would go here...</Text>
        </View>
      )
    },
    {
      id: 'pars-inventory',
      title: 'Pars & Inventory',
      subtitle: 'Under-par items highlighted',
      isExpandable: true,
      content: <InventorySection />
    },
    {
      id: 'captain-notes',
      title: 'Captain Notes',
      subtitle: 'Share context for the team',
      isExpandable: true,
      content: (
        <View style={{ padding: 16 }}>
          <Text style={{ color: 'white', marginBottom: 8 }}>
            • Event-specific notes and instructions
          </Text>
          <Text style={{ color: 'white', marginBottom: 8 }}>
            • Special guest requirements and VIP services
          </Text>
          <Text style={{ color: 'white', marginBottom: 8 }}>
            • End-of-shift cleanup and inventory procedures
          </Text>
        </View>
      )
    }
  ];

  const router = useRouter();
  const navigation = useNavigation();
              // Cambiar título dinámicamente cuando entra a detalle
    useEffect(() => {
      if (eventDetails) {
        navigation.setOptions({
          title: eventDetails.title,
          headerStyle: { backgroundColor: "#1E3A8A" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontWeight: "bold", fontSize: 20 },
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={{ paddingHorizontal: 12 }}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        ),
        });
      }
    },[eventDetails]);

  return (
    <SafeAreaView style={styles.container} edges={[ 'left', 'right', 'bottom' ]}>
      <StatusBar backgroundColor="#1E2A4A" barStyle="light-content" />
      
      <EventHeader
        eventDetails={eventDetails}
        onStartService={handleStartService}
        onPrintBEO={handlePrintBEO}
        onShare={handleShare}
      />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {sections.map(section => (
          <AccordionSection
            key={section.id}
            section={section}
            isExpanded={isExpanded(section.id)}
            onToggle={() => toggleSection(section.id)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:  '#0B1220',
  },
  scrollView: {
    flex: 1,
  },
});