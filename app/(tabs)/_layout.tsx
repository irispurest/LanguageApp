import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { StyleSheet, type ColorValue } from 'react-native';
import { strings } from '@/i18n';
import { theme } from '@/ui/theme';

function resolveTabColor(color: ColorValue): string {
  return typeof color === 'string' ? color : theme.colors.textMuted;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
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
    paddingTop: theme.spacing.xs,
  },
  tabItem: {
    paddingVertical: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
});
