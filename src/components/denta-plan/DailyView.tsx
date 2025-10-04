import React from 'react';
import { format, getDay, parse } from 'date-fns';
import { Settings, Appointment, Patient, PROCEDURE_COLORS } from '@/types/denta-plan';
import { generateTimeSlots, getAppointmentKey } from '@/lib/denta-plan-utils';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
interface DailyViewProps {
  date: Date;
  settings: Settings;
  appointments: Record<string, Appointment>;
  patients: Record<string, Patient>;
  onSlotClick: (date: Date, time: string) => void;
  searchQuery: string;
  zoomLevel: number;
}
export const DailyView: React.FC<DailyViewProps> = ({ date, settings, appointments, patients, onSlotClick, searchQuery, zoomLevel }) => {
  const timeSlots = generateTimeSlots(settings);
  const lowerCaseQuery = searchQuery.toLowerCase();
  const slotHeight = 5 * zoomLevel; // 5rem is the base height (h-20)
  const dayIndex = getDay(date);
  const daySetting = settings.workingHours[dayIndex];
  return (
    <ScrollArea className="flex-grow">
      <div className="grid grid-cols-[auto_1fr] min-w-[500px] p-4">
        {timeSlots.map(time => {
          const slotTime = parse(time, 'HH:mm', new Date());
          const slotHour = slotTime.getHours();
          const isWorkingSlot = daySetting?.isWorkingDay && slotHour >= daySetting.startTime && slotHour < daySetting.endTime;
          const appointmentKey = getAppointmentKey(date, time);
          const appointment = appointments[appointmentKey];
          const patient = appointment ? patients[appointment.patientId] : null;
          const isMatch = lowerCaseQuery && patient ? patient.name.toLowerCase().includes(lowerCaseQuery) : true;
          const procedureName = appointment?.procedure === 'Custom' ? appointment.customProcedureName : appointment?.procedure;
          const colorClass = appointment ? PROCEDURE_COLORS[appointment.procedure] || PROCEDURE_COLORS['Custom'] : '';
          return (
            <React.Fragment key={time}>
              <div className="relative text-right pr-4 text-sm text-muted-foreground" style={{ top: '-0.5rem' }}>
                {time}
              </div>
              <div
                className={cn(
                  "border-b relative group p-2 text-sm overflow-hidden transition-all duration-200 flex items-center",
                  !isWorkingSlot && "bg-slate-100 dark:bg-slate-800/50",
                  isWorkingSlot && !appointment && "cursor-pointer hover:bg-blue-50",
                  appointment ? `${colorClass} border-l-4` : "border-l-4 border-transparent",
                  lowerCaseQuery && appointment && !isMatch && "opacity-30"
                )}
                style={{ height: `${slotHeight}rem` }}
                onClick={() => isWorkingSlot && onSlotClick(date, time)}
              >
                {appointment && patient ? (
                  <div className="flex flex-col w-full">
                    <p className="font-bold truncate">{patient.name}</p>
                    <p className="truncate">{procedureName}</p>
                    <p className="text-muted-foreground truncate mt-auto">{patient.phone}</p>
                  </div>
                ) : appointment ? (
                  <div className="flex flex-col w-full">
                    <p className="font-bold truncate text-red-500">Unknown Patient</p>
                    <p className="truncate">{procedureName}</p>
                  </div>
                ) : isWorkingSlot && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="h-6 w-6 text-blue-400" />
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </ScrollArea>
  );
};