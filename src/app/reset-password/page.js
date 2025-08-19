'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '../../utils/axiosConfig'; // Use our new axios instance
import Link from 'next/link';
import toast from 'react-hot-toast';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setError('');
        setLoading(true);

        try {
            const response = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/password/reset`, { token, email, password });
            setMessage(response.data.message);
            toast.success("Password reset!");
            setTimeout(() => router.push('/'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password.");
            toast.error(err.response?.data?.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    if (!token || !email) {
        return <div className="text-red-500">Invalid password reset link.</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-4">
            <input type="password" placeholder="New Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-2 border rounded-md" />
            <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full p-2 border rounded-md" />
            <button type="submit" disabled={loading || message} className="w-full py-2 bg-primary text-white font-semibold rounded-lg disabled:bg-gray-400">
                {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            {error && <p className="text-red-500 text-center text-sm pt-2">{error}</p>}
            {message && <p className="text-green-600 text-center text-sm pt-2">{message}</p>}
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-sm">
                <h1 className="text-3xl font-bold text-center mb-6">Set a New Password</h1>
                <Suspense fallback={<div>Loading...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </main>
    );
}