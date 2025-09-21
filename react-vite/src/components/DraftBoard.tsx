import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  Search,
  Filter,
  Star,
  TrendingUp,
  Users,
  Clock,
  Building2,
  Zap,
  Crown,
  Target
} from 'lucide-react';

interface Company {
  link: string;
  image_url: string;
  name: string;
  description: string;
  vertical: string;
  'sub-vertical': string;
}

interface DraftBoardProps {
  availableCompanies: Company[];
  onDraftCompany: (company: Company) => void;
  currentPick: number;
  draftOrder: string[];
  pickedCompanies: Company[];
}

const DraftBoard: React.FC<DraftBoardProps> = ({
  availableCompanies,
  onDraftCompany,
  currentPick,
  draftOrder,
  pickedCompanies
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVertical, setFilterVertical] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const currentTeam = draftOrder[(currentPick - 1) % draftOrder.length];
  const isMyTurn = currentTeam === 'You';

  const getVerticalColor = (vertical: string) => {
    const colors: { [key: string]: string } = {
      'B2B': 'bg-blue-500',
      'Healthcare': 'bg-green-500',
      'Fintech': 'bg-yellow-500',
      'Consumer': 'bg-purple-500',
      'Industrials': 'bg-orange-500',
      'Education': 'bg-pink-500',
      'Government': 'bg-gray-500',
      'Construction': 'bg-brown-500',
      '': 'bg-slate-500'
    };
    return colors[vertical] || 'bg-slate-500';
  };

  const getCompanyScore = (company: Company) => {
    // Mock scoring algorithm based on various factors
    let score = Math.random() * 100;

    // Boost score for certain verticals
    if (company.vertical === 'B2B') score += 10;
    if (company.vertical === 'Healthcare') score += 15;
    if (company.vertical === 'Fintech') score += 8;

    // Boost for AI/tech keywords
    if (company.description.toLowerCase().includes('ai')) score += 20;
    if (company.description.toLowerCase().includes('automation')) score += 15;
    if (company.description.toLowerCase().includes('agent')) score += 12;

    return Math.round(score);
  };

  const filteredCompanies = availableCompanies
    .filter(company =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(company =>
      filterVertical === 'all' || company.vertical === filterVertical
    )
    .sort((a, b) => getCompanyScore(b) - getCompanyScore(a));

  const verticals = [...new Set(availableCompanies.map(c => c.vertical).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Draft Status Header */}
      <Card className={`${isMyTurn ? 'bg-gradient-to-r from-green-500 to-blue-600' : 'bg-gradient-to-r from-gray-500 to-gray-600'} text-white`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-full">
                {isMyTurn ? <Crown className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  Pick #{currentPick} - {currentTeam}{isMyTurn ? ' (Your Turn!)' : ''}
                </h3>
                <p className="opacity-90">
                  {isMyTurn ? 'Choose your startup wisely!' : `Waiting for ${currentTeam} to pick...`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Available</p>
              <p className="text-3xl font-bold">{availableCompanies.length}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Draft Order */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5" />
            Draft Order & Recent Picks
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {draftOrder.map((team, teamIndex) => {
              const isCurrentPick = (currentPick - 1) % draftOrder.length === teamIndex;

              // Get picks for this specific team based on draft order
              const teamPicks = pickedCompanies.filter((_, pickIndex) => {
                const pickTeamIndex = pickIndex % draftOrder.length;
                return pickTeamIndex === teamIndex;
              });

              const latestPick = teamPicks[teamPicks.length - 1];

              return (
                <div
                  key={`${team}-${teamIndex}`}
                  className={`p-3 rounded-lg border text-center ${
                    isCurrentPick
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="font-semibold text-sm">{team}</span>
                    {isCurrentPick && <Target className="w-4 h-4 text-blue-500" />}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {teamPicks.length} picks
                  </p>
                  {latestPick && (
                    <div className="mt-2">
                      <img
                        src={latestPick.image_url}
                        alt={latestPick.name}
                        className="w-6 h-6 mx-auto rounded-full object-cover"
                      />
                      <p className="text-xs font-medium truncate mt-1">{latestPick.name}</p>
                    </div>
                  )}
                  {teamPicks.length === 0 && (
                    <div className="mt-2">
                      <div className="w-6 h-6 mx-auto rounded-full bg-gray-200 dark:bg-gray-700"></div>
                      <p className="text-xs text-muted-foreground mt-1">No picks</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={filterVertical}
                onChange={(e) => setFilterVertical(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="all">All Verticals</option>
                {verticals.map(vertical => (
                  <option key={vertical} value={vertical}>{vertical}</option>
                ))}
              </select>

              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company List */}
      <div className={viewMode === 'grid'
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
        : 'space-y-3'
      }>
        {filteredCompanies.slice(0, 20).map((company) => {
          const score = getCompanyScore(company);

          return viewMode === 'grid' ? (
            <Card
              key={company.name}
              className="hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden"
            >
              <CardContent className="p-4">
                {/* Score Badge */}
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    {score}
                  </Badge>
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={company.image_url}
                    alt={company.name}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{company.name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {company.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className={`${getVerticalColor(company.vertical)} text-white text-xs`}
                    >
                      {company.vertical || 'Other'}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <TrendingUp className="w-3 h-3" />
                      <span>{score}%</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => onDraftCompany(company)}
                    disabled={!isMyTurn}
                    className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    {isMyTurn ? 'Draft' : 'Not Your Turn'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card key={company.name} className="hover:shadow-md transition-all cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={company.image_url}
                    alt={company.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{company.name}</h4>
                      <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                        {score}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{company.description}</p>
                    <Badge
                      variant="secondary"
                      className={`${getVerticalColor(company.vertical)} text-white text-xs`}
                    >
                      {company.vertical || 'Other'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="font-semibold">{score}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Projection</p>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => onDraftCompany(company)}
                      disabled={!isMyTurn}
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      {isMyTurn ? 'Draft' : 'Wait'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredCompanies.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Companies Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DraftBoard;