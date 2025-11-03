import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ProductList } from '@/components/ProductList';
import { useNavigation } from '@/navigation/SimpleNavigator';
import { IconArrowLeft } from '@tabler/icons-react-native';

export function FavouritesScreen() {
  const { goBack } = useNavigation();
  
  // Mock data for now - you'll replace this with actual favourites from storage
  const favouriteBarcodes = [
    '3017620422003', // Nutella
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <IconArrowLeft size={24} stroke="#434A54" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>Favourites</Text>
          <Text style={styles.subtitle}>
            {favouriteBarcodes.length === 0
              ? 'No favourite products'
              : `${favouriteBarcodes.length} favourite products`}
          </Text>
        </View>
      </View>

      {/* Product List */}
      {favouriteBarcodes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            Add products to favourites to see them here
          </Text>
        </View>
      ) : (
        <ProductList barcodes={favouriteBarcodes} />
      )}
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    textAlign: 'center',
    color: '#8E99AB',
    fontSize: 16,
  },
});

