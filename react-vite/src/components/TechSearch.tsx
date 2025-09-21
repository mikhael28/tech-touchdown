import React from 'react';
import SearchInterface from './SearchInterface';

const TechSearch: React.FC = () => {
  return (
    <div className="h-full">
      <SearchInterface
        title="💻 Tech News"
        placeholder="Search for tech articles, startup news, or software engineering topics..."
        defaultQuery="What are the latest headlines in startups, full stack software engineering, and tech industry news?"
        className="h-full"
      />
    </div>
  );
};

export default TechSearch;
