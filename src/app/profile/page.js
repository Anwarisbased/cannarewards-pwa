'use client';

import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AnimatedPage from '../../components/AnimatedPage';
import MenuItem from '../../components/MenuItem';

export default function ProfilePage() {
    const { user, logout, isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, loading, router]);

    if (loading || !isAuthenticated) {
        return <div className="flex items-center justify-center min-h-screen">Loading Profile...</div>;
    }

    // Get the user's first initial, defaulting to 'U' for User if no name is set.
    const userInitial = user.firstName ? user.firstName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U');

    return (
        <AnimatedPage>
            <main className="p-4 bg-white min-h-screen">
                <div className="w-full max-w-md mx-auto">
                    {/* --- 1. NEW PROFILE HEADER --- */}
                    <div className="flex flex-col items-center p-4 mb-6 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-4xl font-bold text-gray-700 mb-4 border">
                            {userInitial}
                        </div>
                        <h1 className="text-2xl font-bold capitalize text-gray-900">{user.firstName || 'User'} {user.lastName || ''}</h1>
                        <p className="text-base text-gray-500">{user.email}</p>
                    </div>
                    {/* --- END OF NEW HEADER --- */}


                    {/* Menu List */}
                    <div className="rounded-lg shadow-sm overflow-hidden mb-4 border border-gray-200">
                        <MenuItem href="/profile/edit" label="Edit Profile" />
                        <MenuItem href="/history" label="Point History" />
                        <MenuItem href="/orders" label="My Orders" />
                    </div>

                    <div className="rounded-lg shadow-sm overflow-hidden mb-4 border border-gray-200">
                        <MenuItem href="/terms" label="Terms and Conditions" />
                        <MenuItem href="/support" label="Support" />
                    </div>
                    
                    <div className="rounded-lg shadow-sm overflow-hidden mt-6 border border-gray-200">
                         <button 
                            onClick={logout} 
                            className="bg-white p-4 w-full flex justify-between items-center text-left hover:bg-gray-50"
                        >
                            <span className="text-red-500 font-medium">Log Out</span>
                            <span className="text-red-400">{'>'}</span>
                        </button>
                    </div>
                </div>
            </main>
        </AnimatedPage>
    );
}