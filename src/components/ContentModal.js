'use client';

import { useEffect, useState } from 'react';
import { getPageContentV2 } from '@/services/pageService';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Skeleton } from './ui/skeleton';

const ContentSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
  </div>
);

export default function ContentModal({ pageSlug, closeModal }) {
  const [pageData, setPageData] = useState({
    title: 'Loading...',
    content: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pageSlug) {
      const fetchPage = async () => {
        setLoading(true);
        try {
          const data = await getPageContentV2(pageSlug);
          setPageData(data);
        } catch (err) {
          setPageData({
            title: 'Error',
            content:
              '<p>Could not load the content for this page. Please try again later.</p>',
          });
        } finally {
          setLoading(false);
        }
      };
      fetchPage();
    }
  }, [pageSlug]);

  return (
    <DialogContent className="flex max-h-[80vh] flex-col sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle className="text-2xl">{pageData.title}</DialogTitle>
      </DialogHeader>
      <div className="-mr-6 flex-grow overflow-y-auto pr-6">
        {loading ? (
          <ContentSkeleton />
        ) : (
          <div
            className="prose prose-sm max-w-none sm:prose-base"
            dangerouslySetInnerHTML={{ __html: pageData.content }}
          />
        )}
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" onClick={closeModal}>
            Close
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
