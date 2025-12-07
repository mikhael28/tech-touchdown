import React from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";

type ItemType = "sports" | "tech";

interface BaseItem {
  name: string;
  short_name: string;
  icon_url?: string;
  logo_url?: string;
  color?: string;
}

interface CategoryConfig {
  items: BaseItem[];
  color: string;
  label: string;
  icon?: string;
}

interface FavoriteItemsBubblesProps<T extends string = string> {
  type: ItemType;
  title: string;
  emptyIcon: string;
  emptyTitle: string;
  emptyDescription?: string;
  editButtonText: string;
  favoriteItems: Record<T, string[]>;
  categoryConfig: Record<T, CategoryConfig>;
  onRemoveItem: (category: T, itemShortName: string) => void;
  onEdit: () => void;
  onItemClick?: (category: T, itemShortName: string) => void;
}

function FavoriteItemsBubbles<T extends string = string>({
  type,
  title,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  editButtonText,
  favoriteItems,
  categoryConfig,
  onRemoveItem,
  onEdit,
  onItemClick,
}: FavoriteItemsBubblesProps<T>) {
  const getItemInfo = (category: T, itemShortName: string) => {
    const config = categoryConfig[category];
    return config.items.find((item) => item.short_name === itemShortName);
  };

  const hasAnyItems = (Object.values(favoriteItems) as string[][]).some(
    (items) => items.length > 0
  );

  if (!hasAnyItems) {
    return (
      <div className="flex min-h-[60px] items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {emptyIcon} {emptyTitle}
        </p>
        <Button variant="outline" size="sm" onClick={onEdit}>
          {editButtonText}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        <Button variant="outline" size="sm" onClick={onEdit}>
          {editButtonText}
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {(Object.entries(favoriteItems) as [T, string[]][]).map(
          ([category, items]) => {
            if (items.length === 0) return null;

            return items.map((itemShortName: string) => {
              const item = getItemInfo(category as T, itemShortName);
              if (!item) return null;

              const config = categoryConfig[category as T];

              return (
                <div
                  key={`${String(category)}-${itemShortName}`}
                  className={`group relative inline-flex items-center gap-2 rounded-full border border-border bg-gradient-to-r from-muted to-muted/80 px-2.5 py-1 transition-all duration-200 hover:border-primary/30 hover:from-primary/10 hover:to-primary/5 hover:shadow-md ${
                    onItemClick ? "cursor-pointer" : ""
                  }`}
                  onClick={() => onItemClick?.(category as T, itemShortName)}
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-background">
                    {item.icon_url || item.logo_url ? (
                      <img
                        src={item.icon_url || item.logo_url}
                        alt={item.name}
                        className="h-4 w-4 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div
                        className="flex h-4 w-4 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.short_name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-foreground">
                    {item.short_name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 rounded-full p-0 opacity-0 transition-all duration-200 hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveItem(category as T, itemShortName);
                    }}
                  >
                    <X className="h-2.5 w-2.5" />
                  </Button>
                </div>
              );
            });
          }
        )}
      </div>
    </div>
  );
}

export default FavoriteItemsBubbles;
