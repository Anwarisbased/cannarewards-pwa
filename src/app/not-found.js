'use client';

import Link from 'next/link';
import Image from 'next/image';
import AnimatedPage from '../components/AnimatedPage';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <AnimatedPage>
      <main className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center p-8 w-full max-w-md">
          <div className="flex justify-center mb-6">
              <ExclamationTriangleIcon className="w-20 h-20 text-yellow-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">404 - Page Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            Sorry, the page you are looking for does not exist.
          </p>
          <Link href="/">
            <button className="bg-primary text-white font-bold py-3 px-8 rounded-lg text-lg transform hover:scale-105 transition-transform">
              Go Back Home
            </button>
          </Link>
        </div>
      </main>
    </AnimatedPage>
  );
}