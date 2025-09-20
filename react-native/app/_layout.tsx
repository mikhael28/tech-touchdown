import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider, useTheme } from "@/hooks/useTheme";
import { SettingsProvider } from "@/hooks/useSettings";
import { AudioProvider } from "@/hooks/useAudio";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isDark, colors } = useTheme();
  
  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} backgroundColor={colors.background} />
      <Stack screenOptions={{ headerBackTitle: "Back" }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="chat/[gameId]" 
          options={{ 
            title: "Game Chat",
            presentation: "card",
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
          }} 
        />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SettingsProvider>
          <AudioProvider>
            <GestureHandlerRootView style={styles.container}>
              <RootLayoutNav />
            </GestureHandlerRootView>
          </AudioProvider>
        </SettingsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}