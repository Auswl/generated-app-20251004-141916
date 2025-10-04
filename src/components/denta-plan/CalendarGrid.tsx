import React from 'react';
import { format, getDay, parse } from 'date-fns';
import { Settings, Appointment, Patient, PROCEDURE_COLORS } from '@/types/denta-plan';
import { generateTimeSlots, getAppointmentKey } from '@/lib/denta-plan-utils';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
interface CalendarGridProps {
  weekDays: Date[];
  settings: Settings;
  appointments: Record<string, Appointment>;
  patients: Record<string, Patient>;
  onSlotClick: (date: Date, time: string) => void;
  searchQuery: string;
  zoomLevel: number;
}
export const CalendarGrid: React.FC<CalendarGridProps> = ({ weekDays, settings, appointments, patients, onSlotClick, searchQuery, zoomLevel }) => {
  const timeSlots = generateTimeSlots(settings);
  const lowerCaseQuery = searchQuery.toLowerCase();
  const slotHeight = 5 * zoomLevel; // 5rem is the base height (h-20)
  return (
    <div className="flex-grow overflow-auto">
      <div className="grid grid-cols-[auto_repeat(7,1fr)] min-w-[800px]">
        {/* Time column header */}
        <div className="sticky top-0 z-20 bg-background border-b border-r p-2"></div>
        {/* Day headers */}
        {weekDays.map(day => (
          <div key={day.toISOString()} className="sticky top-0 z-20 bg-background border-b p-2 text-center">
            <p className="font-semibold text-sm">{format(day, 'EEE')}</p>
            <p className="text-2xl font-bold">{format(day, 'd')}</p>
          </div>
        ))}
        {/* Time slots and calendar cells */}
        {timeSlots.map(time => (
          <React.Fragment key={time}>
            {/* Time cell */}
            <div className="relative text-right pr-2 text-xs text-muted-foreground" style={{ top: '-0.75rem' }}>
              {time}
            </div>
            {/* Calendar cells for the time slot */}
            {weekDays.map(day => {
              const dayIndex = getDay(day);
              const daySetting = settings.workingHours[dayIndex];
              const slotTime = parse(time, 'HH:mm', new Date());
              const slotHour = slotTime.getHours();
              const isWorkingSlot = daySetting?.isWorkingDay && slotHour >= daySetting.startTime && slotHour < daySetting.endTime;
              const appointmentKey = getAppointmentKey(day, time);
              const appointment = appointments[appointmentKey];
              const patient = appointment ? patients[appointment.patientId] : null;
              const isMatch = lowerCaseQuery && patient
                ? patient.name.toLowerCase().includes(lowerCaseQuery)
                : true;
              const procedureName = appointment?.procedure === 'Custom'
                ? appointment.customProcedureName
                : appointment?.procedure;
              const colorClass = appointment
                ? PROCEDURE_COLORS[appointment.procedure] || PROCEDURE_COLORS['Custom']
                : '';
              return (
                <div
                  key={day.toISOString() + time}
                  className={cn(
                    "border-r border-b relative group p-1 text-xs overflow-hidden transition-all duration-200",
                    !isWorkingSlot && "bg-slate-100 dark:bg-slate-800/50",
                    isWorkingSlot && !appointment && "cursor-pointer hover:bg-blue-50",
                    appointment ? `${colorClass} border-l-4` : "",
                    lowerCaseQuery && appointment && !isMatch && "opacity-30"
                  )}
                  style={{ height: `${slotHeight}rem` }}
                  onClick={() => isWorkingSlot && onSlotClick(day, time)}
                >
                  {appointment && patient ? (
                    <div className="flex flex-col h-full">
                      <p className="font-bold truncate">{patient.name}</p>
                      <p className="truncate">{procedureName}</p>
                      <p className="text-muted-foreground truncate mt-auto">{patient.phone}</p>
                    </div>
                  ) : appointment ? (
                     <div className="flex flex-col h-full">
                      <p className="font-bold truncate text-red-500">Unknown Patient</p>
                      <p className="truncate">{procedureName}</p>
                    </div>
                  ) : isWorkingSlot && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="h-6 w-6 text-blue-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};