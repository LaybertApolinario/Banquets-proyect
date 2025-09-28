import React, { useEffect } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, TextInput} from "react-native"
import { mockEvents } from "@/data/mockEvents";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { TabOption } from "@/types/events";
import Item from "@/components/Item";
import { Ionicons } from "@expo/vector-icons";


const tabOptions: TabOption[] = [
  { key: 'All', label: 'All' },
  { key: 'Liquior', label: 'Liquior' },
  { key: 'Wine', label: 'Wine' },
  { key: 'Beer', label: 'Beer' },
]

export default function ReturnDetail(){
    const {id} = useLocalSearchParams<{id : string}>();
    const event = mockEvents.find((e) => e.id == id)
    const navigation = useNavigation();
    const [activeTab1, setActiveTab1] = useState<string>('All');

    const renderTab = (tab: TabOption, activeTab: string, setActiveTab: (val:string) => void) => {
      const isActive = activeTab === tab.key;
      return(
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabButton, isActive && styles.activeTabButton]}
            onPress={()=>setActiveTab(tab.key)}
          >
          <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab.label}</Text>
          </TouchableOpacity>
        )
    };

  // Cambiar título dinámicamente cuando entra a detalle
    useEffect(() => {
      if (event) {
        navigation.setOptions({
          title: event.title,
          headerStyle: { backgroundColor: "#1E3A8A" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontWeight: "bold", fontSize: 20 },
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingHorizontal: 12 }}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        ),
        });
      }
    }, [event]);

    if (!event) {
      return (
        <SafeAreaView style={styles.container}>
          <Text style={styles.text}>Event not found</Text>
        </SafeAreaView>
      );
    }

      const [note, setNote] = useState("");

     return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.content}>
          <StatusBar style='dark'/>
          <View style={styles.tabsContainer}>
            {tabOptions.map((tab) => renderTab(tab, activeTab1, setActiveTab1))}
          </View>
          <FlatList
            data={event?.products} 
            keyExtractor={(item)=> item.name} 
            renderItem={({item}) => <Item product={item}/>} 
            scrollEnabled={true} 
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={false}
          />  
          <View style={styles.Footercontainer}>
            <TextInput 
                style={styles.textInput}
                placeholder="Note: damaged, spilled, broken bottles"
                placeholderTextColor="#999"
                value={note}
                onChangeText={setNote}
                multiline>
            </TextInput>
            <View style={styles.row}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Total return = 8</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Total usado: 15</Text>
              </View>
            </View>
            <View style={styles.buttonsRow}>
              <TouchableOpacity style={styles.buttonSecondary}>
                <Text style={styles.buttonSecondaryText}>everything returned</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonPrimary}>
                <Text style={styles.buttonPrimaryText}>Send return</Text>
              </TouchableOpacity>
            </View>            
          </View>
        </View>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#0B1220",
  },
  content: {
    flex: 1,
    paddingBottom: 20, // Espacio adicional en la parte inferior
  },
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 24,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle:{
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#9CA3AF'
  },
  tabsContainer:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    marginVertical: 10,
    marginHorizontal: 5,
  },
  tabButton:{
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 8,
    borderRadius: 25,
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  },
  activeTabButton:{
    backgroundColor: '#0EA5E9' 
  },
  tabText: { 
    fontSize: 14, 
    fontWeight: '500', 
    color: '#9CA3AF',
    textAlign: 'center'
  },
  activeTabText: { 
    color: '#ffffff' 
  },
  flatListContent: { 
    paddingHorizontal: 20, 
    paddingBottom: 40, // Espacio extra al final del scroll
    flexGrow: 1,
    overflow: 'hidden'
  },
  listContent: { 
    paddingHorizontal: 20, 
    paddingBottom: 20,
    overflow: 'hidden'
  },
  text: { color: "#fff", fontSize: 16 },

  textInput: {
    backgroundColor: "#0d2a4d",
    borderRadius: 10,
    padding: 10,
    color: "#fff",
    minHeight: 70,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  badge: {
    backgroundColor: "#0d2a4d",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "600",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonSecondary: {
    backgroundColor: "#4a5d73",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  buttonSecondaryText: {
    color: "#d1d1d1",
    fontWeight: "600",
  },
  buttonPrimary: {
    backgroundColor: "#1c84ff",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonPrimaryText: {
    color: "#fff",
    fontWeight: "700",
  },
  Footercontainer: {
    backgroundColor: "#1e3d66",
    padding: 15,
    borderRadius: 10,
  },
});