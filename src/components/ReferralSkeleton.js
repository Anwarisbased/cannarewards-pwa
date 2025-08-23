// src/components/ReferralSkeleton.js
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function ReferralSkeleton() {
    return (
        <Card>
            <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex items-center ml-4 space-x-2">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                </div>
            </CardContent>
        </Card>
    );
}