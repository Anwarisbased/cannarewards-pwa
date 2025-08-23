// src/components/ContentModal.js
'use client';

import { useEffect, useState } from 'react';
import { getPageContent } from '@/services/pageService';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from './ui/button';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';

export default function ContentModal({ pageSlug }) {
    const [pageData, setPageData] = useState({ title: 'Loading...', content: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (pageSlug) {
            const fetchPage = async () => {
                setLoading(true);
                try {
                    const data = await getPageContent(pageSlug);
                    setPageData(data);
                } catch (err) {
                    setPageData({ 
                        title: 'Error', 
                        content: '<p>Could not load the content for this page. Please try again later.</p>' 
                    });
                } finally {
                    setLoading(false);
                }
            };
            fetchPage();
        }
    }, [pageSlug]);

    return (
        <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
            <DialogHeader>
                <DialogTitle className="text-2xl">{pageData.title}</DialogTitle>
            </DialogHeader>
            <div className="flex-grow overflow-y-auto pr-6 -mr-6">
                {loading ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                ) : (
                    <div 
                      className="prose prose-sm sm:prose-base max-w-none" 
                      dangerouslySetInnerHTML={{ __html: pageData.content }} 
                    />
                )}
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button">Close</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    );
}