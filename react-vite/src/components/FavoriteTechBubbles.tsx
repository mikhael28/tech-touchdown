import React from "react";
import { X } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  programmingLanguages,
  techStacks,
  industries,
  companies,
} from "../data/tech";

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
    color: "bg-blue-500",
    label: "Languages",
    icon: "💻",
  },
  stacks: {
    items: techStacks,
    color: "bg-green-500",
    label: "Stacks",
    icon: "⚡",
  },
  industries: {
    items: industries,
    color: "bg-purple-500",
    label: "Industries",
    icon: "🏢",
  },
  companies: {
    items: companies,
    color: "bg-orange-500",
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
  const getTechInfo = (category: keyof FavoriteTech, itemShortName: string) => {
    const config = techConfig[category];
    return config.items.find((item) => item.short_name === itemShortName);
  };

  const hasAnyTech = Object.values(favoriteTech).some(
    (items) => items.length > 0
  );

  if (!hasAnyTech) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <span className="text-2xl">💻</span>
          </div>
          <div className="space-y-2">
            <p className="text-lg text-muted-foreground">
              No tech interests selected
            </p>
            <p className="text-sm text-muted-foreground">
              Choose your tech interests to get personalized content
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onEditTech}
            className="mt-4"
          >
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

      <div className="flex flex-wrap gap-2">
        {Object.entries(favoriteTech).map(([category, items]) => {
          if (items.length === 0) return null;

          return items.map((itemShortName: string) => {
            const item = getTechInfo(
              category as keyof FavoriteTech,
              itemShortName
            );
            if (!item) return null;

            const config = techConfig[category as keyof FavoriteTech];

            return (
              <div
                key={`${category}-${itemShortName}`}
                className={`group relative inline-flex items-center gap-3 rounded-full border border-border bg-gradient-to-r from-muted to-muted/80 px-4 py-2 transition-all duration-200 hover:border-primary/30 hover:from-primary/10 hover:to-primary/5 hover:shadow-md ${
                  onTechItemClick ? "cursor-pointer" : ""
                }`}
                onClick={() =>
                  onTechItemClick?.(
                    category as keyof FavoriteTech,
                    itemShortName
                  )
                }
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-background">
                  {item.icon_url ? (
                    <img
                      src={item.icon_url}
                      alt={item.name}
                      className="h-5 w-5 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div
                      className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.short_name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {item.short_name}
                </span>
                {/* <div className={`w-2 h-2 rounded-full ${config.color}`} title={config.label}></div> */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full p-0 opacity-0 transition-all duration-200 hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
                  onClick={() =>
                    onRemoveTech(category as keyof FavoriteTech, itemShortName)
                  }
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            );
          });
        })}
      </div>
    </div>
  );
};

export default FavoriteTechBubbles;
