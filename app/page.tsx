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
        className="container mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Newspaper Masthead */}
        <motion.header variants={itemVariants} className="text-center mb-12 border-b-2 border-[#1a1a1a] pb-8">
          <h1 className="text-6xl font-playfair font-black mb-2 tracking-tight">
            THE BIZATLAS CHRONICLE
          </h1>
          <p className="text-sm tracking-wider text-[#666] mb-4">
            EST. 2025 • VOL. 1 • COMPETITIVE INTELLIGENCE WEEKLY
          </p>
          <div className="newspaper-divider"></div>
        </motion.header>

        {/* Hero Section - Front Page Headline */}
        <motion.section variants={itemVariants} className="text-center mb-16">
          <h2 className="text-5xl font-playfair font-bold mb-6 leading-tight">
            EXTRA! Chart Your Competitive<br />Landscape with Unprecedented Clarity
          </h2>
          <p className="text-xl font-lora mb-8 text-[#444] max-w-2xl mx-auto">
            Exclusive analysis reveals market secrets. Your business, our atlas.
          </p>
          
          <div className="flex justify-center mb-8">
            <CompassIcon className="w-32 h-32" />
          </div>
          
          <div className="flex gap-6 justify-center">
            <Link href="/setup?path=startup">
              <motion.button 
                className="letterpress-btn text-lg font-lora"
                whileHover={{ x: 2, y: 2 }}
                transition={{ duration: 0.1 }}
              >
                Launch a New Venture
              </motion.button>
            </Link>
            <Link href="/setup?path=business">
              <motion.button 
                className="letterpress-btn text-lg font-lora"
                whileHover={{ x: 2, y: 2 }}
                transition={{ duration: 0.1 }}
              >
                Analyze an Existing Business
              </motion.button>
            </Link>
          </div>
        </motion.section>

        <div className="newspaper-divider"></div>

        {/* Features Section - Our Intelligence Desk */}
        <motion.section variants={itemVariants} className="mb-16">
          <h3 className="text-3xl font-playfair font-bold text-center mb-12">
            Our Intelligence Desk
          </h3>
          
          <div className="grid md:grid-cols-3 gap-0">
            <article className="newspaper-column">
              <div className="flex items-center gap-3 mb-4">
                <TelescopeIcon className="w-8 h-8" />
                <h4 className="text-xl font-playfair font-bold">Deep Market Insights</h4>
              </div>
              <p className="font-lora leading-relaxed">
                Our correspondents delve deep into market territories, uncovering the strategic positions 
                of your competitors with the thoroughness of investigative journalism.
              </p>
            </article>
            
            <article className="newspaper-column">
              <div className="flex items-center gap-3 mb-4">
                <QuillIcon className="w-8 h-8" />
                <h4 className="text-xl font-playfair font-bold">Strategy Deconstructed</h4>
              </div>
              <p className="font-lora leading-relaxed">
                We break down complex competitive landscapes into clear, actionable intelligence, 
                delivered with the clarity and precision you expect from seasoned analysts.
              </p>
            </article>
            
            <article className="newspaper-column">
              <div className="flex items-center gap-3 mb-4">
                <MapIcon className="w-8 h-8" />
                <h4 className="text-xl font-playfair font-bold">Market Cartography</h4>
              </div>
              <p className="font-lora leading-relaxed">
                Navigate your competitive terrain with our expertly crafted market maps, 
                charting the opportunities and threats that define your business landscape.
              </p>
            </article>
          </div>
        </motion.section>

        <div className="newspaper-divider"></div>

        {/* How It Works - Public Notice Style */}
        <motion.section variants={itemVariants} className="mb-16">
          <div className="max-w-2xl mx-auto newspaper-border p-8">
            <h3 className="text-2xl font-playfair font-bold text-center mb-8">
              PUBLIC NOTICE: Our Process
            </h3>
            <ol className="space-y-4 font-lora">
              <li className="flex gap-4">
                <span className="font-bold text-xl">1.</span>
                <span><strong>Submit Your Idea</strong> - Share your business concept or existing company details</span>
              </li>
              <li className="flex gap-4">
                <span className="font-bold text-xl">2.</span>
                <span><strong>Select Competitors</strong> - Choose from our curated list of market participants</span>
              </li>
              <li className="flex gap-4">
                <span className="font-bold text-xl">3.</span>
                <span><strong>Receive Your Chronicle</strong> - Get your personalized competitive intelligence report</span>
              </li>
            </ol>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer variants={itemVariants} className="border-t-2 border-[#1a1a1a] pt-8 mt-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="newspaper-column">
              <h5 className="font-playfair font-bold mb-4">Intelligence Services</h5>
              <ul className="space-y-2 font-lora">
                <li><Link href="/setup?path=startup" className="hover:text-[#8b5a2b]">Startup Analysis</Link></li>
                <li><Link href="/setup?path=business" className="hover:text-[#8b5a2b]">Business Intelligence</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#8b5a2b]">Report Archives</Link></li>
              </ul>
            </div>
            
            <div className="newspaper-column">
              <h5 className="font-playfair font-bold mb-4">Editorial Office</h5>
              <ul className="space-y-2 font-lora">
                <li>About The Chronicle</li>
                <li>Our Methodology</li>
                <li>Contact Editors</li>
              </ul>
            </div>
            
            <div className="newspaper-column">
              <h5 className="font-playfair font-bold mb-4">Subscription</h5>
              <p className="font-lora text-sm leading-relaxed">
                Stay informed with the latest competitive intelligence and market analysis 
                from The BizAtlas Chronicle editorial team.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8 pt-4 border-t border-[#1a1a1a]">
            <p className="font-lora text-sm">© 2025 The BizAtlas Chronicle. All rights reserved.</p>
          </div>
        </motion.footer>
      </motion.main>
    </div>
  );
}