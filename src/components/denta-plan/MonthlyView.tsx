import React from 'react';
import { format, getDay, isSameMonth, isToday } from 'date-fns';
import { Settings, Appointment } from '@/types/denta-plan';
import { getMonthGridDays, getAppointmentKey } from '@/lib/denta-plan-utils';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
interface MonthlyViewProps {
  currentDate: Date;
  settings: Settings;
  appointments: Record<string, Appointment>;
  onDayClick: (date: Date) => void;
}
const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MonthlyView: React.FC<MonthlyViewProps> = ({ currentDate, settings, appointments, onDayClick }) => {
  const monthDays = getMonthGridDays(currentDate);
  const appointmentsByDay: Record<string, number> = {};
  Object.keys(appointments).forEach(key => {
    const day = key.split('_')[0];
    appointmentsByDay[day] = (appointmentsByDay[day] || 0) + 1;
  });
  return (
    <ScrollArea className="flex-grow">
      <div className="grid grid-cols-7 flex-1">
        {WEEK_DAYS.map(day => (
          <div key={day} className="text-center font-semibold text-sm p-2 border-b text-muted-foreground">
            {day}
          </div>
        ))}
        {monthDays.map(day => {
          const dayKey = format(day, 'yyyy-MM-dd');
          const appointmentCount = appointmentsByDay[dayKey] || 0;
          const isCurrentMonth = isSameMonth(day, currentDate);
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "border-r border-b p-2 h-32 flex flex-col cursor-pointer transition-colors hover:bg-blue-50",
                !isCurrentMonth && "text-muted-foreground bg-muted/30",
                isToday(day) && "bg-blue-100"
              )}
              onClick={() => onDayClick(day)}
            >
              <span className={cn("font-bold", isToday(day) && "text-blue-600")}>
                {format(day, 'd')}
              </span>
              {appointmentCount > 0 && (
                <div className="mt-auto text-xs bg-blue-200 text-blue-800 rounded-full px-2 py-1 w-fit">
                  {appointmentCount} appt{appointmentCount > 1 ? 's' : ''}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};