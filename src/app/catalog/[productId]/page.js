'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProducts } from '@/services/woocommerceService';
import CatalogSkeleton from '../../components/CatalogSkeleton';
import ImageWithLoader from '../../components/ImageWithLoader';
import PageContainer from '../../components/PageContainer';
import { MagnifyingGlassIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'; // Added PlusIcon

// --- SHADCN IMPORTS ---
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Input } from "@/components/ui/input";
// --- END IMPORTS ---

// --- Refactored ProductCard Component ---
function ProductCard({ product }) {
    const imageUrl = product.images?.[0]?.src || 'https://via.placeholder.com/300';

    return (
        <Link href={`/catalog/${product.id}`} className="block group">
            <Card className="overflow-hidden h-full flex flex-col">
                <CardContent className="p-0 flex-grow">
                    <div className="relative">
                        <AspectRatio ratio={1 / 1}>
                            <ImageWithLoader 
                                src={imageUrl} 
                                alt={product.name} 
                                className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                            />
                        </AspectRatio>
                        <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg">
                            <PlusIcon className="w-5 h-5" />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="p-3 flex-col items-start">
                    <h3 className="text-sm font-medium truncate text-foreground w-full">{product.name}</h3>
                    <p className="text-base font-semibold text-foreground">{product.points_cost} Points</p>
                </CardFooter>
            </Card>
        </Link>
    );
}

export default function CatalogPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/');
            return;
        }

        if (isAuthenticated) {
            const fetchProducts = async () => {
                try {
                    const productsFromApi = await getProducts();
                    const formattedProducts = productsFromApi.map(p => {
                        const pointsMeta = p.meta_data.find(meta => meta.key === 'points_cost');
                        return { 
                            id: p.id, 
                            name: p.name, 
                            images: p.images, 
                            points_cost: pointsMeta ? parseInt(pointsMeta.value) : null 
                        };
                    }).filter(p => p.points_cost !== null);

                    setAllProducts(formattedProducts);
                    setFilteredProducts(formattedProducts);
                } catch (err) {
                    console.error("Failed to fetch products:", err);
                    setError(err.message || 'Could not load rewards. Please try again later.');
                } finally {
                    setLoading(false);
                }
            };
            fetchProducts();
        }
    }, [isAuthenticated, authLoading, router]);
    
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

    if (authLoading || loading) {
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
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </PageContainer>
    );
}