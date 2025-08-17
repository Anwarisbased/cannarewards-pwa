// src/app/profile/page.js
'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import AnimatedPage from '../../components/AnimatedPage';
import MenuItem from '../../components/MenuItem'; // Import our new component

export default function ProfilePage() {
    const { logout, isAuthenticated, loading } = useAuth();
    const router = useRouter();

    if (loading) {
        return <div>Loading...</div>; // Or a skeleton loader
    }

    if (!isAuthenticated) {
        router.push('/');
        return null;
    }

    return (
        <AnimatedPage>
            <main className="p-4 bg-gray-100 min-h-screen">
                <div className="w-full max-w-md mx-auto">

                    {/* Menu Group 1 */}
                    <div className="rounded-lg shadow-sm overflow-hidden mb-4 border border-gray-200">
                        <MenuItem href="/profile/edit" label="Edit Profile" />
                        <MenuItem href="#" label="Merge Account" />
                    </div>

                    {/* Menu Group 2 */}
                    <div className="rounded-lg shadow-sm overflow-hidden mb-4 border border-gray-200">
                        <MenuItem href="/history" label="Point History" />
                        <MenuItem href="/orders" label="My Orders" />
                    </div>

                    {/* Menu Group 3 */}
                    <div className="rounded-lg shadow-sm overflow-hidden mb-4 border border-gray-200">
                        <MenuItem href="/terms" label="Terms and Conditions" />
                        <MenuItem href="/support" label="Support" />
                        <MenuItem href="#" label="Settings" />
                    </div>
                    
                    {/* Log Out Button - styled similarly but is a button */}
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