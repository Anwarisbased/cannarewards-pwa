'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../../../utils/axiosConfig';
import AnimatedPage from '../../../components/AnimatedPage';
import FloatingLabelInput from '../../../components/FloatingLabelInput';
import DynamicHeader from '../../../components/DynamicHeader';
import { showToast } from '../../../components/CustomToast';

export default function EditProfilePage() {
    const { user, login, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        phone: ''
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
            await api.post(
                `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/me/update`,
                formData
            );
            showToast('success', 'Profile Updated', 'Your changes have been saved successfully.');
            const currentToken = localStorage.getItem('authToken');
            if (currentToken) {
                login(currentToken);
            }
            router.push('/profile');
        } catch (err) {
            showToast('error', 'Update Failed', 'Could not save your profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || !user) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <AnimatedPage>
            {/* 
              This main container takes up the full screen and organizes content in a column.
              The NavBar is the only other fixed element on the page.
            */}
            <main className="bg-white h-screen flex flex-col">
                <div className="w-full max-w-md mx-auto flex-grow flex flex-col">

                    {/* Header: Sits at the top. Safe area padding handles the notch. */}
                    <div className="p-4 flex-shrink-0" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}>
                        <DynamicHeader title="Edit Profile" />
                    </div>

                    {/* Form: Wraps the scrollable inputs AND the fixed button */}
                    <form onSubmit={handleSubmit} className="flex-grow flex flex-col overflow-hidden">
                        
                        {/* Inputs: This div now scrolls, and has internal padding to prevent clipping. */}
                        <div className="flex-grow overflow-y-auto px-4 py-2 space-y-8">
                            <FloatingLabelInput id="firstName" name="firstName" label="First Name" value={formData.firstName} onChange={handleChange} />
                            <FloatingLabelInput id="lastName" name="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} />
                            <FloatingLabelInput id="email" label="Email" value={user.email} onChange={() => {}} type="email" disabled={true} />
                            <FloatingLabelInput id="dateOfBirth" name="dateOfBirth" label="Date of Birth" value={formData.dateOfBirth} onChange={handleChange} />
                            <FloatingLabelInput id="phone" name="phone" label="Phone Number" value={formData.phone} onChange={handleChange} type="tel" />
                        </div>
                        
                        {/* Button: Sits at the bottom of the form. Safe area padding handles the home bar. */}
                        <div className="p-4 flex-shrink-0" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
                            <button 
                                type="submit"
                                disabled={loading} 
                                className="w-full py-4 px-6 bg-black text-white font-semibold rounded-lg disabled:bg-gray-400"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>

                     {/* Spacer for the fixed NavBar at the very bottom */}
                    <div className="h-16 flex-shrink-0"></div>
                </div>
            </main>
        </AnimatedPage>
    );
}