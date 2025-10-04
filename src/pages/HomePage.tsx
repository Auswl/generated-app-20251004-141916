import React, { useState, useMemo } from 'react';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { Settings, Patient, Appointment, AppView } from '@/types/denta-plan';
import { getAppointmentKey } from '@/lib/denta-plan-utils';
import { PatientModal } from '@/components/denta-plan/PatientModal';
import { ConfirmationDialog } from '@/components/denta-plan/ConfirmationDialog';
import { AppointmentModal } from '@/components/denta-plan/AppointmentModal';
import { OnboardingWizard } from '@/components/denta-plan/OnboardingWizard';
import { BottomNavBar } from '@/components/denta-plan/BottomNavBar';
import { DashboardView } from '@/components/denta-plan/DashboardView';
import { CalendarView } from '@/components/denta-plan/CalendarView';
import { PatientsView } from '@/components/denta-plan/PatientsView';
import { ReportsView } from '@/components/denta-plan/ReportsView';
import { SettingsView } from '@/components/denta-plan/SettingsView';
import { SideNavBar } from '@/components/denta-plan/SideNavBar';
type EditingContext = {
  patient: Patient | null;
  returnTo: 'manage' | 'appointment' | null;
};
const DEFAULT_SETTINGS: Settings = {
  workingHours: {
    0: { isWorkingDay: false, startTime: 9, endTime: 17 },
    1: { isWorkingDay: true, startTime: 9, endTime: 17 },
    2: { isWorkingDay: true, startTime: 9, endTime: 17 },
    3: { isWorkingDay: true, startTime: 9, endTime: 17 },
    4: { isWorkingDay: true, startTime: 9, endTime: 17 },
    5: { isWorkingDay: true, startTime: 9, endTime: 17 },
    6: { isWorkingDay: false, startTime: 9, endTime: 17 }
  },
  slotDuration: 30,
  isConfigured: false
};
export function HomePage() {
  const [settings, setSettings] = useLocalStorageState<Settings>('dentalSettings', DEFAULT_SETTINGS);
  const [patients, setPatients] = useLocalStorageState<Record<string, Patient>>('dentalPatients', {});
  const [appointments, setAppointments] = useLocalStorageState<Record<string, Appointment>>('dentalAppointments', {});
  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [editingContext, setEditingContext] = useState<EditingContext>({ patient: null, returnTo: null });
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{date: Date;time: string;} | null>(null);
  const patientList = useMemo(() => Object.values(patients).sort((a, b) => a.name.localeCompare(b.name)), [patients]);
  const handleSaveSettings = (newSettings: Settings) => {
    setSettings({ ...newSettings, isConfigured: true });
    setActiveView('dashboard'); // Go to dashboard after saving settings
  };
  const handleOpenAddPatientModal = () => {
    setEditingContext({ patient: null, returnTo: null });
    setIsPatientModalOpen(true);
  };
  const handleOpenEditPatient = (patient: Patient, returnTo: 'manage' | 'appointment' = 'manage') => {
    setEditingContext({ patient, returnTo });
    setIsPatientModalOpen(true);
    if (returnTo === 'appointment') setIsAppointmentModalOpen(false);
  };
  const handleClosePatientModal = () => {
    setIsPatientModalOpen(false);
    if (editingContext.returnTo === 'appointment') {
      setIsAppointmentModalOpen(true);
    }
    setEditingContext({ patient: null, returnTo: null });
  };
  const handleSavePatient = (patient: Patient) => {
    setPatients((prev) => ({ ...prev, [patient.id]: patient }));
    handleClosePatientModal();
  };
  const handleOpenDeleteConfirmation = (patientId: string) => {
    setPatientToDelete(patientId);
    setIsConfirmationDialogOpen(true);
  };
  const handleDeletePatient = () => {
    if (patientToDelete) {
      setPatients((prev) => {
        const newPatients = { ...prev };
        delete newPatients[patientToDelete];
        return newPatients;
      });
      // Instead of deleting appointments, orphan them by clearing the patientId
      setAppointments((prev) => {
        const newAppointments = { ...prev };
        Object.keys(newAppointments).forEach((key) => {
          if (newAppointments[key].patientId === patientToDelete) {
            newAppointments[key] = { ...newAppointments[key], patientId: '' };
          }
        });
        return newAppointments;
      });
    }
    setIsConfirmationDialogOpen(false);
    setPatientToDelete(null);
  };
  const handleSlotClick = (date: Date, time: string) => {
    setSelectedSlot({ date, time });
    setIsAppointmentModalOpen(true);
  };
  const handleBookAppointmentFromDashboard = () => {
      setActiveView('calendar');
      setTimeout(() => {
        const now = new Date();
        const minutes = now.getMinutes();
        const roundedMinutes = Math.ceil(minutes / settings.slotDuration) * settings.slotDuration;
        now.setMinutes(roundedMinutes, 0, 0);
        handleSlotClick(new Date(), `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
      }, 100);
  };
  const handleSaveAppointment = (appointment: Appointment) => {
    if (selectedSlot) {
      const key = getAppointmentKey(selectedSlot.date, selectedSlot.time);
      setAppointments((prev) => ({ ...prev, [key]: appointment }));
    }
    setIsAppointmentModalOpen(false);
    setSelectedSlot(null);
  };
  const handleDeleteAppointment = () => {
    if (selectedSlot) {
      const key = getAppointmentKey(selectedSlot.date, selectedSlot.time);
      setAppointments((prev) => {
        const newAppointments = { ...prev };
        delete newAppointments[key];
        return newAppointments;
      });
    }
    setIsAppointmentModalOpen(false);
    setSelectedSlot(null);
  };
  const existingAppointment = selectedSlot ? appointments[getAppointmentKey(selectedSlot.date, selectedSlot.time)] : null;
  if (!settings.isConfigured) {
    return <OnboardingWizard onComplete={handleSaveSettings} initialSettings={DEFAULT_SETTINGS} />;
  }
  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView appointments={appointments} patients={patients} onViewChange={setActiveView} onAddPatient={handleOpenAddPatientModal} onBookAppointment={handleBookAppointmentFromDashboard} />;
      case 'calendar':
        return <CalendarView settings={settings} patients={patients} appointments={appointments} onSlotClick={handleSlotClick} onOpenSettings={() => setActiveView('settings')} />;
      case 'patients':
        return <PatientsView patients={patientList} onAddPatient={handleOpenAddPatientModal} onEditPatient={handleOpenEditPatient} onDeletePatient={handleOpenDeleteConfirmation} />;
      case 'reports':
        return <ReportsView appointments={appointments} patients={patientList} />;
      case 'settings':
        return <SettingsView currentSettings={settings} onSave={handleSaveSettings} />;
      default:
        return <DashboardView appointments={appointments} patients={patients} onViewChange={setActiveView} onAddPatient={handleOpenAddPatientModal} onBookAppointment={handleBookAppointmentFromDashboard} />;
    }
  };
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <SideNavBar activeView={activeView} onViewChange={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 flex flex-col overflow-y-auto pb-16 md:pb-0">
          {renderActiveView()}
        </main>
        <div className="md:hidden">
          <BottomNavBar activeView={activeView} onViewChange={setActiveView} />
        </div>
      </div>
      {/* Modals */}
      <PatientModal isOpen={isPatientModalOpen} onClose={handleClosePatientModal} onSave={handleSavePatient} patientToEdit={editingContext.patient} />
      <ConfirmationDialog isOpen={isConfirmationDialogOpen} onClose={() => setIsConfirmationDialogOpen(false)} onConfirm={handleDeletePatient} title="Delete Patient?" description="This will permanently delete the patient's profile. Their appointments will remain on the calendar but will be marked as 'Unknown Patient'. This action cannot be undone." />
      <AppointmentModal isOpen={isAppointmentModalOpen} onClose={() => setIsAppointmentModalOpen(false)} onSave={handleSaveAppointment} onDelete={handleDeleteAppointment} patients={patientList} selectedSlot={selectedSlot} existingAppointment={existingAppointment} onEditPatient={(patient) => handleOpenEditPatient(patient, 'appointment')} />
    </div>
  );
}