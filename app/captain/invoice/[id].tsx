import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, StatusBar, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useInvoiceCalculator } from '@/hooks/InvoiceCalculator';
import Ionicons from '@expo/vector-icons/build/Ionicons';
// Sub-componentes
import InvoiceHeader from "@/components/InvoiceComponents/InvoiceHeader";
import InvoiceInfoPanel from '@/components/InvoiceComponents/InvoiceInfoPanel';
import InvoiceTable from '@/components/InvoiceComponents/InvoiceTable';
import InvoiceSummary from '@/components/InvoiceComponents/InvoiceSummary';
import InvoiceBottomActions from '@/components/InvoiceComponents/InvoiceBottomActions';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorScreen from '@/components/InvoiceComponents/ErrorScreen';

export default function InvoiceEditor() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<string>('view');
  const navigation = useNavigation();
  const router = useRouter();
  const {
    invoiceData,
    items,
    summary,
    loading,
    error,
    updateItem,
    addNewItem,
    recalculateItems
  } = useInvoiceCalculator(id || '');

            // Cambiar título dinámicamente cuando entra a detalle
    useEffect(() => {
      if (invoiceData) {
        navigation.setOptions({
          title: invoiceData.invoiceId,
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
    },[invoiceData]);
    
  // Handlers
  const handleExport = (type: string) => {
    if (type === 'preview') {
      Alert.alert('Preview PDF', 'Generando vista previa del PDF...', [
        { text: 'Cerrar', style: 'cancel' },
        { text: 'Descargar PDF', onPress: () => Alert.alert('Descargando...') }
      ]);
    } else {
      Alert.alert('Exportar', `Exportando como ${type.toUpperCase()}...`);
    }
  };

  const handleRecalculate = () => {
    recalculateItems();
    Alert.alert('Recalculado', 'Los valores han sido recalculados automáticamente');
  };

  const handleSave = () => {
    Alert.alert('Guardado', 'Los cambios han sido guardados exitosamente');
  };

  const handleCancel = () => {
    Alert.alert('Cancelar', 'Se descartarán los cambios no guardados');
  };

  const handleClear = () => {
    Alert.alert('Limpiar', 'Se limpiarán todos los valores');
  };

  const isEditable = activeTab === 'edit';
  const canEdit = activeTab === 'edit';

  // Estados de carga y error
  if (loading) return <LoadingScreen invoiceId={id || ''} />;
  if (error || !invoiceData) return <ErrorScreen error={error || 'Datos no encontrados'} />;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="light-content" />
      
      {/* Header */}
      <InvoiceHeader
        invoiceData={invoiceData}
        activeTab={activeTab}
        canEdit={canEdit}
        onViewTab={() => setActiveTab('view')}
        onEditTab={() => setActiveTab('edit')}
        onExportTab={() => setActiveTab('export')}
        onRecalculate={handleRecalculate}
        onSave={handleSave}
      />

      {/* Content */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.companyName}>{invoiceData.companyName}</Text>
        <Text style={styles.eventDate}>{invoiceData.eventDate}</Text>

        {/* Panel de información */}
        <InvoiceInfoPanel 
          activeTab={activeTab}
          invoiceData={invoiceData}
          onExport={handleExport}
        />

        {/* Tabla de items */}
        <InvoiceTable
          items={items}
          isEditable={isEditable}
          onUpdateItem={updateItem}
          onAddNewItem={addNewItem}
        />

        {/* Resumen */}
        <InvoiceSummary summary={summary} invoiceData={invoiceData} />

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom actions */}
      <InvoiceBottomActions
        canEdit={canEdit}
        onCancel={handleCancel}
        onClear={handleClear}
        onRecalc={handleRecalculate}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1D36",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  companyName: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 8,
  },
  eventDate: {
    color: '#A0AEC0',
    fontSize: 14,
    marginBottom: 20,
  },
  bottomSpacer: {
    height: 16,
  },
});