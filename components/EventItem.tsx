import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Event } from "@/types/events";
import StatusBadge from "./StatusBadge";
import { useRouter } from "expo-router";

type EventItemProps= {
    event : Event,
    toGo: string,
}


export default function EventItem(event: EventItemProps){
    const router = useRouter();
    
    return(
        <TouchableOpacity style={styles.eventItem} onPress={()=>
            {
                if (event.toGo == "Event") {
                    router.push({
                        pathname: '/bartender/event/[id]',
                        params: {id: event.event.id}
                    })
                }
                else{
                    router.push({
                        pathname: '/bartender/return/[id]',
                        params: {id: event.event.id}
                    })
                }
            }
            }>
            <View style={styles.eventContent}>
                <View style={styles.eventHeader}>
                    <Text style={styles.eventCode}>{event.event.code}</Text>
                    <StatusBadge status={event.event.status}/>
                </View>
                <Text style={styles.eventTitle}>{event.event.title}</Text>
                <View style={styles.eventDetails}>
                    <Text style={styles.eventTime}>{event.event.time} - {event.event.location}</Text>
                    <Text style={styles.eventStation}>{event.event.station}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
    eventItem: {
        backgroundColor: '#0F1C2E',
        borderRadius: 12,
        marginBottom: 12,
        overflow:'hidden'
    },
    eventContent: {
        padding: 16,
    },
    eventHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    eventCode: {
        fontSize: 14,
        fontWeight: '600',
        color: '#9CA3AF'
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    eventDetails: {
        gap: 2,
    },
    eventTime: {
        fontSize: 13,
        color: '#9CA3AF'
    },
    eventStation:{
        fontSize: 13,
        color: '#6B7280'
    }
})