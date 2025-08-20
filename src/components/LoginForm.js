'use client';

import { useState } from 'react';
import api from '../utils/axiosConfig';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function LoginForm({ onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/login`,
        {
          email: email,
          password: password,
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      login(response.data.token);

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      // console.warn removed
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-8 bg-white rounded-lg shadow-md max-w-sm w-full">
      <h2 className="text-2xl font-bold text-center">Login</h2>
      
      {error && <p className="text-red-500 text-sm text-center p-2 bg-red-100 rounded">{error}</p>}

      <div>
        <label htmlFor="email-login" className="block text-sm font-medium text-gray-700 sr-only">
          Username or Email
        </label>
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
        <label htmlFor="password-login" className="block text-sm font-medium text-gray-700 sr-only">
          Password
        </label>
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
        className="w-full py-2 px-4 bg-primary hover:opacity-90 text-white font-semibold rounded-lg disabled:bg-gray-400"
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