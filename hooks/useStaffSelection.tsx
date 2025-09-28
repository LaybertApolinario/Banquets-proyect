import { useState } from 'react';

export interface StaffMember {
  id: string;
  name: string;
  available: boolean;
}

export const useStaffSelection = (maxSelection: number = 4) => {
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);

  const toggleStaff = (name: string) => {
    if (selectedStaff.includes(name)) {
      setSelectedStaff(prev => prev.filter(s => s !== name));
    } else if (selectedStaff.length < maxSelection) {
      setSelectedStaff(prev => [...prev, name]);
    }
  };

  const resetSelection = () => {
    setSelectedStaff([]);
  };

  const isSelected = (name: string) => selectedStaff.includes(name);
  const canSelect = (name: string) => isSelected(name) || selectedStaff.length < maxSelection;

  return {
    selectedStaff,
    toggleStaff,
    resetSelection,
    isSelected,
    canSelect
  };
};
