'use client';

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function LoginForm({ onSwitchToRegister }) {
  // --- DIAGNOSTIC LINE ---
  // We are logging the value of the environment variable to the browser console.
  console.log("DIAGNOSTIC - API URL from ENV:", process.env.NEXT_PUBLIC_API_URL);
  // --- END DIAGNOSTIC LINE ---

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    try {
      // Using the template literal to build the URL from the environment variable
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/wp-json/jwt-auth/v1/token`,
        formData
      );
      
      login(response.data.token);

    } catch (err) {
      setError('Login failed. Please check your username and password.');
      console.error('Login Failed:', err);
    } finally {
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
      <div>
        <label htmlFor="password-login" className="block text-sm font-medium text-gray-700 sr-only">
          Password
        </label>
        <input
          type="password"
          id="password-login"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <button 
        type="submit" 
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:bg-blue-300"
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Log In'}
      </button>

      <p className="text-center text-sm text-gray-600 pt-4">
        Don't have an account?{' '}
        <button 
          type="button" 
          onClick={onSwitchToRegister} 
          className="font-medium text-blue-600 hover:text-blue-500 underline"
        >
          Sign Up
        </button>
      </p>
    </form>
  );
}