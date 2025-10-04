import React from 'react';
import { format, getDay } from 'date-fns';
import { Settings, Appointment, Patient, PROCEDURE_COLORS } from '@/types/denta-plan';
import { getWeekDays, getAppointmentKey } from '@/lib/denta-plan-utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
interface MinimalViewProps {
  currentDate: Date;
  settings: Settings;
  appointments: Record<string, Appointment>;
  patients: Record<string, Patient>;
  onAppointmentClick: (date: Date, time: string) => void;
}
export const MinimalView: React.FC<MinimalViewProps> = ({ currentDate, settings, appointments, patients, onAppointmentClick }) => {
  const weekDays = getWeekDays(currentDate);
  const weeklyAppointments = weekDays.flatMap(day => {
    const dayIndex = getDay(day);
    const daySetting = settings.workingHours[dayIndex];
    if (!daySetting?.isWorkingDay) return [];
    return Object.entries(appointments)
      .filter(([key]) => key.startsWith(format(day, 'yyyy-MM-dd')))
      .map(([key, appointment]) => {
        const time = key.split('_')[1];
        return { day, time, appointment };
      });
  }).sort((a, b) => {
    if (a.day.getTime() !== b.day.getTime()) {
      return a.day.getTime() - b.day.getTime();
    }
    return a.time.localeCompare(b.time);
  });
  return (
    <ScrollArea className="flex-grow p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {weeklyAppointments.length > 0 ? (
          <div className="space-y-6">
            {weeklyAppointments.map(({ day, time, appointment }) => {
              const patient = patients[appointment.patientId];
              const procedureName = appointment.procedure === 'Custom' ? appointment.customProcedureName : appointment.procedure;
              const colorClass = PROCEDURE_COLORS[appointment.procedure] || PROCEDURE_COLORS['Custom'];
              const bgColor = colorClass.split(' ').find(c => c.startsWith('bg-')) || 'bg-gray-100';
              return (
                <Card
                  key={getAppointmentKey(day, time)}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onAppointmentClick(day, time)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`w-2 h-full rounded-l-md ${bgColor}`} style={{ alignSelf: 'stretch' }}></div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div>
                        <p className="font-bold text-lg">{format(day, 'EEEE')}</p>
                        <p className="text-muted-foreground">{format(day, 'MMM d')}</p>
                      </div>
                      <div className="font-mono text-xl font-semibold">{time}</div>
                      <div>
                        <p className="font-semibold">{patient ? patient.name : 'Unknown Patient'}</p>
                        <p className="text-sm text-muted-foreground">{patient?.phone}</p>
                      </div>
                      <div className="text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${colorClass}`}>
                          {procedureName}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold">No appointments this week.</h3>
            <p className="text-muted-foreground">Enjoy the quiet time or book a new appointment.</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};