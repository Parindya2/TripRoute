// app/_layout.tsx
import { AuthProvider } from '@/_context/AuthContext';
import { ThemeProvider } from '@/_context/ThemeContext';
import { store } from '@/store/store';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AuthProvider>
          <ThemeProvider>
            <Stack>
              {/* Auth screens */}
              <Stack.Screen 
                name="(auth)" 
                options={{ headerShown: false }} 
              />
              
              {/* Main tabs */}
              <Stack.Screen 
                name="(tabs)" 
                options={{ headerShown: false }} 
              />
              
              {/* Destination screens */}
              <Stack.Screen 
                name="destination/[id]"
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="destinations/all"
                options={{ headerShown: false }}
              />
              
              {/* Transport screens */}
              <Stack.Screen 
                name="transport/[destinationId]"
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="transport/schedules"
                options={{ headerShown: false }}
              />
              
              {/* Station screens */}
              <Stack.Screen 
                name="stations/[type]"
                options={{ headerShown: false }}
              />
              
              {/* Profile screens */}
              <Stack.Screen 
                name="edit-profile"
                options={{ headerShown: false }}
              />
            </Stack>
          </ThemeProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </Provider>
  );
}