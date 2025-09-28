// components/EventAccordion/sections/TeamShiftsSection.tsx
/**
 * Sección de equipo y turnos
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TeamMember } from '@/types/events';

interface TeamShiftsSectionProps {
  captain: string;
  teamMembers?: TeamMember[];
}

export default function TeamShiftsSection({ captain, teamMembers }: TeamShiftsSectionProps) {
  const defaultTeam: TeamMember[] = [
    { name: captain, role: 'Lead Bartender & Service', shift: 'Main Service' },
    { name: 'Staff Member 1', role: 'Bar Support', shift: 'Main Service' },
    { name: 'Staff Member 2', role: 'Runner & Setup', shift: 'Setup Crew' },
  ];

  const team = teamMembers || defaultTeam;
  const shifts = team.reduce((acc, member) => {
    const shift = member.shift || 'Main Service';
    if (!acc[shift]) acc[shift] = [];
    acc[shift].push(member);
    return acc;
  }, {} as Record<string, TeamMember[]>);

  return (
    <View style={styles.sectionContent}>
      {Object.entries(shifts).map(([shiftName, members]) => (
        <View key={shiftName} style={styles.shiftSection}>
          <Text style={styles.shiftTitle}>{shiftName}</Text>
          {members.map((member, index) => (
            <View key={index} style={styles.teamMember}>
              <Text style={styles.memberName}>
                {member.name} {member.name === captain ? '(Captain)' : ''}
              </Text>
              <Text style={styles.memberRole}>{member.role}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContent: {
    padding: 16,
  },
  shiftSection: {
    marginBottom: 16,
  },
  shiftTitle: {
    color: '#00BCD4',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  teamMember: {
    marginBottom: 8,
    paddingLeft: 8,
  },
  memberName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  memberRole: {
    color: '#B0BEC5',
    fontSize: 12,
    marginTop: 2,
  },
});