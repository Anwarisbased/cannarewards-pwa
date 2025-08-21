'use client';

import { useEffect, useState } from 'react';
// --- 1. IMPORT THE SERVICE ---
import { getPageContent } from '@/services/pageService';
import AnimatedPage from './AnimatedPage';
import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import DynamicHeader from './DynamicHeader'; // For a consistent header

export default function DynamicPage({ pageSlug, backLink }) {
    const [pageData, setPageData] = useState({ title: '', content: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (pageSlug) {
            const fetchPage = async () => {
                setLoading(true);
                try {
                    // --- 2. USE THE SERVICE FUNCTION ---
                    const data = await getPageContent(pageSlug);
                    setPageData(data);
                } catch (err) {
                    console.error("Failed to fetch page content:", err);
                    setError(err.message || 'The content for this page could not be loaded.');
                    setPageData({ title: 'Page Not Found', content: '<p>The content for this page could not be loaded. Please ensure a page with the correct slug exists in the WordPress admin.</p>' });
                } finally {
                    setLoading(false);
                }
            };
            fetchPage();
        }
    }, [pageSlug]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Loading...
            </div>
        );
    }

    return (
        <AnimatedPage>
            <main className="p-4 bg-white min-h-screen">
                <div className="w-full max-w-2xl mx-auto">
                    {/* --- Using DynamicHeader for consistency --- */}
                    <DynamicHeader title={pageData.title} backLink={backLink || '/profile'} />
                    
                    {error && <p className="text-red-500 text-center my-4">{error}</p>}
                    
                    {/* The 'prose' class from Tailwind Typography is great for styling HTML content */}
                    <div 
                      className="prose lg:prose-xl max-w-none" 
                      dangerouslySetInnerHTML={{ __html: pageData.content }} 
                    />
                </div>
            </main>
        </AnimatedPage>
    );
}