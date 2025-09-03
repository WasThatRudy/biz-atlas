'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { ProtectedRoute } from '@/components/auth/protected-route';

interface ReportViewProps {
  reportId: string;
}

export function ReportView({ reportId }: ReportViewProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f8f5f0]">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Newspaper Header */}
          <header className="newspaper-border p-8 mb-8">
            <div className="text-center border-b-2 border-[#1a1a1a] pb-6 mb-6">
              <h1 className="text-5xl font-playfair font-black tracking-tight mb-2">
                THE BIZATLAS CHRONICLE
              </h1>
              <div className="text-sm tracking-wider text-[#666] mb-4">
                COMPETITIVE INTELLIGENCE • SPECIAL EDITION • {currentDate.toUpperCase()}
              </div>
            </div>
            
            <div className="text-center">
              <h2 className="text-3xl font-playfair font-bold mb-4">
                MARKET ANALYSIS COMPLETE
              </h2>
              <p className="font-lora text-lg text-[#666]">
                Comprehensive Competitive Intelligence Report • Project: Tech Startup Analysis
              </p>
            </div>
          </header>

          {/* Report Content */}
          <div className="newspaper-border p-8">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Left Column */}
              <div>
                <article className="mb-8">
                  <h3 className="text-2xl font-playfair font-bold mb-4 border-b border-[#1a1a1a] pb-2">
                    EXECUTIVE SUMMARY
                  </h3>
                  <p className="font-lora leading-relaxed mb-4">
                    Our intelligence gathering operation has successfully mapped the competitive terrain 
                    for your venture. The market shows significant opportunity with established players 
                    maintaining traditional approaches.
                  </p>
                  <p className="font-lora leading-relaxed">
                    Key strategic advantages have been identified, along with potential market entry 
                    points that could provide competitive differentiation.
                  </p>
                </article>

                <article className="mb-8">
                  <h3 className="text-2xl font-playfair font-bold mb-4 border-b border-[#1a1a1a] pb-2">
                    MARKET LANDSCAPE
                  </h3>
                  <div className="space-y-4">
                    <div className="newspaper-border p-4">
                      <h4 className="font-playfair font-bold mb-2">Primary Competitors</h4>
                      <ul className="font-lora text-sm space-y-1">
                        <li>• TechCorp Solutions - Enterprise focus, legacy systems</li>
                        <li>• InnovateLab - AI automation, high-end market</li>
                        <li>• MarketLeader Inc - Established SaaS platform</li>
                      </ul>
                    </div>
                  </div>
                </article>
              </div>

              {/* Right Column */}
              <div>
                <article className="mb-8">
                  <h3 className="text-2xl font-playfair font-bold mb-4 border-b border-[#1a1a1a] pb-2">
                    STRATEGIC OPPORTUNITIES
                  </h3>
                  <div className="space-y-4">
                    <div className="newspaper-border p-4">
                      <h4 className="font-playfair font-bold mb-2 text-[#8b5a2b]">Market Gap Identified</h4>
                      <p className="font-lora text-sm leading-relaxed">
                        Analysis reveals underserved small-to-medium business segment with 
                        demand for accessible, modern solutions.
                      </p>
                    </div>
                    
                    <div className="newspaper-border p-4">
                      <h4 className="font-playfair font-bold mb-2 text-[#8b5a2b]">Pricing Advantage</h4>
                      <p className="font-lora text-sm leading-relaxed">
                        Current market pricing shows opportunity for disruptive pricing model 
                        targeting cost-conscious enterprises.
                      </p>
                    </div>
                  </div>
                </article>

                <article>
                  <h3 className="text-2xl font-playfair font-bold mb-4 border-b border-[#1a1a1a] pb-2">
                    RECOMMENDED ACTIONS
                  </h3>
                  <ol className="font-lora space-y-3">
                    <li className="flex gap-3">
                      <span className="font-bold">1.</span>
                      <span>Focus on small business market segment initially</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold">2.</span>
                      <span>Emphasize user experience and simplicity</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold">3.</span>
                      <span>Consider freemium pricing model for market penetration</span>
                    </li>
                  </ol>
                </article>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/dashboard">
              <motion.button
                className="letterpress-btn text-lg px-8 mr-4"
                whileHover={{ x: 2, y: 2 }}
                transition={{ duration: 0.1 }}
              >
                Return to Archives
              </motion.button>
            </Link>
            <button
              onClick={() => window.print()}
              className="letterpress-btn text-lg px-8"
            >
              Print Report
            </button>
          </div>
        </motion.div>
      </main>
    </div>
    </ProtectedRoute>
  );
}