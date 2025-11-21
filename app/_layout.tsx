// app/_layout.tsx
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { AuthProvider } from '@/app/context/AuthContext';
import { ThemeProvider } from '@/app/context/ThemeContext';

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