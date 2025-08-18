'use client';

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function RegisterForm({ onSwitchToLogin }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToMarketing, setAgreedToMarketing] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!agreedToTerms) {
      setError("You must agree to the terms and conditions.");
      return;
    }
    setLoading(true);
    setError('');

    try {
      // Step 1: Register the User using our custom /register endpoint
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/register`,
        {
          username: email,
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
          phone: phone,
          agreedToMarketing: agreedToMarketing,
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      // Step 2: If Registration is Successful, Immediately Log Them In using our custom /login endpoint
      const loginResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/login`,
        {
          email: email,
          password: password
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      // Step 3: Update the Global App State, which will trigger the redirect
      login(loginResponse.data.token);

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      console.error("Registration failed:", err.response?.data || err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-8 bg-white rounded-lg shadow-md max-w-sm w-full">
      <h2 className="text-2xl font-bold text-center">Create Account</h2>
      
      {error && <p className="text-red-500 text-sm text-center p-2 bg-red-100 rounded">{error}</p>}
      
      <div className="flex space-x-4">
        <input type="text" placeholder="First Name" autoComplete="given-name" value={firstName} onChange={e => setFirstName(e.target.value)} required className="w-1/2 mt-1 block px-3 py-2 border border-gray-300 rounded-md" />
        <input type="text" placeholder="Last Name" autoComplete="family-name" value={lastName} onChange={e => setLastName(e.target.value)} required className="w-1/2 mt-1 block px-3 py-2 border border-gray-300 rounded-md" />
      </div>
      <input type="email" placeholder="Email Address" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
      
      <div className="relative">
        <input 
            type={passwordVisible ? 'text' : 'password'} 
            placeholder="Password" 
            autoComplete="new-password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md pr-10" 
        />
        <div 
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            onClick={() => setPasswordVisible(!passwordVisible)}
        >
            {passwordVisible ? <EyeSlashIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
        </div>
      </div>
      
      <input type="tel" placeholder="Phone Number" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />

      <div className="space-y-3 pt-4">
        <label className="flex items-center text-sm text-gray-600">
          <input type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mr-2" />
          I agree to the <a href="/terms" target="_blank" className="underline font-medium text-primary">Terms and Conditions</a>.
        </label>
        <label className="flex items-center text-sm text-gray-600">
          <input type="checkbox" checked={agreedToMarketing} onChange={e => setAgreedToMarketing(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mr-2" />
          I agree to receive marketing communications (optional).
        </label>
      </div>
      
      <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-primary hover:opacity-90 text-white font-semibold rounded-lg disabled:bg-gray-400">
        {loading ? 'Creating Account...' : 'Sign Up'}
      </button>

      <p className="text-center text-sm text-gray-600 pt-4">
        Already have an account?{' '}
        <button 
          type="button" 
          onClick={onSwitchToLogin} 
          className="font-medium text-primary hover:opacity-90 underline"
          disabled={loading}
        >
          Log In
        </button>
      </p>
    </form>
  );
}