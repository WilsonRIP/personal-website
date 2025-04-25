import React from "react";

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
    <aside className="sticky top-20 h-[calc(100vh-5rem)] w-56 flex-shrink-0 p-6 border-r border-gray-200 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-r-lg hidden md:block overflow-y-auto">
      <h3 className="text-xl font-bold mb-5 text-gray-800 dark:text-gray-200">
        Components
      </h3>
      <nav>
        <ul>
          {items.map((item) => {
            const isActive = item.id === activeItemId;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSelectItem(item.id)}
                  className={`block w-full text-left px-3 py-2 mb-1 rounded-md transition-all duration-150 ease-in-out font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-75 ${
                    isActive
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-200/70 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700/50"
                  }`}
                >
                  {item.name}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default ShowcaseSidebar;
