'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { registerUser, loginUser } from '@/services/authService';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import zxcvbn from 'zxcvbn';
import { showToast } from './CustomToast';
import { motion, AnimatePresence } from 'framer-motion';

// --- SHADCN IMPORTS ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AnimatedProgressBar from './AnimatedProgressBar';
import ImageWithLoader from './ImageWithLoader';

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!agreedToTerms) {
      showToast("error", "Agreement Required", "You must certify your age and agree to the terms.");
      return;
    }
    setLoading(true);

    try {
      const registrationPayload = {
        email, password,
        firstName, lastName, phone,
        agreedToMarketing,
        agreedToTerms,
      };

      const storedRefCode = localStorage.getItem('referralCode');
      if (storedRefCode) {
          registrationPayload.referralCode = storedRefCode;
      }
      
      if (claimCode) {
        registrationPayload.code = claimCode;
      }
      
      // Step 1: Register the user using the new v2 service function.
      await registerUser(registrationPayload);

      // Step 2: Automatically log the user in after successful registration.
      const loginData = await loginUser(email, password);
      login(loginData.token); // This will set the auth token and redirect to the dashboard.

      if (storedRefCode) {
          localStorage.removeItem('referralCode');
      }

      // Handle special redirects for first-time scans or referral gifts.
      if (rewardPreview?.id) {
        let redirectUrl = `/catalog/${rewardPreview.id}`;
        if (rewardPreview.isReferralGift || claimCode) {
            redirectUrl += '?first_scan=true';
        }
        router.push(redirectUrl);
      } else {
        // Default redirect is handled by the AuthContext, but we can be explicit.
        router.push('/');
      }

    } catch (err) {
      showToast('error', 'Registration Failed', err.message);
      setLoading(false);
    }
  };
  
  const { progress, barColor, textColor, label } = getStrengthIndicator();

  return (
    <Card className="w-full max-w-sm text-left border-none shadow-none bg-transparent">
      <form onSubmit={handleSubmit}>
        <CardHeader className="text-center">
          {rewardPreview && (
            <div className="mb-4">
              <div className="bg-white p-4 rounded-lg shadow-inner border max-w-[250px] mx-auto">
                <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                  <ImageWithLoader src={rewardPreview.image} alt={rewardPreview.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs text-muted-foreground">YOUR WELCOME REWARD</p>
                <p className="text-lg font-semibold text-card-foreground">{rewardPreview.name}</p>
              </div>
            </div>
          )}
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Enter your details below to get started.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="Jane" required value={firstName} onChange={e => setFirstName(e.target.value)} autoComplete="given-name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Doe" required value={lastName} onChange={e => setLastName(e.target.value)} autoComplete="family-name" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="jane@example.com" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
                <Input 
                    id="password" 
                    type={passwordVisible ? 'text' : 'password'} 
                    required 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    autoComplete="new-password"
                    className="pr-10"
                />
                <div 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-muted-foreground"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    {passwordVisible ? (
                      <motion.div
                        key="eye-slash-reg"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <EyeSlashIcon className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="eye-open-reg"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <EyeIcon className="h-5 w-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
            </div>
            {password.length > 0 && (
              <div className="mt-2">
                  <AnimatedProgressBar progress={progress} barColor={barColor} />
                  <div className="flex justify-between items-center">
                      <p className={`text-xs mt-1 ${textColor}`}>{passwordStrength.feedback}</p>
                      <p className={`text-xs mt-1 font-medium ${textColor}`}>{label}</p>
                  </div>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input id="phone" type="tel" placeholder="(123) 456-7890" value={phone} onChange={e => setPhone(e.target.value)} autoComplete="tel" />
          </div>

          <div className="items-top flex space-x-2">
            <input type="checkbox" id="terms" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} className="h-4 w-4 mt-1 rounded border-gray-300 text-primary focus:ring-primary" />
            <div className="grid gap-1.5 leading-none">
                <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I certify that I am 21+ and agree to the <a href="/terms" target="_blank" className="underline text-primary">Terms and Conditions</a>.
                </label>
            </div>
          </div>

          <div className="items-top flex space-x-2">
            <input type="checkbox" id="marketing" checked={agreedToMarketing} onChange={e => setAgreedToMarketing(e.target.checked)} className="h-4 w-4 mt-1 rounded border-gray-300 text-primary focus:ring-primary" />
            <label htmlFor="marketing" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I agree to receive marketing communications (optional).
            </label>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating Account...' : (rewardPreview ? 'Sign Up & Claim Reward' : 'Create Account')}
          </Button>
          
          {!(claimCode || rewardPreview?.isReferralGift) && (
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <button type="button" onClick={onSwitchToLogin} className="font-medium text-primary hover:underline underline-offset-4" disabled={loading}>
                Log In
              </button>
            </p>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}