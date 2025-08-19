'use client';

import AnimatedPage from '../../components/AnimatedPage';
import DynamicHeader from '../../components/DynamicHeader';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

export default function SettingsPage() {
    return (
        <AnimatedPage>
            <main className="p-4 bg-white min-h-screen">
                <div className="w-full max-w-md mx-auto">
                    <DynamicHeader title="Settings" />
                    
                    <div className="text-center py-10 px-4 bg-gray-50 rounded-lg mt-6">
                        <div className="flex justify-center mb-4">
                            <Cog6ToothIcon className="w-16 h-16 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Coming Soon</h3>
                        <p className="text-gray-500">
                            This is where you'll be able to manage your notification preferences and other account settings.
                        </p>
                    </div>
                </div>
            </main>
        </AnimatedPage>
    );
}