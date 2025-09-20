import { useState, useEffect, useMemo, useCallback } from 'react';
import { Platform } from 'react-native';
import createContextHook from '@nkzw/create-context-hook';

type ThemeMode = 'light' | 'dark' | 'system';

interface Settings {
  showPictures: boolean;
  themeMode: ThemeMode;
}

const DEFAULT_SETTINGS: Settings = {
  showPictures: true,
  themeMode: 'dark' as ThemeMode,
};

const SETTINGS_STORAGE_KEY = 'tech_touchdown_settings';

const getAsyncStorage = () => {
  if (Platform.OS === 'web') {
    return {
      getItem: async (key: string) => {
        try {
          return localStorage.getItem(key);
        } catch {
          return null;
        }
      },
      setItem: async (key: string, value: string) => {
        try {
          localStorage.setItem(key, value);
        } catch {
          // Ignore storage errors on web
        }
      },
    };
  }
  // For native platforms, we'll use a simple in-memory storage for now
  const storage = new Map<string, string>();
  return {
    getItem: async (key: string) => storage.get(key) || null,
    setItem: async (key: string, value: string) => {
      storage.set(key, value);
    },
  };
};

export const [SettingsProvider, useSettings] = createContextHook(() => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const storage = useMemo(() => getAsyncStorage(), []);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await storage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = useCallback(async (newSettings: Settings) => {
    if (!newSettings || typeof newSettings !== 'object') {
      console.log('Invalid settings object');
      return;
    }
    
    try {
      await storage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  }, [storage]);

  const updateSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  return useMemo(() => ({
    settings,
    isLoading,
    updateSetting,
  }), [settings, isLoading, updateSetting]);
});