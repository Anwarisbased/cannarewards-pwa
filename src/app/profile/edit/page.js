'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import AnimatedPage from '../../../components/AnimatedPage';
import FloatingLabelInput from '../../../components/FloatingLabelInput';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast'; // 1. Import toast

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
    // We no longer need the success/error state for this component
    // const [success, setSuccess] = useState('');
    // const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                dateOfBirth: user.date_of_birth || '', // Assuming we add this to the /me endpoint later
                phone: user.phone_number || '' // Assuming we add this to the /me endpoint later
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
            await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/me/update`, 
              formData,
              { headers: { 'Content-Type': 'application/json' } } // Good practice to include header
            );
            
            // 2. Show a success toast
            toast.success('Profile updated successfully!');
            
            // Refresh the user data in our global state
            const currentToken = localStorage.getItem('authToken');
            if (currentToken) {
                login(currentToken);
            }

            // Redirect back to the profile page after a short delay
            setTimeout(() => {
                router.push('/profile');
            }, 1500);

        } catch (err) {
            // 3. Show an error toast
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
                    <header className="flex items-center mb-8">
                        <Link href="/profile" className="p-2 -ml-2">
                            <ChevronLeftIcon className="h-6 w-6" />
                        </Link>
                        <h1 className="text-2xl font-semibold ml-2">Edit Profile</h1>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-8 flex-grow flex flex-col">
                        <div className="space-y-8">
                            <FloatingLabelInput id="firstName" label="First Name" value={formData.firstName} onChange={handleChange} />
                            <FloatingLabelInput id="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} />
                            <FloatingLabelInput id="email" label="Email" value={user.email} onChange={() => {}} type="email" />
                            <FloatingLabelInput id="dateOfBirth" label="Date of Birth" value={formData.dateOfBirth} onChange={handleChange} />
                            <FloatingLabelInput id="phone" label="Phone Number" value={formData.phone} onChange={handleChange} type="tel" />
                        </div>
                        <div className="mt-auto pt-8">
                            <button type="submit" disabled={loading} className="w-full py-4 px-6 bg-black text-white font-semibold rounded-lg disabled:bg-gray-400">
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </AnimatedPage>
    );
}