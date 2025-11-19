import React from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "./ui/button";
import { useAudioContext } from "./Layout";

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const PersistentFooterPlayer: React.FC = () => {
  const {
    audioRef,
    isPlaying,
    setIsPlaying,
    currentTime,
    duration,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
  } = useAudioContext();

  const handleSkipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, currentTime - 15);
    }
  };

  const handleSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, currentTime + 15);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = pos * audioRef.current.duration;
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t shadow-2xl">
      <div className="container mx-auto px-4 py-3">
        {/* Mini Progress Bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1 cursor-pointer bg-muted/30"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          {/* Episode Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex-shrink-0 w-12 h-12 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">EP 0</span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm truncate">
                Episode 0: Pilot
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                {formatTime(currentTime)} / {formatTime(duration)}
              </p>
            </div>
          </div>

          {/* Compact Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSkipBackward}
              className="h-8 w-8 hidden sm:flex"
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
              className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="ml-0.5 h-5 w-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleSkipForward}
              className="h-8 w-8 hidden sm:flex"
            >
              <SkipForward className="h-4 w-4" />
            </Button>

            <div className="hidden md:flex items-center gap-2 ml-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className="h-8 w-8"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="w-20"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersistentFooterPlayer;

