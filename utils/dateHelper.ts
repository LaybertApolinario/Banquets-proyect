import { EventsCaptain } from '@/types/events';

export const isToday = (dateString: string): boolean => {
  const today = new Date();
  const eventDate = new Date(dateString);
  
  return (
    eventDate.getDate() === today.getDate() &&
    eventDate.getMonth() === today.getMonth() &&
    eventDate.getFullYear() === today.getFullYear()
  );
};

export const isThisWeek = (dateString: string): boolean => {
  const today = new Date();
  const eventDate = new Date(dateString);
  
  // Obtener el inicio de la semana (domingo)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  // Obtener el fin de la semana (sábado)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  return eventDate >= startOfWeek && eventDate <= endOfWeek;
};

export const filterEventsByTab = (events: EventsCaptain[], activeTab: string): EventsCaptain[] => {
  switch (activeTab) {
    case 'today':
      return events.filter(event => isToday(event.date));
    case 'week':
      return events.filter(event => isThisWeek(event.date));
    case 'all':
    default:
      return events;
  }
};