'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

// --- SHADCN IMPORT ---
import { Button } from './ui/button';

export default function EmptyState({ Icon, title, message, buttonLabel, buttonHref }) {
    return (
        <motion.div 
            className="text-center py-10 px-4 bg-card rounded-lg shadow-sm mt-6 border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex justify-center mb-4">
                <Icon className="w-16 h-16 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground mb-6">{message}</p>
            
            {buttonLabel && buttonHref && (
                <Link href={buttonHref}>
                    <Button>{buttonLabel}</Button>
                </Link>
            )}
        </motion.div>
    );
}