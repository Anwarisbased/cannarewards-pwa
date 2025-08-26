'use client';

import Link from 'next/link';
import { useOnboarding } from '@/context/OnboardingContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

export default function ActiveQuestsCard() {
  const { currentQuest } = useOnboarding();

  if (!currentQuest.show) {
    return null;
  }

  return (
    <Card className="bg-primary-foreground border-primary">
      <CardHeader>
        <CardTitle>New Quest Available!</CardTitle>
        <CardDescription>{currentQuest.message}</CardDescription>
      </CardHeader>
      <CardContent>
        {currentQuest.ctaLink && (
          <Link href={currentQuest.ctaLink} passHref>
            <Button as="a" className="w-full">
              {currentQuest.ctaText}
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}