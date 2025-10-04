import React, { useState } from 'react';
import { Settings, DaySetting } from '@/types/denta-plan';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
interface OnboardingWizardProps {
  onComplete: (settings: Settings) => void;
  initialSettings: Omit<Settings, 'isConfigured'>;
}
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const timeOptions = Array.from({ length: 25 }, (_, i) => i);
const durationOptions = [15, 20, 30, 45, 60];
export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete, initialSettings }) => {
  const [settings, setSettings] = useState(initialSettings);
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
  const handleComplete = () => {
    onComplete({ ...settings, isConfigured: true });
  };
  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-3xl shadow-xl animate-scale-in">
        <CardHeader className="text-center">
          <div className="mx-auto bg-blue-100 p-3 rounded-full w-fit mb-4">
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-3xl font-bold">Welcome to DentaPlan!</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Let's get your clinic's schedule set up in just a minute.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8 py-8 px-8">
          <div className="space-y-3">
            <Label className="text-base font-semibold">1. Set Your Weekly Hours</Label>
            <div className="space-y-3 pt-2">
              {daysOfWeek.map((day, index) => (
                <div key={day} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={`onboard-day-${index}`}
                      checked={settings.workingHours[index].isWorkingDay}
                      onCheckedChange={(checked) => handleDaySettingChange(index, 'isWorkingDay', !!checked)}
                    />
                    <label htmlFor={`onboard-day-${index}`} className="font-medium">{day}</label>
                  </div>
                  <Select
                    disabled={!settings.workingHours[index].isWorkingDay}
                    value={String(settings.workingHours[index].startTime)}
                    onValueChange={(value) => handleDaySettingChange(index, 'startTime', Number(value))}
                  >
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {timeOptions.slice(0, 24).map(hour => <SelectItem key={hour} value={String(hour)}>{`${String(hour).padStart(2, '0')}:00`}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <span className="text-muted-foreground">to</span>
                  <Select
                    disabled={!settings.workingHours[index].isWorkingDay}
                    value={String(settings.workingHours[index].endTime)}
                    onValueChange={(value) => handleDaySettingChange(index, 'endTime', Number(value))}
                  >
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {timeOptions.slice(1, 25).map(hour => <SelectItem key={hour} value={String(hour)}>{`${String(hour).padStart(2, '0')}:00`}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Label htmlFor="slot-duration" className="text-base font-semibold">2. Define Appointment Slot Duration</Label>
            <Select value={String(settings.slotDuration)} onValueChange={(value) => setSettings({ ...settings, slotDuration: Number(value) })}>
              <SelectTrigger id="slot-duration"><SelectValue /></SelectTrigger>
              <SelectContent>
                {durationOptions.map(duration => <SelectItem key={duration} value={String(duration)}>{`${duration} minutes`}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleComplete} size="lg" className="w-full text-base">
            Save & View Calendar
          </Button>
        </CardFooter>
      </Card>
      <footer className="text-center py-6 text-sm text-muted-foreground mt-4">
        Built with ❤️ at Cloudflare
      </footer>
    </div>
  );
};