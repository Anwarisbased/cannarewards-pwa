'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../../../utils/axiosConfig'; // Use our new axios instance
import AnimatedPage from '../../../components/AnimatedPage';
import FloatingLabelInput from '../../../components/FloatingLabelInput';
import DynamicHeader from '../../../components/DynamicHeader';
import toast from 'react-hot-toast';

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
            
            toast.success('Profile updated successfully!');
            
            const currentToken = localStorage.getItem('authToken');
            if (currentToken) {
                login(currentToken);
            }

            router.push('/profile');

        } catch (err) {
            toast.error('Failed to update profile. Please try again.');
            console.error("Profile update failed:", err);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || !user) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <AnimatedPage>
            <main className="p-4 bg-white min-h-screen flex flex-col">
                <div className="w-full max-w-md mx-auto flex-grow flex flex-col">
                    <DynamicHeader title="Edit Profile" />

                    <form onSubmit={handleSubmit} className="space-y-8 flex-grow flex flex-col">
                        <div className="space-y-8">
                            <FloatingLabelInput id="firstName" label="First Name" value={formData.firstName} onChange={handleChange} />
                            <FloatingLabelInput id="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} />
                            <FloatingLabelInput id="email" label="Email" value={user.email} onChange={() => {}} type="email" disabled={true} />
                            <FloatingLabelInput id="dateOfBirth" label="Date of Birth" value={formData.dateOfBirth} onChange={handleChange} />
                            <FloatingLabelInput id="phone" label="Phone Number" value={formData.phone} onChange={handleChange} type="tel" />
                        </div>
                        
                        <div className="mt-auto pt-8">
                            <button 
                                type="submit" 
                                disabled={loading} 
                                className="w-full py-4 px-6 bg-black text-white font-semibold rounded-lg disabled:bg-gray-400 transform hover:scale-105 transition-transform"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </AnimatedPage>
    );
}