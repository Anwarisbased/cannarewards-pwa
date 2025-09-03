'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getProfileData, updateProfileData } from '@/services/profileService';
import { showToast } from './CustomToast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from './ui/skeleton';

// A small helper component to render the correct input based on field type
const DynamicField = ({ field, value, handleChange }) => {
  if (field.type === 'dropdown') {
    return (
      <select
        id={field.key}
        name={field.key}
        value={value || ''}
        onChange={handleChange}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
      >
        <option value="">-- Select an option --</option>
        {field.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === 'date') {
    return (
      <Input
        id={field.key}
        name={field.key}
        type="date"
        value={value || ''}
        onChange={handleChange}
      />
    );
  }

  // Default to text input
  return (
    <Input
      id={field.key}
      name={field.key}
      type="text"
      value={value || ''}
      onChange={handleChange}
    />
  );
};

export default function EditProfileModal({ closeModal }) {
  const { user, login } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await getProfileData();
        setProfileData(data);
        // Initialize form data with existing values
        setFormData({
          firstName: user?.firstName || '',
          lastName: data.lastName || '',
          phone_number: data.phone_number || '',
          custom_fields: data.custom_fields.values || {},
        });
      } catch (error) {
        showToast('error', 'Error', 'Could not load your profile to edit.');
        closeModal();
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, closeModal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Check if it's a custom field or a core field
    const isCustom = profileData?.custom_fields?.definitions.some(
      (def) => def.key === name
    );

    if (isCustom) {
      setFormData((prev) => ({
        ...prev,
        custom_fields: {
          ...prev.custom_fields,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfileData(formData);
      showToast('success', 'Profile Updated', 'Your changes have been saved.');

      // Refresh the main user session data to reflect any changes like name
      login(localStorage.getItem('authToken'), true);
      closeModal();
    } catch (err) {
      showToast('error', 'Update Failed', err.message);
    } finally {
      setSaving(false);
    }
  };

  const renderFormContent = () => {
    if (loading || !profileData) {
      return (
        <div className="space-y-4 py-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      );
    }

    const { definitions } = profileData.custom_fields;
    const editProfileFields = definitions.filter((field) =>
      field.display.includes('edit_profile')
    );

    return (
      <form
        id="edit-profile-form"
        onSubmit={handleSubmit}
        className="space-y-4 py-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone_number">Phone Number</Label>
          <Input
            id="phone_number"
            name="phone_number"
            type="tel"
            value={formData.phone_number}
            onChange={handleChange}
          />
        </div>

        {/* Dynamically render custom fields */}
        {editProfileFields.map((field) => (
          <div className="space-y-2" key={field.key}>
            <Label htmlFor={field.key}>{field.label}</Label>
            <DynamicField
              field={field}
              value={formData.custom_fields[field.key]}
              handleChange={handleChange}
            />
          </div>
        ))}
      </form>
    );
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      {renderFormContent()}
      <DialogFooter>
        <Button variant="outline" onClick={closeModal} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" form="edit-profile-form" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
