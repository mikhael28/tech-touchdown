import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Clock,
} from "lucide-react";
import { Button } from "../components/ui/button";

interface TranscriptSegment {
  timestamp: number;
  text: string;
}

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

// Transcript data from first episode
const dummyTranscript: TranscriptSegment[] = [
  {
    timestamp: 0,
    text: "All right, everybody. Welcome to the Sports Tech Talk Show. We got Will Johnson here.",
  },
  {
    timestamp: 7,
    text: "He is a developer relations at OffZero, helping your web apps and full stack applications stay secure. We have Jim. Jim, you're the chief party person here at Cascadia JS.",
  },
  {
    timestamp: 18,
    text: "What else do you do? I'm also an engineering leader at PitchBook.",
  },
  {
    timestamp: 25,
    text: "PitchBook. All right, he's helping people get funded. I'm Michael and we're gonna start the show with the Kansas City Chiefs, fresh off of Sunday's Fox Game of the Week. Chiefs are 0-2 for the first time in Mahomes' career and they've now lost three straight. We're gonna go to Will.",
  },
  {
    timestamp: 45,
    text: "Will's from Kansas City. We're gonna start with you. Do you have any cause to be concerned about your Chiefs missing the playoffs? No, I'm not concerned about them missing the playoffs.",
  },
  {
    timestamp: 53,
    text: "It doesn't matter what position you get into the playoffs. If it's a wild card, what matters is if you win the big game. So with their experience, I still think that they got a chance.",
  },
  {
    timestamp: 65,
    text: "They're just, you know, going through growing pains. Every great team has to adjust, you know, and the Chiefs are like everyone's Super Bowl, like when everyone wants to beat the Chiefs. But we've won Super Bowls, so.",
  },
  {
    timestamp: 80,
    text: "Yeah, you've got like three of them, yeah. I don't know, from my perspective, the way I see it is it reminds me a lot of my Golden State Warriors. Like after their last finals run with Durant, you know, Durant tore his Achilles, Klay tore his ACL, and then Curry had Valanchunis fall on him and broke his hand.",
  },
  {
    timestamp: 97,
    text: "They kind of like, it's exhausting to just go to the finals, to go to the Super Bowl year in and year out, and like you see teams just kind of, just kind of collapse. And it's not because they're not great, like Mahomes is obviously the best quarterback I've ever seen, but it just feels like the way that they're going with injuries, you know, Worvey, he's getting banged up, Rasheed Rice is chilling at home, and Mahomes, he has a, he's on the medical report, he's got a wrist problem. So like, they're playing the Giants next week, so if you lose to the Giants, then you're really, really cooked.",
  },
  {
    timestamp: 135,
    text: "But I mean, they have Baltimore after that, so I mean they could be like 1-3, or they could even be 0-4, and like no team has ever come back to make it to the playoffs. I think one team ever has been 0-3 and been to the playoffs, so like it just seems like since everyone, like you said, is giving the Chiefs like their best week in and week out. Like last year, they won all the close games.",
  },
  {
    timestamp: 161,
    text: "Yeah. And like we saw that with the Vikings a couple years ago, with Kirk Cousins. They won like eight, like one possession games.",
  },
  {
    timestamp: 172,
    text: "They barely made it to the playoffs, and then the next year they were just terrible. So the way I'm looking at it, like, I mean, I don't know. I feel like there's a really good chance they missed the playoffs just due to the exhaustion of having to play into February every year.",
  },
  {
    timestamp: 192,
    text: "I can definitely see that, but I do think that, you know, the thing is with the Chiefs, they've always had holes, but they, you know, had a way to cover them up. You know, Mahomes won the Super Bowl with, you know, Valdez-Scantleyness. It's like worthy for number one.",
  },
  {
    timestamp: 208,
    text: "So I think like now, you know, but other teams are like stocking up, you know, and, you know, doing weird things with their contracts, and it's like they're, you know, becoming powerhouses while the Chiefs are trying to like spread the money out, you know, between all the players and trying to keep it together. So now those holes are starting to get exposed. Like when someone gets good with the Chiefs, like if they draft them or they sign them for Chiefs, they play two, three years, and then, you know, they go somewhere where they can get paid more.",
  },
  {
    timestamp: 233,
    text: "And just, so that happens, you know, year over year. I just think that the holes are getting more and more exposed, and I still think it's a solid team, but I just think that those gaps are starting to be seen more now.",
  },
  {
    timestamp: 243,
    text: "All right, Jim, you have any thoughts?",
  },
  {
    timestamp: 245,
    text: "Well, I think all what you said so far make a lot of sense from, you know, analytical perspective, but I think you did not tell the X Factor, which is that Travis Kelsey is now the America's sweetheart.",
  },
  {
    timestamp: 263,
    text: "He has all the sweet tea behind him. So I think there is a lot of anticipation on the line, but still a lot of support coming from the Chiefs nation. So I actually think they can pull it off for sure.",
  },
  {
    timestamp: 279,
    text: "Particularly, I was very impressed in that five-second field goal that they were able to make on that game one. And you can tell that for the winning club, it's the little things they have to perfect.",
  },
  {
    timestamp: 294,
    text: "So you think the spiritual power of the Swifties is going to, like, give the Chiefs that boost that they need?",
  },
  {
    timestamp: 297,
    text: "Never underestimate Swifties.",
  },
  {
    timestamp: 299,
    text: "That is very true. I mean, Travis Kelsey is getting, like, he is getting pretty old. He's like 35, like, I mean, and he has marriage on his mind, you know? So maybe, I mean, from that perspective, I mean, maybe the Chiefs just aren't as focused as they used to be, right? I mean, they've won so many championships. They have all the success. But we're going to switch gears. We're going to move on to GPT-5.",
  },
  {
    timestamp: 329,
    text: "It came out a couple weeks ago. There was a big jump from 3 to 4. I mean, 3.5 to 4. It was genuinely life-changing. I think that, you know, people actually started using, developers started using these large language models in their day to day workflows with 4. But now that we came to 5, you know, Will, we'll start with you.",
  },
  {
    timestamp: 346,
    text: "Did it kind of meet your expectations or did it kind of fail to live up to the hype?",
  },
  {
    timestamp: 353,
    text: "Yeah, so I feel like, so to me, no, it didn't live up to the hype, just being honest. Like, it makes a lot more, and to my personal experience, it makes a lot more mistakes. I have to correct a lot more things.",
  },
  {
    timestamp: 370,
    text: "And I think the only reason that, you know, it didn't live up to the hype is because how much it was hyped up. I remember people on Twitter, like some of the people who worked there saying, like, you know, how life-changing, like, literally they were saying life-changing it was going to be. And, you know, it's a mid-upgrade at best.",
  },
  {
    timestamp: 389,
    text: "You know, and for some of the things that they say it's better at, like medical advice, that's not something I use it for, so I can't say that. But for me, what I mainly use it for is, like, coding or, like, you know, like, help with, like, drafts of stuff, like, you know, blog posts or other things like that. And it, like, seems to go off the topic a lot of, like, I'm like, that's not what I was talking about.",
  },
  {
    timestamp: 413,
    text: "So for me, it didn't, I thought it was going to be, like, I was hyped from all the stuff I was reading, but it didn't, for me, it didn't live up to the hype.",
  },
  {
    timestamp: 420,
    text: "So are you, like, integrating it with Curse or, like, how, like, when you're using GPT-5, are you just using the, like, OpenAI as a chat? Like, how are you using it, like?",
  },
  {
    timestamp: 431,
    text: "So I use it with ChatGPT, of course, and then I did for a minute use it with V0 for, with Vercel, but I think they, like, took it out or something. I'm not, I haven't looked at it in a while, but I know, like, when it first came out, I was using it with that, and it just felt like I had to, like, just correct way more things than, than I did before.",
  },
  {
    timestamp: 451,
    text: "Yeah, okay. Like, was it with the structure of the, of the code itself? Was it the CSS, the styling? Like, what was it about it that, like, was, like, a deterioration from, from Quora?",
  },
  {
    timestamp: 461,
    text: "Either not, like, not listening or, like, doing things on its own or, like, not listening to what I say. Like, I'll say, like, you know, if I say, build a certain thing, like, it'll delete another page that I didn't ask it to delete.",
  },
  {
    timestamp: 476,
    text: "It goes off the rails.",
  },
  {
    timestamp: 477,
    text: "Yeah, yeah. Like, in the, in the previous version, didn't, I felt like I had, it was way more, like, in control. Things were, like, a lot tighter. It's like, this one takes more, like, leeway, I guess.",
  },
  {
    timestamp: 489,
    text: "Jim, what are your, what are your, what are your thoughts?",
  },
  {
    timestamp: 491,
    text: "So, I actually have a different thought than Will, but, you know, I would have to first say that a lot of my use case is actually also different from Will's.",
  },
  {
    timestamp: 500,
    text: "So, I treat ChargeBT basically as my sounding board for everything. There is rarely one decision or one task that I do, I do not pass to OpenAI, ChargeBT. And it's mostly because I just want to see what it can do.",
  },
  {
    timestamp: 518,
    text: "And so, for example, I'll make two examples that I think was, like, really a big improvement, maybe not from an intelligence perspective of ChargeBT, but really from a user experience, it was very nice. So, one is that I'm training for 5K, and it's like a couch to 5K situation where I have not run for a decade. But, I have an Apple Watch, and I want to follow the instruction from ChargeBT.",
  },
  {
    timestamp: 545,
    text: "And, you know, I'm three weeks in, I feel great. And not only have I already run further than 5K, I'm actually keep breaking my personal best throughout the training. And so, I do think that, you know, it's a very novice situation.",
  },
  {
    timestamp: 564,
    text: "I'm not an expert in running. So, from that perspective, I get a lot of help from ChargeBT. And the way I think about it is that, oh, this is saving me so much time to Google and read everything and then synthesize into an actual play.",
  },
  {
    timestamp: 580,
    text: "So, that's the first example I have. The second example is almost kind of scary. So, I am a fanatic for fantasy baseball, and this is in playoff time.",
  },
  {
    timestamp: 589,
    text: "I have some trusted sources that, you know, they write about reliever usage. You know, this is super niche. But, basically, how different relievers, different bullpen being used.",
  },
  {
    timestamp: 600,
    text: "And so, they can suggest who can get the save today. And that publish every morning, you know, range from 5.30 to 7 a.m. All I do every day is, I first say, you know, create a prompt, right? I say, hey, this is like a fantasy baseball blog that I trust. It has this content.",
  },
  {
    timestamp: 624,
    text: "You know, please synthesize it, summarize it, actionable insight for me. And then, I got lazy. Then, I started just pasting URL.",
  },
  {
    timestamp: 634,
    text: "I didn't even say the prompt. Yeah, just put the URL in. And then, after a week, hopefully, I just say, do you want me to generate a daily repeatable task that I can ask you for automatically? And, of course, I say yes.",
  },
  {
    timestamp: 648,
    text: "And then, now, I didn't even have to go out and fetch the URL.",
  },
  {
    timestamp: 653,
    text: "Does it give you an email? Or how does it give it to you? You just wake up and it's there?",
  },
  {
    timestamp: 656,
    text: "ChargeAPD has the ability. Depends on your plan. I have a plus plan. Yeah, I think it gives you like three to five notifications. So, it's a notification.",
  },
  {
    timestamp: 666,
    text: "Yeah, you can do that. Yeah. And so, for example, I have easy run notification.",
  },
  {
    timestamp: 670,
    text: "Yeah. And, you know, strength training notification. It just pops up.",
  },
  {
    timestamp: 675,
    text: "Wow. At a time I ask it to.",
  },
  {
    timestamp: 678,
    text: "And so, it's scary crazy. It's like, oh, you know what I want before I knew what I wanted.",
  },
  {
    timestamp: 684,
    text: "Yeah, it used to do that. I think it only do that with G3, G3O3 at first. But, I think they blended in the five.",
  },
  {
    timestamp: 693,
    text: "Now, I will say that for like my sports photography, just G-ChargeAPT in general is incredible.",
  },
  {
    timestamp: 699,
    text: "Like, the questions I ask it that I can't find when I search it online. Like, questions about like lenses or like how to do certain things is, you know, I'll get like a forum post that has so much unrelated information.",
  },
  {
    timestamp: 713,
    text: "But, if I ask it into ChargeAPT, I get it exactly for the make and model that I have.",
  },
  {
    timestamp: 719,
    text: "So, for that, it's been incredible like helping with that type of stuff. So, did you notice that performance increased from like 4.0 or 0.3 to 5.0? Like, is that or is that just a continuation?",
  },
  {
    timestamp: 731,
    text: "They're just iterating on like making it a little better. Yeah, I would say we're fine.",
  },
  {
    timestamp: 735,
    text: "I got like some newer stuff in it. I kind of asked the same questions. Like, I mean, like you said, yours is super niche.",
  },
  {
    timestamp: 742,
    text: "But, like, I had a lens that was like 300 millimeters and I had all my settings right.",
  },
  {
    timestamp: 748,
    text: "But, the image was always soft. And, I was like, I like every there's no reason the image should be soft.",
  },
  {
    timestamp: 754,
    text: "And, it was like, oh, because that particular lens is soft at the furthest focal length.",
  },
  {
    timestamp: 760,
    text: "Like, it didn't tell me that before. Like, before GTP 5, you know, like it didn't like bring that up.",
  },
  {
    timestamp: 767,
    text: "It's like, because I asked like what are the pros and cons of this and et cetera, et cetera.",
  },
  {
    timestamp: 773,
    text: "And so, it felt like it like knew where to get more. And, I was like, and I asked for like a source.",
  },
  {
    timestamp: 779,
    text: "And, they gave me like the most obscure website I've ever seen.",
  },
  {
    timestamp: 783,
    text: "An old Drupal page from like 2015, yeah.",
  },
  {
    timestamp: 787,
    text: "And so, for certain things it's gotten better. But, for me, for code, I feel like it hasn't.",
  },
  {
    timestamp: 793,
    text: "Because, that's mainly what I use it for. Like, you know, to build like demo apps or to at least like get something started.",
  },
  {
    timestamp: 800,
    text: "So, I can like, you know, add Auth0 to it or add another, you know, tool to it.",
  },
  {
    timestamp: 806,
    text: "You know, get rid of that. You know, I don't have to start from scratch every time.",
  },
  {
    timestamp: 810,
    text: "Alright. Well, sticking with baseball, quick bonus topic before we wrap up.",
  },
  {
    timestamp: 815,
    text: "So, staying on baseball, we have Cal Raleigh, you know, the big dumper here in Seattle.",
  },
  {
    timestamp: 821,
    text: "You know, he's setting records. He just passed Mickey Mantle for like 65 home runs. Is that what he has?",
  },
  {
    timestamp: 827,
    text: "So, Mickey as a switch hitter, he had 54 home runs. That was the most as a switch hitter.",
  },
  {
    timestamp: 834,
    text: "Okay, he had 55, not 65. Okay.",
  },
  {
    timestamp: 837,
    text: "And then, I think Cal did hit 55 and 56 already.",
  },
  {
    timestamp: 841,
    text: "So, is he your MVP for the AL, right?",
  },
  {
    timestamp: 846,
    text: "I mean, absolutely. I think Cal managing the pitching staff, Cal playing the catcher position.",
  },
  {
    timestamp: 854,
    text: "I have all the world of admiration to Aaron Judge because I think he is an amazing hitter.",
  },
  {
    timestamp: 862,
    text: "But, I think if we are talking about most valuable player, this is the case of most valuable to their team.",
  },
  {
    timestamp: 869,
    text: "I do think that it's really, really hard to replace what Cal can put on the table.",
  },
  {
    timestamp: 875,
    text: "Yeah, well, I mean, the Mariners have Julio, but Julio has kind of become kind of an afterthought this season, right?",
  },
  {
    timestamp: 881,
    text: "Like, he was viewed as the best player, but not anymore.",
  },
  {
    timestamp: 885,
    text: "What do you think was the difference? Like, is there anything, how did he jump to this level of production?",
  },
  {
    timestamp: 891,
    text: "Like, how do you think he got to this point?",
  },
  {
    timestamp: 893,
    text: "Yeah, I think a lot of people may already know this, but Cal is an incredible, hard-working player.",
  },
  {
    timestamp: 899,
    text: "So, everybody knows Cal is a switch hitter.",
  },
  {
    timestamp: 903,
    text: "And, you know, as a professional hitter, you have to maintain both sides of hitting.",
  },
  {
    timestamp: 909,
    text: "That means probably at least, you know, 50% more pitch time, if not double.",
  },
  {
    timestamp: 916,
    text: "You know, Cal has this reputation that he's first to the ballpark, last to leave.",
  },
  {
    timestamp: 922,
    text: "You know, his previous roommate, Brian Wu, can testify that, you know, every single day that when he woke up, Cal was already in the ballpark.",
  },
  {
    timestamp: 932,
    text: "He was, you know, always out before noon and come home after midnight.",
  },
  {
    timestamp: 938,
    text: "And I think his incredible work ethic really took him to this far.",
  },
  {
    timestamp: 944,
    text: "He spent a lot of time training, hitting from the right side, because, you know, early in his career in a Mariner tenure, Mariner even basically put to him, like, only let him hit when it's, like, right-handed pitcher.",
  },
  {
    timestamp: 961,
    text: "And he solved that himself through the offseason training.",
  },
  {
    timestamp: 965,
    text: "Now that, you know, not only Mariner don't put to him, Mariner actually want him to be in the lineup every single day as a DH, when he's resting as a catcher.",
  },
  {
    timestamp: 975,
    text: "So, I think, you know, the way that Mariner is using Cal says it all.",
  },
  {
    timestamp: 980,
    text: "You know, not only is he breaking home run record, he is probably breaking, like, just the fact that how many games he played as a catcher and how many games he played as a player.",
  },
  {
    timestamp: 990,
    text: "So, those are all indications of how much value he improved on the field.",
  },
  {
    timestamp: 994,
    text: "Yeah, for real.",
  },
  {
    timestamp: 996,
    text: "And the Royals, I believe, they're on the other conference.",
  },
  {
    timestamp: 999,
    text: "What's the name of the – it's the AL and then the – what's the other conference?",
  },
  {
    timestamp: 1003,
    text: "National League.",
  },
  {
    timestamp: 1004,
    text: "The Royals are also on here.",
  },
  {
    timestamp: 1006,
    text: "Oh, they're also here.",
  },
  {
    timestamp: 1007,
    text: "Yeah.",
  },
  {
    timestamp: 1008,
    text: "My baseball.",
  },
  {
    timestamp: 1009,
    text: "Yeah.",
  },
  {
    timestamp: 1011,
    text: "Is he your MVP, Cal Raleigh?",
  },
  {
    timestamp: 1013,
    text: "Bobby Witt, Jr.",
  },
  {
    timestamp: 1014,
    text: "Bobby Witt, Jr.",
  },
  {
    timestamp: 1016,
    text: "Okay.",
  },
  {
    timestamp: 1017,
    text: "Yeah.",
  },
  {
    timestamp: 1019,
    text: "All right.",
  },
  {
    timestamp: 1020,
    text: "Okay.",
  },
  {
    timestamp: 1021,
    text: "Well, that's it for Sports Talk sponsored by Off Zero.",
  },
  {
    timestamp: 1024,
    text: "You know, they're flying us out everywhere.",
  },
  {
    timestamp: 1026,
    text: "They're paying for our studio equipment.",
  },
  {
    timestamp: 1029,
    text: "All right.",
  },
  {
    timestamp: 1030,
    text: "That was that.",
  },
];

const Podcast: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const transcriptRefs = useRef<(HTMLDivElement | null)[]>([]);

  const podcastUrl = "/data/tech-touchdown-ep-0.mp3";

  // Initialize audio context and analyser
  useEffect(() => {
    if (audioRef.current && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;

      sourceRef.current = audioContextRef.current.createMediaElementSource(
        audioRef.current
      );
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);

      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Audio visualizer
  useEffect(() => {
    if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current)
      return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      if (!analyserRef.current || !dataArrayRef.current || !ctx) return;

      animationRef.current = requestAnimationFrame(draw);
    // @ts-ignore
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      // Set canvas size
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      // Clear canvas
      ctx.fillStyle = "rgb(15, 23, 42)"; // slate-900
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / dataArrayRef.current.length) * 2.5;
      let x = 0;

      for (let i = 0; i < dataArrayRef.current.length; i++) {
        const barHeight = (dataArrayRef.current[i] / 255) * canvas.height * 0.8;

        // Create gradient
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, "rgb(59, 130, 246)"); // blue-500
        gradient.addColorStop(0.5, "rgb(147, 51, 234)"); // purple-600
        gradient.addColorStop(1, "rgb(236, 72, 153)"); // pink-500

        ctx.fillStyle = gradient;
        ctx.fillRect(
          x,
          canvas.height - barHeight,
          barWidth,
          barHeight
        );

        x += barWidth + 1;
      }
    };

    if (isPlaying) {
      draw();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

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
        // Resume audio context if needed
        if (
          audioContextRef.current &&
          audioContextRef.current.state === "suspended"
        ) {
          audioContextRef.current.resume();
        }
        audioRef.current.play().catch((error) => {
          console.error("Playback failed:", error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Update active transcript segment
  useEffect(() => {
    const currentIndex = dummyTranscript.findIndex((segment, index) => {
      const nextSegment = dummyTranscript[index + 1];
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

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = pos * audioRef.current.duration;
    }
  };

  const handleSkipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, currentTime - 15);
    }
  };

  const handleSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        duration,
        currentTime + 15
      );
    }
  };

  const handleTranscriptClick = (timestamp: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = timestamp;
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Main Player Card */}
        <div className="rounded-lg border bg-card p-8 shadow-xl">
          {/* Audio Visualizer */}
          <div className="mb-8 overflow-hidden rounded-lg">
            <canvas
              ref={canvasRef}
              className="h-64 w-full rounded-lg bg-slate-900"
            />
          </div>

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
              variant="ghost"
              size="icon"
              onClick={handleSkipBackward}
              className="h-12 w-12"
            >
              <SkipBack className="h-6 w-6" />
            </Button>

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

            <Button
              variant="ghost"
              size="icon"
              onClick={handleSkipForward}
              className="h-12 w-12"
            >
              <SkipForward className="h-6 w-6" />
            </Button>

            <div className="ml-4 flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
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
                className="w-24"
              />
            </div>
          </div>
        </div>

        {/* Transcript Section */}
        <div className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center space-x-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-xl font-semibold">Transcript</h3>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {dummyTranscript.map((segment, index) => (
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

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={podcastUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />
      </div>
    </div>
  );
};

export default Podcast;

