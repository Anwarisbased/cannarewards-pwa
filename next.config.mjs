import bundleAnalyzer from '@next/bundle-analyzer';

// Initialize the analyzer with an environment variable flag
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your regular Next.js config goes here
  // For example:
  // images: { ... }
};

export default withBundleAnalyzer(nextConfig);