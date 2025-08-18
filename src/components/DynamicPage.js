// src/components/DynamicPage.js
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import AnimatedPage from './AnimatedPage'; // Using relative path
import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

export default function DynamicPage({ pageSlug, backLink }) {
    const [pageData, setPageData] = useState({ title: '', content: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (pageSlug) {
            const fetchPage = async () => {
                try {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/page/${pageSlug}`);
                    setPageData(response.data);
                } catch (error) {
                    console.error("Failed to fetch page content:", error);
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
                    <header className="flex items-center mb-4">
                        <Link href={backLink || '/'} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                            <ChevronLeftIcon className="h-6 w-6" />
                        </Link>
                        <h1 className="text-2xl font-semibold ml-2">{pageData.title}</h1>
                    </header>
                    {/* The 'prose' class from Tailwind is great for styling HTML content */}
                    <div className="prose lg:prose-xl" dangerouslySetInnerHTML={{ __html: pageData.content }} />
                </div>
            </main>
        </AnimatedPage>
    );
}