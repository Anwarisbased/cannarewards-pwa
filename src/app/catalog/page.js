'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProducts } from '@/services/woocommerceService';
import CatalogSkeleton from '@/components/CatalogSkeleton';
import ImageWithLoader from '@/components/ImageWithLoader';
import PageContainer from '@/components/PageContainer';
import StaggeredList from '@/components/StaggeredList';
import EmptyState from '@/components/EmptyState';
import { MagnifyingGlassIcon, PlusIcon, XMarkIcon, LockClosedIcon, LightBulbIcon, CircleStackIcon } from '@heroicons/react/24/outline';
import { cn } from "@/components/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

function ProductCard({ product, user }) {
    const imageUrl = product.images?.[0]?.src || 'https://via.placeholder.com/300';
    const userRankData = user?.rank || {};
    const allRanks = user?.allRanks || {};
    const userRankPoints = allRanks[userRankData.key]?.points ?? 0;
    const requiredRankPoints = allRanks[product.tierRequired]?.points ?? 0;
    const isLocked = product.tierRequired && userRankPoints < requiredRankPoints;
    
    const Wrapper = isLocked ? 'div' : Link;
    const wrapperProps = isLocked ? {} : { href: `/catalog/${product.id}` };

    return (
        <Wrapper {...wrapperProps} className="block group">
            <Card className={cn("overflow-hidden h-full flex flex-col", isLocked && "bg-gray-50 opacity-60")}>
                <CardContent className="p-0 flex-grow"><div className="relative"><AspectRatio ratio={1 / 1}><ImageWithLoader src={imageUrl} alt={product.name} className={cn("w-full h-full object-cover transition-transform duration-300 ease-in-out", !isLocked && "group-hover:scale-105")} />{isLocked && <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>}</AspectRatio>{product.tierRequired && (<Badge variant={isLocked ? "outline" : "secondary"} className="absolute top-2 left-2 bg-white/80"><LockClosedIcon className="w-3 h-3 mr-1.5" />{allRanks[product.tierRequired]?.name || product.tierRequired} Tier</Badge>)}{!isLocked && (<div className="absolute bottom-2 right-2 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg"><PlusIcon className="w-5 h-5" /></div>)}</div></CardContent>
                <CardFooter className="p-3 flex-col items-start"><h3 className="text-sm font-medium truncate text-foreground w-full">{product.name}</h3><p className="text-base font-semibold text-foreground">{product.points_cost} Points</p></CardFooter>
            </Card>
        </Wrapper>
    );
}

export default function CatalogPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!authLoading && !isAuthenticated) { router.push('/'); return; }
        if (isAuthenticated && user) {
            const fetchProducts = async () => {
                try {
                    const productsFromApi = await getProducts();
                    const formattedProducts = productsFromApi.map(p => ({ id: p.id, name: p.name, images: p.images, points_cost: p.meta_data.find(meta => meta.key === 'points_cost') ? parseInt(p.meta_data.find(meta => meta.key === 'points_cost').value) : null, tierRequired: p.meta_data.find(meta => meta.key === '_required_rank')?.value || null })).filter(p => p.points_cost !== null);
                    setAllProducts(formattedProducts); setFilteredProducts(formattedProducts);
                } catch (err) { setError(err.message || 'Could not load rewards. Please try again later.'); } finally { setLoading(false); }
            };
            fetchProducts();
        }
    }, [isAuthenticated, authLoading, router, user]);
    
    useEffect(() => {
        if (searchTerm === '') { setFilteredProducts(allProducts); } else { const filtered = allProducts.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase())); setFilteredProducts(filtered); }
    }, [searchTerm, allProducts]);

    const nextBestReward = useMemo(() => {
        if (!user || !user.eligibleRewards || user.points === undefined) return null;
        let bestCandidate = null;
        let smallestDifference = Infinity;
        user.eligibleRewards.forEach(reward => {
            if (reward.points_cost > user.points) {
                const difference = reward.points_cost - user.points;
                if (difference < smallestDifference) { smallestDifference = difference; bestCandidate = reward; }
            }
        });
        return bestCandidate ? { ...bestCandidate, pointsNeeded: smallestDifference } : null;
    }, [user]);

    if (authLoading || loading || !user) { return <CatalogSkeleton />; }

    const renderEmptyState = () => {
        if (searchTerm) {
            return (
                <div className="text-center mt-8">
                    <EmptyState Icon={MagnifyingGlassIcon} title={`No results for "${searchTerm}"`} message="Try a different search term or check out our suggestion for you." />
                    {nextBestReward && (
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center justify-center gap-2"><LightBulbIcon className="w-6 h-6 text-yellow-500" /> Suggestion For You</h3>
                            <div className="max-w-xs mx-auto"><ProductCard product={nextBestReward} user={user} /><p className="text-sm text-muted-foreground mt-2">You're only {nextBestReward.pointsNeeded.toLocaleString()} points away!</p></div>
                        </div>
                    )}
                </div>
            );
        }
        return <EmptyState Icon={CircleStackIcon} title="No Rewards Available" message="We're busy adding new items to the catalog. Please check back soon!" />;
    };
    
    return (
        <PageContainer>
            <div className="relative mb-6"><MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><Input type="text" placeholder="Search for rewards" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-secondary border-none pl-10 pr-10" />{searchTerm && (<XMarkIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground cursor-pointer" onClick={() => setSearchTerm('')} />)}</div>
            {error && <p className="text-destructive text-center">{error}</p>}
            {!error && filteredProducts.length === 0 ? renderEmptyState() : (
                <StaggeredList className="grid grid-cols-2 gap-4">
                    {filteredProducts.map(product => ( <ProductCard key={product.id} product={product} user={user} /> ))}
                </StaggeredList>
            )}
        </PageContainer>
    );
}