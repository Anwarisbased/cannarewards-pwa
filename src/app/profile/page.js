'use client';

import { useEffect } from 'react'; // 1. Import useEffect
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AnimatedPage from '../../components/AnimatedPage';
import MenuItem from '../../components/MenuItem';

export default function ProfilePage() {
    const { user, logout, isAuthenticated, loading } = useAuth();
    const router = useRouter();

    // --- THIS IS THE FIX ---
    // This effect runs after the component renders and whenever auth state changes.
    useEffect(() => {
        // We wait until the initial loading is complete...
        if (!loading && !isAuthenticated) {
            // ...and IF the user is not authenticated, THEN we redirect.
            router.push('/');
        }
    }, [isAuthenticated, loading, router]); // Dependency array

    // While loading or before the redirect happens, show a loading state.
    if (loading || !isAuthenticated) {
        return <div className="flex items-center justify-center min-h-screen">Loading Profile...</div>;
    }

    // If we get past the loading check, the user is authenticated, so we render the profile.
    return (
        <AnimatedPage>
            <main className="p-4 bg-gray-100 min-h-screen">
                <div className="w-full max-w-md mx-auto">
                    {/* Header with Profile Info */}
                    <div className="flex items-center p-4 mb-6">
                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-2xl font-bold mr-4">
                            {user.firstName ? user.firstName.charAt(0) : user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold capitalize">{user.firstName || 'User'} {user.lastName || ''}</h1>
                            <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                    </div>

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