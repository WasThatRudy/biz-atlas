'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function Navigation() {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-[#1a1a1a] bg-[#f8f5f0] py-4 mb-8"
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-3xl font-playfair font-bold tracking-tight hover:text-[#8b5a2b] transition-colors">
          The BizAtlas Chronicle
        </Link>
        <div className="flex gap-8">
          <Link href="/dashboard" className="font-lora hover:text-[#8b5a2b] transition-colors border-b border-transparent hover:border-[#8b5a2b]">
            Dashboard
          </Link>
          <Link href="/setup?path=startup" className="letterpress-btn hover:translate-x-0.5 hover:translate-y-0.5 transition-transform">
            Start New Report
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}