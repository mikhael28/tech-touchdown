import React, { useState, useEffect } from 'react';
import { X, Check, ArrowRight, ArrowLeft, Code, Building2, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { programmingLanguages, techStacks, industries, companies } from '../data/tech';

interface TechSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (favoriteTech: FavoriteTech) => void;
}

interface FavoriteTech {
  languages: string[];
  stacks: string[];
  industries: string[];
  companies: string[];
}

const techCategories = [
  { 
    key: 'languages', 
    name: 'Programming Languages', 
    items: programmingLanguages, 
    color: 'bg-blue-500',
    icon: Code,
    description: 'Choose your preferred programming languages'
  },
  { 
    key: 'stacks', 
    name: 'Tech Stacks & Frameworks', 
    items: techStacks, 
    color: 'bg-green-500',
    icon: Building2,
    description: 'Select frameworks and technologies you use'
  },
  { 
    key: 'industries', 
    name: 'Industries & Verticals', 
    items: industries, 
    color: 'bg-purple-500',
    icon: Users,
    description: 'Pick industries you\'re interested in'
  },
  { 
    key: 'companies', 
    name: 'Companies & AI Startups', 
    items: companies, 
    color: 'bg-orange-500',
    icon: Users,
    description: 'Choose companies you want to follow'
  },
] as const;

const TechSelectionModal: React.FC<TechSelectionModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [selectedTech, setSelectedTech] = useState<FavoriteTech>({
    languages: [],
    stacks: [],
    industries: [],
    companies: [],
  });

  const currentCategory = techCategories[currentCategoryIndex];
  const isLastCategory = currentCategoryIndex === techCategories.length - 1;
  const isFirstCategory = currentCategoryIndex === 0;

  const handleTechToggle = (itemShortName: string) => {
    const categoryKey = currentCategory.key;
    setSelectedTech(prev => ({
      ...prev,
      [categoryKey]: prev[categoryKey].includes(itemShortName)
        ? prev[categoryKey].filter(t => t !== itemShortName)
        : [...prev[categoryKey], itemShortName]
    }));
  };

  const handleNext = () => {
    if (isLastCategory) {
      onComplete(selectedTech);
    } else {
      setCurrentCategoryIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstCategory) {
      setCurrentCategoryIndex(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onComplete(selectedTech);
  };

  const canProceed = selectedTech[currentCategory.key].length > 0 || isLastCategory;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden">
        <Card className="bg-card border-0 shadow-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${currentCategory.color} flex items-center justify-center text-white font-bold text-lg`}>
                  <currentCategory.icon className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    Select Your Favorite {currentCategory.name}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    {currentCategory.description} (you can select multiple)
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Progress indicator */}
            <div className="flex items-center gap-2">
              {techCategories.map((category, index) => (
                <div
                  key={category.key}
                  className={`flex-1 h-2 rounded-full transition-colors ${
                    index <= currentCategoryIndex
                      ? category.color
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            {/* Tech items grid */}
            <div className="max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                {currentCategory.items.map((item) => {
                  const isSelected = selectedTech[currentCategory.key].includes(item.short_name);
                  return (
                    <button
                      key={item.short_name}
                      onClick={() => handleTechToggle(item.short_name)}
                      className={`group relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                        isSelected
                          ? 'border-primary bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50 hover:bg-gradient-to-br hover:from-muted/50 hover:to-muted/20'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-3">
                        <div className="relative">
                          <div 
                            className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-200 ${
                              isSelected ? 'bg-primary/10' : 'bg-muted/50'
                            }`}
                            style={{ backgroundColor: isSelected ? undefined : `${item.color}20` }}
                          >
                            {item.icon_url ? (
                              <img
                                src={item.icon_url}
                                alt={item.name}
                                className="w-12 h-12 object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div 
                                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                                style={{ backgroundColor: item.color }}
                              >
                                {item.short_name.charAt(0)}
                              </div>
                            )}
                          </div>
                          {isSelected && (
                            <div className="absolute -top-2 -right-2 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-lg animate-in zoom-in-50 duration-200">
                              <Check className="w-4 h-4 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="text-center space-y-1">
                          <p className="text-sm font-semibold text-foreground truncate max-w-24">
                            {item.short_name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate max-w-24 leading-tight">
                            {item.name.split(' ').pop()}
                          </p>
                          {item.description && (
                            <p className="text-xs text-muted-foreground/70 truncate max-w-24 leading-tight">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected tech summary */}
            {selectedTech[currentCategory.key].length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Selected:</span>
                {selectedTech[currentCategory.key].map(itemShortName => {
                  const item = currentCategory.items.find(t => t.short_name === itemShortName);
                  return (
                    <Badge key={itemShortName} variant="secondary" className="text-xs">
                      {item?.short_name}
                    </Badge>
                  );
                })}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex gap-2">
                {!isFirstCategory && (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Skip for now
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className="flex items-center gap-2"
                >
                  {isLastCategory ? 'Complete' : 'Next'}
                  {!isLastCategory && <ArrowRight className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TechSelectionModal;
