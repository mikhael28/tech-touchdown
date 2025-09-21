import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  ChevronDown,
  Volume2,
  VolumeX,
} from "lucide-react";

interface Song {
  title: string;
  url: string;
  artist: string;
}

interface Playlist {
  name: string;
  songs: Song[];
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const playlists: Playlist[] = [
  {
    name: "Tech Touchdown Podcast",
    songs: [
      {
        title: "Tech Touchdown Ep. 0",
        url: "/data/tech-touchdown-ep-0.mp3",
        artist: "Michael Nightingale",
      },
    ],
  },
];

const HeaderMusicPlayer: React.FC = () => {
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState<number>(0);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [shuffle, setShuffle] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const currentPlaylist = playlists[currentPlaylistIndex];
  const currentSong = currentPlaylist.songs[currentSongIndex];

  // Save volume state to localStorage
  useEffect(() => {
    const savedVolume = localStorage.getItem("mp3PlayerVolume");
    if (savedVolume) {
      setVolume(parseFloat(savedVolume));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mp3PlayerVolume", volume.toString());
  }, [volume]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;

      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          setError("Failed to play audio. Please try again.");
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSongIndex, currentPlaylistIndex, volume, isMuted]);

  const toggleMute = (): void => {
    setIsMuted(!isMuted);
  };

  const handlePlaylistSelect = (index: number): void => {
    if (index !== currentPlaylistIndex) {
      setCurrentPlaylistIndex(index);
      setCurrentSongIndex(0);
      setIsPlaying(false);
      setError(null);
    }
    setIsDropdownOpen(false);
  };

  const handlePlayPause = (): void => {
    setIsPlaying(!isPlaying);
    setError(null);
  };

  const handlePrevious = (): void => {
    setCurrentSongIndex((prevIndex) =>
      prevIndex === 0 ? currentPlaylist.songs.length - 1 : prevIndex - 1,
    );
    setError(null);
  };

  const handleNext = (): void => {
    if (shuffle) {
      const nextIndex = Math.floor(
        Math.random() * currentPlaylist.songs.length,
      );
      setCurrentSongIndex(nextIndex);
    } else {
      setCurrentSongIndex((prevIndex) =>
        prevIndex === currentPlaylist.songs.length - 1 ? 0 : prevIndex + 1,
      );
    }
    setError(null);
  };

  const handleEnded = (): void => {
    handleNext();
  };

  const handleTimeUpdate = (): void => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setCurrentTime(current);
      setDuration(duration);
      setProgress((current / duration) * 100 || 0);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = pos * audioRef.current.duration;
    }
  };

  return (
    <div className="flex items-center space-x-3 bg-card/50 rounded-lg px-3 py-2 min-w-0 flex-1 max-w-md">
      {/* Playlist Selector */}
      <div className="relative" ref={dropdownRef}>
        {/* <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Select playlist"
          title="Select playlist"
        >
          <span className="truncate max-w-32">{currentPlaylist.name}</span>
          <ChevronDown size={14} className={`transform transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
        </button> */}

        {isDropdownOpen && (
          <div className="absolute top-full left-0 w-48 bg-popover border rounded-md shadow-lg z-50 mt-1">
            {playlists.map((playlist, index) => (
              <button
                key={index}
                onClick={() => handlePlaylistSelect(index)}
                className={`w-full text-left px-3 py-2 text-sm ${
                  index === currentPlaylistIndex
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50"
                }`}
              >
                {playlist.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Song Info */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{currentSong.title}</div>
        <div className="text-xs text-muted-foreground truncate">{currentSong.artist}</div>
      </div>

      {/* Progress Bar */}
      <div className="flex-1 min-w-0 max-w-24">
        <div
          ref={progressRef}
          className="w-full h-1 bg-muted rounded-full cursor-pointer"
          onClick={handleProgressClick}
          title="Seek"
        >
          <div
            className="h-full bg-primary rounded-full transition-all"
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
          onClick={handlePrevious}
          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Previous track"
          title="Previous track"
        >
          <SkipBack size={16} />
        </button>

        <button
          onClick={handlePlayPause}
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
          onClick={handleNext}
          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Next track"
          title="Next track"
        >
          <SkipForward size={16} />
        </button>

        <button
          onClick={toggleMute}
          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={isMuted ? "Unmute" : "Mute"}
          title={`${isMuted ? "Unmute" : "Mute"}`}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        <button
          onClick={() => setShuffle(!shuffle)}
          className={`p-1 transition-colors ${
            shuffle ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
          aria-label={shuffle ? "Shuffle on" : "Shuffle off"}
          title="Toggle shuffle"
        >
          <Shuffle size={16} />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-destructive text-xs">{error}</div>
      )}

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentSong.url}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
      />
    </div>
  );
};

export default HeaderMusicPlayer;
