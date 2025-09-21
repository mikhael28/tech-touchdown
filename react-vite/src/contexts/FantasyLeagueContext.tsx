import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import companiesData from '../data/companies.json';

interface Company {
  link: string;
  image_url: string;
  name: string;
  description: string;
  vertical: string;
  'sub-vertical': string;
}

interface LeagueTeam {
  id: string;
  name: string;
  owner: string;
  companies: Company[];
  points: number;
  rank: number;
}

interface DraftState {
  isActive: boolean;
  isComplete: boolean;
  currentPick: number;
  draftOrder: string[];
  availableCompanies: Company[];
  pickedCompanies: Company[];
  roundsCompleted: number;
  totalRounds: number;
}

interface FantasyLeagueContextType {
  teams: LeagueTeam[];
  draftState: DraftState;
  startDraft: () => void;
  draftCompany: (company: Company) => void;
  loadSavedLeague: () => boolean;
  clearLeague: () => void;
  myTeam: LeagueTeam | undefined;
}

const FantasyLeagueContext = createContext<FantasyLeagueContextType | undefined>(undefined);

export const useFantasyLeague = () => {
  const context = useContext(FantasyLeagueContext);
  if (!context) {
    throw new Error('useFantasyLeague must be used within a FantasyLeagueProvider');
  }
  return context;
};

interface FantasyLeagueProviderProps {
  children: ReactNode;
}

export const FantasyLeagueProvider: React.FC<FantasyLeagueProviderProps> = ({ children }) => {
  const TOTAL_ROUNDS = 8; // Each team drafts 8 companies
  const STORAGE_KEY = 'fantasy-league-data';

  const initialDraftOrder = [
    'You', 'Tech Titans', 'Startup Squad', 'Venture Vikings', 'Code Cowboys',
    'AI Avengers', 'Data Dynamos', 'Silicon Sharks', 'Byte Brigade', 'Innovation Inc'
  ];

  const [teams, setTeams] = useState<LeagueTeam[]>([]);
  const [draftState, setDraftState] = useState<DraftState>({
    isActive: false,
    isComplete: false,
    currentPick: 1,
    draftOrder: initialDraftOrder,
    availableCompanies: companiesData as Company[],
    pickedCompanies: [],
    roundsCompleted: 0,
    totalRounds: TOTAL_ROUNDS
  });

  // Initialize teams
  useEffect(() => {
    if (teams.length === 0) {
      const initialTeams: LeagueTeam[] = initialDraftOrder.map((owner, index) => ({
        id: `team-${index}`,
        name: owner === 'You' ? 'My Team' : owner,
        owner,
        companies: [],
        points: Math.floor(Math.random() * 200) + 400,
        rank: index + 1
      }));

      setTeams(initialTeams);
    }
  }, []);

  // Auto-draft logic for AI teams
  const autoDraftForAI = (currentTeam: string, availableCompanies: Company[]) => {
    if (currentTeam === 'You' || availableCompanies.length === 0) return null;

    // AI draft strategy: prefer certain verticals and high-scoring companies
    const scoredCompanies = availableCompanies.map(company => ({
      company,
      score: calculateCompanyScore(company, currentTeam)
    }));

    // Sort by score and add some randomness
    scoredCompanies.sort((a, b) => {
      const randomFactor = (Math.random() - 0.5) * 20; // Add some unpredictability
      return (b.score + randomFactor) - a.score;
    });

    return scoredCompanies[0]?.company || null;
  };

  // Calculate company score for AI draft decisions
  const calculateCompanyScore = (company: Company, teamName: string): number => {
    let score = Math.random() * 50 + 50; // Base score 50-100

    // Vertical preferences
    const verticalBonus: { [key: string]: number } = {
      'B2B': 15,
      'Healthcare': 12,
      'Fintech': 10,
      'AI': 20,
      'Consumer': 8,
      'Industrials': 6
    };

    score += verticalBonus[company.vertical] || 0;

    // AI/automation bonus
    const description = company.description.toLowerCase();
    if (description.includes('ai')) score += 15;
    if (description.includes('automation')) score += 10;
    if (description.includes('agent')) score += 12;
    if (description.includes('platform')) score += 8;

    // Team-specific preferences
    const teamPreferences: { [key: string]: string[] } = {
      'Tech Titans': ['ai', 'platform', 'automation'],
      'AI Avengers': ['ai', 'agent', 'model'],
      'Data Dynamos': ['data', 'analytics', 'intelligence'],
      'Silicon Sharks': ['fintech', 'crypto', 'payment'],
      'Code Cowboys': ['developer', 'api', 'infrastructure']
    };

    const preferences = teamPreferences[teamName] || [];
    preferences.forEach(keyword => {
      if (description.includes(keyword)) score += 5;
    });

    return score;
  };

  const startDraft = () => {
    setDraftState(prev => ({ ...prev, isActive: true }));
    // Note: Auto-drafting is now handled by the useEffect hook
  };

  const draftCompany = (company: Company) => {
    if (!draftState.isActive || draftState.isComplete) return;

    const currentTeamIndex = (draftState.currentPick - 1) % draftState.draftOrder.length;
    const currentTeam = draftState.draftOrder[currentTeamIndex];

    console.log(`Pick ${draftState.currentPick}: ${currentTeam} drafting ${company.name}`);

    // Update teams state
    setTeams(prev => {
      const updated = prev.map(team =>
        team.owner === currentTeam
          ? { ...team, companies: [...team.companies, company] }
          : team
      );
      return updated;
    });

    // Update draft state
    const newPickedCompanies = [...draftState.pickedCompanies, company];
    const newAvailableCompanies = draftState.availableCompanies.filter(c => c.name !== company.name);
    const newCurrentPick = draftState.currentPick + 1;
    const newRoundsCompleted = Math.floor((newCurrentPick - 1) / draftState.draftOrder.length);
    const isDraftComplete = newRoundsCompleted >= TOTAL_ROUNDS;

    const newDraftState = {
      ...draftState,
      currentPick: newCurrentPick,
      availableCompanies: newAvailableCompanies,
      pickedCompanies: newPickedCompanies,
      roundsCompleted: newRoundsCompleted,
      isComplete: isDraftComplete,
      isActive: !isDraftComplete
    };

    setDraftState(newDraftState);

    // Save to localStorage after each pick
    const updatedTeams = teams.map(team =>
      team.owner === currentTeam
        ? { ...team, companies: [...team.companies, company] }
        : team
    );

    saveToStorage({
      teams: updatedTeams,
      draftState: newDraftState
    });

    // Note: Auto-drafting is now handled by the useEffect hook
  };

  const autoDraftNext = (currentDraftState: DraftState) => {
    if (!currentDraftState.isActive || currentDraftState.isComplete) return;

    const currentTeamIndex = (currentDraftState.currentPick - 1) % currentDraftState.draftOrder.length;
    const currentTeam = currentDraftState.draftOrder[currentTeamIndex];

    console.log(`Auto-draft check: Pick ${currentDraftState.currentPick}, Team: ${currentTeam}`);

    if (currentTeam !== 'You' && currentDraftState.availableCompanies.length > 0) {
      const selectedCompany = autoDraftForAI(currentTeam, currentDraftState.availableCompanies);
      if (selectedCompany) {
        console.log(`AI team ${currentTeam} auto-drafting ${selectedCompany.name}`);
        draftCompany(selectedCompany);
      }
    }
  };

  const saveToStorage = (data: { teams: LeagueTeam[], draftState: DraftState }) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Failed to save league data:', error);
    }
  };

  const loadSavedLeague = (): boolean => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);

        // Only load if saved within last 7 days
        const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        if (data.timestamp && data.timestamp > weekAgo) {
          setTeams(data.teams);
          setDraftState(data.draftState);
          return true;
        }
      }
    } catch (error) {
      console.error('Failed to load league data:', error);
    }
    return false;
  };

  const clearLeague = () => {
    localStorage.removeItem(STORAGE_KEY);

    // Reset to initial state
    const initialTeams: LeagueTeam[] = initialDraftOrder.map((owner, index) => ({
      id: `team-${index}`,
      name: owner === 'You' ? 'My Team' : owner,
      owner,
      companies: [],
      points: Math.floor(Math.random() * 200) + 400,
      rank: index + 1
    }));

    setTeams(initialTeams);
    setDraftState({
      isActive: false,
      isComplete: false,
      currentPick: 1,
      draftOrder: initialDraftOrder,
      availableCompanies: companiesData as Company[],
      pickedCompanies: [],
      roundsCompleted: 0,
      totalRounds: TOTAL_ROUNDS
    });
  };

  // Load saved data on mount
  useEffect(() => {
    loadSavedLeague();
  }, []);

  // Auto-draft effect - triggers when draft state changes
  useEffect(() => {
    if (!draftState.isActive || draftState.isComplete) return;

    const currentTeamIndex = (draftState.currentPick - 1) % draftState.draftOrder.length;
    const currentTeam = draftState.draftOrder[currentTeamIndex];

    // If it's an AI team's turn, auto-draft after a delay
    if (currentTeam !== 'You' && draftState.availableCompanies.length > 0) {
      const timeoutId = setTimeout(() => {
        autoDraftNext(draftState);
      }, 1500);

      return () => clearTimeout(timeoutId);
    }
  }, [draftState.currentPick, draftState.isActive]);

  const myTeam = teams.find(team => team.owner === 'You');

  const value: FantasyLeagueContextType = {
    teams,
    draftState,
    startDraft,
    draftCompany,
    loadSavedLeague,
    clearLeague,
    myTeam
  };

  return (
    <FantasyLeagueContext.Provider value={value}>
      {children}
    </FantasyLeagueContext.Provider>
  );
};