'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '@/services/authService'; // Correctly import the v2-compliant function
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { showToast } from './CustomToast';
import { triggerHapticFeedback } from '@/utils/haptics';
import { FloatingLabelInput } from './FloatingLabelInput'; // Using this for consistency
import { motion, AnimatePresence } from 'framer-motion';

// --- SHADCN IMPORTS ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginForm({ onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    triggerHapticFeedback();

    try {
      // Step 1: Call the updated loginUser service function.
      const data = await loginUser(email, password);
      // Step 2: Pass the received token to the AuthContext.
      // The AuthContext will handle state updates and redirection.
      login(data.token);
    } catch (err) {
      showToast('error', 'Login Failed', err.message);
      setLoading(false); // Only set loading to false on failure.
    }
  };

  return (
    <Card className="w-full max-w-sm text-left border-none shadow-none bg-transparent">
      <form onSubmit={handleSubmit}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Welcome back! Please enter your credentials.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 pt-4">
          <FloatingLabelInput
            id="email-login"
            label="Email Address"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-muted-foreground"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {passwordVisible ? (
                    <motion.div
                      key="eye-slash"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <EyeSlashIcon className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="eye-open"
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
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-8">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
          
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
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