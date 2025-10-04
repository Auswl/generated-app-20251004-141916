import React, { useState } from 'react';
import { Settings, DaySetting } from '@/types/denta-plan';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Settings as SettingsIcon } from 'lucide-react';
interface SettingsViewProps {
  currentSettings: Settings;
  onSave: (settings: Settings) => void;
}
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const timeOptions = Array.from({ length: 25 }, (_, i) => i);
const durationOptions = [15, 20, 30, 45, 60];
export const SettingsView: React.FC<SettingsViewProps> = ({ currentSettings, onSave }) => {
  const [settings, setSettings] = useState<Settings>(currentSettings);
  const handleDaySettingChange = (dayIndex: number, field: keyof DaySetting, value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [dayIndex]: {
          ...prev.workingHours[dayIndex],
          [field]: value,
        },
      },
    }));
  };
  const handleSave = () => {
    onSave(settings);
    // Optionally show a toast notification for feedback
  };
  return (
    <ScrollArea className="h-full bg-gray-50/50">
      <div className="p-4 md:p-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <SettingsIcon className="w-8 h-8" />
            Settings
          </h1>
          <p className="text-muted-foreground">Manage your clinic's schedule and preferences.</p>
        </header>
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Weekly Hours</CardTitle>
            <CardDescription>
              Define the working days and hours for your clinic.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {daysOfWeek.map((day, index) => (
              <div key={day} className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_auto_auto] items-center gap-2 md:gap-4 p-3 border rounded-lg">
                <div className="flex items-center space-x-3 col-span-2 md:col-span-1">
                  <Checkbox
                    id={`day-${index}`}
                    checked={settings.workingHours[index].isWorkingDay}
                    onCheckedChange={(checked) => handleDaySettingChange(index, 'isWorkingDay', !!checked)}
                  />
                  <label htmlFor={`day-${index}`} className="font-medium text-sm md:text-base">{day}</label>
                </div>
                <div className="col-span-2 md:col-span-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                  <Select
                    disabled={!settings.workingHours[index].isWorkingDay}
                    value={String(settings.workingHours[index].startTime)}
                    onValueChange={(value) => handleDaySettingChange(index, 'startTime', Number(value))}
                  >
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {timeOptions.slice(0, 24).map(hour => <SelectItem key={hour} value={String(hour)}>{`${String(hour).padStart(2, '0')}:00`}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <span className="text-muted-foreground text-sm text-center">to</span>
                  <Select
                    disabled={!settings.workingHours[index].isWorkingDay}
                    value={String(settings.workingHours[index].endTime)}
                    onValueChange={(value) => handleDaySettingChange(index, 'endTime', Number(value))}
                  >
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {timeOptions.slice(1, 25).map(hour => <SelectItem key={hour} value={String(hour)}>{`${String(hour).padStart(2, '0')}:00`}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="w-full max-w-4xl mx-auto mt-6">
          <CardHeader>
            <CardTitle>Appointment Slot Duration</CardTitle>
            <CardDescription>
              Set the default length for each appointment slot in the calendar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={String(settings.slotDuration)} onValueChange={(value) => setSettings({ ...settings, slotDuration: Number(value) })}>
              <SelectTrigger id="slot-duration"><SelectValue /></SelectTrigger>
              <SelectContent>
                {durationOptions.map(duration => <SelectItem key={duration} value={String(duration)}>{`${duration} minutes`}</SelectItem>)}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <div className="max-w-4xl mx-auto mt-6">
          <Button onClick={handleSave} size="lg">
            Save Changes
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};