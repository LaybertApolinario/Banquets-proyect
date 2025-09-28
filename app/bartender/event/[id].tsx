import React, { useEffect } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList} from "react-native"
import { mockEvents } from "@/data/mockEvents";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { TabOption } from "@/types/events";
import Item from "@/components/Item";
import { Ionicons } from "@expo/vector-icons";
import RequestProductForm from "@/components/EventComponents/Bartender/RequestForm";


const tabOptions: TabOption[] = [
  { key: 'All', label: 'All' },
  { key: 'Liquior', label: 'Liquior' },
  { key: 'Wine', label: 'Wine' },
  { key: 'Beer', label: 'Beer' },
]

const tabOptions2: TabOption[] = [
  { key: 'Assigned', label: 'Assigned' },
  { key: 'Additional', label: 'Additional' },
]


export default function EventDetail(){
    const {id} = useLocalSearchParams<{id : string}>();
    const event = mockEvents.find((e) => e.id == id)
    const navigation = useNavigation();
    const [activeTab1, setActiveTab1] = useState<string>('All');
    const [activeTab2, setActiveTab2] = useState<string>('Assigned');

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

     return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.content}>
          <View style={styles.tabsContainer}>
            {tabOptions2.map((tab) => renderTab(tab, activeTab2, setActiveTab2))}
          </View>
          <StatusBar style='dark'/>
          <View style={styles.tabsContainer}>
            {tabOptions.map((tab) => renderTab(tab, activeTab1, setActiveTab1))}
          </View>
          <FlatList
            data={event?.products} 
            keyExtractor={(item)=> item.name} 
            renderItem={({item}) => <Item product={item}/>} 
            ListFooterComponent={<RequestProductForm/>} 
            scrollEnabled={true} 
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={false}
          />  
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
});