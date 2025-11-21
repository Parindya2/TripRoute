// app/(auth)/welcome.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const WelcomeScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#00BCD4', '#0097A7', '#006064']}
        style={styles.gradient}
      >
        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Logo/Icon Section */}
          <View style={styles.logoContainer}>
            <Text style={styles.appName}>TripRoute</Text>
            <Text style={styles.tagline}>Discover Your Next Adventure</Text>
          </View>

          {/* Illustration or Image */}
          <View style={styles.illustrationContainer}>
            <Ionicons name="earth" size={120} color="rgba(255,255,255,0.3)" />
          </View>
        </View>

        {/* CTA Buttons - Fixed at Bottom */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.loginButtonText}>Get Started</Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.signupLink}>Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Wave Decoration */}
          <View style={styles.waveContainer}>
            <Ionicons name="water" size={24} color="rgba(255,255,255,0.2)" />
            <Ionicons name="water" size={24} color="rgba(255,255,255,0.2)" />
            <Ionicons name="water" size={24} color="rgba(255,255,255,0.2)" />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 30,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  appName: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  illustrationContainer: {
    alignItems: 'center',
  },
  buttonContainer: {
    paddingBottom: 50,
  },
  loginButton: {
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 20,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00BCD4',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signupText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  signupLink: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  waveContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
});

export default WelcomeScreen;