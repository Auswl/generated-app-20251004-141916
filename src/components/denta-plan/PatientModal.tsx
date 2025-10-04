import React, { useState, useEffect } from 'react';
import { Patient } from '@/types/denta-plan';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: Patient) => void;
  patientToEdit: Patient | null;
}
const emptyPatient: Omit<Patient, 'id'> = {
  name: '',
  phone: '',
  email: '',
  dateOfBirth: '',
  address: '',
  medicalHistory: '',
};
export const PatientModal: React.FC<PatientModalProps> = ({ isOpen, onClose, onSave, patientToEdit }) => {
  const [formData, setFormData] = useState<Omit<Patient, 'id'>>(emptyPatient);
  useEffect(() => {
    if (isOpen) {
      setFormData(patientToEdit || emptyPatient);
    }
  }, [patientToEdit, isOpen]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleSave = () => {
    if (!formData.name.trim()) {
      // Basic validation
      return;
    }
    const patientData: Patient = {
      ...formData,
      id: patientToEdit?.id || crypto.randomUUID(),
    };
    onSave(patientData);
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{patientToEdit ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
          <DialogDescription>
            {patientToEdit ? 'Update the details for this patient.' : 'Enter the details for the new patient.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Full Name
            </Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dateOfBirth" className="text-right">
              Date of Birth
            </Label>
            <Input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Input id="address" name="address" value={formData.address} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="medicalHistory" className="text-right pt-2">
              Medical History
            </Label>
            <Textarea id="medicalHistory" name="medicalHistory" value={formData.medicalHistory} onChange={handleChange} className="col-span-3" rows={4} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!formData.name.trim()}>Save Patient</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};