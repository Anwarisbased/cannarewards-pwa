'use client';

import { CheckCircleIcon } from '@heroicons/react/24/solid';

// --- SHADCN IMPORTS ---
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
// --- END IMPORTS ---

export default function SuccessModal({ title, message, buttonLabel, onButtonClick }) {
    // The parent component controls visibility, so we just need `open={true}`.
    // The `onOpenChange` with `onButtonClick` handles closing when the user clicks away,
    // though the primary action is the button.
    return (
        <Dialog open={true} onOpenChange={onButtonClick}>
            <DialogContent className="sm:max-w-md text-center">
                <DialogHeader className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full mx-auto flex items-center justify-center mb-6">
                        <CheckCircleIcon className="h-12 w-12" />
                    </div>
                    <DialogTitle className="text-2xl">{title}</DialogTitle>
                </DialogHeader>
                
                <div className="py-4">
                    <p className="text-muted-foreground">{message}</p>
                </div>

                <DialogFooter className="sm:justify-center">
                    <Button onClick={onButtonClick} className="w-full">
                        {buttonLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}