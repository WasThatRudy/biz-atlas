'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { CompassIcon } from '@/components/icons/compass';
import { MapIcon } from '@/components/icons/map';
import { QuillIcon } from '@/components/icons/quill';
import { TelescopeIcon } from '@/components/icons/telescope';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <Navigation />
      
      <motion.main 
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Newspaper Masthead */}
        <motion.header variants={itemVariants} className="text-center mb-8 sm:mb-12 border-b-2 border-[#1a1a1a] pb-6 sm:pb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-playfair font-black mb-2 tracking-tight">
            THE BIZATLAS CHRONICLE
          </h1>
          <p className="text-xs sm:text-sm tracking-wider text-[#666] mb-4">
            EST. 2025 • VOL. 1 • COMPETITIVE INTELLIGENCE WEEKLY
          </p>
        </motion.header>

        {/* Hero Section - Newspaper Classified Ads Style */}
        <motion.section variants={itemVariants} className="mb-12 sm:mb-16 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto relative">
            {/* Startup Analysis - Classified Ad Style */}
            <div className="relative">
              <Link href="/setup?path=startup">
                <motion.div 
                  className="newspaper-border p-6 sm:p-8 h-56 sm:h-64 bg-[#f8f5f0] hover:bg-[#f0ede8] transition-colors cursor-pointer relative z-10"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-center border-b-2 border-[#1a1a1a] pb-3 sm:pb-4 mb-3 sm:mb-4">
                    <h3 className="text-xs sm:text-sm font-lora tracking-widest text-[#666] uppercase">
                      New Business Ventures
                    </h3>
                  </div>
                  
                  <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-playfair font-black mb-3 sm:mb-4 leading-tight">
                      LAUNCH A NEW<br />VENTURE
                    </h2>
                    <p className="font-lora text-xs sm:text-sm text-[#666] leading-relaxed">
                      Professional market analysis for startup ideas. Get competitive intelligence before you launch.
                    </p>
                  </div>
                </motion.div>
              </Link>
              

            </div>

            {/* Business Analysis - Classified Ad Style */}
            <div className="relative">
              <Link href="/setup?path=business">
                <motion.div 
                  className="newspaper-border p-6 sm:p-8 h-56 sm:h-64 bg-[#f8f5f0] hover:bg-[#f0ede8] transition-colors cursor-pointer relative z-10"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-center border-b-2 border-[#1a1a1a] pb-3 sm:pb-4 mb-3 sm:mb-4">
                    <h3 className="text-xs sm:text-sm font-lora tracking-widest text-[#666] uppercase">
                      Established Companies
                    </h3>
                  </div>
                  
                  <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-playfair font-black mb-3 sm:mb-4 leading-tight">
                      ANALYZE EXISTING<br />BUSINESS
                    </h2>
                    <p className="font-lora text-xs sm:text-sm text-[#666] leading-relaxed">
                      Comprehensive competitive analysis for established businesses seeking market insights.
                    </p>
                  </div>
                </motion.div>
              </Link>
              

            </div>
          </div>
          
          {/* Central encouraging text - Desktop */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:block">
            <div className="bg-[#f8f5f0] px-4 py-2 border border-dashed border-[#8b5a2b] transform rotate-3 shadow-sm">
              <span className="font-lora text-sm text-[#8b5a2b] font-medium">← Click to start →</span>
            </div>
          </div>
          
          {/* Mobile encouraging text */}
          <div className="text-center mt-6 lg:hidden">
            <div className="inline-block bg-[#f8f5f0] px-4 py-2 border border-dashed border-[#8b5a2b] transform rotate-1 shadow-sm">
              <span className="font-lora text-sm text-[#8b5a2b] font-medium">← Choose one to start →</span>
            </div>
          </div>
        </motion.section>

        <div className="newspaper-divider"></div>

        {/* Features Section - Our Intelligence Desk */}
        <motion.section variants={itemVariants} className="mb-12 sm:mb-16">
          <h3 className="text-2xl sm:text-3xl font-playfair font-bold text-center mb-8 sm:mb-12">
            Our Intelligence Desk
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0">
            <article className="newspaper-column">
              <div className="flex items-center gap-3 mb-4">
                <TelescopeIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                <h4 className="text-lg sm:text-xl font-playfair font-bold">Deep Market Insights</h4>
              </div>
              <p className="font-lora text-sm sm:text-base leading-relaxed">
                Uncover strategic competitor positions with thoroughness of investigative journalism.
              </p>
            </article>
            
            <article className="newspaper-column">
              <div className="flex items-center gap-3 mb-4">
                <QuillIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                <h4 className="text-lg sm:text-xl font-playfair font-bold">Strategy Deconstructed</h4>
              </div>
              <p className="font-lora text-sm sm:text-base leading-relaxed">
                Transform complex competitive landscapes into clear, actionable intelligence.
              </p>
            </article>
            
            <article className="newspaper-column">
              <div className="flex items-center gap-3 mb-4">
                <MapIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                <h4 className="text-lg sm:text-xl font-playfair font-bold">Market Cartography</h4>
              </div>
              <p className="font-lora text-sm sm:text-base leading-relaxed">
                Navigate competitive terrain with expertly crafted market maps.
              </p>
            </article>
          </div>
        </motion.section>

        <div className="newspaper-divider"></div>

        {/* How It Works - Public Notice Style */}
        <motion.section variants={itemVariants} className="mb-12 sm:mb-16">
          <div className="max-w-2xl mx-auto newspaper-border p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-playfair font-bold text-center mb-6 sm:mb-8">
              PUBLIC NOTICE: Our Process
            </h3>
            <ol className="space-y-3 sm:space-y-4 font-lora text-sm sm:text-base">
              <li className="flex gap-3 sm:gap-4">
                <span className="font-bold text-lg sm:text-xl flex-shrink-0">1.</span>
                <span><strong>Submit Your Idea</strong> - Share your business concept or existing company details</span>
              </li>
              <li className="flex gap-3 sm:gap-4">
                <span className="font-bold text-lg sm:text-xl flex-shrink-0">2.</span>
                <span><strong>Select Competitors</strong> - Choose from our curated list of market participants</span>
              </li>
              <li className="flex gap-3 sm:gap-4">
                <span className="font-bold text-lg sm:text-xl flex-shrink-0">3.</span>
                <span><strong>Receive Your Chronicle</strong> - Get your personalized competitive intelligence report</span>
              </li>
            </ol>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer variants={itemVariants} className="border-t-2 border-[#1a1a1a] pt-6 sm:pt-8 mt-12 sm:mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="newspaper-column">
              <h5 className="font-playfair font-bold mb-3 sm:mb-4 text-base sm:text-lg">Intelligence Services</h5>
              <ul className="space-y-2 font-lora text-sm sm:text-base">
                <li><Link href="/setup?path=startup" className="hover:text-[#8b5a2b]">Startup Analysis</Link></li>
                <li><Link href="/setup?path=business" className="hover:text-[#8b5a2b]">Business Intelligence</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#8b5a2b]">Report Archives</Link></li>
              </ul>
            </div>
            
            <div className="newspaper-column">
              <h5 className="font-playfair font-bold mb-3 sm:mb-4 text-base sm:text-lg">Editorial Office</h5>
              <ul className="space-y-2 font-lora text-sm sm:text-base">
                <li>About The Chronicle</li>
                <li>Our Methodology</li>
                <li>Contact Editors</li>
              </ul>
            </div>
            
            <div className="newspaper-column">
              <h5 className="font-playfair font-bold mb-3 sm:mb-4 text-base sm:text-lg">Subscription</h5>
              <p className="font-lora text-sm leading-relaxed">
                Stay informed with competitive intelligence from The BizAtlas Chronicle.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-6 sm:mt-8 pt-4 border-t border-[#1a1a1a]">
            <p className="font-lora text-xs sm:text-sm">© 2025 The BizAtlas Chronicle. All rights reserved.</p>
          </div>
        </motion.footer>
      </motion.main>
    </div>
  );
}