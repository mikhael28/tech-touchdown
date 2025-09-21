import React from 'react';
import SearchInterface from './SearchInterface';

const SportsSearch: React.FC = () => {
  return (
    <div className="h-full">
      <SearchInterface
        title="🏈 Sports News"
        placeholder="Search for sports articles, news, or any topic..."
        defaultQuery="What are the latest headlines in the NFL, NBA, MLB, and NHL?"
        className="h-full"
      />
    </div>
  );
};

export default SportsSearch;
