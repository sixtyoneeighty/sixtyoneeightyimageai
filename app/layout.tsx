import { ReactNode } from 'react';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

interface LayoutProps {
  children: ReactNode;
}

export const metadata = {
  title: 'AI Image Generator',
  description: 'Generate amazing images using AI',
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}