import React from 'react';
import { ChevronLeft, ChevronRight, Search, Download, Settings as SettingsIcon, Calendar, X, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDateRangeForView } from '@/lib/denta-plan-utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ViewMode } from '@/types/denta-plan';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
interface HeaderProps {
  currentDate: Date;
  onNext: () => void;
  onPrevious: () => void;
  onToday: () => void;
  onOpenSettings: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isSearchVisible: boolean;
  onToggleSearch: () => void;
  onExport: () => void;
  viewMode: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}
export const Header: React.FC<HeaderProps> = ({
  currentDate,
  onNext,
  onPrevious,
  onToday,
  onOpenSettings,
  searchQuery,
  onSearchChange,
  isSearchVisible,
  onToggleSearch,
  onExport,
  viewMode,
  onViewChange,
  onZoomIn,
  onZoomOut,
}) => {
  return (
    <header className="sticky top-0 z-30 flex min-h-[4rem] items-center justify-between gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-8 flex-wrap">
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2 text-2xl font-bold text-primary">
          <Calendar className="h-7 w-7 text-blue-500" />
          <h1 className="hidden md:block">DentaPlan</h1>
        </div>
        <Button variant="outline" size="sm" onClick={onToday}>Today</Button>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onPrevious} aria-label="Previous period">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onNext} aria-label="Next period">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <h2 className="text-base md:text-xl font-semibold text-foreground/80 w-36 sm:w-auto">
          {formatDateRangeForView(currentDate, viewMode)}
        </h2>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <ToggleGroup type="single" value={viewMode} onValueChange={(value: ViewMode) => value && onViewChange(value)} aria-label="Calendar View">
          <ToggleGroupItem value="daily" aria-label="Daily view" className="text-xs sm:text-sm">Day</ToggleGroupItem>
          <ToggleGroupItem value="weekly" aria-label="Weekly view" className="text-xs sm:text-sm">Week</ToggleGroupItem>
          <ToggleGroupItem value="monthly" aria-label="Monthly view" className="text-xs sm:text-sm">Month</ToggleGroupItem>
          <ToggleGroupItem value="minimal" aria-label="Minimal view" className="text-xs sm:text-sm">Agenda</ToggleGroupItem>
        </ToggleGroup>
        {(viewMode === 'weekly' || viewMode === 'daily') && (
          <>
            <Button variant="ghost" size="icon" onClick={onZoomIn} aria-label="Zoom in">
              <ZoomIn className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onZoomOut} aria-label="Zoom out">
              <ZoomOut className="h-5 w-5" />
            </Button>
          </>
        )}
        <AnimatePresence>
          {isSearchVisible && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '8rem', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full h-9"
              />
            </motion.div>
          )}
        </AnimatePresence>
        <Button variant="ghost" size="icon" onClick={onToggleSearch} aria-label="Search">
          {isSearchVisible ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={onExport} aria-label="Download schedule">
          <Download className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onOpenSettings} aria-label="Settings">
          <SettingsIcon className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};