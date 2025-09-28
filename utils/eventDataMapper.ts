
// utils/eventDataMapper.ts
/**
 * Mapea datos de EventsCaptain a EventDetails
 */
import { EventsCaptain } from '@/types/events';
import { EventDetails } from '@/types/events';

export const mapEventToDetails = (event: EventsCaptain): EventDetails => {
  return {
    id: event.id,
    title: event.title,
    venue: event.venue || event.venue.split('•')[0]?.trim() || 'Venue',
    location: event.room || event.venue.split('•')[1]?.trim() || 'Main Area',
    date: formatEventDate(event.date),
    startTime: event.startTime || event.startTime,
    endTime: event.endTime || calculateEndTime(event.startTime || event.startTime),
    status: event.status,
    guestCount: event.headcount || 100,
    captain: 'Current User', // Se obtendría del contexto de usuario
    eventType: event.service || 'Special Event',
    serviceStyle: `${event.tier} Service` || 'Premium Service',
    duration: calculateDuration(event.startTime || event.startTime, event.endTime)
  };
};

const formatEventDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

const calculateEndTime = (startTime: string): string => {
  // Lógica simple para calcular tiempo de fin
  const [hours, minutes] = startTime.split(':');
  const endHour = parseInt(hours) + 5; // Asumir 5 horas de duración
  return `${endHour > 24 ? endHour - 24 : endHour}:${minutes}`;
};

const calculateDuration = (start?: string, end?: string): string => {
  if (!start || !end) return '5 hours';
  
  const startHour = parseInt(start.split(':')[0]);
  const endHour = parseInt(end.split(':')[0]);
  const duration = endHour - startHour;
  
  return `${duration} hours`;
};