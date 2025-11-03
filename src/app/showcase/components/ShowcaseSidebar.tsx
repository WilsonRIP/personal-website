import React from "react";
import { Button } from "@/components/ui/button";

interface ShowcaseItem {
  id: string;
  name: string;
}

interface ShowcaseSidebarProps {
  items: ShowcaseItem[];
  activeItemId: string;
  onSelectItem: (id: string) => void;
}

const ShowcaseSidebar: React.FC<ShowcaseSidebarProps> = ({
  items,
  activeItemId,
  onSelectItem,
}) => {
  return (
    <aside className="sticky top-20 h-[calc(100vh-5rem)] w-56 flex-shrink-0 p-6 border-r border-border bg-background/50 backdrop-blur-sm rounded-r-lg hidden md:block overflow-y-auto">
      <h3 className="text-xl font-bold mb-5 text-foreground">
        Components
      </h3>
      <nav>
        <ul>
          {items.map((item) => {
            const isActive = item.id === activeItemId;
            return (
              <li key={item.id}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => onSelectItem(item.id)}
                  className={`block w-full justify-start text-left px-3 py-2 mb-1 rounded-xl transition-all duration-150 ease-in-out font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-opacity-75 ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:text-primary hover:bg-muted"
                  }`}
                >
                  {item.name}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default ShowcaseSidebar;
