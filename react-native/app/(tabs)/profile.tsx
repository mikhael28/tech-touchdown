import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useSettings } from '@/hooks/useSettings';
import { Settings } from 'lucide-react-native';
import { SettingsToggle, ThemeSelector } from '@/components/SettingsToggle';
import { TabletLayout } from '@/components/TabletLayout';

export default function ProfileScreen() {
  const { colors, spacing, fontSize, borderRadius, themeMode, setThemeMode } = useTheme();
  const { settings, updateSetting } = useSettings();

  return (
    <TabletLayout selectedScreen="profile">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.content, { padding: spacing.lg }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.header, { marginBottom: spacing.xl }]}>
            <Settings size={32} color={colors.accent} />
            <Text style={[styles.title, { color: colors.text, fontSize: fontSize.xl }]}>
              Settings
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: fontSize.md }]}>
              Customize your Tech Touchdown experience
            </Text>
          </View>

          <View
            style={[
              styles.settingsSection,
              {
                backgroundColor: colors.card,
                borderRadius: borderRadius.lg,
                padding: spacing.lg,
                borderWidth: 1,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fontSize.lg }]}>
              Display
            </Text>
            
            <SettingsToggle
              label="Show Pictures"
              description="Display article images in the feed"
              value={settings.showPictures}
              onValueChange={(value) => updateSetting('showPictures', value)}
              testID="show-pictures-toggle"
            />
            
            <ThemeSelector
              value={themeMode}
              onValueChange={setThemeMode}
              testID="theme-selector"
            />
          </View>
        </ScrollView>
      </View>
    </TabletLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontWeight: '700' as const,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 22,
  },
  settingsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '600' as const,
    marginBottom: 16,
  },
});