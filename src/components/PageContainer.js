'use client';

// PageContainer is a simple layout component. It does not need any hooks or other imports.

export default function PageContainer({ children }) {
  return (
    <main
      className="p-4 bg-white min-h-screen"
      style={{
        paddingTop: `calc(5rem + env(safe-area-inset-top))`,
        paddingBottom: `calc(4rem + env(safe-area-inset-bottom))`,
      }}
    >
      <div className="w-full max-w-md mx-auto h-full">
        {children}
      </div>
    </main>
  );
}