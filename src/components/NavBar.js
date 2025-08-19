'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import { motion } from 'framer-motion';
// 1. Import OUTLINE icons
import { 
    HomeIcon as HomeOutline, 
    CircleStackIcon as CatalogOutline, 
    QrCodeIcon as ScanOutline, 
    TrophyIcon as RewardsOutline 
} from '@heroicons/react/24/outline';
// 2. Import SOLID icons
import { 
    HomeIcon as HomeSolid, 
    CircleStackIcon as CatalogSolid, 
    QrCodeIcon as ScanSolid, // Although not used for an active link, good practice to have it
    TrophyIcon as RewardsSolid 
} from '@heroicons/react/24/solid';

// A reusable component for a single navigation item
function NavItem({ href, label, IconOutline, IconSolid }) {
    const pathname = usePathname();
    const isActive = pathname === href;
    // 3. Conditionally choose the icon
    const Icon = isActive ? IconSolid : IconOutline;
    // 4. Update active/inactive styles
    const textStyle = isActive ? 'text-primary font-semibold' : 'text-gray-500';

    return (
        <Link href={href} className={`flex-1 flex flex-col items-center justify-center p-2 hover:bg-gray-100 transition-colors ${textStyle}`}>
            <motion.div whileTap={{ scale: 0.9 }} className="text-center">
                <Icon className="h-6 w-6 mb-1 mx-auto" />
                <span className="text-xs">{label}</span>
            </motion.div>
        </Link>
    );
}

// A special component for the Scan button (no active state)
function ScanButton({ label, IconOutline }) {
    const { openScanModal } = useModal();
    return (
        <button onClick={openScanModal} className="flex-1 flex flex-col items-center justify-center p-2 text-gray-500 hover:bg-gray-100 transition-colors">
            <motion.div whileTap={{ scale: 0.9 }} className="text-center">
                <IconOutline className="h-6 w-6 mb-1 mx-auto" />
                <span className="text-xs">{label}</span>
            </motion.div>
        </button>
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
                <ScanButton label="Scan" IconOutline={ScanOutline} />
                <NavItem href="/my-points" label="My Points" IconOutline={RewardsOutline} IconSolid={RewardsSolid} />
            </div>
        </nav>
    );
}