import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ProductList } from '@/components/ProductList';
import { useNavigation } from '@/navigation/SimpleNavigator';
import { IconArrowLeft } from '@tabler/icons-react-native';

export function HistoryScreen() {
  const { goBack } = useNavigation();
  
  // Mock data for now - you'll replace this with actual history from storage
  const historyBarcodes = [
    '5449000000996', // Coca-Cola
    '3017620422003', // Nutella
    '5000159461122', // Kit Kat
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <IconArrowLeft size={24} stroke="#434A54" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>History</Text>
          <Text style={styles.subtitle}>
            {historyBarcodes.length} scanned products
          </Text>
        </View>
      </View>

      {/* Product List */}
      <ProductList barcodes={historyBarcodes} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#DDE3ED',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#434A54',
  },
  subtitle: {
    fontSize: 14,
    color: '#8E99AB',
    marginTop: 4,
  },
});

