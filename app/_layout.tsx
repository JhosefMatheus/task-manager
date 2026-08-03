import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from 'expo-router/react-navigation';
import { PortalHost } from '@rn-primitives/portal';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { NativeTabs } from 'expo-router/build/native-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { openDatabaseSync } from 'expo-sqlite';
import { DATABASE_NAME } from '@/constants';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '../db/drizzle/migrations';
import { Text } from '@/components/ui/text';
import { StyleSheet } from 'react-native';
import { House } from 'lucide-react-native';
import { Stack } from 'expo-router';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

const sqliteDatabase = openDatabaseSync(DATABASE_NAME);

const database = drizzle(sqliteDatabase);

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
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="task/create" options={{ title: 'Create Task' }} />
        </Stack>
        <PortalHost />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  migrationErrorSafeAreaView: {
    flex: 1,
  },
});
