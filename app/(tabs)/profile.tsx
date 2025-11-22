// app/(tabs)/profile.tsx
import { useAuth } from '@/app/_context/AuthContext';
import { useTheme } from '@/app/_context/ThemeContext';
import { getThemeColors } from '@/app/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const ProfileScreen = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  // Get profile image source - use default if no user image
  const getProfileImage = () => {
    if (user?.image) {
      return { uri: user.image };
    }
    return require('../../assets/images/profile.jpg');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
          <TouchableOpacity onPress={() => router.push('/edit-profile')}>
            <Text style={[styles.editButton, { color: colors.primary }]}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Image and Name */}
        <View style={styles.profileSection}>
          <Image
            source={getProfileImage()}
            style={[styles.profileImage, { borderColor: colors.primary }]}
          />
          <Text style={[styles.name, { color: colors.text }]}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={[styles.username, { color: colors.primary }]}>@{user?.username}</Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>{user?.email}</Text>
        </View>

        {/* User Details Card */}
        <View style={[styles.detailsCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Gender</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {user?.gender || 'Not specified'}
            </Text>
          </View>

          <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Email</Text>
            <Text style={[styles.detailValue, { color: colors.text }]} numberOfLines={1}>
              {user?.email}
            </Text>
          </View>

          <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Ionicons name="at-outline" size={20} color={colors.textSecondary} />
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Username</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {user?.username}
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {/* Dark Mode */}
          <View style={[styles.menuItem, { backgroundColor: colors.surface }]}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="moon-outline" size={22} color={colors.textSecondary} />
              <Text style={[styles.menuText, { color: colors.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#E0E0E0', true: '#81D4FA' }}
              thumbColor={isDarkMode ? '#00BCD4' : '#F4F3F4'}
            />
          </View>

          {/* Settings */}
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.surface }]}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="settings-outline" size={22} color={colors.textSecondary} />
              <Text style={[styles.menuText, { color: colors.text }]}>Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>

          {/* Help & Support */}
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.surface }]}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="help-circle-outline" size={22} color={colors.textSecondary} />
              <Text style={[styles.menuText, { color: colors.text }]}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            style={[styles.logoutButton, { borderColor: colors.accent, backgroundColor: colors.surface }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={22} color={colors.accent} />
            <Text style={[styles.logoutText, { color: colors.accent }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  editButton: {
    fontSize: 15,
    fontWeight: '500',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0E0E0',
    marginBottom: 16,
    borderWidth: 3,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  username: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
  },
  detailsCard: {
    marginHorizontal: 24,
    borderRadius: 40,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  detailLabel: {
    flex: 1,
    fontSize: 14,
    marginLeft: 12,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    maxWidth: 150,
    textTransform: 'capitalize',
  },
  menuContainer: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 50,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 50,
    gap: 8,
    borderWidth: 1.5,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;