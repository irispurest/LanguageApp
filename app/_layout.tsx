import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { strings } from '@/i18n';
import { theme } from '@/ui/theme';

const stackHeaderOptions = {
  headerShown: true,
  headerStyle: { backgroundColor: theme.colors.background },
  headerTintColor: theme.colors.text,
  headerTitleStyle: { fontWeight: '600' as const },
  headerShadowVisible: false,
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="lesson/[lessonId]" />
        <Stack.Screen
          name="about"
          options={{ ...stackHeaderOptions, title: strings.about.title }}
        />
        <Stack.Screen
          name="review"
          options={{ ...stackHeaderOptions, title: strings.review.title }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
