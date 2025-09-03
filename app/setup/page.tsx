'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navigation } from '@/components/navigation';

export default function Setup() {
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
    <div className="min-h-screen bg-[#f8f5f0]">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <div className="newspaper-border p-12">
            <h1 className="text-4xl font-playfair font-bold text-center mb-8">
              {isStartup ? 'New Venture Intelligence' : isBusiness ? 'Business Analysis' : 'Project Setup'}
            </h1>
            
            <div className="newspaper-divider"></div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {isStartup && (
                <>
                  <div>
                    <label className="block text-lg font-lora font-medium mb-3">
                      Describe Your Startup Idea
                    </label>
                    <p className="text-sm font-lora text-[#666] mb-4">
                      Provide details about your business concept, target market, and key value propositions.
                    </p>
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter your startup idea..."
                      className="w-full h-32 p-4 border border-[#1a1a1a] bg-[#f8f5f0] font-lora resize-none focus:outline-none focus:ring-1 focus:ring-[#8b5a2b]"
                      required
                    />
                  </div>
                </>
              )}
              
              {isBusiness && (
                <>
                  <div>
                    <label className="block text-lg font-lora font-medium mb-3">
                      Company Website URL
                    </label>
                    <p className="text-sm font-lora text-[#666] mb-4">
                      Enter your company's website to analyze your existing business position.
                    </p>
                    <input
                      type="url"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="https://your-company.com"
                      className="w-full p-4 border border-[#1a1a1a] bg-[#f8f5f0] font-lora focus:outline-none focus:ring-1 focus:ring-[#8b5a2b]"
                      required
                    />
                  </div>
                </>
              )}
              
              {!isStartup && !isBusiness && (
                <div className="text-center">
                  <p className="font-lora text-lg mb-6">Please select your analysis type:</p>
                  <div className="space-y-4">
                    <Link href="/setup?path=startup" className="block">
                      <button type="button" className="letterpress-btn w-full">
                        New Startup Analysis
                      </button>
                    </Link>
                    <Link href="/setup?path=business" className="block">
                      <button type="button" className="letterpress-btn w-full">
                        Existing Business Analysis
                      </button>
                    </Link>
                  </div>
                </div>
              )}
              
              {(isStartup || isBusiness) && (
                <div className="text-center">
                  <motion.button
                    type="submit"
                    className="letterpress-btn text-lg px-8"
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
    </div>
  );
}