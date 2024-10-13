import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div
      style={{
        width: '100vw',        /* Full viewport width */
        height: '100vh',       /* Full viewport height */
        margin: '0',           /* Reset default margin */
        padding: '0',          /* Reset default padding */
        overflowX: 'hidden',   /* Disable horizontal scrolling */
        display: 'flex',       /* Optional: Flexbox for layout */
        flexDirection: 'column', /* Optional: Column-based layout */
      }}
    >
      {children}
    </div>
  );
}