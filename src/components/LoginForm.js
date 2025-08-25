'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { loginUser, requestMagicLink } from '@/services/authService';
import { EyeIcon, EyeSlashIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { showToast } from './CustomToast';

// --- SHADCN IMPORTS ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// --- END IMPORTS ---

export default function LoginForm({ onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [view, setView] = useState('passwordLogin'); // 'passwordLogin' or 'magicLink'
  const { login } = useAuth();

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const responseData = await loginUser(email, password);
      if (responseData.data && responseData.data.token) {
        login(responseData.data.token);
      } else if (responseData.token) { // Handle direct token response
        login(responseData.token);
      }
      else {
        throw new Error("Invalid login response from server.");
      }
    } catch (err) {
      showToast('error', 'Login Failed', err.message);
      setLoading(false);
    }
  };

  const handleMagicLinkSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
        await requestMagicLink(email);
        showToast('success', 'Check Your Email', 'A secure login link has been sent to you.');
        setView('magicLinkSent');
    } catch (err) {
        showToast('error', 'Request Failed', err.message);
    } finally {
        setLoading(false);
    }
  };

  if (view === 'magicLinkSent') {
    return (
        <Card className="w-full max-w-sm text-center">
            <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <EnvelopeIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                </div>
                <CardTitle className="text-2xl mt-4">Email Sent!</CardTitle>
                <CardDescription>A secure login link has been sent to <strong>{email}</strong>. Please check your inbox.</CardDescription>
            </CardHeader>
            <CardFooter>
                 <Button variant="outline" className="w-full" onClick={() => setView('passwordLogin')}>
                    Back to Login
                </Button>
            </CardFooter>
        </Card>
    );
  }

  if (view === 'magicLink') {
    return (
        <Card className="w-full max-w-sm text-left">
            <form onSubmit={handleMagicLinkSubmit}>
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Passwordless Login</CardTitle>
                    <CardDescription>Enter your email to receive a secure login link.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="email-magic">Email Address</Label>
                        <Input id="email-magic" type="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Magic Link'}
                    </Button>
                    <Button variant="link" onClick={() => setView('passwordLogin')}>
                        Log in with password instead
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm text-left">
      <form onSubmit={handlePasswordSubmit}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Welcome back! Please enter your credentials.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-login">Username or Email</Label>
            <Input id="email-login" type="text" placeholder="you@example.com" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label htmlFor="password-login">Password</Label>
                <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline underline-offset-4">
                    Forgot Password?
                </Link>
            </div>
            <div className="relative">
              <Input id="password-login" type={passwordVisible ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required className="pr-10" />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-muted-foreground" onClick={() => setPasswordVisible(!passwordVisible)}>
                {passwordVisible ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
          
           <Button type="button" variant="outline" className="w-full" onClick={() => setView('magicLink')}>
                <EnvelopeIcon className="w-4 h-4 mr-2" />
                Email me a login link
            </Button>
          
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button type="button" onClick={onSwitchToRegister} className="font-medium text-primary hover:underline underline-offset-4">
              Sign Up
            </button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}