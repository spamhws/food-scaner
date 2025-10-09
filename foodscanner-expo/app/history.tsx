import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useScanHistory } from '@/hooks/useScanHistory';
import { ProductCard } from '@/components/ProductCard';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryScreen() {
  const { history, isLoading, clearHistory } = useScanHistory();
  const router = useRouter();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerButton}>
            <Ionicons name='chevron-back' size={28} color='#0066CC' />
            <Text style={styles.headerButtonText}>Back</Text>
          </Pressable>
          <Text style={styles.headerTitle}>History</Text>
          <Pressable onPress={() => clearHistory()} style={styles.headerButton}>
            <Ionicons name='trash-outline' size={24} color='#DE1B1B' />
            <Text style={[styles.headerButtonText, styles.clearButtonText]}>Clear</Text>
          </Pressable>
        </View>

        {/* Product List */}
        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name='cube-outline' size={80} color='#D9D9D9' />
            <Text style={styles.emptyTitle}>No scans yet</Text>
            <Text style={styles.emptyDescription}>Start scanning products to see them here</Text>
          </View>
        ) : (
          <FlatList data={history} keyExtractor={(item, index) => `${item.barcode}-${index}`} renderItem={({ item }) => <ProductCard barcode={item.barcode} />} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#8C8C8C',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
  },
  headerButtonText: {
    fontSize: 17,
    color: '#0066CC',
  },
  clearButtonText: {
    color: '#DE1B1B',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#8C8C8C',
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
  },
});
