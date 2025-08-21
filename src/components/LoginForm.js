'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '@/services/authService'; // --- 1. IMPORT THE SERVICE ---
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { showToast } from './CustomToast'; // Using the custom toast for errors

export default function LoginForm({ onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // --- 2. USE THE CLEAN SERVICE FUNCTION ---
      const data = await loginUser(email, password);
      login(data.token); // This still comes from AuthContext to set global state
      // No need to setLoading(false) here, as the page will redirect.

    } catch (err) {
      // --- 3. SIMPLER ERROR HANDLING ---
      // The service already standardizes the error message for us.
      showToast('error', 'Login Failed', err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      
      {/* Error messages are now handled by toasts, so the old error state is gone */}

      <div>
        <label htmlFor="email-login" className="sr-only">Username or Email</label>
        <input
          type="text"
          id="email-login"
          placeholder="Username or Email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div className="relative">
        <label htmlFor="password-login" className="sr-only">Password</label>
        <input
          type={passwordVisible ? 'text' : 'password'}
          id="password-login"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm pr-10"
        />
        <div 
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            onClick={() => setPasswordVisible(!passwordVisible)}
        >
            {passwordVisible ? <EyeSlashIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
        </div>
      </div>

      <div className="text-right text-sm">
        <Link href="/forgot-password" className="font-medium text-primary hover:opacity-90 underline">
          Forgot Password?
        </Link>
      </div>

      <button 
        type="submit" 
        className="w-full py-3 px-4 bg-primary hover:opacity-90 text-white font-semibold rounded-lg disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Log In'}
      </button>

      <p className="text-center text-sm text-gray-600 pt-4">
        Don't have an account?{' '}
        <button 
          type="button" 
          onClick={onSwitchToRegister} 
          className="font-medium text-primary hover:opacity-90 underline"
        >
          Sign Up
        </button>
      </p>
    </form>
  );
}