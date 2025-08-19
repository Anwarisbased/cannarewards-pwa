'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
// We no longer need useModal here
import { useTransitionDirection } from '../context/TransitionContext';
import { motion } from 'framer-motion';
import { 
    HomeIcon as HomeOutline, 
    CircleStackIcon as CatalogOutline, 
    QrCodeIcon as ScanOutline, 
    TrophyIcon as RewardsOutline 
} from '@heroicons/react/24/outline';
import { 
    HomeIcon as HomeSolid, 
    CircleStackIcon as CatalogSolid, 
    QrCodeIcon as ScanSolid,
    TrophyIcon as RewardsSolid 
} from '@heroicons/react/24/solid';

function NavItem({ href, label, IconOutline, IconSolid }) {
    const pathname = usePathname();
    const { setDirection } = useTransitionDirection();
    // More robust check for active state, includes child routes
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
    const Icon = isActive ? IconSolid : IconOutline;
    const textStyle = isActive ? 'text-primary font-semibold' : 'text-gray-500';

    return (
        <Link 
            href={href} 
            onClick={() => setDirection('right')}
            className={`flex-1 flex flex-col items-center justify-center p-2 hover:bg-gray-100 transition-colors ${textStyle}`}
        >
            <motion.div whileTap={{ scale: 0.9 }} className="text-center">
                <Icon className="h-6 w-6 mb-1 mx-auto" />
                <span className="text-xs">{label}</span>
            </motion.div>
        </Link>
    );
}


export default function NavBar() {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return null;
    }
    
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-10">
            <div className="flex justify-around max-w-md mx-auto h-16">
                <NavItem href="/" label="Home" IconOutline={HomeOutline} IconSolid={HomeSolid} />
                <NavItem href="/catalog" label="Catalog" IconOutline={CatalogOutline} IconSolid={CatalogSolid} />
                {/* --- THIS IS THE CHANGE --- */}
                {/* The Scan button is now a standard NavItem linking to the /scan page */}
                <NavItem href="/scan" label="Scan" IconOutline={ScanOutline} IconSolid={ScanSolid} />
                <NavItem href="/my-points" label="My Points" IconOutline={RewardsOutline} IconSolid={RewardsSolid} />
            </div>
        </nav>
    );
}