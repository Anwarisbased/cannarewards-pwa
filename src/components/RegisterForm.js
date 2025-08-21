'use client';

import { useState, useEffect } from 'react';
import api from '../utils/axiosConfig'; // This can be removed after refactor
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
// --- 1. IMPORT THE SERVICE FUNCTIONS ---
import { registerUser, loginUser } from '@/services/authService';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import zxcvbn from 'zxcvbn';
import AnimatedProgressBar from './AnimatedProgressBar';
import ImageWithLoader from './ImageWithLoader';
import { showToast } from './CustomToast'; // For consistent error handling

export default function RegisterForm({ onSwitchToLogin, claimCode = null, rewardPreview = null }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToMarketing, setAgreedToMarketing] = useState(false);

  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '' });

  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (password) {
      const result = zxcvbn(password);
      setPasswordStrength({
        score: result.score,
        feedback: result.feedback?.warning || ''
      });
    } else {
      setPasswordStrength({ score: 0, feedback: '' });
    }
  }, [password]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!agreedToTerms) {
      showToast("error", "Terms Required", "You must agree to the terms and conditions.");
      return;
    }
    setLoading(true);

    try {
      const registrationPayload = {
        username: email,
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        agreedToMarketing: agreedToMarketing,
      };

      const storedRefCode = localStorage.getItem('referralCode');
      if (storedRefCode) {
          registrationPayload.referralCode = storedRefCode;
      }
      
      if (claimCode) {
        registrationPayload.code = claimCode;
      }
      
      // --- 2. USE THE CLEAN SERVICE FUNCTIONS ---
      await registerUser(registrationPayload);

      if (storedRefCode) {
          localStorage.removeItem('referralCode');
      }

      // Automatically log the user in after successful registration
      const loginData = await loginUser(email, password);
      login(loginData.token); // Set global state via AuthContext

      if (rewardPreview && rewardPreview.productId) {
        let redirectUrl = `/catalog/${rewardPreview.productId}`;
        if (rewardPreview.isReferralGift || claimCode) {
            redirectUrl += '?first_scan=true';
        }
        router.push(redirectUrl);
      } else {
        router.push('/');
      }

    } catch (err) {
      // --- 3. SIMPLER ERROR HANDLING ---
      showToast('error', 'Registration Failed', err.message);
      setLoading(false);
    }
  };
  
  // (The rest of the component's JSX and helper functions remain unchanged)
  const getStrengthIndicator = () => {
      switch (passwordStrength.score) {
          case 0: return { progress: 0, barColor: 'bg-gray-200', textColor: 'text-gray-400', label: '' };
          case 1: return { progress: 25, barColor: 'bg-red-500', textColor: 'text-red-500', label: 'Weak' };
          case 2: return { progress: 50, barColor: 'bg-yellow-500', textColor: 'text-yellow-500', label: 'Fair' };
          case 3: return { progress: 75, barColor: 'bg-blue-500', textColor: 'text-blue-500', label: 'Good' };
          case 4: return { progress: 100, barColor: 'bg-green-500', textColor: 'text-green-500', label: 'Strong' };
          default: return { progress: 0, barColor: 'bg-gray-200', textColor: 'text-gray-400', label: '' };
      }
  };
  
  const { progress, barColor, textColor, label } = getStrengthIndicator();

  const formContainerClass = claimCode || rewardPreview
    ? "w-full"
    : "space-y-4 p-8 bg-white rounded-lg shadow-md max-w-sm w-full";

  return (
    <form onSubmit={handleSubmit} className={formContainerClass}>
      
      {rewardPreview && (
        <div className="text-center mb-6">
          <div className="bg-white p-4 rounded-lg shadow-inner border max-w-[250px] mx-auto">
            <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
              <ImageWithLoader src={rewardPreview.image} alt={rewardPreview.name} className="w-full h-full object-cover" />
            </div>
            <p className="text-xs text-gray-500">YOUR WELCOME REWARD</p>
            <p className="text-lg font-semibold text-gray-900">{rewardPreview.name}</p>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold text-center">Create Account</h2>
      
      {/* The old [error] state is now handled by toasts */}

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
                <AnimatedProgressBar progress={progress} barColor={barColor} />
                <div className="flex justify-between items-center">
                    <p className={`text-xs mt-1 ${textColor}`}>
                        {passwordStrength.feedback}
                    </p>
                    <p className={`text-xs mt-1 font-medium ${textColor}`}>{label}</p>
                </div>
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
        {loading ? 'Creating Account...' : 'Sign Up & Claim Reward'}
      </button>

      {!(claimCode || rewardPreview?.isReferralGift) && (
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
      )}
    </form>
  );
}