import React from "react";
import {
  programmingLanguages,
  techStacks,
  industries,
  companies,
} from "../data/tech";
import FavoriteItemsBubbles from "./FavoriteItemsBubbles";

interface FavoriteTechBubblesProps {
  favoriteTech: FavoriteTech;
  onRemoveTech: (category: keyof FavoriteTech, itemShortName: string) => void;
  onEditTech: () => void;
  onTechItemClick?: (
    category: keyof FavoriteTech,
    itemShortName: string
  ) => void;
}

interface FavoriteTech {
  languages: string[];
  stacks: string[];
  industries: string[];
  companies: string[];
}

const techConfig = {
  languages: {
    items: programmingLanguages,
    color: "bg-primary",
    label: "Languages",
    icon: "💻",
  },
  stacks: {
    items: techStacks,
    color: "bg-accent",
    label: "Stacks",
    icon: "⚡",
  },
  industries: {
    items: industries,
    color: "bg-purple",
    label: "Industries",
    icon: "🏢",
  },
  companies: {
    items: companies,
    color: "bg-secondary",
    label: "Companies",
    icon: "🚀",
  },
} as const;

const FavoriteTechBubbles: React.FC<FavoriteTechBubblesProps> = ({
  favoriteTech,
  onRemoveTech,
  onEditTech,
  onTechItemClick,
}) => {
  return (
    <FavoriteItemsBubbles
      type="tech"
      title="Your Tech Interests"
      emptyIcon="💻"
      emptyTitle="No tech interests selected"
      emptyDescription="Choose your tech interests to get personalized content"
      editButtonText="Edit Interests"
      favoriteItems={favoriteTech}
      categoryConfig={techConfig}
      onRemoveItem={onRemoveTech}
      onEdit={onEditTech}
      onItemClick={onTechItemClick}
    />
  );
};

export default FavoriteTechBubbles;
