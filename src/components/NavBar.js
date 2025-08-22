'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { triggerHapticFeedback } from '@/utils/haptics';
import { 
    HomeIcon as HomeOutline, 
    CircleStackIcon as CatalogOutline, 
    QrCodeIcon as ScanOutline, 
    TrophyIcon as RewardsOutline,
    UserIcon as UserOutline
} from '@heroicons/react/24/outline';
import { 
    HomeIcon as HomeSolid, 
    CircleStackIcon as CatalogSolid, 
    TrophyIcon as RewardsSolid,
    UserIcon as UserSolid
} from '@heroicons/react/24/solid';

function NavItem({ href, label, IconOutline, IconSolid }) {
    const pathname = usePathname();
    // Make the profile tab active even on sub-pages like /profile/edit
    const isActive = href === '/' ? pathname === href : pathname.startsWith(href);
    const Icon = isActive ? IconSolid : IconOutline;
    const textStyle = isActive ? 'text-primary font-semibold' : 'text-gray-500';

    return (
        <Link 
            href={href} 
            onClick={triggerHapticFeedback}
            className={`flex-1 flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${textStyle}`}
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
    if (!isAuthenticated) { return null; }

    return (
        <nav 
          className="fixed bottom-0 left-0 right-0 h-20 z-20" // Increased height for the button overlap
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} // Handle iPhone home bar
        >
            <div className="relative max-w-md mx-auto h-full">
                {/* The main nav bar background and items */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex justify-around items-center">
                    {/* Left side items */}
                    <div className="flex-1 flex justify-around">
                        <NavItem href="/" label="Home" IconOutline={HomeOutline} IconSolid={HomeSolid} />
                        <NavItem href="/catalog" label="Catalog" IconOutline={CatalogOutline} IconSolid={CatalogSolid} />
                    </div>

                    {/* Placeholder to create space for the center button */}
                    <div className="w-20"></div> 

                    {/* Right side items */}
                    <div className="flex-1 flex justify-around">
                        <NavItem href="/my-points" label="My Points" IconOutline={RewardsOutline} IconSolid={RewardsSolid} />
                        <NavItem href="/profile" label="Profile" IconOutline={UserOutline} IconSolid={UserSolid} />
                    </div>
                </div>

                {/* The floating scan button, positioned in the center */}
                <Link href="/scan" onClick={triggerHapticFeedback} className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
                    <motion.div 
                        whileTap={{ scale: 0.95 }}
                        className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg text-white"
                    >
                        <ScanOutline className="w-8 h-8" />
                    </motion.div>
                </Link>
            </div>
        </nav>
    );
}