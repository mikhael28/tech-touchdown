import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import PodcastSidebar from "./PodcastSidebar";
import PersistentFooterPlayer from "./PersistentFooterPlayer";
import SportsChyron from "./SportsChyron";
import ThemeToggle from "./ThemeToggle";
import HeaderMusicPlayer from "./HeaderMusicPlayer";
import { Button } from "./ui/button";
import { Menu, LogIn, LogOut, PanelRightClose, PanelRightOpen } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

// Create context for shared audio state
interface AudioContextType {
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentTime: number;
  duration: number;
  volume: number;
  setVolume: (volume: number) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudioContext must be used within Layout");
  }
  return context;
};

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [podcastSidebarVisible, setPodcastSidebarVisible] = useState(() => {
    const saved = localStorage.getItem("podcastSidebarVisible");
    return saved !== null ? saved === "true" : true;
  });
  const { user, login, logout, isAuthenticated } = useAuth();

  // Shared audio state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const podcastUrl = "/data/tech-touchdown-ep-0.mp3";

  // Save podcast sidebar visibility preference
  useEffect(() => {
    localStorage.setItem("podcastSidebarVisible", String(podcastSidebarVisible));
  }, [podcastSidebarVisible]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Playback failed:", error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const audioContextValue: AudioContextType = {
    audioRef,
    isPlaying,
    setIsPlaying,
    currentTime,
    duration,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
  };

  return (
    <AudioContext.Provider value={audioContextValue}>
      <div className="flex h-screen bg-background">
        {/* Left Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top bar */}
          <header className="flex h-16 items-center justify-between border-b bg-card px-6">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex-shrink-0"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <HeaderMusicPlayer />
            </div>
            
            <div className="flex items-center gap-4">
              {/* Podcast Sidebar Toggle - only show on desktop */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPodcastSidebarVisible(!podcastSidebarVisible)}
                className="hidden lg:flex"
                title={podcastSidebarVisible ? "Hide Podcast" : "Show Podcast"}
              >
                {podcastSidebarVisible ? (
                  <PanelRightClose className="h-5 w-5" />
                ) : (
                  <PanelRightOpen className="h-5 w-5" />
                )}
              </Button>

              {isAuthenticated ? (
                <>
                  {user && (
                    <div className="flex items-center gap-2">
                      <img
                        src={user.avatar_url}
                        alt={user.name || user.login}
                        className="h-8 w-8 rounded-full"
                      />
                      <span className="hidden sm:block text-sm font-medium">
                        {user.name || user.login}
                      </span>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={logout}
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={login}
                  className="gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign in with GitHub</span>
                </Button>
              )}
              <ThemeToggle />
            </div>
          </header>

          {/* Page content with podcast sidebar */}
          <div className="flex flex-1 overflow-hidden">
            {/* Main page content - add bottom padding for chyron (10vh) + mobile footer player (5rem) */}
            <main className="flex-1 overflow-auto pb-[calc(10vh+5rem)] lg:pb-[10vh]">
              <Outlet />
            </main>

            {/* Right Podcast Sidebar - 15-20% of screen width, hidden on mobile */}
            {podcastSidebarVisible && (
              <div className="hidden lg:block w-72 flex-shrink-0 overflow-hidden transition-all">
                <PodcastSidebar />
              </div>
            )}
          </div>
        </div>

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={podcastUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Persistent Footer Player - visible on mobile/small screens, positioned above chyron */}
        <div className="lg:hidden fixed bottom-[10vh] left-0 right-0 z-50">
          <PersistentFooterPlayer />
        </div>

        {/* Sports News Chyron - always visible at bottom */}
        <SportsChyron />
      </div>
    </AudioContext.Provider>
  );
};

export default Layout;
