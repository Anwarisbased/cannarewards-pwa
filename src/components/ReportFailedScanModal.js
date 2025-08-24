'use client';

import { useState } from 'react';
import { showToast } from './CustomToast';

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Our new component
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// NOTE: In a real implementation, this would call a service function.
// For now, we'll simulate the API call.
const reportFailedScan = async (code, comments) => {
    console.log("Reporting failed scan for code:", code, "Comments:", comments);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // For now, we just resolve successfully. In the future, this would hit the API.
    return { success: true };
};

export default function ReportFailedScanModal({ failedCode, closeModal }) {
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await reportFailedScan(failedCode, comments);
      showToast('success', 'Report Sent', 'Thank you for your feedback. We will investigate this issue.');
      closeModal();
    } catch (err) {
      showToast('error', 'Submission Failed', err.message || 'Could not send report. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Report a Problem</DialogTitle>
        <DialogDescription>
          Sorry you had trouble scanning. Please provide any details below so we can investigate.
        </DialogDescription>
      </DialogHeader>
      <form id="report-scan-form" onSubmit={handleSubmit} className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="failedCode">Problematic Code</Label>
          <Input id="failedCode" value={failedCode || 'N/A'} readOnly disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="comments">Comments (Optional)</Label>
          <Textarea 
            id="comments"
            placeholder="e.g., The code was scratched, it's a new product, etc."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
      </form>
      <DialogFooter>
        <Button variant="outline" onClick={closeModal}>Cancel</Button>
        <Button type="submit" form="report-scan-form" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Report'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}