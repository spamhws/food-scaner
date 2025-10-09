import React from 'react';
import { View, Text, Image, ScrollView, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProduct } from '@/hooks/useProduct';
import { Ionicons } from '@expo/vector-icons';

export default function ProductDetailScreen() {
  const { barcode } = useLocalSearchParams<{ barcode: string }>();
  const router = useRouter();
  const { data: product, isLoading, error } = useProduct(barcode);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='#0066CC' />
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.errorContainer}>
          <Ionicons name='sad-outline' size={64} color='#8C8C8C' />
          <Text style={styles.errorTitle}>Product not found</Text>
          <Text style={styles.errorDescription}>Sorry, we couldn't find information for this product.</Text>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerButton}>
            <Ionicons name='chevron-back' size={28} color='#0066CC' />
            <Text style={styles.headerButtonText}>Back</Text>
          </Pressable>
        </View>

        {/* Product Image */}
        <View style={styles.imageSection}>
          {product.image ? (
            <Image source={{ uri: product.image }} style={styles.productImage} resizeMode='contain' />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name='image-outline' size={64} color='#8C8C8C' />
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.section}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productBrand}>{product.brand}</Text>
          <Text style={styles.productQuantity}>
            {product.product_quantity} {product.product_quantity_unit}
          </Text>
        </View>

        {/* Assessment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NUTRITIONAL VALUE PER 100G</Text>
          <View
            style={[
              styles.assessmentBadge,
              {
                borderColor: product.assessment.color,
                backgroundColor: `${product.assessment.color}15`,
              },
            ]}
          >
            <Text style={[styles.assessmentText, { color: product.assessment.color }]}>{product.assessment.description}</Text>
          </View>
        </View>

        {/* Nutrition Facts */}
        <View style={styles.section}>
          <View style={styles.nutritionRow}>
            <View style={styles.nutritionLeft}>
              <Ionicons name='flame-outline' size={24} color='#8C8C8C' />
              <Text style={styles.nutritionLabel}>Calories</Text>
            </View>
            <Text style={styles.nutritionValue}>{Math.round(product.nutrition.calories.value)} kcal</Text>
          </View>

          <View style={styles.nutritionRow}>
            <View style={styles.nutritionLeft}>
              <Ionicons name='nutrition-outline' size={24} color='#8C8C8C' />
              <Text style={styles.nutritionLabel}>Protein</Text>
            </View>
            <Text style={styles.nutritionValue}>{product.nutrition.protein.value.toFixed(1)} g</Text>
          </View>

          <View style={styles.nutritionRow}>
            <View style={styles.nutritionLeft}>
              <Ionicons name='water-outline' size={24} color='#8C8C8C' />
              <Text style={styles.nutritionLabel}>Fat</Text>
            </View>
            <Text style={styles.nutritionValue}>{product.nutrition.fat.value.toFixed(1)} g</Text>
          </View>

          <View style={[styles.nutritionRow, styles.nutritionRowLast]}>
            <View style={styles.nutritionLeft}>
              <Ionicons name='leaf-outline' size={24} color='#8C8C8C' />
              <Text style={styles.nutritionLabel}>Carbohydrates</Text>
            </View>
            <Text style={styles.nutritionValue}>{product.nutrition.carbohydrates.value.toFixed(1)} g</Text>
          </View>
        </View>

        {/* Key Features */}
        {(product.labels.length > 0 || product.allergens.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>KEY FEATURES</Text>

            {product.labels.length > 0 && (
              <View style={styles.featureSection}>
                <Text style={styles.featureTitle}>✓ High in protein</Text>
                <View style={styles.labelContainer}>
                  {product.labels.slice(0, 3).map((label, index) => (
                    <View key={index} style={styles.label}>
                      <Text style={styles.labelText}>{label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {product.allergens.length > 0 && (
              <View style={styles.featureSection}>
                <Text style={styles.allergenTitle}>Allergens:</Text>
                <View style={styles.labelContainer}>
                  {product.allergens.map((allergen, index) => (
                    <View key={index} style={styles.allergen}>
                      <Text style={styles.allergenText}>{allergen}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <Pressable style={styles.actionButtonOutline}>
            <Ionicons name='heart-outline' size={24} color='#404040' />
          </Pressable>
          <Pressable style={styles.actionButtonFilled}>
            <Ionicons name='share-outline' size={24} color='white' />
          </Pressable>
        </View>

        {/* Bottom padding */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#8C8C8C',
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  errorDescription: {
    fontSize: 16,
    color: '#8C8C8C',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#0066CC',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerButtonText: {
    fontSize: 17,
    color: '#0066CC',
  },
  imageSection: {
    backgroundColor: 'white',
    padding: 24,
    alignItems: 'center',
  },
  productImage: {
    width: 192,
    height: 192,
    borderRadius: 16,
  },
  imagePlaceholder: {
    width: 192,
    height: 192,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  productBrand: {
    fontSize: 18,
    color: '#8C8C8C',
    marginBottom: 16,
  },
  productQuantity: {
    fontSize: 16,
    color: '#737373',
  },
  assessmentBadge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  assessmentText: {
    fontSize: 15,
    fontWeight: '600',
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  nutritionRowLast: {
    borderBottomWidth: 0,
  },
  nutritionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nutritionLabel: {
    fontSize: 16,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  featureSection: {
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#038537',
    marginBottom: 8,
  },
  allergenTitle: {
    fontSize: 16,
    color: '#737373',
    marginBottom: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  label: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  labelText: {
    fontSize: 14,
    color: '#737373',
  },
  allergen: {
    backgroundColor: '#FEECEC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DE1B1B',
  },
  allergenText: {
    fontSize: 14,
    color: '#DE1B1B',
  },
  actionsSection: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    gap: 12,
  },
  actionButtonOutline: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonFilled: {
    flex: 1,
    backgroundColor: '#0066CC',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
