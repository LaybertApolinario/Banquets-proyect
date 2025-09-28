import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index" 
          options={{
            drawerLabel: 'Events',
            title: 'Events',
            headerTitleAlign: 'center',
            headerStyle:{
              backgroundColor: '#1E3A8A'
            },
            headerTintColor: '#FFFFFF', 
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
            },
            drawerHideStatusBarOnOpen: true,
          }}
        />
        <Drawer.Screen
          name='invoices'
          options={
            {
              drawerLabel: 'Invoices',
              title: 'Invoices',
              headerTitleAlign: 'center',
              headerStyle:{
                backgroundColor: '#1E3A8A'
              },
              headerTintColor: '#FFFFFF', 
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 20,
              },
              drawerHideStatusBarOnOpen: true,
            }
          }
          />
          <Drawer.Screen
            name='inventory'
            options={
              {
                drawerLabel: 'Inventory',
                title: 'Invoices',
                headerTitleAlign: 'center',
                headerStyle:{
                  backgroundColor: '#1E3A8A'
                },
                headerTintColor: '#FFFFFF', 
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 20,
                },
                drawerHideStatusBarOnOpen: true,
              }
            }
          />
          <Drawer.Screen
            name="event/requestData/[id]"
            options={{
              drawerItemStyle: {
                display: 'none',
              },
              drawerHideStatusBarOnOpen: true,
            }}
          />
          <Drawer.Screen
            name="invoice/[id]"
            options={{
              drawerItemStyle: {
                display: 'none',
              },
              drawerHideStatusBarOnOpen: true,
            }}
          />  
          <Drawer.Screen
            name="event/closeout/[id]"
            options={{
              drawerItemStyle: {
                display: 'none',
              },
              drawerHideStatusBarOnOpen: true,
            }}
          />   
          <Drawer.Screen
            name="event/eventDetails/[id]"
            options={{
              drawerItemStyle: {
                display: 'none',
              },
              drawerHideStatusBarOnOpen: true,
            }}
          />         
      </Drawer>
    </GestureHandlerRootView>
  );
}