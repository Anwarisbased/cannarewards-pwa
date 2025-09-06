'use client';
import { useState } from 'react';
import { PencilIcon } from '@heroicons/react/24/solid';

// --- SHADCN IMPORTS ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// --- END IMPORTS ---

// Sub-component for displaying the static address (now uses Shadcn components)
const AddressDisplay = ({ details, onEdit }) => (
    <div className="bg-secondary p-4 rounded-lg border mb-6">
        <div className="flex justify-between items-start">
            <div>
                <p className="font-semibold text-secondary-foreground">{details.firstName} {details.lastName}</p>
                <p className="text-muted-foreground">{details.address1}</p>
                <p className="text-muted-foreground">{details.city}, {details.state} {details.zip}</p>
            </div>
            <Button onClick={onEdit} variant="ghost" size="icon" className="h-8 w-8">
                <PencilIcon className="h-4 w-4" />
                <span className="sr-only">Edit Address</span>
            </Button>
        </div>
    </div>
);

// Sub-component for the editable form fields (now uses Shadcn components)
const AddressForm = ({ details, handleChange }) => (
    <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" placeholder="Jane" value={details.firstName} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" placeholder="Doe" value={details.lastName} onChange={handleChange} required />
            </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="address1">Address Line 1</Label>
            <Input id="address1" name="address1" placeholder="123 Main St" value={details.address1} onChange={handleChange} required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" placeholder="Anytown" value={details.city} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" placeholder="CA" value={details.state} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input id="zip" name="zip" placeholder="12345" value={details.zip} onChange={handleChange} required />
            </div>
        </div>
    </div>
);


export default function ShippingFormModal({ onSubmit, onCancel, currentUser }) {
    // --- START FIX: Correctly access the shipping data from the user object ---
    const [details, setDetails] = useState({
        firstName: currentUser?.shipping?.shipping_first_name || currentUser?.firstName || '',
        lastName: currentUser?.shipping?.shipping_last_name || currentUser?.lastName || '',
        address1: currentUser?.shipping?.shipping_address_1 || '',
        city: currentUser?.shipping?.shipping_city || '',
        state: currentUser?.shipping?.shipping_state || '',
        zip: currentUser?.shipping?.shipping_postcode || ''
    });
    // --- END FIX ---

    const isAddressComplete = details.address1 && details.city && details.state && details.zip;
    const [isEditing, setIsEditing] = useState(!isAddressComplete);

    const handleChange = (e) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(details);
    };
    
    return (
        <Dialog open={true} onOpenChange={(isOpen) => !isOpen && onCancel()}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        {isEditing ? 'Update Shipping Details' : 'Confirm Shipping Details'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing 
                            ? 'Please provide your address to ship this reward.' 
                            : 'Your reward will be shipped to the address below.'}
                    </DialogDescription>
                </DialogHeader>

                <form id="shipping-form" onSubmit={handleSubmit}>
                    {isEditing ? (
                        <AddressForm details={details} handleChange={handleChange} />
                    ) : (
                        <AddressDisplay details={details} onEdit={() => setIsEditing(true)} />
                    )}
                </form>
                
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                    <Button type="submit" form="shipping-form">
                        {isEditing ? 'Save & Redeem' : 'Confirm & Redeem'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}