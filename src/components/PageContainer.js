'use client';

// PageContainer is a simple layout component. It does not need any hooks or other imports.

export default function PageContainer({ children }) {
  return (
    <main
      className="p-4 bg-white min-h-screen"
      style={{
        paddingTop: `calc(5rem + env(safe-area-inset-top))`,
        // UPDATED PADDING: 5rem (h-20) instead of 4rem (h-16) for the new navbar
        paddingBottom: `calc(5rem + env(safe-area-inset-bottom))`, 
      }}
    >
      <div className="w-full max-w-md mx-auto h-full">
        {children}
      </div>
    </main>
  );
}