import React from 'react';
import { AppView, NAV_ITEMS } from '@/types/denta-plan';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
interface SideNavBarProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}
export const SideNavBar: React.FC<SideNavBarProps> = ({ activeView, onViewChange }) => {
  return (
    <nav className="hidden md:flex flex-col w-64 bg-background border-r">
      <div className="flex items-center gap-2 h-16 border-b px-6">
        <Calendar className="h-7 w-7 text-blue-500" />
        <h1 className="text-2xl font-bold text-primary">DentaPlan</h1>
      </div>
      <div className="flex-1 p-4 space-y-2">
        {NAV_ITEMS.map((item) => (
          <Button
            key={item.view}
            variant={activeView === item.view ? 'secondary' : 'ghost'}
            className="w-full justify-start text-base"
            onClick={() => onViewChange(item.view)}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
          </Button>
        ))}
      </div>
      <div className="p-4 border-t flex flex-col items-center gap-4">
        <ThemeToggle className="relative top-0 right-0" />
        <div className="text-center text-sm text-muted-foreground">
          Built with ���️ at Cloudflare
        </div>
      </div>
    </nav>
  );
};