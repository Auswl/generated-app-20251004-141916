import React from 'react';
import { Appointment, Patient, PROCEDURE_COLORS } from '@/types/denta-plan';
import { getTodaysAppointments, getProcedureSummary } from '@/lib/denta-plan-utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Users, Plus, BarChart, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
interface DashboardViewProps {
  appointments: Record<string, Appointment>;
  patients: Record<string, Patient>;
  onViewChange: (view: 'calendar' | 'patients' | 'reports') => void;
  onAddPatient: () => void;
  onBookAppointment: () => void;
}
export const DashboardView: React.FC<DashboardViewProps> = ({ appointments, patients, onViewChange, onAddPatient, onBookAppointment }) => {
  const todaysAppointments = getTodaysAppointments(appointments);
  const nextAppointment = todaysAppointments.length > 0 ? todaysAppointments[0] : null;
  const nextPatient = nextAppointment ? patients[nextAppointment.appointment.patientId] : null;
  const procedureSummary = getProcedureSummary(appointments);
  return (
    <ScrollArea className="flex-1 bg-gray-50/50">
      <div className="p-4 md:p-8 space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your summary for today, {format(new Date(), 'MMMM d, yyyy')}.</p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todaysAppointments.length}</div>
              <p className="text-xs text-muted-foreground">patients scheduled for today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {nextAppointment && nextPatient ? (
                <>
                  <div className="text-2xl font-bold">{nextAppointment.time}</div>
                  <p className="text-xs text-muted-foreground truncate">{nextPatient.name} - {nextAppointment.appointment.procedure}</p>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">No more appointments today</p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(patients).length}</div>
              <p className="text-xs text-muted-foreground">active patient profiles</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button onClick={onBookAppointment}><Plus className="mr-2 h-4 w-4" /> Book Appointment</Button>
              <Button variant="secondary" onClick={onAddPatient}><User className="mr-2 h-4 w-4" /> Add Patient</Button>
              <Button variant="outline" onClick={() => onViewChange('calendar')}><Calendar className="mr-2 h-4 w-4" /> View Schedule</Button>
              <Button variant="outline" onClick={() => onViewChange('reports')}><BarChart className="mr-2 h-4 w-4" /> View Reports</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Procedure Summary</CardTitle>
              <CardDescription>A look at all scheduled procedures.</CardDescription>
            </CardHeader>
            <CardContent>
              {procedureSummary.length > 0 ? (
                <ul className="space-y-2">
                  {procedureSummary.slice(0, 5).map(proc => (
                    <li key={proc.name} className="flex justify-between items-center text-sm">
                      <span>{proc.name}</span>
                      <span className="font-semibold">{proc.count}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No procedures scheduled yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
};