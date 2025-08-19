'use client';
import { useState } from 'react';
import api from '../../utils/axiosConfig'; // Use our new axios instance
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const response = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/password/request`, { email });
            setMessage(response.data.message);
            toast.success("Request sent!");
        } catch (error) {
            toast.error("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-sm">
                <h1 className="text-3xl font-bold text-center mb-6">Reset Password</h1>
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-4">
                    <p className="text-sm text-gray-600">Enter your email address and we will send you a link to reset your password.</p>
                    <input type="email" placeholder="Your Email Address" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-2 border rounded-md" />
                    <button type="submit" disabled={loading || message} className="w-full py-2 bg-primary text-white font-semibold rounded-lg disabled:bg-gray-400">
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                    {message && <p className="text-green-600 text-center text-sm pt-2">{message}</p>}
                    <div className="text-center pt-2">
                      <Link href="/" className="text-sm underline text-gray-500">Back to Login</Link>
                    </div>
                </form>
            </div>
        </main>
    );
}