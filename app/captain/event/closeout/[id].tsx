import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';

interface InventoryItem {
  description: string;
  assigned: number;
  returned: number;
  used: number;
  drinks?: number;
  notes?: string;
}

const CloseoutScreen: React.FC = () => {
  const inventoryData: InventoryItem[] = [
    {
      description: "Tito's 1.75L",
      assigned: 12,
      returned: 8,
      used: 4,
      drinks: 125,
    },
    {
      description: "Dom Pérignon 750ml",
      assigned: 6,
      returned: 5,
      used: 1,
      drinks: 5,
    },
    {
      description: "Michelob Ultra 12oz",
      assigned: 48,
      returned: 28,
      used: 20,
      drinks: 20,
      notes: "break: 1",
    },
    {
      description: "Lemons (lb)",
      assigned: 12,
      returned: 6,
      used: 6,
      drinks: 0,
      notes: "garnish",
    },
  ];

  const eventInfo = {
    beo: "152,429",
    location: "Ballroom A",
    time: "Thu 6-10 PM",
    tier: "PREMIUM"
  };

  const summary = {
    liquor: "L-bott 5 bt",
    wine: "Wine 1 bt", 
    beer: "Beer 20 bt",
    lemons: "Lemons 6 lb"
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a2332" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Closeout</Text>
        <View style={styles.eventInfo}>
          <Text style={styles.eventText}>
            BEO {eventInfo.beo} • {eventInfo.location} • {eventInfo.time} • Tier: {eventInfo.tier}
          </Text>
        </View>
      </View>

      {/* Summary Section */}
      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>Summary</Text>
        <Text style={styles.summarySubtitle}>
          Used: {summary.liquor} • {summary.wine} • {summary.beer} • {summary.lemons}
        </Text>
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.headerText, styles.descriptionColumn]}>Item Description</Text>
        <Text style={[styles.headerText, styles.numberColumn]}>Assigned</Text>
        <Text style={[styles.headerText, styles.numberColumn]}>Returned</Text>
        <Text style={[styles.headerText, styles.numberColumn]}>Used</Text>
        <Text style={[styles.headerText, styles.numberColumn]}>#Drinks</Text>
        <Text style={[styles.headerText, styles.notesColumn]}>Notes</Text>
      </View>

      {/* Table Content */}
      <ScrollView style={styles.tableContent}>
        {inventoryData.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.cellText, styles.descriptionColumn]}>{item.description}</Text>
            <Text style={[styles.cellText, styles.numberColumn]}>{item.assigned}</Text>
            <Text style={[styles.cellText, styles.numberColumn]}>{item.returned}</Text>
            <Text style={[styles.cellText, styles.numberColumn]}>{item.used}</Text>
            <Text style={[styles.cellText, styles.numberColumn]}>{item.drinks || 0}</Text>
            <Text style={[styles.cellText, styles.notesColumn]}>{item.notes || ''}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Actions Section */}
      <View style={styles.actionsSection}>
        <Text style={styles.actionsTitle}>Actions</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.confirmButton]}>
            <Text style={styles.buttonText}>Confirm Returns</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.generateButton]}>
            <Text style={styles.buttonText}>Generate Hosted Op</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.approveButton]}>
            <Text style={styles.buttonText}>Approve Closeout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a2332',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#1a2332',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  eventInfo: {
    marginTop: 4,
  },
  eventText: {
    fontSize: 12,
    color: '#8a9ba8',
  },
  summarySection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1a2332',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  summarySubtitle: {
    fontSize: 12,
    color: '#8a9ba8',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#243447',
    borderTopWidth: 1,
    borderTopColor: '#2a3f54',
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64b5f6',
    textAlign: 'left',
  },
  tableContent: {
    flex: 1,
    backgroundColor: '#1a2332',
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a3f54',
  },
  cellText: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'left',
  },
  descriptionColumn: {
    flex: 2,
  },
  numberColumn: {
    flex: 0.8,
    textAlign: 'center',
  },
  notesColumn: {
    flex: 1,
    fontSize: 10,
    color: '#8a9ba8',
  },
  actionsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#1a2332',
    borderTopWidth: 1,
    borderTopColor: '#2a3f54',
  },
  actionsTitle: {
    fontSize: 14,
    color: '#8a9ba8',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#1976d2',
  },
  generateButton: {
    backgroundColor: '#388e3c',
  },
  approveButton: {
    backgroundColor: '#2e7d32',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default CloseoutScreen;