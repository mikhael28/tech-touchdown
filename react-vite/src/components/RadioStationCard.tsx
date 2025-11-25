import React from 'react';
import { RadioStation } from '../types/radio';
import RadioPlayer from './RadioPlayer';

interface RadioStationCardProps {
  station: RadioStation;
  showFullDetails?: boolean;
}

const RadioStationCard: React.FC<RadioStationCardProps> = ({ 
  station, 
  showFullDetails = true 
}) => {
  return (
    <div className="radio-station-card">
      <RadioPlayer station={station} compact={!showFullDetails} />
    </div>
  );
};

export default RadioStationCard;

