import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { StyleSheet, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { strings } from '@/i18n';
import { theme } from '@/ui/theme';

function resolveTabColor(color: ColorValue): string {
  return typeof color === 'string' ? color : theme.colors.textMuted;
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 66 + insets.bottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.accentStrong,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarHideOnKeyboard: true,
        tabBarLabelPosition: 'below-icon',
        tabBarLabelStyle: styles.tabLabel,
        tabBarIconStyle: styles.tabIcon,
        tabBarStyle: [
          styles.tabBar,
          {
            height: tabBarHeight,
            paddingBottom: Math.max(insets.bottom, 8),
          },
        ],
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: strings.tabs.home,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={resolveTabColor(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="course"
        options={{
          title: strings.tabs.course,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'school' : 'school-outline'} size={size} color={resolveTabColor(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="dictionary"
        options={{
          title: strings.tabs.dictionary,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'book' : 'book-outline'} size={size} color={resolveTabColor(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="grammar"
        options={{
          title: strings.tabs.grammar,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'library' : 'library-outline'} size={size} color={resolveTabColor(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="texts"
        options={{
          title: strings.tabs.texts,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'reader' : 'reader-outline'} size={size} color={resolveTabColor(color)} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: theme.spacing.sm,
  },
  tabItem: {
    paddingTop: 2,
  },
  tabIcon: {
    marginTop: 2,
  },
  tabLabel: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '600',
  },
});
