'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { mockReports } from '@/lib/mock-data';

export default function Dashboard() {
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
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          <motion.header variants={itemVariants} className="text-center mb-12">
            <h1 className="text-5xl font-playfair font-bold mb-6">
              My Archives
            </h1>
            <p className="font-lora text-lg text-[#666] mb-8">
              Your collection of competitive intelligence reports from The BizAtlas Chronicle
            </p>
            
            <Link href="/setup?path=startup">
              <motion.button
                className="letterpress-btn text-lg px-8"
                whileHover={{ x: 2, y: 2 }}
                transition={{ duration: 0.1 }}
              >
                Commission New Report
              </motion.button>
            </Link>
          </motion.header>

          <div className="newspaper-divider mb-8"></div>

          <motion.div 
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {mockReports.map((report) => (
              <motion.div
                key={report.id}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Link href={`/report/${report.id}`}>
                  <div className="newspaper-border p-6 h-full hover:shadow-sm transition-shadow cursor-pointer">
                    <div className="text-center mb-4">
                      <div className="text-xs font-lora tracking-wider text-[#888] mb-2">
                        ISSUE #{report.id.split('-')[2]}
                      </div>
                      <h3 className="text-xl font-playfair font-bold mb-3 leading-tight">
                        {report.projectName}
                      </h3>
                    </div>
                    
                    <div className="newspaper-divider"></div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm font-lora">
                        <span className="text-[#666]">Published:</span>
                        <span>{new Date(report.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm font-lora">
                        <span className="text-[#666]">Competitors Analyzed:</span>
                        <span>{report.competitors}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-[#1a1a1a]">
                      <p className="text-xs font-lora text-center text-[#888] tracking-wide">
                        READ FULL REPORT →
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {mockReports.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center py-16"
            >
              <div className="newspaper-border p-12 max-w-md mx-auto">
                <h3 className="text-2xl font-playfair font-bold mb-4">
                  No Reports Published
                </h3>
                <p className="font-lora text-[#666] mb-6">
                  Your archive is currently empty. Commission your first competitive intelligence report.
                </p>
                <Link href="/setup?path=startup">
                  <button className="letterpress-btn">
                    Start First Analysis
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}