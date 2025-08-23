'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '@/services/authService';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { showToast } from './CustomToast';

// --- SHADCN IMPORTS ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// --- END IMPORTS ---

export default function LoginForm({ onSwitchToRegister }) {
  // ========================================================================
  // === THIS IS THE CRITICAL DIAGNOSTIC LINE ===
  // ========================================================================
  console.log('API URL FROM ENV:', process.env.NEXT_PUBLIC_API_URL);
  // ========================================================================

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      login(data.token);
    } catch (err) {
      showToast('error', 'Login Failed', err.message);
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm text-left">
      <form onSubmit={handleSubmit}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Welcome back! Please enter your credentials.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-login">Username or Email</Label>
            <Input
              id="email-login"
              type="text"
              placeholder="you@example.com"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label htmlFor="password-login">Password</Label>
                <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline underline-offset-4">
                    Forgot Password?
                </Link>
            </div>
            <div className="relative">
              <Input
                id="password-login"
                type={passwordVisible ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-muted-foreground"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
          
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="font-medium text-primary hover:underline underline-offset-4"
            >
              Sign Up
            </button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}