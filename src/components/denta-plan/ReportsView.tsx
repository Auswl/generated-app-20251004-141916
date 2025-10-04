import React, { useState, useMemo } from 'react';
import { Appointment, Patient } from '@/types/denta-plan';
import { getProcedureSummary, filterAppointmentsByDateRange, getAppointmentsByDayOfWeek } from '@/lib/denta-plan-utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Calendar, BarChart as BarChartIcon, Star, Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
interface ReportsViewProps {
  appointments: Record<string, Appointment>;
  patients: Patient[];
}
type DateRange = 'week' | 'month' | 'all';
export const ReportsView: React.FC<ReportsViewProps> = ({ appointments, patients }) => {
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const filteredAppointments = useMemo(() => filterAppointmentsByDateRange(appointments, dateRange), [appointments, dateRange]);
  const totalAppointments = Object.keys(filteredAppointments).length;
  const totalPatients = patients.length;
  const procedureSummary = getProcedureSummary(filteredAppointments);
  const appointmentsByDay = getAppointmentsByDayOfWeek(filteredAppointments);
  const busiestDay = useMemo(() => {
    if (totalAppointments === 0) return { name: 'N/A', count: 0 };
    return appointmentsByDay.reduce((max, day) => day.count > max.count ? day : max, appointmentsByDay[0]);
  }, [appointmentsByDay, totalAppointments]);
  const mostCommonProcedure = useMemo(() => {
    if (procedureSummary.length === 0) return { name: 'N/A', count: 0 };
    return procedureSummary[0];
  }, [procedureSummary]);
  return (
    <ScrollArea className="flex-1 bg-gray-50/50">
      <div className="p-4 md:p-8 space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
            <p className="text-muted-foreground">An overview of your clinic's activity.</p>
          </div>
          <ToggleGroup type="single" value={dateRange} onValueChange={(value: DateRange) => value && setDateRange(value)} aria-label="Date Range">
            <ToggleGroupItem value="week" aria-label="This Week">This Week</ToggleGroupItem>
            <ToggleGroupItem value="month" aria-label="This Month">This Month</ToggleGroupItem>
            <ToggleGroupItem value="all" aria-label="All Time">All Time</ToggleGroupItem>
          </ToggleGroup>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPatients}</div>
              <p className="text-xs text-muted-foreground">active patient profiles</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAppointments}</div>
              <p className="text-xs text-muted-foreground">in selected period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Busiest Day</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{busiestDay.name}</div>
              <p className="text-xs text-muted-foreground">{busiestDay.count} appointments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Procedure</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold truncate">{mostCommonProcedure.name}</div>
              <p className="text-xs text-muted-foreground">{mostCommonProcedure.count} appointments</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Procedure Breakdown</CardTitle>
              <CardDescription>Count of scheduled procedures in period.</CardDescription>
            </CardHeader>
            <CardContent>
              {procedureSummary.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={procedureSummary} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" allowDecimals={false} />
                      <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-10 h-80 flex flex-col justify-center items-center">
                  <BarChartIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-sm text-muted-foreground">No appointment data for this period.</p>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Appointments by Day</CardTitle>
              <CardDescription>Weekly appointment distribution.</CardDescription>
            </CardHeader>
            <CardContent>
              {totalAppointments > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={appointmentsByDay} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-10 h-80 flex flex-col justify-center items-center">
                  <BarChartIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-sm text-muted-foreground">No appointment data for this period.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
};