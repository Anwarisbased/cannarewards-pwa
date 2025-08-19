'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../utils/axiosConfig';
import AnimatedPage from '../../components/AnimatedPage';
import CatalogSkeleton from '../../components/CatalogSkeleton';
import DynamicHeader from '../../components/DynamicHeader';
import ImageWithLoader from '../../components/ImageWithLoader'; // 1. Import the new component
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

function ProductCard({ product }) {
    const imageUrl = product.images && product.images[0] ? product.images[0].src : 'https://via.placeholder.com/150';

    return (
        <Link href={`/catalog/${product.id}`} className="block group">
            <div className="space-y-2">
                <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {/* 2. Use the ImageWithLoader component */}
                    <ImageWithLoader 
                        src={imageUrl} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                    <div className="absolute bottom-3 right-3 bg-black text-white w-10 h-10 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg">
                        <span className="text-2xl font-light">+</span>
                    </div>
                </div>
                <div className="px-1">
                    <h3 className="text-sm font-medium truncate text-gray-800">{product.name}</h3>
                    <p className="text-base font-semibold mt-1 text-gray-900">{product.points_cost} Points</p>
                </div>
            </div>
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
                    const consumerKey = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
                    const consumerSecret = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;
                    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/wc/v3/products?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;

                    const response = await api.get(apiUrl);
                    
                    const formattedProducts = response.data.map(p => {
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
                    setError('Could not load rewards. Please try again later.');
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
        <AnimatedPage>
            <main className="p-4 bg-white min-h-screen">
                <div className="w-full max-w-md mx-auto">
                    <DynamicHeader title="Shop" />
                    
                    <div className="relative mb-6">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input 
                            type="text"
                            placeholder="Search for rewards"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-100 border-none rounded-lg py-3 pl-10 pr-10" 
                        />
                        {searchTerm && (
                            <XMarkIcon 
                                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 cursor-pointer" 
                                onClick={() => setSearchTerm('')}
                            />
                        )}
                    </div>
                    
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    
                    {!error && filteredProducts.length === 0 && (
                        <p className="text-center text-gray-500 mt-8">
                            {searchTerm ? `No rewards found for "${searchTerm}"` : "No rewards available yet."}
                        </p>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </main>
        </AnimatedPage>
    );
}