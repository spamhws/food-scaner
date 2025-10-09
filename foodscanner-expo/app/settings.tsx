import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerButton}>
            <Ionicons name='chevron-back' size={28} color='#0066CC' />
            <Text style={styles.headerButtonText}>Back</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Settings Content */}
        <ScrollView style={styles.scrollView}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>GENERAL</Text>

            <Pressable style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name='notifications-outline' size={24} color='#0066CC' />
                <Text style={styles.settingText}>Notifications</Text>
              </View>
              <Ionicons name='chevron-forward' size={20} color='#8C8C8C' />
            </Pressable>

            <Pressable style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name='language-outline' size={24} color='#0066CC' />
                <Text style={styles.settingText}>Language</Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>English</Text>
                <Ionicons name='chevron-forward' size={20} color='#8C8C8C' />
              </View>
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SCANNER</Text>

            <Pressable style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name='volume-high-outline' size={24} color='#0066CC' />
                <Text style={styles.settingText}>Sound Effects</Text>
              </View>
              <Ionicons name='chevron-forward' size={20} color='#8C8C8C' />
            </Pressable>

            <Pressable style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name='save-outline' size={24} color='#0066CC' />
                <Text style={styles.settingText}>Auto-save Scans</Text>
              </View>
              <Ionicons name='chevron-forward' size={20} color='#8C8C8C' />
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ABOUT</Text>

            <Pressable style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name='information-circle-outline' size={24} color='#0066CC' />
                <Text style={styles.settingText}>App Version</Text>
              </View>
              <Text style={styles.settingValue}>1.0.0</Text>
            </Pressable>

            <Pressable style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name='document-text-outline' size={24} color='#0066CC' />
                <Text style={styles.settingText}>Privacy Policy</Text>
              </View>
              <Ionicons name='chevron-forward' size={20} color='#8C8C8C' />
            </Pressable>
          </View>
        </ScrollView>
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
  },
  headerButtonText: {
    fontSize: 17,
    color: '#0066CC',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8C8C8C',
    paddingHorizontal: 16,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  settingItem: {
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#000',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 16,
    color: '#8C8C8C',
  },
});
