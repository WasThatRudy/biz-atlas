'use client';

import { motion } from 'framer-motion';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { ProtectedRoute } from '@/components/auth/protected-route';
import Link from 'next/link';

function SetupContent() {
  const [input, setInput] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const path = searchParams.get('path');
  
  const isStartup = path === 'startup';
  const isBusiness = path === 'business';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      router.push('/competitors');
    }
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-2xl mx-auto"
      >
        <div className="newspaper-border p-6 sm:p-8 lg:p-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-center mb-6 sm:mb-8">
            {isStartup ? 'New Venture Intelligence' : isBusiness ? 'Business Analysis' : 'Project Setup'}
          </h1>
          
          <div className="newspaper-divider"></div>
          
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {isStartup && (
              <>
                <div>
                  <label className="block text-base sm:text-lg font-lora font-medium mb-2 sm:mb-3">
                    Describe Your Startup Idea
                  </label>
                  <p className="text-xs sm:text-sm font-lora text-[#666] mb-3 sm:mb-4">
                    Provide details about your business concept, target market, and key value propositions.
                  </p>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter your startup idea..."
                    className="w-full h-28 sm:h-32 p-3 sm:p-4 border border-[#1a1a1a] bg-[#f8f5f0] font-lora resize-none focus:outline-none focus:ring-1 focus:ring-[#8b5a2b] text-sm sm:text-base"
                    required
                  />
                </div>
              </>
            )}
            
            {isBusiness && (
              <>
                <div>
                  <label className="block text-base sm:text-lg font-lora font-medium mb-2 sm:mb-3">
                    Company Website URL
                  </label>
                  <p className="text-xs sm:text-sm font-lora text-[#666] mb-3 sm:mb-4">
                    Enter your company's website to analyze your existing business position.
                  </p>
                  <input
                    type="url"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="https://your-company.com"
                    className="w-full p-3 sm:p-4 border border-[#1a1a1a] bg-[#f8f5f0] font-lora focus:outline-none focus:ring-1 focus:ring-[#8b5a2b] text-sm sm:text-base"
                    required
                  />
                </div>
              </>
            )}
            
            {!isStartup && !isBusiness && (
              <div className="text-center">
                <p className="font-lora text-base sm:text-lg mb-4 sm:mb-6">Please select your analysis type:</p>
                <div className="space-y-3 sm:space-y-4">
                  <Link href="/setup?path=startup" className="block">
                    <button type="button" className="letterpress-btn w-full text-sm sm:text-base py-3 sm:py-4">
                      New Startup Analysis
                    </button>
                  </Link>
                  <Link href="/setup?path=business" className="block">
                    <button type="button" className="letterpress-btn w-full text-sm sm:text-base py-3 sm:py-4">
                      New Business Analysis
                    </button>
                  </Link>
                </div>
              </div>
            )}
            
            {(isStartup || isBusiness) && (
              <div className="text-center">
                <motion.button
                  type="submit"
                  className="letterpress-btn text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
                  whileHover={{ x: 2, y: 2 }}
                  transition={{ duration: 0.1 }}
                  disabled={!input.trim()}
                >
                  Find Competitors
                </motion.button>
              </div>
            )}
          </form>
        </div>
      </motion.div>
    </main>
  );
}

export default function Setup() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f8f5f0]">
        <Navigation />
        <Suspense fallback={
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
            <div className="max-w-2xl mx-auto">
              <div className="newspaper-border p-6 sm:p-8 lg:p-12">
                <div className="text-center">
                  <div className="animate-pulse">
                    <div className="h-6 sm:h-8 bg-gray-300 rounded mb-3 sm:mb-4"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded mb-6 sm:mb-8"></div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        }>
          <SetupContent />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}