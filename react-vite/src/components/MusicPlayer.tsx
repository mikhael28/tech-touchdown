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

const MP3Player: React.FC = () => {
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
  const volumeRef = useRef<HTMLDivElement | null>(null);

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

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (volumeRef.current) {
      const rect = volumeRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      setVolume(Math.max(0, Math.min(1, pos)));
      setIsMuted(false);
    }
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
    <div className="w-56 bg-gray-900 rounded-lg p-2 shadow-xl">
      <div className="flex flex-col space-y-1">
        {/* Playlist Selector and Song Info */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-gray-800 text-white text-xs px-2 py-1 rounded flex items-center justify-between"
            aria-label="Select playlist"
            title="Select playlist"
          >
            <div className="flex-1 flex flex-col items-start">
              <span className="text-gray-400 text-xs">
                {currentPlaylist.name}
              </span>
              <span className="truncate text-xs">{currentSong.title}</span>
            </div>
            <ChevronDown
              size={12}
              className={`transform transition-transform ml-1 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute bottom-full left-0 w-full bg-gray-800 rounded mt-1 py-1 shadow-lg z-10">
              {playlists.map((playlist, index) => (
                <button
                  key={index}
                  onClick={() => handlePlaylistSelect(index)}
                  className={`w-full text-left px-2 py-1 text-xs ${
                    index === currentPlaylistIndex
                      ? "bg-blue-500 text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {playlist.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Time and Progress */}
        <div className="flex items-center justify-between text-xs text-gray-400 px-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Progress Bar */}
        <div
          ref={progressRef}
          className="w-full h-0.5 bg-gray-700 rounded-full cursor-pointer"
          onClick={handleProgressClick}
          title="Seek"
        >
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevious}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Previous track"
              title="Previous track"
            >
              <SkipBack size={20} />
            </button>

            <button
              onClick={handlePlayPause}
              className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
              title={`${isPlaying ? "Pause" : "Play"} (Space)`}
            >
              {isPlaying ? (
                <Pause size={20} className="text-white" />
              ) : (
                <Play size={20} className="text-white ml-1" />
              )}
            </button>

            <button
              onClick={handleNext}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Next track"
              title="Next track"
            >
              <SkipForward size={20} />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMute}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
              title={`${isMuted ? "Unmute" : "Mute"} (M)`}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            {/* TODO add back in, increase or decrease volume */}
            {/* <div
              ref={volumeRef}
              className="w-12 h-1 bg-gray-700 rounded-full cursor-pointer"
              onClick={handleVolumeChange}
              title="Volume"
            >
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${isMuted ? 0 : volume * 100}%` }}
              />
            </div> */}

            <button
              onClick={() => setShuffle(!shuffle)}
              className={`text-gray-400 hover:text-white transition-colors ${
                shuffle ? "text-blue-500" : ""
              }`}
              aria-label={shuffle ? "Shuffle on" : "Shuffle off"}
              title="Toggle shuffle"
            >
              <Shuffle size={20} />
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-xs text-center mt-1">{error}</div>
        )}
      </div>

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

export default MP3Player;
