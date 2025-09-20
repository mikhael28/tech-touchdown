import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Headphones } from 'lucide-react-native';
import { AudioPlayer } from '@/components/AudioPlayer';
import { Soundboard } from '@/components/Soundboard';
import { TabletLayout } from '@/components/TabletLayout';

export default function PodcastScreen() {
  const { colors, spacing, fontSize } = useTheme();

  return (
    <TabletLayout selectedScreen="podcast">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.content, { padding: spacing.lg }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.header, { marginBottom: spacing.xl }]}>
            <Headphones size={32} color={colors.accent} />
            <Text style={[styles.title, { color: colors.text, fontSize: fontSize.xl }]}>
              Podcast Player
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: fontSize.md }]}>
              Listen to Tech Touchdown episodes and use the soundboard
            </Text>
          </View>

          <AudioPlayer />
          <Soundboard />
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
});