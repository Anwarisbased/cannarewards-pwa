'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

function ClaimProcessor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth(); // We just need the login function to refresh data

  const [status, setStatus] = useState('processing'); // 'processing', 'success', or 'error'
  const [message, setMessage] = useState('Claiming your points...');

  // This effect runs once when the component loads
  useEffect(() => {
    const code = searchParams.get('code');

    if (!code) {
      setStatus('error');
      setMessage('No code provided in the URL.');
      return; // Stop execution if no code
    }

    // Define the async function to call our API
    const claimCode = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/claim`,
          { code: code } // Pass the code in the body
        );
        
        setStatus('success');
        setMessage(response.data.message);
        
        // Refresh the user's data in our global state
        const currentToken = localStorage.getItem('authToken');
        if (currentToken) {
            login(currentToken);
        }

      } catch (err) {
        setStatus('error');
        // Use the specific error message from our API if it exists
        setMessage(err.response?.data?.message || 'An unknown error occurred during claim.');
      }
    };

    claimCode();
  }, []); // The empty array ensures this effect runs only once

  return (
    <div className="text-center p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">
        {status === 'processing' && 'Processing...'}
        {status === 'success' && 'Success!'}
        {status === 'error' && 'Error'}
      </h1>

      {/* Display the dynamic message */}
      <p className={`text-lg ${status === 'success' ? 'text-green-600' : ''} ${status === 'error' ? 'text-red-600' : ''}`}>
        {message}
      </p>
      
      <button 
        onClick={() => router.push('/')}
        className="mt-8 py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
      >
        Go to Dashboard
      </button>
    </div>
  );
}

// The main page component wraps our processor in Suspense
export default function ClaimPage() {
    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-50">
            <Suspense fallback={<div>Loading...</div>}>
                <ClaimProcessor />
            </Suspense>
        </main>
    );
}