import React, { useState, useEffect } from 'react';
import { Appointment, Patient, PROCEDURES } from '@/types/denta-plan';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Appointment) => void;
  onDelete: () => void;
  patients: Patient[];
  selectedSlot: { date: Date; time: string } | null;
  existingAppointment: Appointment | null;
  onEditPatient?: (patient: Patient) => void;
}
const emptyAppointment: Omit<Appointment, 'id'> = {
  patientId: '',
  procedure: '',
  customProcedureName: '',
  notes: '',
};
export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  patients,
  selectedSlot,
  existingAppointment,
  onEditPatient,
}) => {
  const [formData, setFormData] = useState(emptyAppointment);
  useEffect(() => {
    if (isOpen) {
      setFormData(existingAppointment || emptyAppointment);
    }
  }, [existingAppointment, isOpen]);
  const handleSave = () => {
    if (!formData.patientId || (!formData.procedure && !formData.customProcedureName)) return;
    const finalProcedure = formData.procedure === 'Custom' && formData.customProcedureName
      ? 'Custom'
      : formData.procedure;
    const appointmentData: Appointment = {
      ...formData,
      id: existingAppointment?.id || crypto.randomUUID(),
      procedure: finalProcedure,
    };
    onSave(appointmentData);
  };
  const handleDelete = () => {
    if (existingAppointment) {
      onDelete();
    }
  };
  const handleEditPatientClick = () => {
    const patient = patients.find(p => p.id === formData.patientId);
    if (patient && onEditPatient) {
      onEditPatient(patient);
    }
  };
  const isFormValid = !!(formData.patientId && formData.procedure && (formData.procedure !== 'Custom' || (formData.procedure === 'Custom' && formData.customProcedureName)));
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{existingAppointment ? 'Edit Appointment' : 'Book Appointment'}</DialogTitle>
          <DialogDescription>
            {selectedSlot && `Booking for ${format(selectedSlot.date, 'MMMM d, yyyy')} at ${selectedSlot.time}`}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="patientId">Patient</Label>
              {formData.patientId && onEditPatient && (
                <Button variant="link" size="sm" className="h-auto p-0" onClick={handleEditPatientClick}>
                  View/Edit Profile
                </Button>
              )}
            </div>
            <Select
              value={formData.patientId}
              onValueChange={(value) => setFormData({ ...formData, patientId: value })}
            >
              <SelectTrigger id="patientId"><SelectValue placeholder="Select a patient" /></SelectTrigger>
              <SelectContent>
                {patients.map(p => <SelectItem key={p.id} value={p.id}>{p.name} ({p.phone})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="procedure">Procedure</Label>
            <Select
              value={formData.procedure}
              onValueChange={(value) => setFormData({ ...formData, procedure: value })}
            >
              <SelectTrigger id="procedure"><SelectValue placeholder="Select a procedure" /></SelectTrigger>
              <SelectContent>
                {PROCEDURES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                <SelectItem value="Custom">Custom Procedure</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {formData.procedure === 'Custom' && (
            <div className="space-y-2">
              <Label htmlFor="customProcedureName">Custom Procedure Name</Label>
              <Input
                id="customProcedureName"
                value={formData.customProcedureName}
                onChange={(e) => setFormData({ ...formData, customProcedureName: e.target.value })}
                placeholder="e.g., Emergency Checkup"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Optional notes about the appointment..."
            />
          </div>
        </div>
        <DialogFooter className="justify-between">
          <div>
            {existingAppointment && (
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} disabled={!isFormValid}>
              {existingAppointment ? 'Save Changes' : 'Book Appointment'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};