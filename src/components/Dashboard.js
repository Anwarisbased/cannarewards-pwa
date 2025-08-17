// Paste the new, simplified "Welcome Back" version here.
'use client';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <motion.div className="w-full max-w-md mx-auto p-4 font-sans text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h1 className="text-3xl font-bold mb-2">Welcome Back,</h1>
      <h2 className="text-4xl font-bold capitalize text-blue-600 mb-8">{user.firstName || 'Member'}!</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="space-y-4">
          <Link href="/catalog" className="block"><button className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg">Browse Rewards</button></Link>
          <Link href="/scan" className="block"><button className="w-full bg-black text-white font-bold py-3 px-6 rounded-lg">Scan a New Product</button></Link>
        </div>
      </div>
    </motion.div>
  );
}