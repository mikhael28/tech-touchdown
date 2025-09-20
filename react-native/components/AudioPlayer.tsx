import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAudio } from '@/hooks/useAudio';

const AudioPlayerComponent: React.FC = () => {
  const { colors, spacing, borderRadius, fontSize } = useTheme();
  const { audioState, play, pause, seekTo, loadTrack } = useAudio();

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (audioState.isPlaying) {
      pause();
    } else {
      if (!audioState.currentTrack) {
        loadTrack('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
      } else {
        play();
      }
    }
  };

  const handleSeek = (value: number) => {
    const position = (value / 100) * audioState.duration;
    seekTo(position);
  };

  const progressPercentage = audioState.duration > 0 
    ? (audioState.position / audioState.duration) * 100 
    : 0;

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
      <View style={[styles.trackInfo, { marginBottom: spacing.md }]}>
        <Text style={[styles.trackTitle, { color: colors.text, fontSize: fontSize.lg }]}>
          {audioState.currentTrack ? 'Tech Touchdown Podcast' : 'No Track Loaded'}
        </Text>
        <Text style={[styles.trackArtist, { color: colors.textSecondary, fontSize: fontSize.sm }]}>
          Episode #42: The Future of Sports Tech
        </Text>
      </View>

      <View style={[styles.progressContainer, { marginBottom: spacing.lg }]}>
        {Platform.OS === 'web' ? (
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.accent,
                  width: `${progressPercentage}%`,
                },
              ]}
            />
          </View>
        ) : (
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={progressPercentage}
            onSlidingComplete={handleSeek}
            minimumTrackTintColor={colors.accent}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.accent}
          />
        )}
        <View style={styles.timeContainer}>
          <Text style={[styles.timeText, { color: colors.textSecondary, fontSize: fontSize.xs }]}>
            {formatTime(audioState.position)}
          </Text>
          <Text style={[styles.timeText, { color: colors.textSecondary, fontSize: fontSize.xs }]}>
            {formatTime(audioState.duration)}
          </Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, { padding: spacing.sm }]}
          onPress={() => seekTo(Math.max(0, audioState.position - 15000))}
          testID="skip-back-button"
        >
          <SkipBack size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.playButton,
            {
              backgroundColor: colors.accent,
              borderRadius: borderRadius.xl,
              padding: spacing.md,
            },
          ]}
          onPress={handlePlayPause}
          disabled={audioState.isLoading}
          testID="play-pause-button"
        >
          {audioState.isLoading ? (
            <View style={styles.loadingIndicator} />
          ) : audioState.isPlaying ? (
            <Pause size={32} color={colors.background} />
          ) : (
            <Play size={32} color={colors.background} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, { padding: spacing.sm }]}
          onPress={() => seekTo(Math.min(audioState.duration, audioState.position + 15000))}
          testID="skip-forward-button"
        >
          <SkipForward size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

AudioPlayerComponent.displayName = 'AudioPlayer';

export const AudioPlayer = React.memo(AudioPlayerComponent);

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  trackInfo: {
    alignItems: 'center',
  },
  trackTitle: {
    fontWeight: '700' as const,
    textAlign: 'center',
    marginBottom: 4,
  },
  trackArtist: {
    textAlign: 'center',
  },
  progressContainer: {},
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontWeight: '500' as const,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  controlButton: {
    borderRadius: 20,
  },
  playButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },
});