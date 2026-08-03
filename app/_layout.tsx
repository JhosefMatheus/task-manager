import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from 'expo-router/react-navigation';
import { PortalHost } from '@rn-primitives/portal';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '../db/drizzle/migrations';
import { Text } from '@/components/ui/text';
import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { ToastProvider } from '@/contexts';
import { database } from '@/db/client';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { error } = useMigrations(database, migrations);

  const { colorScheme } = useColorScheme();

  if (error !== undefined) {
    return (
      <SafeAreaProvider>
        <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
          <SafeAreaView
            style={styles.migrationErrorSafeAreaView}
            className="items-center justify-center bg-background p-1"
            edges={['top', 'bottom']}>
            <Text>Migration error: {error?.message}</Text>
          </SafeAreaView>
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
        <ToastProvider>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="task/create" options={{ title: 'Create Task' }} />
            <Stack.Screen name="task/[id]" options={{ title: "Task's Details" }} />
          </Stack>
          <PortalHost />
        </ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  migrationErrorSafeAreaView: {
    flex: 1,
  },
});
