'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import AnimatedPage from '../../components/AnimatedPage';
import CatalogSkeleton from '../../components/CatalogSkeleton'; // 1. Import the new skeleton component
import { ChevronLeftIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Reusable component for a single Product Card in the grid
function ProductCard({ product }) {
    const imageUrl = product.images && product.images[0] ? product.images[0].src : 'https://via.placeholder.com/150';

    return (
        <Link href={`/catalog/${product.id}`} className="block group">
            <div className="bg-gray-100 rounded-lg">
                <div className="relative">
                    <img src={imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-t-lg" />
                    <div className="absolute bottom-2 right-2 bg-black text-white w-10 h-10 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                        <span className="text-2xl font-light">+</span>
                    </div>
                </div>
                <div className="p-3">
                    <h3 className="text-sm font-medium truncate">{product.name}</h3>
                    <p className="text-md font-semibold mt-1">{product.points_cost} Points</p>
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
        // Redirect if user is not logged in
        if (!authLoading && !isAuthenticated) {
            router.push('/');
            return;
        }

        if (isAuthenticated) {
            const fetchProducts = async () => {
                try {
                    const consumerKey = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
                    const consumerSecret = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;
                    // Construct the API URL using template literals (backticks)
                    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/wc/v3/products?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;

                    const response = await axios.get(apiUrl);
                    
                    const formattedProducts = response.data.map(p => {
                        const pointsMeta = p.meta_data.find(meta => meta.key === 'points_cost');
                        return { 
                            id: p.id, 
                            name: p.name, 
                            images: p.images, 
                            points_cost: pointsMeta ? parseInt(pointsMeta.value) : null 
                        };
                    }).filter(p => p.points_cost !== null); // Only include products with a point cost

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
    
    // This effect runs whenever the search term changes, filtering the products
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

    // --- 2. THIS IS THE CHANGE ---
    // Render the skeleton if auth is loading OR if we are fetching products
    if (authLoading || loading) {
        return <CatalogSkeleton />;
    }
    // --- END OF CHANGE ---

    return (
        <AnimatedPage>
            <main className="p-4 bg-white min-h-screen">
                <div className="w-full max-w-md mx-auto">
                    <header className="flex items-center mb-4 h-16">
                        <Link href="/" className="p-2 -ml-2">
                            <ChevronLeftIcon className="h-6 w-6" />
                        </Link>
                        <h1 className="text-xl font-semibold text-center flex-grow">SHOP</h1>
                        {/* Empty div for spacing to keep title centered */}
                        <div className="w-6 h-6"></div>
                    </header>

                    {/* Search Bar */}
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