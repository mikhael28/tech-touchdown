import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselImage {
  src: string;
  alt: string;
  title: string;
  description: string;
}

const WebsitePreviewCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const images: CarouselImage[] = [
    {
      src: "/tech-touchdown-1.png",
      alt: "Hacker News + Sports",
      title: "Hacker News + Sports",
      description:
        "A place to read the latest news from the sports world and software/startup ecosystem",
    },
    {
      src: "/tech-touchdown-2.png",
      alt: "Sports Coverage",
      title: "Sports Coverage",
      description: "See the latest scores for all major sports.",
    },
    {
      src: "/tech-touchdown-3.png",
      alt: "Chatrooms & Trash Talk",
      title: "Chatrooms & Trash Talk",
      description: "Each game has it's own private chatroom - talk away!",
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="relative overflow-hidden rounded-lg bg-white shadow-lg">
        {/* Main carousel container */}
        <div className="relative h-64 sm:h-80 md:h-96">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h4 className="mb-1 text-lg font-semibold">{image.title}</h4>
                <p className="text-sm opacity-90">{image.description}</p>
              </div>
            </div>
          ))}

          {/* Navigation arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 transform rounded-full bg-white/80 p-2 text-gray-800 shadow-lg transition-all duration-200 hover:scale-110 hover:bg-white"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full bg-white/80 p-2 text-gray-800 shadow-lg transition-all duration-200 hover:scale-110 hover:bg-white"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center space-x-2 bg-gray-50 p-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 w-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? "scale-125 bg-gray-800"
                  : "bg-gray-300 hover:bg-gray-500"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Play/Pause button */}
        <div className="absolute right-4 top-4">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="rounded-full bg-white/80 p-2 text-gray-800 shadow-lg transition-all duration-200 hover:bg-white"
            aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isAutoPlaying ? (
              <div className="flex h-4 w-4 space-x-1">
                <div className="w-1 rounded-sm bg-current" />
                <div className="w-1 rounded-sm bg-current" />
              </div>
            ) : (
              <div className="ml-1 h-0 w-0 border-y-[4px] border-l-[6px] border-y-transparent border-l-current" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebsitePreviewCarousel;
