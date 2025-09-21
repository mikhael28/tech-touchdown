import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const Slideshow: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();

  const slides = [
    {
      id: 1,
      title: "Tech Touchdown",
      subtitle: "The Latest News in Tech & Sports",
      content: "From the CascadiaJS 2025 Hackathon, a project & podcast to bridge the world of tech & sports. A place to discuss the latest news, talk trash &  connect.",
      // image: "/powered-by-vitawind-bright.png",
      bgColor: "bg-gradient-to-br from-green-600 via-emerald-600 to-teal-800",
      
    },
    {
      id: 2,
      title: "Our Venn Diagram",
      subtitle: "Millions of people every day listen to news about sports; whether through radio, cable television, or reading articles online. At the same time, millions of people every day read news about tech; whether through social media, Hacker News, or through podcasts. Why not combine the two?",
      content: "Software engineers need to exercise more, and touch grass. Non-technical people should probably learn a little bit more about the software that is running their world. People want human connection on game day; that's why 40,000 people to the stadium, or dozens crowd into a bar.",
      bgColor: "bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800"
    },
    // {
    //   id: 3,
    //   title: "Why Tech Matters",
    //   content: "Chances are, if you don't understand how modern technology works, you will be taken advantage of. If we can help more people become AI literate, we can build a future",
    //   bgColor: "bg-gradient-to-br from-orange-600 via-red-600 to-pink-800"
    // },
    // {
    //   id: 4,
    //   title: "Bringing Two Worlds Together",
    //   content: "Tech Touchdown combines the passion of sports with the power of technology. We create immersive experiences, real-time analytics, fantasy leagues, and social connections that make sports more engaging and accessible to everyone.",
    //   bgColor: "bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-800"
    // }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const exitSlideshow = () => {
    navigate(-1); // Go back to previous page
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          prevSlide();
          break;
        case "ArrowRight":
          nextSlide();
          break;
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "Escape":
          exitSlideshow();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const currentSlideData = slides[currentSlide];

  return (
    <div className={`fixed inset-0 ${currentSlideData.bgColor} text-white transition-all duration-1000 z-50`}>
      {/* Exit button */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={exitSlideshow}
          className="text-white hover:bg-white/20 h-12 w-12"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Play/Pause button */}
      <div className="absolute top-4 right-20 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlay}
          className="text-white hover:bg-white/20 h-12 w-12"
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
      </div>

      {/* Left arrow navigation */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="text-white hover:bg-white/20 h-16 w-16 rounded-r-lg"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
      </div>

      {/* Right arrow navigation */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="text-white hover:bg-white/20 h-16 w-16 rounded-l-lg"
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>

      {/* Main slide content */}
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Slide 1 - Title slide */}
          {currentSlide === 0 && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
                  {currentSlideData.title}
                </h1>
                <h2 className="text-2xl md:text-4xl font-light text-white/90">
                  {currentSlideData.subtitle}
                </h2>
              </div>
              
              <div className="max-w-4xl mx-auto">
                <p className="text-xl md:text-2xl leading-relaxed text-white/90">
                  {currentSlideData.content}
                </p>
              </div>

              {/* <div className="flex justify-center">
                <img
                  src={currentSlideData.image}
                  alt="Tech Touchdown"
                  className="h-32 w-auto opacity-90"
                />
              </div> */}
            </div>
          )}

          {/* Other slides */}
          {currentSlide > 0 && (
            <div className="space-y-8">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                {currentSlideData.title}
              </h1>
              <h2 className="text-2xl md:text-4xl font-light text-white/90">
                  {currentSlideData.subtitle}
                </h2>
              
              <div className="max-w-5xl mx-auto">
                <p className="text-xl md:text-3xl leading-relaxed text-white/90">
                  {currentSlideData.content}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-8 right-8 text-white/70 text-sm">
        {currentSlide + 1} / {slides.length}
      </div>

      {/* Instructions overlay */}
      <div className="absolute top-4 left-4 text-white/70 text-sm space-y-1">
        <div>← → Navigate slides</div>
        <div>Spacebar Play/Pause</div>
        <div>Esc Exit slideshow</div>
      </div>
    </div>
  );
};

export default Slideshow;
