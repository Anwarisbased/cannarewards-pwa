'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateUserProfile } from '@/services/authService';
import { showToast } from './CustomToast';

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// We'll pass `closeModal` and `onProfileUpdate` as props from the context
export default function EditProfileModal({ closeModal, onProfileUpdate }) {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', dateOfBirth: '', phone: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        dateOfBirth: user.date_of_birth || '',
        phone: user.phone_number || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfile(formData);
      showToast('success', 'Profile Updated', 'Your changes have been saved.');
      
      // Call the success handler passed via props
      onProfileUpdate(); 
      closeModal(); // Close the modal on success
    } catch (err) {
      showToast('error', 'Update Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="email">Email (cannot be changed)</Label>
            <Input id="email" value={user?.email || ''} disabled />
        </div>
        <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
        </div>
      </form>
      <DialogFooter>
        <Button variant="outline" onClick={closeModal}>Cancel</Button>
        <Button type="submit" form="edit-profile-form" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}