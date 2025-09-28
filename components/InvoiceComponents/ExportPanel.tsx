import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';    

// Panel de exportación memoizado
const ExportPanel = memo(({ onExport }: { onExport: (type: string) => void }) => (
  <View style={styles.infoPanel}>
    <Text style={styles.infoPanelTitle}>Opciones de Exportación</Text>
    <View style={styles.exportButtons}>
      <TouchableOpacity 
        style={[styles.exportButton, styles.previewButton]}
        onPress={() => onExport('preview')}
        activeOpacity={0.8}
      >
        <Text style={styles.exportButtonText}>👁️ Preview PDF</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.exportButton, styles.pdfButton]}
        onPress={() => onExport('pdf')}
        activeOpacity={0.8}
      >
        <Text style={styles.exportButtonText}>📄 Exportar como PDF</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.exportButton, styles.excelButton]}
        onPress={() => onExport('excel')}
        activeOpacity={0.8}
      >
        <Text style={styles.exportButtonText}>📊 Exportar como Excel</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.exportButton, styles.emailButton]}
        onPress={() => onExport('email')}
        activeOpacity={0.8}
      >
        <Text style={styles.exportButtonText}>📧 Enviar por Email</Text>
      </TouchableOpacity>
    </View>
  </View>
));

export default ExportPanel;


const styles = StyleSheet.create({
  infoPanel: {
    backgroundColor: "#132A4A",
    padding: 14,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoPanelTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  exportButtons: {
    marginTop: 12,
    gap: 8,
  },
  exportButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  previewButton: {
    backgroundColor: '#6366F1',
  },
  pdfButton: {
    backgroundColor: '#3B82F6',
  },
  excelButton: {
    backgroundColor: '#10B981',
  },
  emailButton: {
    backgroundColor: '#8B5CF6',
  },
  exportButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});