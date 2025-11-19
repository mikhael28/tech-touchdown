import React, { useRef } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useAudioContext } from "./Layout";

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const HeaderMusicPlayer: React.FC = () => {
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

  const progressRef = useRef<HTMLDivElement | null>(null);

  const handleSkipBackward = (): void => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, currentTime - 15);
    }
  };

  const handleSkipForward = (): void => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, currentTime + 15);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = pos * audioRef.current.duration;
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center space-x-3 bg-card/50 rounded-lg px-3 py-2 min-w-0 flex-1 max-w-md">
      {/* Song Info */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">Episode 0: Pilot</div>
        <div className="text-xs text-muted-foreground truncate">Tech Touchdown</div>
      </div>

      {/* Progress Bar */}
      <div className="flex-1 min-w-0 max-w-24 hidden sm:block">
        <div
          ref={progressRef}
          className="w-full h-1 bg-muted rounded-full cursor-pointer"
          onClick={handleProgressClick}
          title="Seek"
        >
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-1">
        <button
          onClick={handleSkipBackward}
          className="p-1 text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          aria-label="Skip backward 15s"
          title="Skip backward 15s"
        >
          <SkipBack size={16} />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-1 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
          aria-label={isPlaying ? "Pause" : "Play"}
          title={`${isPlaying ? "Pause" : "Play"}`}
        >
          {isPlaying ? (
            <Pause size={16} />
          ) : (
            <Play size={16} className="ml-0.5" />
          )}
        </button>

        <button
          onClick={handleSkipForward}
          className="p-1 text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          aria-label="Skip forward 15s"
          title="Skip forward 15s"
        >
          <SkipForward size={16} />
        </button>

        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-1 text-muted-foreground hover:text-foreground transition-colors hidden md:block"
          aria-label={isMuted ? "Unmute" : "Mute"}
          title={`${isMuted ? "Unmute" : "Mute"}`}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
    </div>
  );
};

export default HeaderMusicPlayer;
