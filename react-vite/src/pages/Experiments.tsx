import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ClipboardCheck, Zap, AlertTriangle, DollarSign } from 'lucide-react';
import FantasyLeague from './FantasyLeague';
import Gambling from './Gambling';

type ExperimentId = 'fantasy-league' | 'gambling' | 'future-experiment-1';

interface Experiment {
  id: ExperimentId;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'active' | 'coming-soon' | 'deprecated';
  component?: React.ComponentType;
}

const experiments: Experiment[] = [
  {
    id: 'fantasy-league',
    name: 'Fantasy Startup League',
    description: 'Draft and manage your fantasy team of YC startups. Track performance and compete with AI teams.',
    icon: Zap,
    status: 'active',
    component: FantasyLeague,
  },
  {
    id: 'gambling',
    name: 'Betting Dashboard',
    description: 'Real-time odds and betting lines across major sports. Simulated odds for entertainment purposes.',
    icon: DollarSign,
    status: 'active',
    component: Gambling,
  },
  {
    id: 'future-experiment-1',
    name: 'Coming Soon',
    description: 'More experimental features will appear here as they are developed.',
    icon: ClipboardCheck,
    status: 'coming-soon',
  },
];

const Experiments: React.FC = () => {
  const [activeExperiment, setActiveExperiment] = useState<ExperimentId>('fantasy-league');

  const currentExperiment = experiments.find(exp => exp.id === activeExperiment);
  const ActiveComponent = currentExperiment?.component;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
              <ClipboardCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Experiments
            </h1>
          </div>
          <p className="text-muted-foreground">
            Experimental features and prototypes - not ready for primetime yet!
          </p>
        </div>
      </div>

      {/* Warning Banner */}
      <Card className="border-yellow-500/50 bg-yellow-500/10">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">Experimental Features</h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                These features are works in progress and may have bugs, incomplete functionality, or undergo significant changes.
                Data may be reset at any time. Use at your own risk!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Experiment Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {experiments.map((experiment) => (
          <Card
            key={experiment.id}
            className={`cursor-pointer transition-all ${
              activeExperiment === experiment.id
                ? 'border-primary shadow-lg ring-2 ring-primary ring-offset-2'
                : experiment.status === 'coming-soon'
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:border-primary hover:shadow-md'
            }`}
            onClick={() => {
              if (experiment.status === 'active') {
                setActiveExperiment(experiment.id);
              }
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${
                  activeExperiment === experiment.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <experiment.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{experiment.name}</h3>
                    {experiment.status === 'coming-soon' && (
                      <Badge variant="outline" className="text-xs">Soon</Badge>
                    )}
                    {experiment.status === 'deprecated' && (
                      <Badge variant="destructive" className="text-xs">Deprecated</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {experiment.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Experiment Content */}
      {ActiveComponent ? (
        <div className="mt-6">
          <ActiveComponent />
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <ClipboardCheck className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
            <p className="text-muted-foreground">
              This experimental feature is currently in development.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Experiments;
