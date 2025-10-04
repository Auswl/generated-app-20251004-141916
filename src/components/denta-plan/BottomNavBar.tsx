import React from 'react';
import { AppView, NAV_ITEMS } from '@/types/denta-plan';
import { cn } from '@/lib/utils';
interface BottomNavBarProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}
export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, onViewChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t z-40 md:hidden">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.view}
            type="button"
            className={cn(
              "inline-flex flex-col items-center justify-center px-2 hover:bg-gray-50 dark:hover:bg-gray-800 group transition-colors",
              activeView === item.view ? "text-blue-600 dark:text-blue-500" : "text-gray-500 dark:text-gray-400"
            )}
            onClick={() => onViewChange(item.view)}
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};