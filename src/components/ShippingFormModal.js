'use client';
import { useState } from 'react';
import { PencilIcon } from '@heroicons/react/24/solid';

// A new sub-component for displaying the static address
const AddressDisplay = ({ details, onEdit }) => (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex justify-between items-start">
            <div>
                <p className="font-semibold text-gray-800">{details.firstName} {details.lastName}</p>
                <p className="text-gray-600">{details.address1}</p>
                <p className="text-gray-600">{details.city}, {details.state} {details.zip}</p>
            </div>
            <button onClick={onEdit} className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full">
                <PencilIcon className="h-5 w-5" />
                <span className="sr-only">Edit Address</span>
            </button>
        </div>
    </div>
);

// A new sub-component for the editable form fields
const AddressForm = ({ details, handleChange }) => (
    <div className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:space-x-4">
            <input name="firstName" placeholder="First Name" value={details.firstName} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded mb-4 sm:mb-0" />
            <input name="lastName" placeholder="Last Name" value={details.lastName} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
        </div>
        <input name="address1" placeholder="Address Line 1" value={details.address1} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
        <div className="flex flex-col sm:flex-row sm:space-x-4">
            <input name="city" placeholder="City" value={details.city} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded mb-4 sm:mb-0" />
            <input name="state" placeholder="State / Province" value={details.state} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded mb-4 sm:mb-0" />
            <input name="zip" placeholder="ZIP / Postal Code" value={details.zip} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
        </div>
    </div>
);


export default function ShippingFormModal({ onSubmit, onCancel, currentUser }) {
    const [details, setDetails] = useState({
        firstName: currentUser?.shipping?.shipping_first_name || currentUser?.firstName || '',
        lastName: currentUser?.shipping?.shipping_last_name || currentUser?.lastName || '',
        address1: currentUser?.shipping?.shipping_address_1 || '',
        city: currentUser?.shipping?.shipping_city || '',
        state: currentUser?.shipping?.shipping_state || '',
        zip: currentUser?.shipping?.shipping_postcode || ''
    });

    // --- NEW STATE TO TOGGLE BETWEEN VIEWS ---
    // Start in 'edit' mode only if the address is incomplete.
    const isAddressComplete = details.address1 && details.city && details.state && details.zip;
    const [isEditing, setIsEditing] = useState(!isAddressComplete);

    const handleChange = (e) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // If they were editing, switch back to display view before submitting.
        if (isEditing) {
            setIsEditing(false); 
        }
        onSubmit(details);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-2">
                    {isEditing ? 'Update Shipping Details' : 'Confirm Shipping Details'}
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                    {isEditing 
                        ? 'Please provide your address to ship this reward.' 
                        : 'Your reward will be shipped to the address below.'}
                </p>

                {/* --- CONDITIONAL RENDERING BASED ON `isEditing` STATE --- */}
                {isEditing ? (
                    <AddressForm details={details} handleChange={handleChange} />
                ) : (
                    <AddressDisplay details={details} onEdit={() => setIsEditing(true)} />
                )}
                
                <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={onCancel} className="py-2 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg">
                        Cancel
                    </button>
                    <button type="submit" className="py-2 px-6 bg-primary hover:opacity-90 text-white font-semibold rounded-lg">
                        {/* The button text changes based on the view */}
                        {isEditing ? 'Save & Redeem' : 'Confirm & Redeem'}
                    </button>
                </div>
            </form>
        </div>
    );
}