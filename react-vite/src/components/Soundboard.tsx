import React, { useState } from 'react';
import { Volume2, Music, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { SoundEffect, SOUND_EFFECTS } from '../services/audioMixer';
import { cn } from '../lib/utils';

interface SoundboardProps {
  onPlaySound: (effect: SoundEffect) => void;
  disabled?: boolean;
}

const Soundboard: React.FC<SoundboardProps> = ({ onPlaySound, disabled = false }) => {
  const [playingSound, setPlayingSound] = useState<string | null>(null);

  const handlePlaySound = (effect: SoundEffect) => {
    if (disabled) return;

    // Play the sound
    onPlaySound(effect);

    // Visual feedback
    setPlayingSound(effect.id);
    setTimeout(() => {
      setPlayingSound(null);
    }, effect.duration);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="rounded-full bg-purple-500/10 p-2">
          <Volume2 className="h-5 w-5 text-purple-500" />
        </div>
        <div>
          <h3 className="font-semibold">Sound Board</h3>
          <p className="text-sm text-muted-foreground">
            Click to play sound effects during your recording
          </p>
        </div>
      </div>

      {/* Sound Effect Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {SOUND_EFFECTS.map((effect) => {
          const isPlaying = playingSound === effect.id;

          return (
            <button
              key={effect.id}
              onClick={() => handlePlaySound(effect)}
              disabled={disabled}
              className={cn(
                'group relative flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-all',
                'hover:scale-105 active:scale-95',
                disabled
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer hover:shadow-lg',
                isPlaying
                  ? `${effect.color} border-transparent text-white shadow-lg`
                  : 'border-border bg-card text-foreground hover:border-purple-500/50'
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  'mb-2 rounded-full p-3 transition-colors',
                  isPlaying ? 'bg-white/20' : `${effect.color} bg-opacity-10`
                )}
              >
                {effect.type === 'intro' || effect.type === 'outro' ? (
                  <Music
                    className={cn(
                      'h-6 w-6',
                      isPlaying ? 'animate-pulse text-white' : 'text-purple-500'
                    )}
                  />
                ) : (
                  <Sparkles
                    className={cn(
                      'h-6 w-6',
                      isPlaying ? 'animate-spin text-white' : 'text-purple-500'
                    )}
                  />
                )}
              </div>

              {/* Label */}
              <span className={cn('text-sm font-medium', isPlaying && 'text-white')}>
                {effect.name}
              </span>

              {/* Playing indicator */}
              {isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex space-x-1">
                    <div className="h-6 w-1 animate-pulse bg-white/60"></div>
                    <div
                      className="h-6 w-1 animate-pulse bg-white/60"
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className="h-6 w-1 animate-pulse bg-white/60"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Info Text */}
      {!disabled && (
        <div className="rounded border border-purple-500/20 bg-purple-500/5 p-3 text-sm text-muted-foreground">
          <p className="flex items-start space-x-2">
            <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-500" />
            <span>
              Sound effects are mixed in real-time with your microphone audio. Try them out while
              recording!
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Soundboard;
