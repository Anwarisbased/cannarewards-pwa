// src/app/profile/edit/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import AnimatedPage from '../../../components/AnimatedPage';
import FloatingLabelInput from '../../../components/FloatingLabelInput'; // Import our new component
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

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
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                // TODO: Fetch and populate DOB and Phone from a custom field in the /me endpoint
                dateOfBirth: '',
                phone: ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/me/update`, formData);
            setSuccess('Profile updated successfully!');
            const currentToken = localStorage.getItem('authToken');
            if (currentToken) login(currentToken);
            setTimeout(() => router.push('/profile'), 1500);
        } catch (err) {
            setError('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || !user) return <div className="min-h-screen bg-white"></div>;
    if (!isAuthenticated) { router.push('/'); return null; }

    return (
        <AnimatedPage>
            <main className="p-4 bg-white min-h-screen flex flex-col">
                <div className="w-full max-w-md mx-auto flex-grow flex flex-col">
                    <div className="flex items-center mb-8">
                        <Link href="/profile" className="p-2 -ml-2">
                            <ChevronLeftIcon className="h-6 w-6" />
                        </Link>
                        <h1 className="text-2xl font-semibold ml-2">Edit Profile</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 flex-grow flex flex-col">
                        <div className="space-y-8">
                            <FloatingLabelInput id="firstName" label="First Name" value={formData.firstName} onChange={handleChange} />
                            <FloatingLabelInput id="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} />
                            <FloatingLabelInput id="email" label="Email" value={user.email} onChange={() => {}} type="email" />
                            <FloatingLabelInput id="dateOfBirth" label="Date of Birth" value={formData.dateOfBirth} onChange={handleChange} />
                            <FloatingLabelInput id="phone" label="Phone Number" value={formData.phone} onChange={handleChange} type="tel" />
                        </div>

                        <div className="mt-auto pt-8">
                            <button type="submit" disabled={loading || success} className="w-full py-4 px-6 bg-black text-white font-semibold rounded-lg disabled:bg-gray-400">
                                {loading ? 'Saving...' : (success ? 'Saved!' : 'Save Changes')}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </AnimatedPage>
    );
}