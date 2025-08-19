'use client';

import { useState, useEffect } from 'react';
import api from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import zxcvbn from 'zxcvbn';

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
  
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { login } = useAuth();

  useEffect(() => {
    if (password) {
      const result = zxcvbn(password);
      setPasswordStrength(result.score);
    } else {
      setPasswordStrength(0);
    }
  }, [password]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!agreedToTerms) {
      setError("You must agree to the terms and conditions.");
      return;
    }
    setLoading(true);
    setError('');

    try {
      await api.post(
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

      const loginResponse = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/login`,
        {
          email: email,
          password: password
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      login(loginResponse.data.token);

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. An unknown error occurred.';
      setError(errorMessage);
      console.warn("Registration failed:", err.response ? JSON.stringify(err.response.data) : err.message);
      setLoading(false);
    }
  };
  
  // --- THIS IS THE CORRECTED LOGIC ---
  const getStrengthIndicator = () => {
      switch (passwordStrength) {
          case 0: return { width: '0%', barColor: 'bg-gray-200', textColor: 'text-gray-400', label: '' };
          case 1: return { width: '25%', barColor: 'bg-red-500', textColor: 'text-red-500', label: 'Weak' };
          case 2: return { width: '50%', barColor: 'bg-yellow-500', textColor: 'text-yellow-500', label: 'Fair' };
          case 3: return { width: '75%', barColor: 'bg-blue-500', textColor: 'text-blue-500', label: 'Good' };
          case 4: return { width: '100%', barColor: 'bg-green-500', textColor: 'text-green-500', label: 'Strong' };
          default: return { width: '0%', barColor: 'bg-gray-200', textColor: 'text-gray-400', label: '' };
      }
  };
  
  const { width, barColor, textColor, label } = getStrengthIndicator();
  // --- END OF CORRECTION ---

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-8 bg-white rounded-lg shadow-md max-w-sm w-full">
      <h2 className="text-2xl font-bold text-center">Create Account</h2>
      
      {error && <p className="text-red-500 text-sm text-center p-2 bg-red-100 rounded">{error}</p>}
      
      <div className="flex space-x-4">
        <input type="text" placeholder="First Name" autoComplete="given-name" value={firstName} onChange={e => setFirstName(e.target.value)} required className="w-1/2 mt-1 block px-3 py-2 border border-gray-300 rounded-md" />
        <input type="text" placeholder="Last Name" autoComplete="family-name" value={lastName} onChange={e => setLastName(e.target.value)} required className="w-1/2 mt-1 block px-3 py-2 border border-gray-300 rounded-md" />
      </div>
      <input type="email" placeholder="Email Address" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
      
      <div>
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
        
        {password.length > 0 && (
            <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full transition-all duration-300 ${barColor}`} style={{ width: width }}></div>
                </div>
                {/* --- THIS IS THE CORRECTED RENDER LOGIC --- */}
                <p className={`text-right text-xs mt-1 font-medium ${textColor}`}>{label}</p>
            </div>
        )}
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