'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/axiosConfig';

export default function ClaimPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Claiming your points...');

  useEffect(() => {
    if (!searchParams) {
        return;
    }

    const code = searchParams.get('code');

    if (!code) {
      setStatus('error');
      setMessage('No code provided in the URL.');
      return;
    }

    const claimCode = async () => {
      try {
        const response = await api.post(
          `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/claim`,
          { code: code }
        );
        
        setStatus('success');
        setMessage(response.data.message);
        
        const currentToken = localStorage.getItem('authToken');
        if (currentToken) {
            login(currentToken);
        }

      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'An unknown error occurred during claim.');
      }
    };

    claimCode();
  }, [searchParams, login, router]);

  if (status === 'processing') {
      return (
        <main className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center p-8">
                <h1 className="text-2xl font-bold mb-4">Processing...</h1>
                <p>{message}</p>
            </div>
        </main>
      );
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">
                {status === 'success' ? 'Success!' : 'Error'}
            </h1>

            <p className={`text-lg ${status === 'success' ? 'text-green-600' : ''} ${status === 'error' ? 'text-red-600' : ''}`}>
                {message}
            </p>
            
            <button 
                onClick={() => router.push('/')}
                className="mt-8 py-2 px-6 bg-primary hover:opacity-90 text-white font-semibold rounded-lg"
            >
                Go to Dashboard
            </button>
        </div>
    </main>
  );
}