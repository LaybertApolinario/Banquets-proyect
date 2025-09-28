import React from 'react';
import { Text, View, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import Button from '@/components/Button';

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Seccion Logo INBY */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>INBY</Text>
            {/* Image could be */}
          </View>
        </View>
        
        {/* Seccion Titulo Subtitulo */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>BarOps</Text>
          <Text style={styles.subtitle}>Events | Inventory | Daily Cost</Text>
        </View>
        
        {/* Seccion Botones */}
        <View>
          <Button label='Enter as bartender' variant='#32cd32' toGo={'/bartender'} />
          <Button label='Enter as captain' variant='#1e90ff' toGo={'/captain'} />
        </View>
        
        <View>
          <Text style={styles.footerText}>Select your role, you can change it in settings</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a2332',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoContainer: {
    marginBottom: 60,
  },
  logo: {
    backgroundColor: '#2d4a6b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logoText: {
    color: '#4a9eff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 70,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8a9ba8',
    letterSpacing: 0.5,
  },
  footerText: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  }
});