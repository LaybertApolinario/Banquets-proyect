import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

type Request = {
  id: string;
  name: string;
  product: string;
  qty: string;
  note?: string;
  time: string;
  status: "pending" | "approved";
};

const requestsData: Request[] = [
  {
    id: "1",
    name: "Joy",
    product: "Tito's 1.75L",
    qty: "+2 bottles",
    note: "Running low",
    time: "6:42 PM",
    status: "pending",
  },
  {
    id: "2",
    name: "Soncha",
    product: "Michelob Ultra 12oz (case)",
    qty: "+1 case",
    note: "Extra table",
    time: "6:45 PM",
    status: "pending",
  },
  {
    id: "3",
    name: "Alex",
    product: "Lemons (lb)",
    qty: "+6 lb",
    time: "6:51 PM",
    status: "approved",
  },
  {
    id: "4",
    name: "Mia",
    product: "Dom Pérignon 750ml",
    qty: "+1 bottle",
    time: "6:58 PM",
    status: "approved",
  },
];

export default function RequestsScreen() {
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");

  const filteredRequests = requestsData.filter(
    (req) => req.status === activeTab
  );

  const renderItem = ({ item }: { item: Request }) => (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <Text style={styles.product}>{item.product}</Text>
      <Text style={styles.qty}>Qty: {item.qty}</Text>
      {item.note && <Text style={styles.note}>Note: {item.note}</Text>}

      {activeTab === "pending" ? (
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.button, styles.deny]}>
            <Text style={styles.btnText}>Deny</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.modify]}>
            <Text style={styles.btnText}>Modify</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.approve]}>
            <Text style={styles.btnText}>Approve</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.approvedBox}>
          <Text style={styles.approvedText}>
            Approved by You • {item.time}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Requests</Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "pending" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("pending")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "pending" && styles.activeTabText,
            ]}
          >
            Pending
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "approved" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("approved")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "approved" && styles.activeTabText,
            ]}
          >
            Approved
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0c1a2a", padding: 16 },
  header: { fontSize: 22, color: "white", fontWeight: "bold", marginBottom: 10 },
  tabs: { flexDirection: "row", marginBottom: 12 },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    backgroundColor: "#1a2b3d",
    marginHorizontal: 4,
  },
  activeTab: { backgroundColor: "#007bff" },
  tabText: { color: "gray", fontSize: 16 },
  activeTabText: { color: "white", fontWeight: "bold" },
  card: {
    backgroundColor: "#1a2b3d",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
  name: { color: "white", fontWeight: "bold", fontSize: 16 },
  time: { color: "gray" },
  product: { color: "white", marginTop: 4 },
  qty: { color: "#0af", marginTop: 2 },
  note: { color: "orange", fontSize: 12, marginTop: 2 },
  actions: { flexDirection: "row", marginTop: 8, justifyContent: "space-between" },
  button: { flex: 1, padding: 8, borderRadius: 6, alignItems: "center", marginHorizontal: 4 },
  deny: { backgroundColor: "red" },
  modify: { backgroundColor: "orange" },
  approve: { backgroundColor: "green" },
  btnText: { color: "white", fontWeight: "bold" },
  approvedBox: { marginTop: 8, padding: 6, borderRadius: 6, backgroundColor: "green" },
  approvedText: { color: "white", fontSize: 12 },
});



// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   StatusBar,
//   SafeAreaView,
// } from 'react-native';

// const requestsData = [
//   {
//     id: '1',
//     name: 'Joy',
//     eventCode: 'EB1',
//     time: '6:42 PM',
//     product: "Tito's 1.75L",
//     quantity: '1 + 2 bottles',
//     status: 'pending',
//     note: 'Running low'
//   },
//   {
//     id: '2',
//     name: 'Soncha',
//     eventCode: 'EB2',
//     time: '6:45 PM',
//     product: 'Michelob Ultra 12oz (case)',
//     quantity: '1 case',
//     status: 'pending',
//     note: 'Extra table'
//   },
//   {
//     id: '3',
//     name: 'Alex',
//     eventCode: 'BC1',
//     time: '6:51 PM',
//     product: 'Lemons (lb)',
//     quantity: '6 lb',
//     status: 'approved',
//     note: ''
//   },
//   {
//     id: '4',
//     name: 'Mia',
//     eventCode: 'EB1',
//     time: '6:58 PM',
//     product: 'Dom Pérignon 750ml',
//     quantity: '1 bottle',
//     status: 'approved',
//     note: ''
//   }
// ];

// export default function RequestsScreen() {
//   const [requests, setRequests] = useState(requestsData);

//   const updateRequestStatus = (id, status) => {
//     setRequests(prev => 
//       prev.map(req => 
//         req.id === id ? { ...req, status } : req
//       )
//     );
//   };

//   const renderRequest = ({ item }) => (
//     <View style={styles.requestCard}>
//       <View style={styles.requestHeader}>
//         <View style={styles.userInfo}>
//           <View style={styles.userCircle}>
//             <Text style={styles.userInitial}>{item.name[0]}</Text>
//           </View>
//           <Text style={styles.userName}>{item.name}</Text>
//         </View>
//         <View style={styles.requestMeta}>
//           <Text style={styles.eventCode}>{item.eventCode}</Text>
//           <Text style={styles.time}>{item.time}</Text>
//         </View>
//       </View>

//       <View style={styles.requestBody}>
//         <Text style={styles.product}>{item.product}</Text>
//         <Text style={styles.quantity}>Qty: {item.quantity}</Text>
//         {item.note ? <Text style={styles.note}>{item.note}</Text> : null}
//       </View>

//       <View style={styles.requestActions}>
//         {item.status === 'pending' ? (
//           <>
//             <TouchableOpacity
//               style={[styles.actionBtn, styles.denyBtn]}
//               onPress={() => updateRequestStatus(item.id, 'denied')}
//             >
//               <Text style={styles.actionBtnText}>Deny</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.actionBtn, styles.modifyBtn]}
//               onPress={() => updateRequestStatus(item.id, 'modified')}
//             >
//               <Text style={styles.actionBtnText}>Modify</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.actionBtn, styles.approveBtn]}
//               onPress={() => updateRequestStatus(item.id, 'approved')}
//             >
//               <Text style={styles.actionBtnText}>Approve</Text>
//             </TouchableOpacity>
//           </>
//         ) : (
//           <View style={styles.approvedContainer}>
//             <Text style={styles.approvedText}>
//               Approved by You • {new Date().toLocaleTimeString('en-US', { 
//                 hour: 'numeric', 
//                 minute: '2-digit', 
//                 hour12: true 
//               })}
//             </Text>
//           </View>
//         )}
//       </View>
//     </View>
//   );

//   const pendingRequests = requests.filter(req => req.status === 'pending');
//   const approvedRequests = requests.filter(req => req.status === 'approved');

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#0B1220" />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <View>
//           <Text style={styles.headerTitle}>Requests</Text>
//           <Text style={styles.headerSubtitle}>BEO 192.425 • Ballroom A • LIVE</Text>
//         </View>
//         <View style={styles.liveIndicator} />
//       </View>

//       {/* Tabs */}
//       <View style={styles.tabsContainer}>
//         <TouchableOpacity style={[styles.tab, styles.activeTab]}>
//           <Text style={[styles.tabText, styles.activeTabText]}>Pending</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.tab}>
//           <Text style={styles.tabText}>Approved</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Requests List */}
//       <FlatList
//         data={requests}
//         keyExtractor={(item) => item.id}
//         renderItem={renderRequest}
//         contentContainerStyle={styles.listContent}
//         showsVerticalScrollIndicator={false}
//       />

//       {/* Footer */}
//       <View style={styles.footer}>
//         <Text style={styles.footerText}>Only bartender requests are shown here.</Text>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0B1220',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     paddingBottom: 10,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#FFF',
//     marginBottom: 4,
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: '#9CA3AF',
//   },
//   liveIndicator: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: '#0EA5E9',
//     marginTop: 6,
//   },
//   tabsContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   tab: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     marginRight: 8,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   activeTab: {
//     backgroundColor: '#0EA5E9',
//   },
//   tabText: {
//     color: '#9CA3AF',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   activeTabText: {
//     color: '#FFF',
//   },
//   sectionHeader: {
//     paddingHorizontal: 20,
//     marginBottom: 10,
//   },
//   sectionTitle: {
//     color: '#9CA3AF',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   listContent: {
//     paddingHorizontal: 20,
//     paddingBottom: 100,
//   },
//   requestCard: {
//     backgroundColor: '#1A2332',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//   },
//   requestHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   userInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   userCircle: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#0EA5E9',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 10,
//   },
//   userInitial: {
//     color: '#FFF',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   userName: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   requestMeta: {
//     alignItems: 'flex-end',
//   },
//   eventCode: {
//     color: '#9CA3AF',
//     fontSize: 12,
//     marginBottom: 2,
//   },
//   time: {
//     color: '#9CA3AF',
//     fontSize: 12,
//   },
//   requestBody: {
//     marginBottom: 16,
//   },
//   product: {
//     color: '#FFF',
//     fontSize: 14,
//     fontWeight: '500',
//     marginBottom: 4,
//   },
//   quantity: {
//     color: '#9CA3AF',
//     fontSize: 13,
//     marginBottom: 4,
//   },
//   note: {
//     color: '#F59E0B',
//     fontSize: 12,
//     fontStyle: 'italic',
//   },
//   requestActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   actionBtn: {
//     flex: 1,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 6,
//     alignItems: 'center',
//     marginHorizontal: 4,
//   },
//   denyBtn: {
//     backgroundColor: '#EF4444',
//   },
//   modifyBtn: {
//     backgroundColor: '#0EA5E9',
//   },
//   approveBtn: {
//     backgroundColor: '#22C55E',
//   },
//   actionBtnText: {
//     color: '#FFF',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   approvedContainer: {
//     flex: 1,
//     backgroundColor: '#22C55E',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 6,
//     alignItems: 'center',
//   },
//   approvedText: {
//     color: '#FFF',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   footer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: '#0B1220',
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//     borderTopWidth: 1,
//     borderTopColor: '#2D3748',
//   },
//   footerText: {
//     color: '#6B7280',
//     fontSize: 12,
//     textAlign: 'center',
//   },
// });