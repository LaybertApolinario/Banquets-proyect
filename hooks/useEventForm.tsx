import { useState } from 'react';

export interface EventFormData {
  beo: string;
  name: string;
  date: string;
  start: string;
  end: string;
  venue: string;
  room: string;
  stations: string;
  tier: string;
  headcount: string;
  service: string;
}

const initialFormState: EventFormData = {
  beo: '',
  name: '',
  date: '',
  start: '',
  end: '',
  venue: '',
  room: '',
  stations: '',
  tier: '',
  headcount: '',
  service: '',
};

export const useEventForm = () => {
  const [form, setForm] = useState<EventFormData>(initialFormState);

  const handleChange = (key: keyof EventFormData, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm(initialFormState);
  };

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!form.beo.trim()) errors.push('BEO es requerido');
    if (!form.name.trim()) errors.push('Nombre del evento es requerido');
    if (!form.date.trim()) errors.push('Fecha es requerida');
    if (!form.venue.trim()) errors.push('Venue es requerido');
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  return {
    form,
    handleChange,
    resetForm,
    validateForm
  };
};