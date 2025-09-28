/**
 * Hook para manejar la lógica del acordeón
 */
import { useState } from 'react';

export const useEventAccordion = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isExpanded = (sectionId: string) => expandedSections.includes(sectionId);

  const expandAll = () => {
    const allSectionIds = ['overview', 'service-tasks', 'team-shifts', 'drink-program', 'pars-inventory', 'captain-notes'];
    setExpandedSections(allSectionIds);
  };

  const collapseAll = () => {
    setExpandedSections([]);
  };

  return {
    expandedSections,
    toggleSection,
    isExpanded,
    expandAll,
    collapseAll
  };
};
