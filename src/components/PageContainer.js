'use client';

// A simple wrapper component to provide consistent app shell padding for standard pages.
export default function PageContainer({ children }) {
  return (
    <main
      className="p-4 bg-white min-h-screen"
      style={{
        paddingTop: `calc(5rem + env(safe-area-inset-top))`,      // 5rem (h-20) for Header
        paddingBottom: `calc(4rem + env(safe-area-inset-bottom))`, // 4rem (h-16) for Nav Bar
      }}
    >
      <div className="w-full max-w-md mx-auto">
        {children}
      </div>
    </main>
  );
}