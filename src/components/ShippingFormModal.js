'use client';
import { useState } from 'react';

export default function ShippingFormModal({ onSubmit, onCancel }) {
    const [details, setDetails] = useState({
        firstName: '',
        lastName: '',
        address1: '',
        city: '',
        state: '',
        zip: ''
    });

    const handleChange = (e) => {
        // This function updates the state as the user types
        setDetails({ ...details, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Pass the completed form details up to the parent component (CatalogPage)
        onSubmit(details);
    };

    return (
        // This creates the grayed-out background overlay
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            {/* This is the white modal box */}
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-2">Enter Shipping Details</h2>
                <p className="text-sm text-gray-600 mb-6">We need your address to ship this physical reward. This will be saved for future redemptions.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:space-x-4">
                        <input name="firstName" placeholder="First Name" onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded mb-4 sm:mb-0" />
                        <input name="lastName" placeholder="Last Name" onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
                    </div>
                    
                    <input name="address1" placeholder="Address Line 1" onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
                    
                    <div className="flex flex-col sm:flex-row sm:space-x-4">
                        <input name="city" placeholder="City" onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded mb-4 sm:mb-0" />
                        <input name="state" placeholder="State / Province" onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded mb-4 sm:mb-0" />
                        <input name="zip" placeholder="ZIP / Postal Code" onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onCancel} className="py-2 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg">
                            Cancel
                        </button>
                        <button type="submit" className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
                            Save & Redeem
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}