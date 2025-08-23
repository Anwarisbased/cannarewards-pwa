'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

// --- SHADCN IMPORT ---
import { Button } from './ui/button';

export default function DynamicHeader({ title, backLink }) {
    const router = useRouter();

    const BackButton = () => {
        const buttonContent = (
            <>
                <ChevronLeftIcon className="h-6 w-6" />
                <span className="sr-only">Back</span>
            </>
        );

        const buttonProps = {
            variant: "ghost",
            size: "icon",
            className: "text-foreground"
        };
        
        if (backLink) {
            return (
                <Link href={backLink} legacyBehavior passHref>
                    <Button {...buttonProps} asChild>
                        <a>{buttonContent}</a>
                    </Button>
                </Link>
            );
        }
        
        return (
            <Button {...buttonProps} onClick={() => router.back()}>
                {buttonContent}
            </Button>
        );
    };

    return (
        <header className="flex items-center h-16">
            <div className="w-1/4"> {/* Left container */}
                <BackButton />
            </div>
            <div className="w-1/2 text-center"> {/* Center container */}
                <h1 className="text-xl font-semibold truncate text-foreground">{title}</h1>
            </div>
            <div className="w-1/4"></div> {/* Right container for alignment */}
        </header>
    );
}