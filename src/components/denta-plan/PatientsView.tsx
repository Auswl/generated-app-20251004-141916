import React, { useState, useMemo } from 'react';
import { Patient } from '@/types/denta-plan';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Search, Edit, Trash2, User } from 'lucide-react';
interface PatientsViewProps {
  patients: Patient[];
  onAddPatient: () => void;
  onEditPatient: (patient: Patient) => void;
  onDeletePatient: (patientId: string) => void;
}
export const PatientsView: React.FC<PatientsViewProps> = ({ patients, onAddPatient, onEditPatient, onDeletePatient }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredPatients = useMemo(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    if (!lowerCaseQuery) return patients;
    return patients.filter(p => p.name.toLowerCase().includes(lowerCaseQuery));
  }, [patients, searchQuery]);
  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      <header className="p-4 md:p-6 border-b bg-background">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Patient Management</h1>
          <Button onClick={onAddPatient}>
            <Plus className="mr-2 h-4 w-4" /> Add Patient
          </Button>
        </div>
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search patients by name..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          {filteredPatients.length > 0 ? (
            <div className="grid gap-4">
              {filteredPatients.map(patient => (
                <Card key={patient.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">{patient.phone}</p>
                      <p className="text-sm text-muted-foreground">{patient.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onEditPatient(patient)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => onDeletePatient(patient.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <User className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No Patients Found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery ? 'Try a different search term.' : 'Click "Add Patient" to get started.'}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};