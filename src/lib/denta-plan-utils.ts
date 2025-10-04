import { Settings, Appointment, Patient, ViewMode } from '@/types/denta-plan';
import { format, addMinutes, setHours, setMinutes, startOfDay, eachDayOfInterval, startOfWeek, endOfWeek, getDay, parse, startOfMonth, endOfMonth, isToday, parseISO, isWithinInterval } from 'date-fns';
export const generateTimeSlots = (settings: Settings): string[] => {
  const { workingHours, slotDuration } = settings;
  const workingDaySettings = Object.values(workingHours).filter((d) => d.isWorkingDay);
  if (workingDaySettings.length === 0) {
    return [];
  }
  const earliestStart = Math.min(...workingDaySettings.map((d) => d.startTime));
  const latestEnd = Math.max(...workingDaySettings.map((d) => d.endTime));
  const slots: string[] = [];
  let currentTime = setMinutes(setHours(startOfDay(new Date()), earliestStart), 0);
  const end = setMinutes(setHours(startOfDay(new Date()), latestEnd), 0);
  while (currentTime < end) {
    slots.push(format(currentTime, 'HH:mm'));
    currentTime = addMinutes(currentTime, slotDuration);
  }
  return slots;
};
export const getWeekDays = (currentDate: Date): Date[] => {
  const start = startOfWeek(currentDate, { weekStartsOn: 0 });
  const end = endOfWeek(currentDate, { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
};
export const getMonthGridDays = (currentDate: Date): Date[] => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  return eachDayOfInterval({ start: gridStart, end: gridEnd });
};
export const formatDateRangeForView = (currentDate: Date, viewMode: ViewMode): string => {
  if (viewMode === 'daily') {
    return format(currentDate, 'MMMM d, yyyy');
  }
  if (viewMode === 'monthly') {
    return format(currentDate, 'MMMM yyyy');
  }
  const weekDays = getWeekDays(currentDate);
  if (!weekDays || weekDays.length === 0) return "";
  const start = weekDays[0];
  const end = weekDays[weekDays.length - 1];
  const startMonth = format(start, 'MMMM');
  const endMonth = format(end, 'MMMM');
  const startYear = format(start, 'yyyy');
  const endYear = format(end, 'yyyy');
  if (startYear !== endYear) {
    return `${format(start, 'MMMM d, yyyy')} - ${format(end, 'MMMM d, yyyy')}`;
  }
  if (startMonth !== endMonth) {
    return `${format(start, 'MMMM d')} - ${format(end, 'MMMM d, yyyy')}`;
  }
  return `${startMonth} ${format(start, 'd')} - ${format(end, 'd, yyyy')}`;
};
export const getAppointmentKey = (date: Date, time: string): string => {
  return `${format(date, 'yyyy-MM-dd')}_${time}`;
};
export const getTodaysAppointments = (appointments: Record<string, Appointment>) => {
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  return Object.entries(appointments).
  filter(([key]) => key.startsWith(todayStr)).
  map(([key, appointment]) => ({
    time: key.split('_')[1],
    appointment
  })).
  sort((a, b) => a.time.localeCompare(b.time));
};
export const getProcedureSummary = (appointments: Record<string, Appointment>): {name: string;count: number;color: string;}[] => {
  const summary: Record<string, number> = {};
  Object.values(appointments).forEach((app) => {
    const name = app.procedure === 'Custom' ? app.customProcedureName || 'Custom' : app.procedure;
    summary[name] = (summary[name] || 0) + 1;
  });
  return Object.entries(summary).
  map(([name, count]) => ({ name, count, color: name })).
  sort((a, b) => b.count - a.count);
};
export const filterAppointmentsByDateRange = (
appointments: Record<string, Appointment>,
range: 'week' | 'month' | 'all')
: Record<string, Appointment> => {
  if (range === 'all') return appointments;
  const now = new Date();
  let interval;
  if (range === 'week') {
    interval = { start: startOfWeek(now, { weekStartsOn: 0 }), end: endOfWeek(now, { weekStartsOn: 0 }) };
  } else {
    interval = { start: startOfMonth(now), end: endOfMonth(now) };
  }
  const filteredAppointments: Record<string, Appointment> = {};
  for (const key in appointments) {
    const date = parseISO(key.split('_')[0]);
    if (isWithinInterval(date, interval)) {
      filteredAppointments[key] = appointments[key];
    }
  }
  return filteredAppointments;
};
export const getAppointmentsByDayOfWeek = (
appointments: Record<string, Appointment>)
: {name: string;count: number;}[] => {
  const dayCounts = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
  const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (const key in appointments) {
    const date = parseISO(key.split('_')[0]);
    const dayName = dayMap[getDay(date)];
    if (dayName) {
      dayCounts[dayName]++;
    }
  }
  return Object.entries(dayCounts).map(([name, count]) => ({ name, count }));
};
export const exportScheduleAsText = (
settings: Settings,
appointments: Record<string, Appointment>,
patients: Record<string, Patient>,
weekDays: Date[])
: void => {
  let content = `Dental Appointments - Week of ${formatDateRangeForView(weekDays[0], 'weekly')}\n\n`;
  let hasAppointments = false;
  weekDays.forEach((day) => {
    const dayIndex = getDay(day);
    const daySetting = settings.workingHours[dayIndex];
    if (!daySetting || !daySetting.isWorkingDay) {
      return;
    }
    const timeSlots = generateTimeSlots(settings);
    const dailyAppointments = timeSlots.
    map((time) => {
      const slotTime = parse(time, 'HH:mm', new Date());
      const slotHour = slotTime.getHours();
      if (slotHour < daySetting.startTime || slotHour >= daySetting.endTime) {
        return null;
      }
      const key = getAppointmentKey(day, time);
      const appointment = appointments[key];
      if (!appointment) return null;
      const patient = patients[appointment.patientId];
      const procedureName =
      appointment.procedure === 'Custom' ?
      appointment.customProcedureName :
      appointment.procedure;
      return {
        time,
        patientName: patient ? patient.name : 'Unknown Patient',
        procedure: procedureName || 'N/A'
      };
    }).
    filter((app): app is {time: string;patientName: string;procedure: string;} => app !== null);
    if (dailyAppointments.length > 0) {
      hasAppointments = true;
      content += `--- ${format(day, 'EEEE, MMMM d, yyyy')} ---\n`;
      dailyAppointments.forEach((app) => {
        content += `${app.time} - ${app.patientName} - ${app.procedure}\n`;
      });
      content += '\n';
    }
  });
  if (!hasAppointments) {
    content += 'No appointments scheduled for this week.';
  }
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `DentaPlan_Schedule_${format(weekDays[0], 'yyyy-MM-dd')}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};