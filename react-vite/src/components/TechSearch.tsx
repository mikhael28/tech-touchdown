import React from 'react';
import SearchInterface from './SearchInterface';
import FavoriteTechBubbles from './FavoriteTechBubbles';
import { useFavoriteTech } from '../hooks/useFavoriteTech';

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

  const handleRemoveTech = (category: keyof FavoriteTech, itemShortName: string) => {
    removeTech(category, itemShortName);
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
        />
      </div>
      
      {/* Search Interface Section */}
      <div className="flex-1 overflow-hidden">
        <SearchInterface
          title="💻 Tech News"
          placeholder="Search for tech articles, startup news, or software engineering topics..."
          defaultQuery="What are the latest headlines in startups, full stack software engineering, and tech industry news?"
          className="h-full"
        />
      </div>
    </div>
  );
};

export default TechSearch;
