import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Clock,
  Maximize2,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { useAudioContext } from "./Layout";
import { episode0Transcript } from "../data/podcastTranscript";

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatTimestamp = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const PodcastSidebar: React.FC = () => {
  const {
    audioRef,
    isPlaying,
    setIsPlaying,
    currentTime,
    duration,
  } = useAudioContext();

  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>(0);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const transcriptRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Update active transcript segment
  useEffect(() => {
    const currentIndex = episode0Transcript.findIndex((segment, index) => {
      const nextSegment = episode0Transcript[index + 1];
      return (
        currentTime >= segment.timestamp &&
        (!nextSegment || currentTime < nextSegment.timestamp)
      );
    });

    if (currentIndex !== -1 && currentIndex !== activeSegmentIndex) {
      setActiveSegmentIndex(currentIndex);
      
      // Auto-scroll to active segment
      if (transcriptRefs.current[currentIndex]) {
        transcriptRefs.current[currentIndex]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [currentTime, activeSegmentIndex]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = pos * audioRef.current.duration;
    }
  };

  const handleTranscriptClick = (timestamp: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = timestamp;
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Full-Screen Mode
  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background overflow-auto">
        <div className="min-h-screen p-6">
          <div className="mx-auto max-w-5xl space-y-8">
            {/* Close Button */}
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Podcast Player</h1>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullScreen(false)}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Close
              </Button>
            </div>

            {/* Main Player Card */}
            <div className="rounded-lg border bg-card p-8 shadow-xl">
              {/* Episode Info */}
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-semibold mb-1">Episode 0: Pilot</h2>
                <p className="text-sm text-muted-foreground">
                  Tech Touchdown • Michael Nightingale
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div
                  className="group h-2 w-full cursor-pointer rounded-full bg-muted hover:h-3 transition-all"
                  onClick={handleProgressClick}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-4">
                <Button
                  size="icon"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="ml-1 h-8 w-8" />
                  )}
                </Button>
              </div>
            </div>

            {/* Transcript Section */}
            <div className="rounded-lg border bg-card p-6">
              <div className="mb-4 flex items-center space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-xl font-semibold">Transcript</h3>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {episode0Transcript.map((segment, index) => (
                  <div
                    key={index}
                    ref={(el) => (transcriptRefs.current[index] = el)}
                    className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-primary ${
                      index === activeSegmentIndex
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-transparent bg-muted/30"
                    }`}
                    onClick={() => handleTranscriptClick(segment.timestamp)}
                  >
                    <div className="mb-2 flex items-center space-x-2">
                      <span
                        className={`text-sm font-mono font-semibold ${
                          index === activeSegmentIndex
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      >
                        {formatTimestamp(segment.timestamp)}
                      </span>
                      {index === activeSegmentIndex && (
                        <span className="flex h-2 w-2">
                          <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-sm leading-relaxed ${
                        index === activeSegmentIndex
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {segment.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Compact Sidebar Mode
  return (
    <div className="h-full flex flex-col bg-card border-l">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold text-sm">Podcast</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFullScreen(true)}
          className="h-8 w-8"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Episode Card */}
      <div className="p-4 border-b">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">EP 0</span>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-1">Episode 0: Pilot</h4>
            <p className="text-xs text-muted-foreground">
              Tech Touchdown
            </p>
          </div>
        </div>

        {/* Mini Progress */}
        <div className="mt-4">
          <div
            className="h-1.5 w-full cursor-pointer rounded-full bg-muted"
            onClick={handleProgressClick}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Play Button */}
        <div className="mt-4 flex justify-center">
          <Button
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="ml-0.5 h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Compact Transcript */}
      <div className="flex-1 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-semibold text-sm">Transcript</h4>
          </div>
          <div className="space-y-2 max-h-full overflow-y-auto pr-2">
            {episode0Transcript.slice(0, 5).map((segment, index) => (
              <div
                key={index}
                className={`cursor-pointer rounded p-2 transition-all text-xs ${
                  index === activeSegmentIndex
                    ? "bg-primary/10 border border-primary/30"
                    : "bg-muted/30 hover:bg-muted/50"
                }`}
                onClick={() => handleTranscriptClick(segment.timestamp)}
              >
                <div className="font-mono font-semibold text-xs text-muted-foreground mb-1">
                  {formatTimestamp(segment.timestamp)}
                </div>
                <p className="text-xs leading-relaxed line-clamp-2">
                  {segment.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastSidebar;

