import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { STATUS_EVENTS, STATUS_INVOICE } from "@/types/events";

type StatusBadgeProps ={
    status: STATUS_EVENTS['status'] | STATUS_INVOICE['status'];
};

export default function StatusBadge({status}: StatusBadgeProps){

    const normalizedStatus = status.toUpperCase();

    const getStatusStyle = () => {
        if (normalizedStatus === 'LIVE' || normalizedStatus === 'EXPORTED') {
            return { backgroundColor: '#32cd32', color: '#FFFFFF' };
        } 
        else if (normalizedStatus === 'PENDING' || normalizedStatus === 'WAITING CLOSEOUT') {
            return { backgroundColor: '#F59E0B', color: '#FFFFFF' };
        } 
        else if (normalizedStatus === 'READY' || normalizedStatus === 'PLANNED') {
            return { backgroundColor: '#3B82F6', color: '#FFFFFF' };
        }
        else {
            return { backgroundColor: '#6B7280', color: '#FFFFFF' };
        }
    };

    const StatusStyle = getStatusStyle();

    return(
        <View>
            <View style={[styles.statusBadge,{backgroundColor: StatusStyle.backgroundColor}]}>
                <Text style={[styles.statusText,{color:StatusStyle.color}]}>
                {status}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    statusBadge:{
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 15,
        minWidth: 80,
        alignItems: 'center',
        justifyContent: 'center'
    },
    statusText: {
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase'
    }
})