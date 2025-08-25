'use client';

import { useEffect, Suspense, useRef } from 'react'; // Import useRef
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { validateMagicLink } from '@/services/authService';
import { showToast } from '@/components/CustomToast';

function MagicLoginProcessor() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();
    const hasProcessed = useRef(false); // Add a ref to prevent double submission

    useEffect(() => {
        // Check if we are already processing or have processed this request
        if (hasProcessed.current) {
            return;
        }

        const token = searchParams.get('token');
        
        if (token) {
            const handleValidation = async () => {
                // Set the ref to true immediately to lock this effect
                hasProcessed.current = true; 
                try {
                    // The service call will exchange our magic token for a real JWT
                    const data = await validateMagicLink(token);
                    login(data.token); // Log the user in with the new JWT
                    router.push('/'); // Redirect to the main dashboard on success
                } catch (error) {
                    showToast('error', 'Login Failed', error.message || 'The magic link is invalid or has expired.');
                    router.push('/'); // Redirect home on any failure
                }
            };
            handleValidation();
        } else {
            // If someone lands here without a token, just send them home.
            showToast('error', 'Invalid Link', 'No login token was provided.');
            router.push('/');
        }
    }, [searchParams, login, router]);

    return (
        <div className="text-center p-8">
            <h1 className="text-2xl font-bold mb-4">Validating Login Link...</h1>
            <p className="text-gray-600">Please wait a moment.</p>
        </div>
    );
}

export default function MagicLoginPage() {
    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-50">
            <Suspense fallback={<div>Loading...</div>}>
                <MagicLoginProcessor />
            </Suspense>
        </main>
    );
}