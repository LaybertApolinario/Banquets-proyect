import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, SafeAreaView,} from 'react-native';
import EventItem from '@/components/EventItem';
import { mockEvents } from '@/data/mockEvents';
import { TabOption, Event } from '@/types/events';

const tabOptions: TabOption[] = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'Week' },
  { key: 'all', label: 'All' },
]

export default function Returns(){

  const [activeTab, setActiveTab] = useState<string>('today');
  const [events] = useState<Event[]>(mockEvents);

  const renderTab = (tab: TabOption) => {
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
  }

  return(
    <SafeAreaView style= {styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={"#1E3A8A"}/>
      {/* <View style= {styles.header}>
        <View>
          <Text style={styles.headerTitle}>Events</Text>
          <Text></Text>
        </View>
      </View> */}
      <View style={styles.tabsContainer}>
        {tabOptions.map(renderTab)}
      </View>
        <FlatList data={events} keyExtractor={(item)=> item.id} 
        renderItem={({item}) => <EventItem event={item} toGo='Return'/>}
        contentContainerStyle = {styles.listContent}
        />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
      backgroundColor: '#0B1220',
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
      paddingTop: 20,
      paddingHorizontal: 20,
      marginBottom: 20
    },
    tabButton:{
      paddingVertical: 12,
      paddingHorizontal: 20,
      marginRight: 8,
      borderRadius: 25,
      backgroundColor: 'rgba(255, 255, 255, 0.1)'
    },
    activeTabButton:{
      backgroundColor: '#0EA5E9' 
    },
    tabText: { 
      fontSize: 14, 
      fontWeight: '500', 
      color: '#9CA3AF' 
    },
    activeTabText: { 
      color: '#ffffff' 
    },
    listContent: { 
      paddingHorizontal: 20, 
      paddingBottom: 20 
    },
  }
)