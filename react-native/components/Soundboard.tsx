import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Volume2 } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAudio } from '@/hooks/useAudio';

const SoundboardComponent: React.FC = () => {
  const { colors, spacing, borderRadius, fontSize } = useTheme();
  const { playSoundboardSound, soundboardSounds } = useAudio();

  const handleSoundPress = (soundId: string) => {
    playSoundboardSound(soundId);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderRadius: borderRadius.lg,
          padding: spacing.lg,
          borderWidth: 1,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={[styles.header, { marginBottom: spacing.lg }]}>
        <Volume2 size={24} color={colors.accent} />
        <Text style={[styles.title, { color: colors.text, fontSize: fontSize.lg }]}>
          Soundboard
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.soundGrid}
        showsVerticalScrollIndicator={false}
      >
        {soundboardSounds.map((sound) => (
          <TouchableOpacity
            key={sound.id}
            style={[
              styles.soundButton,
              {
                backgroundColor: colors.background,
                borderRadius: borderRadius.md,
                borderWidth: 2,
                borderColor: colors.border,
                padding: spacing.md,
              },
            ]}
            onPress={() => handleSoundPress(sound.id)}
            activeOpacity={0.7}
            testID={`soundboard-${sound.id}`}
          >
            <Text
              style={[
                styles.soundButtonText,
                {
                  color: colors.text,
                  fontSize: fontSize.sm,
                },
              ]}
            >
              {sound.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

SoundboardComponent.displayName = 'Soundboard';

export const Soundboard = React.memo(SoundboardComponent);

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontWeight: '700' as const,
  },
  soundGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  soundButton: {
    flex: 1,
    minWidth: '45%',
    maxWidth: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  soundButtonText: {
    fontWeight: '600' as const,
    textAlign: 'center',
  },
});