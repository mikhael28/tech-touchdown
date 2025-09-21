import { useState, useEffect } from "react";
import { SportsData, Game, League } from "../types/sports";

const useSportsData = () => {
  const [data, setData] = useState<SportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSportsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/sports");

      if (!response.ok) {
        throw new Error("Failed to fetch sports data");
      }

      const rawData = await response.text();
      const parsedData = parsePlaintextSports(rawData);

      setData(parsedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const parsePlaintextSports = (rawText: string): SportsData => {
    const lines = rawText.split("\n").filter((line) => line.trim());
    const leagues: League[] = [];
    let currentLeague: League | null = null;

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (isLeagueHeader(trimmedLine)) {
        if (currentLeague) {
          leagues.push(currentLeague);
        }
        currentLeague = {
          name: trimmedLine,
          games: [],
        };
      } else if (currentLeague && isGameLine(trimmedLine)) {
        const game = parseGameLine(trimmedLine);
        if (game) {
          currentLeague.games.push(game);
        }
      }
    }

    if (currentLeague) {
      leagues.push(currentLeague);
    }

    return {
      leagues,
      lastUpdated: new Date().toISOString(),
    };
  };

  const isLeagueHeader = (line: string): boolean => {
    const leaguePatterns = [
      /^(MLB|NFL|NBA|NHL|MLS|WNBA|NWSL|Premier League|Champions League|Europa League|NCAA|La Liga|Serie A|Bundesliga)/i,
    ];
    return leaguePatterns.some((pattern) => pattern.test(line));
  };

  const isGameLine = (line: string): boolean => {
    return (
      line.includes(" - ") || line.includes(" vs ") || /\d+.*\d+/.test(line)
    );
  };

  const parseGameLine = (line: string): Game | null => {
    const scorePattern = /(\w+.*?)\s+(\d+)\s*[-–]\s*(\d+)\s+(.*)/;
    const upcomingPattern = /(.+?)\s+(?:@|vs)\s+(.+?)\s+(.+)/;

    const scoreMatch = line.match(scorePattern);
    if (scoreMatch) {
      const [, teams, awayScore, homeScore, status] = scoreMatch;
      const [awayTeam, homeTeam] = teams.split(/\s+(?:@|vs)\s+/);

      return {
        id: `${awayTeam}-${homeTeam}-${Date.now()}`,
        league: "",
        homeTeam: homeTeam?.trim() || "",
        awayTeam: awayTeam?.trim() || "",
        homeScore: parseInt(homeScore),
        awayScore: parseInt(awayScore),
        gameStatus: status.trim(),
        date: new Date().toISOString().split("T")[0],
        isLive:
          status.toLowerCase().includes("live") ||
          /\d+(st|nd|rd|th|:)/.test(status),
        isCompleted:
          status.toLowerCase().includes("final") ||
          status.toLowerCase().includes("ft"),
      };
    }

    const upcomingMatch = line.match(upcomingPattern);
    if (upcomingMatch) {
      const [, awayTeam, homeTeam, time] = upcomingMatch;

      return {
        id: `${awayTeam}-${homeTeam}-${Date.now()}`,
        league: "",
        homeTeam: homeTeam.trim(),
        awayTeam: awayTeam.trim(),
        homeScore: null,
        awayScore: null,
        gameStatus: "scheduled",
        startTime: time.trim(),
        date: new Date().toISOString().split("T")[0],
        isLive: false,
        isCompleted: false,
      };
    }

    return null;
  };

  useEffect(() => {
    fetchSportsData();
  }, []);

  return { data, loading, error, refetch: fetchSportsData };
};

export default useSportsData;
