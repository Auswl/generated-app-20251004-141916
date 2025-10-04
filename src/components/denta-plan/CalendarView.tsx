import React, { useState, useMemo } from 'react';
import { add, sub } from 'date-fns';
import { Settings, Patient, Appointment, ViewMode } from '@/types/denta-plan';
import { getWeekDays, exportScheduleAsText } from '@/lib/denta-plan-utils';
import { Header } from '@/components/denta-plan/Header';
import { CalendarGrid } from '@/components/denta-plan/CalendarGrid';
import { DailyView } from '@/components/denta-plan/DailyView';
import { MonthlyView } from '@/components/denta-plan/MonthlyView';
import { MinimalView } from '@/components/denta-plan/MinimalView';
import { ProcedureLegend } from './ProcedureLegend';
interface CalendarViewProps {
  settings: Settings;
  patients: Record<string, Patient>;
  appointments: Record<string, Appointment>;
  onSlotClick: (date: Date, time: string) => void;
  onOpenSettings: () => void;
}
export const CalendarView: React.FC<CalendarViewProps> = ({ settings, patients, appointments, onSlotClick, onOpenSettings }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('weekly');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);
  const handleNext = () => {
    if (viewMode === 'daily') setCurrentDate(add(currentDate, { days: 1 }));
    else if (viewMode === 'monthly') setCurrentDate(add(currentDate, { months: 1 }));
    else setCurrentDate(add(currentDate, { weeks: 1 }));
  };
  const handlePrevious = () => {
    if (viewMode === 'daily') setCurrentDate(sub(currentDate, { days: 1 }));
    else if (viewMode === 'monthly') setCurrentDate(sub(currentDate, { months: 1 }));
    else setCurrentDate(sub(currentDate, { weeks: 1 }));
  };
  const handleToday = () => setCurrentDate(new Date());
  const handleViewChange = (newView: ViewMode) => setViewMode(newView);
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
    setViewMode('daily');
  };
  const handleToggleSearch = () => {
    setIsSearchVisible((prev) => !prev);
    if (isSearchVisible) setSearchQuery('');
  };
  const handleExport = () => {
    exportScheduleAsText(settings, appointments, patients, weekDays);
  };
  const renderCalendarView = () => {
    switch (viewMode) {
      case 'daily':
        return <DailyView date={currentDate} settings={settings} appointments={appointments} patients={patients} onSlotClick={onSlotClick} searchQuery={searchQuery} zoomLevel={zoomLevel} />;
      case 'monthly':
        return <MonthlyView currentDate={currentDate} settings={settings} appointments={appointments} onDayClick={handleDayClick} />;
      case 'minimal':
        return <MinimalView currentDate={currentDate} settings={settings} appointments={appointments} patients={patients} onAppointmentClick={onSlotClick} />;
      case 'weekly':
      default:
        return <CalendarGrid weekDays={weekDays} settings={settings} appointments={appointments} patients={patients} onSlotClick={onSlotClick} searchQuery={searchQuery} zoomLevel={zoomLevel} />;
    }
  };
  return (
    <div className="flex flex-col h-full">
      <Header
        currentDate={currentDate}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onToday={handleToday}
        onOpenSettings={onOpenSettings}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSearchVisible={isSearchVisible}
        onToggleSearch={handleToggleSearch}
        onExport={handleExport}
        viewMode={viewMode}
        onViewChange={handleViewChange}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        {renderCalendarView()}
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground border-t px-4 md:px-8 flex justify-center items-center">
        <ProcedureLegend />
      </footer>
    </div>
  );
};