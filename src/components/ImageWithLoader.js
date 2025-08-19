'use client';

import { useState, useEffect } from 'react';

export default function ImageWithLoader({ src, alt, className }) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Reset loaded state if the image source changes
        setIsLoaded(false);
    }, [src]);

    return (
        <div className="relative w-full h-full">
            {/* The actual image, hidden until loaded */}
            <img
                src={src}
                alt={alt}
                className={`
                    ${className} 
                    transition-opacity duration-500 ease-in-out
                    ${isLoaded ? 'opacity-100' : 'opacity-0'}
                `}
                onLoad={() => setIsLoaded(true)}
                // In case the image fails to load, we still want to show the placeholder
                onError={() => setIsLoaded(true)} 
            />
            {/* The placeholder, visible until the image is loaded */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
            )}
        </div>
    );
}