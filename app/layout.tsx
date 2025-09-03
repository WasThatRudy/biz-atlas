import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, Lora } from 'next/font/google';

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const lora = Lora({ 
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'The BizAtlas Chronicle - Competitive Intelligence',
  description: 'Chart your competitive landscape with unprecedented clarity',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${lora.variable} font-lora bg-[#f8f5f0] text-[#1a1a1a]`}>
        {children}
      </body>
    </html>
  );
}