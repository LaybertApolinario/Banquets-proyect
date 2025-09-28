// import React, { memo } from 'react';
// import { View, Text, TextInput, StyleSheet } from 'react-native';
// import { InvoiceItem } from '@/types/events';

// // Componente memoizado para los items de la tabla
// const ItemRow = memo(({ 
//   item, 
//   isEditable, 
//   onUpdate 
// }: { 
//   item: InvoiceItem; 
//   isEditable: boolean; 
//   onUpdate: (id: string, field: keyof InvoiceItem, value: string) => void; 
// }) => {
//   return (
//     <View style={styles.itemRow}>
//       <View style={styles.categoryColumn}>
//         <Text style={styles.categoryText}>{item.category}</Text>
//         {item.sku ? <Text style={styles.skuText}>{item.sku}</Text> : null}
//       </View>
      
//       {isEditable ? (
//         <>
//           {/* Input field for unit price */}
//           <TextInput
//             style={styles.numberInput}
//             value={item.unitPrice}
//             onChangeText={(text) => onUpdate(item.id, 'unitPrice', text)}
//             keyboardType="numeric"
//             selectTextOnFocus
//             returnKeyType="next"
//           />
          
//           {/* Input field for quantity */}
//           <TextInput
//             style={styles.numberInput}
//             value={item.quantity}
//             onChangeText={(text) => onUpdate(item.id, 'quantity', text)}
//             keyboardType="numeric"
//             selectTextOnFocus
//             returnKeyType="next"
//           />
          
//           {/* Display calculated sales value (readonly) */}
//           <Text style={styles.calculatedValue}>{item.sales}</Text>
          
//           {/* Input field for comp items */}
//           <TextInput
//             style={styles.numberInput}
//             value={item.comp}
//             onChangeText={(text) => onUpdate(item.id, 'comp', text)}
//             keyboardType="numeric"
//             selectTextOnFocus
//             returnKeyType="done"
//           />
          
//           {/* Display calculated net value (readonly) */}
//           <Text style={styles.calculatedValue}>{item.net}</Text>
//         </>
//       ) : (
//         <>
//           <Text style={styles.readOnlyValue}>{item.unitPrice}</Text>
//           <Text style={styles.readOnlyValue}>{item.quantity}</Text>
//           <Text style={styles.readOnlyValue}>{item.sales}</Text>
//           <Text style={styles.readOnlyValue}>{item.comp}</Text>
//           <Text style={styles.readOnlyValue}>{item.net}</Text>
//         </>
//       )}
//     </View>
//   );
// });


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#2D3748',
//   },
//   header: {
//     backgroundColor: '#2D3748',
//     padding: 16,
//     paddingTop: 8,
//   },
//   headerTitle: {
//     color: 'white',
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   headerSubtitle: {
//     color: '#A0AEC0',
//     fontSize: 13,
//     marginBottom: 16,
//   },
//   headerButtons: {
//     flexDirection: 'row',
//     marginBottom: 16,
//   },
//   headerButton: {
//     paddingHorizontal: 14,
//     paddingVertical: 7,
//     marginRight: 6,
//     borderRadius: 6,
//     backgroundColor: '#374151',
//     borderWidth: 1,
//     borderColor: '#4A5568',
//   },
//   activeHeaderButton: {
//     backgroundColor: '#3182CE',
//     borderColor: '#3182CE',
//   },
//   headerButtonText: {
//     color: '#A0AEC0',
//     fontSize: 13,
//     fontWeight: '500',
//   },
//   activeHeaderButtonText: {
//     color: 'white',
//   },
//   actionButtons: {
//     flexDirection: 'row',
//   },
//   actionButton: {
//     paddingHorizontal: 14,
//     paddingVertical: 7,
//     marginRight: 6,
//     borderRadius: 6,
//     backgroundColor: '#374151',
//     borderWidth: 1,
//     borderColor: '#4A5568',
//   },
//   saveButton: {
//     backgroundColor: '#38A169',
//     borderColor: '#38A169',
//     paddingHorizontal: 14,
//     paddingVertical: 7,
//     borderRadius: 6,
//     borderWidth: 1,
//   },
//   disabledButton: {
//     opacity: 0.4,
//     backgroundColor: '#374151',
//   },
//   disabledSaveButton: {
//     opacity: 0.4,
//     backgroundColor: '#374151',
//   },
//   actionButtonText: {
//     color: '#A0AEC0',
//     fontSize: 13,
//   },
//   saveButtonText: {
//     color: 'white',
//     fontSize: 13,
//   },
//   disabledText: {
//     color: '#6B7280',
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 16,
//   },
//   companyName: {
//     color: 'white',
//     fontSize: 17,
//     fontWeight: '600',
//     marginBottom: 4,
//     marginTop: 8,
//   },
//   eventDate: {
//     color: '#A0AEC0',
//     fontSize: 14,
//     marginBottom: 20,
//   },
//   infoPanel: {
//     backgroundColor: '#374151',
//     padding: 14,
//     borderRadius: 8,
//     marginBottom: 20,
//   },
//   infoPanelTitle: {
//     color: 'white',
//     fontSize: 15,
//     fontWeight: '600',
//     marginBottom: 8,
//   },
//   infoPanelText: {
//     color: '#D1D5DB',
//     fontSize: 14,
//     lineHeight: 20,
//   },
//   exportButtons: {
//     marginTop: 12,
//     gap: 8,
//   },
//   exportButton: {
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//   },
//   previewButton: {
//     backgroundColor: '#6366F1',
//   },
//   pdfButton: {
//     backgroundColor: '#3B82F6',
//   },
//   excelButton: {
//     backgroundColor: '#10B981',
//   },
//   emailButton: {
//     backgroundColor: '#8B5CF6',
//   },
//   exportButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '500',
//     textAlign: 'center',
//   },
//   tableScrollView: {
//     marginBottom: 16,
//   },
//   tableWrapper: {
//     minWidth: 600, // Ancho mínimo para scroll
//   },
//   tableHeader: {
//     flexDirection: 'row',
//     paddingVertical: 12,
//     borderBottomWidth: 2,
//     borderBottomColor: '#4A5568',
//     backgroundColor: '#374151',
//     paddingHorizontal: 12,
//     borderTopLeftRadius: 8,
//     borderTopRightRadius: 8,
//   },
//   headerCell: {
//     color: '#A0AEC0',
//     fontSize: 12,
//     fontWeight: '600',
//     textAlign: 'center',
//     paddingHorizontal: 4,
//   },
//   categoryHeaderCell: {
//     width: 120,
//     textAlign: 'left',
//   },
//   skuHeaderCell: {
//     width: 80,
//   },
//   numberHeaderCell: {
//     width: 85,
//   },
//   itemsContainer: {
//     backgroundColor: '#374151',
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderBottomLeftRadius: 8,
//     borderBottomRightRadius: 8,
//   },
//   itemRowHorizontal: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#4A5568',
//   },
//   cellValue: {
//     color: 'white',
//     fontSize: 13,
//     paddingHorizontal: 4,
//   },
//   cellInput: {
//     backgroundColor: '#4A5568',
//     color: 'white',
//     textAlign: 'center',
//     paddingHorizontal: 8,
//     paddingVertical: 6,
//     borderRadius: 4,
//     fontSize: 13,
//     marginHorizontal: 2,
//     borderWidth: 1,
//     borderColor: '#6B7280',
//   },
//   categoryCell: {
//     width: 120,
//     textAlign: 'left',
//   },
//   skuCell: {
//     width: 80,
//     textAlign: 'center',
//   },
//   numberCell: {
//     width: 85,
//     textAlign: 'center',
//   },
//   addRowButton: {
//     backgroundColor: '#38A169',
//     padding: 12,
//     borderRadius: 6,
//     alignItems: 'center',
//     marginTop: 8,
//     marginBottom: 8,
//   },
//   addRowButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   itemRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#374151',
//   },
//   categoryColumn: {
//     flex: 2,
//     paddingRight: 6,
//   },
//   categoryText: {
//     color: 'white',
//     fontSize: 13,
//     fontWeight: '500',
//   },
//   skuText: {
//     color: '#A0AEC0',
//     fontSize: 11,
//     marginTop: 2,
//   },
//   numberInput: {
//     backgroundColor: '#4A5568',
//     color: 'white',
//     textAlign: 'center',
//     paddingHorizontal: 6,
//     paddingVertical: 6,
//     borderRadius: 4,
//     fontSize: 13,
//     flex: 1,
//     marginHorizontal: 1,
//     minWidth: 50,
//   },
//   calculatedValue: {
//     color: 'white',
//     textAlign: 'center',
//     fontSize: 13,
//     flex: 1,
//     marginHorizontal: 1,
//   },
//   readOnlyValue: {
//     color: '#D1D5DB',
//     textAlign: 'center',
//     fontSize: 13,
//     flex: 1,
//     marginHorizontal: 1,
//   },
//   summaryContainer: {
//     backgroundColor: '#374151',
//     padding: 14,
//     borderRadius: 8,
//     marginBottom: 20,
//   },
//   summaryTitle: {
//     color: 'white',
//     fontSize: 15,
//     fontWeight: '600',
//     marginBottom: 12,
//   },
//   summaryRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 6,
//   },
//   summaryLabel: {
//     color: '#A0AEC0',
//     fontSize: 13,
//   },
//   summaryValue: {
//     color: 'white',
//     fontSize: 13,
//     fontWeight: '500',
//   },
//   totalRow: {
//     borderTopWidth: 1,
//     borderTopColor: '#4A5568',
//     marginTop: 6,
//     paddingTop: 8,
//   },
//   totalLabel: {
//     color: 'white',
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   totalValue: {
//     color: 'white',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   bottomSpacer: {
//     height: 16,
//   },
//   bottomActions: {
//     flexDirection: 'row',
//     backgroundColor: '#2D3748',
//     padding: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#4A5568',
//     gap: 6,
//   },
//   bottomButton: {
//     paddingHorizontal: 8,
//     paddingVertical: 8,
//     borderRadius: 6,
//     backgroundColor: '#374151',
//     borderWidth: 1,
//     borderColor: '#4A5568',
//     flex: 1,
//   },
//   clearButton: {
//     backgroundColor: '#E53E3E',
//     borderColor: '#E53E3E',
//     paddingHorizontal: 8,
//     paddingVertical: 8,
//     borderRadius: 6,
//     borderWidth: 1,
//     flex: 1,
//   },
//   saveChangesButton: {
//     backgroundColor: '#3182CE',
//     borderColor: '#3182CE',
//     paddingHorizontal: 8,
//     paddingVertical: 8,
//     borderRadius: 6,
//     borderWidth: 1,
//     flex: 1,
//   },
//   bottomButtonText: {
//     color: '#A0AEC0',
//     fontSize: 11,
//     textAlign: 'center',
//     fontWeight: '500',
//   },
//   clearButtonText: {
//     color: 'white',
//     fontSize: 11,
//     textAlign: 'center',
//     fontWeight: '500',
//   },
//   saveChangesButtonText: {
//     color: 'white',
//     fontSize: 11,
//     textAlign: 'center',
//     fontWeight: '500',
//   },
// });

// export default ItemRow;