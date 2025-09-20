import { useState, useEffect, useMemo, useCallback } from 'react';
import { Platform } from 'react-native';
import { Audio } from 'expo-av';
import createContextHook from '@nkzw/create-context-hook';

interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
  position: number;
  duration: number;
  currentTrack: string | null;
}

interface SoundboardSound {
  id: string;
  name: string;
  url: string;
}

const DEFAULT_AUDIO_STATE: AudioState = {
  isPlaying: false,
  isLoading: false,
  position: 0,
  duration: 0,
  currentTrack: null,
};

const SOUNDBOARD_SOUNDS: SoundboardSound[] = [
  {
    id: 'touchdown',
    name: 'TOUCHDOWN!',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  },
  {
    id: 'field_goal',
    name: 'Field Goal!',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-04.wav',
  },
  {
    id: 'interception',
    name: 'Interception!',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-03.wav',
  },
  {
    id: 'sack',
    name: 'SACK!',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-02.wav',
  },
];

export const [AudioProvider, useAudio] = createContextHook(() => {
  const [audioState, setAudioState] = useState<AudioState>(DEFAULT_AUDIO_STATE);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [soundboardSounds, setSoundboardSounds] = useState<Map<string, Audio.Sound>>(new Map());

  const onPlaybackStatusUpdate = useCallback((status: any) => {
    if (status.isLoaded) {
      setAudioState(prev => ({
        ...prev,
        isPlaying: status.isPlaying,
        position: status.positionMillis || 0,
        duration: status.durationMillis || 0,
      }));
    }
  }, []);

  const setupAudio = useCallback(async () => {
    if (Platform.OS !== 'web') {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.log('Error setting up audio:', error);
      }
    }
  }, []);

  const cleanup = useCallback(async () => {
    if (sound) {
      await sound.unloadAsync();
    }
    for (const [, soundInstance] of soundboardSounds) {
      await soundInstance.unloadAsync();
    }
  }, [sound, soundboardSounds]);

  useEffect(() => {
    setupAudio();
    return () => {
      cleanup();
    };
  }, [setupAudio, cleanup]);

  const loadTrack = useCallback(async (uri: string) => {
    try {
      setAudioState(prev => ({ ...prev, isLoading: true }));
      
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
      setAudioState(prev => ({ 
        ...prev, 
        isLoading: false, 
        currentTrack: uri 
      }));
    } catch (error) {
      console.log('Error loading track:', error);
      setAudioState(prev => ({ ...prev, isLoading: false }));
    }
  }, [sound, onPlaybackStatusUpdate]);

  const play = useCallback(async () => {
    if (sound) {
      try {
        await sound.playAsync();
      } catch (error) {
        console.log('Error playing sound:', error);
      }
    }
  }, [sound]);

  const pause = useCallback(async () => {
    if (sound) {
      try {
        await sound.pauseAsync();
      } catch (error) {
        console.log('Error pausing sound:', error);
      }
    }
  }, [sound]);

  const seekTo = useCallback(async (position: number) => {
    if (typeof position !== 'number' || position < 0) {
      console.log('Invalid position value');
      return;
    }
    
    if (sound) {
      try {
        await sound.setPositionAsync(position);
      } catch (error) {
        console.log('Error seeking:', error);
      }
    }
  }, [sound]);

  const playSoundboardSound = useCallback(async (soundId: string) => {
    try {
      const soundData = SOUNDBOARD_SOUNDS.find(s => s.id === soundId);
      if (!soundData) return;

      let soundInstance = soundboardSounds.get(soundId);
      
      if (!soundInstance) {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: soundData.url },
          { shouldPlay: false }
        );
        soundInstance = newSound;
        setSoundboardSounds(prev => new Map(prev).set(soundId, newSound));
      }

      await soundInstance.replayAsync();
    } catch (error) {
      console.log('Error playing soundboard sound:', error);
    }
  }, [soundboardSounds]);

  return useMemo(() => ({
    audioState,
    loadTrack,
    play,
    pause,
    seekTo,
    playSoundboardSound,
    soundboardSounds: SOUNDBOARD_SOUNDS,
  }), [audioState, loadTrack, play, pause, seekTo, playSoundboardSound]);
});