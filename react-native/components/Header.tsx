import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { Bell, Search, Menu, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';

interface Song {
  title: string;
  url: string;
  artist: string;
}

interface HeaderProps {
  onMenuPress?: () => void;
  showMenu?: boolean;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const podcastSongs: Song[] = [
  {
    title: "Tech Touchdown Ep. 0",
    url: "/data/tech-touchdown-ep-0.mp3",
    artist: "Michael Nightingale",
  },
];

const Header: React.FC<HeaderProps> = ({ onMenuPress, showMenu = false }) => {
  const { colors, spacing, fontSize } = useTheme();
  const insets = useSafeAreaInsets();

  // Music player state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const currentSong = podcastSongs[currentSongIndex];

  // Music player functions
  const loadSound = async () => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: currentSong.url },
        { shouldPlay: isPlaying, volume: isMuted ? 0 : 1 }
      );
      setSound(newSound);
      // Duration will be set when the sound loads
      
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setCurrentTime(status.positionMillis / 1000);
          if (status.durationMillis) {
            setDuration(status.durationMillis / 1000);
          }
          if (status.didJustFinish) {
            handleNext();
          }
        }
      });
    } catch {
      Alert.alert('Error', 'Failed to load audio');
    }
  };

  const handlePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    } else {
      await loadSound();
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    setCurrentSongIndex((prevIndex) =>
      prevIndex === podcastSongs.length - 1 ? 0 : prevIndex + 1
    );
    setIsPlaying(false);
  };

  const handlePrevious = () => {
    setCurrentSongIndex((prevIndex) =>
      prevIndex === 0 ? podcastSongs.length - 1 : prevIndex - 1
    );
    setIsPlaying(false);
  };

  const toggleMute = async () => {
    if (sound) {
      await sound.setVolumeAsync(isMuted ? 1 : 0);
    }
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    loadSound();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSongIndex]);

  useEffect(() => {
    if (sound) {
      sound.setVolumeAsync(isMuted ? 0 : 1);
    }
  }, [isMuted, sound]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + spacing.sm,
          paddingHorizontal: spacing.md,
          paddingBottom: spacing.sm,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.content}>
        {showMenu && (
          <TouchableOpacity
            onPress={onMenuPress}
            style={[styles.iconButton, { marginRight: spacing.sm }]}
            testID="menu-button"
          >
            <Menu size={24} color={colors.text} />
          </TouchableOpacity>
        )}
        
        <View style={styles.titleSection}>
          <Text style={[styles.logo, { fontSize: fontSize.xl }]}>⚡</Text>
          <Text style={[styles.title, { color: colors.text, fontSize: fontSize.xl }]}>
            Tech Touchdown
          </Text>
        </View>

        {/* Compact Music Player */}
        <View style={[styles.musicPlayer, { backgroundColor: colors.card }]}>
          <View style={styles.songInfo}>
            <Text style={[styles.songTitle, { color: colors.text, fontSize: fontSize.xs }]} numberOfLines={1}>
              {currentSong.title}
            </Text>
            <Text style={[styles.songTime, { color: colors.textSecondary, fontSize: fontSize.xs }]}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Text>
          </View>
          
          <View style={styles.playerControls}>
            <TouchableOpacity onPress={handlePrevious} style={styles.controlButton}>
              <SkipBack size={14} color={colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handlePlayPause} style={[styles.playButton, { backgroundColor: colors.accent }]}>
              {isPlaying ? (
                <Pause size={16} color={colors.background} />
              ) : (
                <Play size={16} color={colors.background} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleNext} style={styles.controlButton}>
              <SkipForward size={14} color={colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={toggleMute} style={styles.controlButton}>
              {isMuted ? (
                <VolumeX size={14} color={colors.text} />
              ) : (
                <Volume2 size={14} color={colors.text} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconButton} testID="search-button">
            <Search size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} testID="notifications-button">
            <Bell size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {},
  title: {
    fontWeight: '800' as const,
    marginLeft: 8,
  },
  musicPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginHorizontal: 8,
    minWidth: 200,
    maxWidth: 250,
  },
  songInfo: {
    flex: 1,
    marginRight: 8,
  },
  songTitle: {
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  songTime: {
    fontSize: 10,
  },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  controlButton: {
    padding: 4,
  },
  playButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
});

export { Header };