'use client';

import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext'; 
import { useRouter } from 'next/navigation';
import MenuItem from '../../components/MenuItem';
import { motion } from 'framer-motion';
import AnimatedPage from '../../components/AnimatedPage';

export default function ProfilePage() {
    const { user, logout, isAuthenticated, loading } = useAuth();
    const { openEditProfileModal, openContentModal } = useModal(); 
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, loading, router]);

    if (loading || !isAuthenticated) {
        return (
            <div className="p-4 bg-white min-h-screen animate-pulse">
                <div className="w-full max-w-md mx-auto">
                    <div className="flex flex-col items-center p-4 mb-6 text-center">
                        <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
                        <div className="h-8 bg-gray-300 rounded-md w-1/2 mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
                    </div>
                    <div className="rounded-lg h-36 bg-gray-200 mb-4"></div>
                    <div className="rounded-lg h-24 bg-gray-200 mb-6"></div>
                    <div className="rounded-lg h-14 bg-gray-200"></div>
                </div>
            </div>
        );
    }

    const userInitial = user.firstName ? user.firstName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U');

    return (
        <AnimatedPage>
            {/* --- MODIFIED: Changed <main> to <div> --- */}
            <div 
              className="p-4 bg-white min-h-screen"
              style={{
                paddingTop: `env(safe-area-inset-top)`,
                paddingBottom: `calc(5rem + env(safe-area-inset-bottom))` 
              }}
            >
              <div className="w-full max-w-md mx-auto">
                    <motion.div 
                        className="flex flex-col items-center p-4 mb-6 text-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-4xl font-bold text-gray-700 mb-4 border">
                            {userInitial}
                        </div>
                        <h1 className="text-2xl font-bold capitalize text-gray-900">{user.firstName || 'User'} {user.lastName || ''}</h1>
                        <p className="text-base text-gray-500">{user.email}</p>
                    </motion.div>
                    
                    <div className="rounded-lg shadow-sm overflow-hidden mb-4 border border-gray-200">
                        <MenuItem onClick={openEditProfileModal} label="Edit Profile" />
                        <MenuItem href="/history" label="Point History" />
                        <MenuItem href="/orders" label="My Orders" />
                    </div>

                    <div className="rounded-lg shadow-sm overflow-hidden mb-4 border border-gray-200">
                        <MenuItem href="/settings" label="Settings" />
                        <MenuItem onClick={() => openContentModal('terms-and-conditions')} label="Terms and Conditions" />
                        <MenuItem onClick={() => openContentModal('support')} label="Support" />
                    </div>
                    
                    <div className="rounded-lg shadow-sm overflow-hidden mt-6 border border-gray-200">
                         <button 
                            onClick={logout} 
                            className="bg-white p-4 w-full flex justify-between items-center text-left hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                        >
                            <span className="text-red-500 font-medium">Log Out</span>
                            <span className="text-red-400">{'>'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
}