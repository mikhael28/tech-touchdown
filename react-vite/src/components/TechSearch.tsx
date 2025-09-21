import React, { useState } from 'react';
import SearchInterface from './SearchInterface';
import FavoriteTechBubbles from './FavoriteTechBubbles';
import { useFavoriteTech } from '../hooks/useFavoriteTech';
import { programmingLanguages, techStacks, industries, companies } from '../data/tech';

interface FavoriteTech {
  languages: string[];
  stacks: string[];
  industries: string[];
  companies: string[];
}

interface TechSearchProps {
  onEditTech: () => void;
}

const TechSearch: React.FC<TechSearchProps> = ({ onEditTech }) => {
  const {
    favoriteTech,
    removeTech,
  } = useFavoriteTech();

  const [searchQuery, setSearchQuery] = useState('');

  const handleRemoveTech = (category: keyof FavoriteTech, itemShortName: string) => {
    removeTech(category, itemShortName);
  };

  // Tech item click handler
  const handleTechItemClick = (category: keyof FavoriteTech, itemShortName: string) => {
    const techConfig = {
      languages: { items: programmingLanguages, label: 'programming language' },
      stacks: { items: techStacks, label: 'tech stack' },
      industries: { items: industries, label: 'industry' },
      companies: { items: companies, label: 'company' },
    };
    
    const config = techConfig[category];
    const item = config.items.find((item: any) => item.short_name === itemShortName);
    
    if (item) {
      const focusedQuery = `${item.name} ${config.label} news articles latest updates`;
      setSearchQuery(focusedQuery);
    }
  };

  // onEditTech is now passed as a prop from the parent Dashboard component

  return (
    <div className="h-full flex flex-col">
      {/* Favorite Tech Bubbles Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <FavoriteTechBubbles
          favoriteTech={favoriteTech}
          onRemoveTech={handleRemoveTech}
          onEditTech={onEditTech}
          onTechItemClick={handleTechItemClick}
        />
      </div>
      
      {/* Search Interface Section */}
      <div className="flex-1 overflow-y-auto">
        <SearchInterface
          title="💻 Tech News"
          placeholder="Search for tech articles, startup news, or software engineering topics..."
          defaultQuery="What are the latest headlines in startups, full stack software engineering, and tech industry news?"
          className="h-full"
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
};

export default TechSearch;
