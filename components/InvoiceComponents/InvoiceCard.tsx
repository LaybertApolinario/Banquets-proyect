import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import StatusBadge from "../StatusBadge";
import { STATUS_INVOICE, Invoice } from "@/types/events";

// TYPES & INTERFACES
interface InvoiceCardProps{
    item: Invoice,
    onCardPress?:(invoiceId: string) => void
}

//CONSTANTS & HELPERS
const router = useRouter();

// Utility to handle card press events
const handleCardPress = (
    invoiceId: string,
    onCardPress?: (invoiceId: string) => void,
    router?: ReturnType<typeof useRouter>
) => {
    if (onCardPress) {
        onCardPress(invoiceId);
    } else if (router) {
        // Default navigation if no custom handler is provided
        router.push({
            pathname: '/captain/invoice/[id]',
            params: { id: invoiceId }
        });
    }
};


export default React.memo(function InvoiceCard({ item, onCardPress }: InvoiceCardProps) {
    return (
        <TouchableOpacity style={styles.card} onPress={() => handleCardPress(item.id, onCardPress, router)}>
            <View style={styles.cardHeader}>
                <Text style={styles.invoiceId}>BEO {item.id}</Text>
                <StatusBadge status={item.status}/>
            </View>

            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.location}>{item.location}</Text>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.total}>{item.total}</Text>

            {/* <View style={styles.buttonsRow}>
                <TouchableOpacity style={[styles.button, styles.viewBtn]}>
                    <Text style={styles.btnText}>View</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.editBtn]}
                    onPress={() => {
                        router.navigate('/captain/invoice/edit');
                    }}
                >
                    <Text style={styles.btnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.exportBtn]}>
                    <Text style={styles.btnText}>Export</Text>
                </TouchableOpacity>
            </View> */}
        </TouchableOpacity>
    );
});
    
// Estilos usados
const styles = StyleSheet.create({
    card: {
        backgroundColor: "#132A4A",
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    invoiceId: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    status: {
        fontSize: 12,
        fontWeight: "600",
        color: "#fff",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        overflow: "hidden",
    },
    title: {
        color: "#fff",
        fontSize: 16,
        marginTop: 5,
        fontWeight: "600",
    },
    location: {
        color: "#A0AEC0",
        fontSize: 14,
    },
    date: {
        color: "#A0AEC0",
        fontSize: 14,
    },
    total: {
        color: "#00E676",
        fontWeight: "bold",
        marginTop: 5,
    },
    // buttonsRow: {
    //     flexDirection: "row",
    //     marginTop: 10,
    //     gap: 10,
    // },
    // button: {
    //     flex: 1,
    //     paddingVertical: 8,
    //     borderRadius: 8,
    //     alignItems: "center",
    // },
    // viewBtn: {
    //     backgroundColor: "#00B0FF",
    // },
    // editBtn: {
    //     backgroundColor: "#FFB300",
    // },
    // exportBtn: {
    //     backgroundColor: "#00C853",
    // },
    // btnText: {
    //     color: "#fff",
    //     fontWeight: "600",
    // },
});