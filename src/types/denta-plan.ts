import { LayoutDashboard, Calendar, Users, BarChart, Settings as SettingsIcon } from 'lucide-react';
export type ViewMode = 'daily' | 'weekly' | 'monthly' | 'minimal';
export type AppView = 'dashboard' | 'calendar' | 'patients' | 'reports' | 'settings';
export const NAV_ITEMS = [
  { view: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { view: 'calendar', icon: Calendar, label: 'Calendar' },
  { view: 'patients', icon: Users, label: 'Patients' },
  { view: 'reports', icon: BarChart, label: 'Reports' },
  { view: 'settings', icon: SettingsIcon, label: 'Settings' },
] as const;
export interface DaySetting {
  isWorkingDay: boolean;
  startTime: number; // Hour of the day (0-23)
  endTime: number; // Hour of the day (1-24)
}
export interface Settings {
  workingHours: Record<number, DaySetting>; // 0 for Sunday, 1 for Monday, etc.
  slotDuration: number; // in minutes
  isConfigured: boolean; // Flag to check if initial setup is done
}
export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  address: string;
  medicalHistory: string;
}
export interface Appointment {
  id: string;
  patientId: string;
  procedure: string; // Can be a preset procedure or "Custom"
  customProcedureName?: string; // Only used if procedure is "Custom"
  notes: string;
}
export const PROCEDURE_COLORS: Record<string, string> = {
  "Filling": "bg-blue-100 border-blue-300 text-blue-800",
  "Cleaning": "bg-green-100 border-green-300 text-green-800",
  "Extraction": "bg-red-100 border-red-300 text-red-800",
  "Consultation": "bg-purple-100 border-purple-300 text-purple-800",
  "Root Canal": "bg-orange-100 border-orange-300 text-orange-800",
  "Crown": "bg-yellow-100 border-yellow-300 text-yellow-800",
  "Whitening": "bg-pink-100 border-pink-300 text-pink-800",
  "Braces": "bg-indigo-100 border-indigo-300 text-indigo-800",
  "Custom": "bg-gray-100 border-gray-300 text-gray-800",
};
export const PROCEDURES = Object.keys(PROCEDURE_COLORS).filter(p => p !== 'Custom');