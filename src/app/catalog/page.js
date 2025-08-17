// src/app/catalog/page.js
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import AnimatedPage from '../../components/AnimatedPage';
import { ChevronLeftIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

// New ProductCard component to match the design
function ProductCard({ product }) {
    const imageUrl = product.images && product.images[0] ? product.images[0].src : 'https://via.placeholder.com/150';

    return (
        <Link href={`/catalog/${product.id}`}>
            <div className="bg-gray-100 rounded-lg group">
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
    const router = useRouter();
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const consumerKey = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
                const consumerSecret = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;

                if (!consumerKey || !consumerSecret) {
                    setError("API credentials are not configured. Please check your .env.local file.");
                    setLoading(false);
                    return;
                }

                const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/wc/v3/products?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;
                console.log('Fetching from URL:', apiUrl);
                const response = await axios.get(apiUrl);
                console.log('API Response:', response.data);
                
                const formattedProducts = response.data.map(p => {
                    const pointsMeta = p.meta_data.find(meta => meta.key === 'points_cost');
                    return { id: p.id, name: p.name, images: p.images, points_cost: pointsMeta ? parseInt(pointsMeta.value) : null };
                }).filter(p => p.points_cost !== null);

                console.log('Formatted Products:', formattedProducts);
                setAllProducts(formattedProducts);
                setFilteredProducts(formattedProducts);
            } catch (err) {
                console.error('Error fetching products:', err);
                if (err.response && err.response.status === 401) {
                    setError('Authentication failed. Please verify your API keys in the .env.local file.');
                } else {
                    setError('Could not load rewards.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);
    
    // Effect for handling the search functionality
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

    if (loading) return <div className="min-h-screen bg-white text-center p-10">Loading...</div>;

    return (
        <AnimatedPage>
            <main className="p-4 bg-white min-h-screen">
                <div className="w-full max-w-md mx-auto">
                    <header className="flex items-center mb-4">
                        <Link href="/" className="p-2 -ml-2">
                            <ChevronLeftIcon className="h-6 w-6" />
                        </Link>
                        <h1 className="text-xl font-semibold text-center flex-grow">SHOP</h1>
                    </header>

                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input 
                            type="text"
                            placeholder="Search"
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