import { Tabs } from "expo-router";
import { Home, Headphones, Trophy, User } from "lucide-react-native";
import React from "react";
import { Platform, Dimensions } from "react-native";
import { useTheme } from "@/hooks/useTheme";

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function TabLayout() {
  const { colors } = useTheme();

  // On tablets, we don't show tabs since we have side navigation
  if (isTablet) {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: { display: 'none' },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => <Home size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="podcast"
          options={{
            title: "Podcast",
            tabBarIcon: ({ color }) => <Headphones size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="tech"
          options={{
            title: "Games",
            tabBarIcon: ({ color }) => <Trophy size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => <User size={24} color={color} />,
          }}
        />
      </Tabs>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600' as const,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="podcast"
        options={{
          title: "Podcast",
          tabBarIcon: ({ color }) => <Headphones size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tech"
        options={{
          title: "Games",
          tabBarIcon: ({ color }) => <Trophy size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}