// app/_layout.tsx
import { AuthProvider } from '@/app/_context/AuthContext';
import { ThemeProvider } from '@/app/_context/ThemeContext';
import { store } from '@/store/store';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';

export default function RootLayout() {
  return (
    <Provider store={store}>
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
            
            {/* Other screens */}
            <Stack.Screen 
              name="destination/[id]"
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="transport/[destinationId]"
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="stations/[type]"
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="edit-profile"
              options={{ headerShown: false }}
            />
          </Stack>
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
}