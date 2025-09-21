import React from 'react';
import { X } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { programmingLanguages, techStacks, industries, companies } from '../data/tech';

interface FavoriteTechBubblesProps {
  favoriteTech: FavoriteTech;
  onRemoveTech: (category: keyof FavoriteTech, itemShortName: string) => void;
  onEditTech: () => void;
  onTechItemClick?: (category: keyof FavoriteTech, itemShortName: string) => void;
}

interface FavoriteTech {
  languages: string[];
  stacks: string[];
  industries: string[];
  companies: string[];
}

const techConfig = {
  languages: { items: programmingLanguages, color: 'bg-blue-500', label: 'Languages', icon: '💻' },
  stacks: { items: techStacks, color: 'bg-green-500', label: 'Stacks', icon: '⚡' },
  industries: { items: industries, color: 'bg-purple-500', label: 'Industries', icon: '🏢' },
  companies: { items: companies, color: 'bg-orange-500', label: 'Companies', icon: '🚀' },
} as const;

const FavoriteTechBubbles: React.FC<FavoriteTechBubblesProps> = ({
  favoriteTech,
  onRemoveTech,
  onEditTech,
  onTechItemClick,
}) => {
  const getTechInfo = (category: keyof FavoriteTech, itemShortName: string) => {
    const config = techConfig[category];
    return config.items.find(item => item.short_name === itemShortName);
  };

  const hasAnyTech = Object.values(favoriteTech).some(items => items.length > 0);

  if (!hasAnyTech) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
            <span className="text-2xl">💻</span>
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground text-lg">No tech interests selected</p>
            <p className="text-sm text-muted-foreground">Choose your tech interests to get personalized content</p>
          </div>
          <Button variant="outline" size="sm" onClick={onEditTech} className="mt-4">
            Select Tech Interests
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Your Tech Interests</h3>
        <Button variant="outline" size="sm" onClick={onEditTech}>
          Edit Interests
        </Button>
      </div>

      <div className="space-y-3 flex flex-wrap gap-2">
        {Object.entries(favoriteTech).map(([category, items]) => {
          if (items.length === 0) return null;
          
          const config = techConfig[category as keyof FavoriteTech];
          
          return (
            <div key={category} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full ${config.color} flex items-center justify-center text-white text-xs font-bold`}>
                  {config.icon}
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {config.label} ({items.length})
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {items.map((itemShortName: string) => {
                  const item = getTechInfo(category as keyof FavoriteTech, itemShortName);
                  if (!item) return null;

                  return (
                    <div
                      key={`${category}-${itemShortName}`}
                      className={`group relative inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-muted to-muted/80 hover:from-primary/10 hover:to-primary/5 border border-border hover:border-primary/30 transition-all duration-200 hover:shadow-md ${onTechItemClick ? 'cursor-pointer' : ''}`}
                      onClick={() => onTechItemClick?.(category as keyof FavoriteTech, itemShortName)}
                    >
                      <div className="w-6 h-6 rounded-full bg-background flex items-center justify-center">
                        {item.icon_url ? (
                          <img
                            src={item.icon_url}
                            alt={item.name}
                            className="w-5 h-5 object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div 
                            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: item.color }}
                          >
                            {item.short_name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-foreground">{item.short_name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                        onClick={() => onRemoveTech(category as keyof FavoriteTech, itemShortName)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FavoriteTechBubbles;
