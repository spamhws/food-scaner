import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import {
  IconUser,
  IconBell,
  IconLanguage,
  IconPalette,
  IconShieldCheck,
  IconInfoCircle,
  IconChevronRight,
  IconArrowLeft,
} from '@tabler/icons-react-native';
import { useNavigation } from '@/navigation/SimpleNavigator';

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
}

function SettingItem({ icon, title, subtitle, onPress }: SettingItemProps) {
  return (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.textContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && (
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        )}
      </View>
      <IconChevronRight size={20} stroke="#8E99AB" />
    </TouchableOpacity>
  );
}

export function SettingsScreen() {
  const { goBack } = useNavigation();
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <IconArrowLeft size={24} stroke="#434A54" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          <SettingItem
            icon={<IconUser size={24} stroke="#3272D9" />}
            title="Profile"
            subtitle="Manage your profile"
            onPress={() => console.log('Profile')}
          />
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APP SETTINGS</Text>
          <SettingItem
            icon={<IconBell size={24} stroke="#3272D9" />}
            title="Notifications"
            subtitle="Manage notifications"
            onPress={() => console.log('Notifications')}
          />
          <SettingItem
            icon={<IconLanguage size={24} stroke="#3272D9" />}
            title="Language"
            subtitle="English"
            onPress={() => console.log('Language')}
          />
          <SettingItem
            icon={<IconPalette size={24} stroke="#3272D9" />}
            title="Appearance"
            subtitle="Light theme"
            onPress={() => console.log('Theme')}
          />
        </View>

        {/* About Section */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>INFORMATION</Text>
          <SettingItem
            icon={<IconShieldCheck size={24} stroke="#3272D9" />}
            title="Privacy"
            subtitle="Privacy policy"
            onPress={() => console.log('Privacy')}
          />
          <SettingItem
            icon={<IconInfoCircle size={24} stroke="#3272D9" />}
            title="About"
            subtitle="Version 1.0.0"
            onPress={() => console.log('About')}
          />
        </View>
      </ScrollView>
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
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#434A54',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 24,
  },
  lastSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E99AB',
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEFF5',
  },
  iconContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#434A54',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#8E99AB',
    marginTop: 2,
  },
});
