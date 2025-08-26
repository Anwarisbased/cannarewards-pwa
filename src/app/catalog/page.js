'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProducts } from '@/services/woocommerceService';
import CatalogSkeleton from '@/components/CatalogSkeleton';
import ImageWithLoader from '@/components/ImageWithLoader';
import PageContainer from '@/components/PageContainer';
import { MagnifyingGlassIcon, PlusIcon, XMarkIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { updateWishlist } from '@/services/authService';
import toast from 'react-hot-toast';
import { cn } from "@/components/lib/utils";
import { lightImpact } from '@/utils/haptics'; // Import lightImpact
import { motion } from 'framer-motion'; // Import motion

// --- SHADCN IMPORTS ---
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
// --- END IMPORTS ---

// --- Refactored ProductCard Component ---
function ProductCard({ product, user, isNewlyAffordable, onWishlistToggle }) { // Added isNewlyAffordable prop
    const imageUrl = product.images?.[0]?.src || 'https://via.placeholder.com/300';

    const isWishlisted = user?.wishlist?.includes(product.id);


    // --- NEW: Logic to check if the reward is locked ---
    const userRankData = user?.rank || {};
    const allRanks = user?.allRanks || {};
    const userRankPoints = allRanks[userRankData.key]?.points ?? 0;
    const requiredRankPoints = allRanks[product.tierRequired]?.points ?? 0;
    const isLocked = product.tierRequired && userRankPoints < requiredRankPoints;
    
    const Wrapper = isLocked ? 'div' : Link;
    const wrapperProps = isLocked ? {} : { href: `/catalog/${product.id}` };

    // Shake animation variants
    const shakeVariants = {
        initial: { x: 0 },
        shake: {
            x: [-5, 5, -5, 5, 0],
            transition: { duration: 0.4, repeat: 0 },
        },
    };

    return (
        <Wrapper {...wrapperProps} className="block group">
            <motion.div // Wrap with motion.div for animation
                variants={shakeVariants}
                animate={isNewlyAffordable ? "shake" : "initial"}
            >
                <Card className={cn(
                    "overflow-hidden h-full flex flex-col",
                    isLocked && "bg-gray-50 opacity-60"
                )}>
                    <CardContent className="p-0 flex-grow">
                        <div className="relative">
                            <AspectRatio ratio={1 / 1}>
                                <ImageWithLoader 
                                    src={imageUrl} 
                                    alt={product.name} 
                                    className={cn(
                                        "w-full h-full object-cover transition-transform duration-300 ease-in-out",
                                        !isLocked && "group-hover:scale-105"
                                    )}
                                />
                                {isLocked && <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>}
                            </AspectRatio>

                            {product.tierRequired && (
                                <Badge variant={isLocked ? "outline" : "secondary"} className="absolute top-2 left-2 bg-white/80">
                                    <LockClosedIcon className="w-3 h-3 mr-1.5" />
                                    {allRanks[product.tierRequired]?.name || product.tierRequired} Tier
                                </Badge>
                            )}

                            {/* --- Wishlist Button --- */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onWishlistToggle(product);
                                }}
                                className="absolute top-2 right-2 z-10 p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-primary hover:bg-white transition"
                                aria-label="Toggle Wishlist"
                            >
                                {isWishlisted ? (
                                    <StarSolid className="w-5 h-5 text-yellow-400" />
                                ) : (
                                    <StarOutline className="w-5 h-5" />
                                )}
                            </button>
                            
                            {!isLocked && (
                                <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg">
                                    <PlusIcon className="w-5 h-5" />
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="p-3 flex-col items-start">
                        <h3 className="text-sm font-medium truncate text-foreground w-full">{product.name}</h3>
                        <p className="text-base font-semibold text-foreground">{product.points_cost} Points</p>
                    </CardFooter>
                </Card>
            </motion.div>
        </Wrapper>
    );
}

export default function CatalogPage() {
    const { user, setUser, isAuthenticated, loading: authLoading } = useAuth(); // GET USER OBJECT
    const router = useRouter();
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [previousUserPoints, setPreviousUserPoints] = useState(0); // Track previous points

    const handleWishlistToggle = async (product) => {
        if (!user) return;

        lightImpact();

        const isWishlisted = user.wishlist?.includes(product.id);
        const oldWishlist = user.wishlist || [];
        const newWishlist = isWishlisted
            ? oldWishlist.filter(id => id !== product.id)
            : [...oldWishlist, product.id];

        // Optimistic UI update
        setUser(prevUser => ({ ...prevUser, wishlist: newWishlist }));

        try {
            await updateWishlist(product.id);
            toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
        } catch (error) {
            toast.error('Could not update wishlist.');
            // Revert UI on error
            setUser(prevUser => ({ ...prevUser, wishlist: oldWishlist }));
        }
    };

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/');
            return;
        }

        if (isAuthenticated && user) { // Ensure user object is available
            // Store current points for next comparison
            setPreviousUserPoints(user.points);

            const fetchProducts = async () => {
                try {
                    const productsFromApi = await getProducts();
                    const formattedProducts = productsFromApi.map(p => {
                        const pointsMeta = p.meta_data.find(meta => meta.key === 'points_cost');
                        const tierMeta = p.meta_data.find(meta => meta.key === '_required_rank');
                        return {
                            id: p.id,
                            name: p.name,
                            images: p.images,
                            points_cost: pointsMeta ? parseInt(pointsMeta.value) : null,
                            tierRequired: tierMeta?.value || null
                        };
                    }).filter(p => p.points_cost !== null);

                    setAllProducts(formattedProducts);
                    setFilteredProducts(formattedProducts);
                } catch (err) {
                    setError(err.message || 'Could not load rewards. Please try again later.');
                } finally {
                    setLoading(false);
                }
            };
            fetchProducts();
        }
    }, [isAuthenticated, authLoading, router, user]);
    
    useEffect(() => {
        if (searchTerm === '') {
            setFilteredProducts(allProducts);
        } else {
            const filtered = allProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    }, [searchTerm, allProducts]);

    if (authLoading || loading || !user) {
        return <CatalogSkeleton />;
    }
    
    return (
        <PageContainer>
            <div className="relative mb-6">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    type="text"
                    placeholder="Search for rewards"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-secondary border-none pl-10 pr-10" 
                />
                {searchTerm && (
                    <XMarkIcon 
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground cursor-pointer" 
                        onClick={() => setSearchTerm('')}
                    />
                )}
            </div>
            
            {error && <p className="text-destructive text-center">{error}</p>}
            
            {!error && filteredProducts.length === 0 && (
                <p className="text-center text-muted-foreground mt-8">
                    {searchTerm ? `No rewards found for "${searchTerm}"` : "No rewards available yet."}
                </p>
            )}

            <div className="grid grid-cols-2 gap-4">
                {filteredProducts.map(product => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        user={user} 
                        onWishlistToggle={handleWishlistToggle}
                        isNewlyAffordable={
                            user.points >= product.points_cost && // Can afford now
                            previousUserPoints < product.points_cost // Couldn't afford before
                        }
                    />
                ))}
            </div>
        </PageContainer>
    );
}