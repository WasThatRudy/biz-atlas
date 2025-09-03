'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { mockReports } from '@/lib/mock-data';
import { ProtectedRoute } from '@/components/auth/protected-route';

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
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f8f5f0]">
        <Navigation />
        
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          <motion.header variants={itemVariants} className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold mb-4 sm:mb-6">
              My Archives
            </h1>
            <p className="font-lora text-base sm:text-lg text-[#666] mb-6 sm:mb-8">
              Your collection of competitive intelligence reports from The BizAtlas Chronicle
            </p>
            
            <Link href="/setup?path=startup">
              <motion.button
                className="letterpress-btn text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
                whileHover={{ x: 2, y: 2 }}
                transition={{ duration: 0.1 }}
              >
                <span className="hidden sm:inline">Commission New Report</span>
                <span className="sm:hidden">New Report</span>
              </motion.button>
            </Link>
          </motion.header>

          <div className="newspaper-divider mb-6 sm:mb-8"></div>

          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {mockReports.map((report) => (
              <motion.div
                key={report.id}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Link href={`/report/${report.id}`}>
                  <div className="newspaper-border p-4 sm:p-6 h-full hover:shadow-sm transition-shadow cursor-pointer">
                    <div className="text-center mb-3 sm:mb-4">
                      <div className="text-xs font-lora tracking-wider text-[#888] mb-2">
                        ISSUE #{report.id.split('-')[2]}
                      </div>
                      <h3 className="text-lg sm:text-xl font-playfair font-bold mb-2 sm:mb-3 leading-tight">
                        {report.projectName}
                      </h3>
                    </div>
                    
                    <div className="newspaper-divider"></div>
                    
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between text-xs sm:text-sm font-lora">
                        <span className="text-[#666]">Published:</span>
                        <span className="text-right">{new Date(report.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}</span>
                      </div>
                      
                      <div className="flex justify-between text-xs sm:text-sm font-lora">
                        <span className="text-[#666]">Competitors:</span>
                        <span>{report.competitors}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[#1a1a1a]">
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
              className="text-center py-12 sm:py-16"
            >
              <div className="newspaper-border p-6 sm:p-8 lg:p-12 max-w-md mx-auto">
                <h3 className="text-xl sm:text-2xl font-playfair font-bold mb-3 sm:mb-4">
                  No Reports Published
                </h3>
                <p className="font-lora text-sm sm:text-base text-[#666] mb-4 sm:mb-6">
                  Your archive is currently empty. Commission your first competitive intelligence report.
                </p>
                <Link href="/setup?path=startup">
                  <button className="letterpress-btn text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">
                    Start First Analysis
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
    </ProtectedRoute>
  );
}