'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { ProtectedRoute } from '@/components/auth/protected-route';

const mockCompetitors = [
  { id: 1, name: 'TechCorp Solutions', description: 'Enterprise software and cloud services' },
  { id: 2, name: 'InnovateLab', description: 'AI-powered business automation' },
  { id: 3, name: 'MarketLeader Inc', description: 'Industry-leading SaaS platform' },
  { id: 4, name: 'CompetitorX', description: 'Digital transformation consultancy' },
  { id: 5, name: 'RivalCorp', description: 'B2B marketplace solutions' },
  { id: 6, name: 'AlternativeData Co', description: 'Data analytics and insights' },
];

export default function Competitors() {
  const [competitors, setCompetitors] = useState(mockCompetitors);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const router = useRouter();

  const removeCompetitor = (id: number) => {
    setCompetitors(prev => prev.filter(comp => comp.id !== id));
    setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
  };

  const toggleSelection = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleAnalyze = () => {
    if (selectedIds.length > 0) {
      router.push('/analysis');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f8f5f0]">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-6xl mx-auto"
        >
          <header className="text-center mb-12">
            <h1 className="text-4xl font-playfair font-bold mb-4">
              Select Your Competitors
            </h1>
            <p className="font-lora text-lg text-[#666]">
              Choose companies to include in your competitive analysis report
            </p>
          </header>

          <div className="newspaper-divider mb-8"></div>

          <AnimatePresence mode="popLayout">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {competitors.map((competitor) => (
                <motion.div
                  key={competitor.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, x: -100 }}
                  transition={{ duration: 0.2 }}
                  className={`newspaper-border p-6 cursor-pointer transition-all hover:shadow-sm ${
                    selectedIds.includes(competitor.id) ? 'bg-[#eee8dd]' : ''
                  }`}
                  onClick={() => toggleSelection(competitor.id)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-playfair font-bold text-lg leading-tight">
                      {competitor.name}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCompetitor(competitor.id);
                      }}
                      className="text-[#8b5a2b] hover:text-[#1a1a1a] transition-colors text-sm"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="font-lora text-sm text-[#666] leading-relaxed">
                    {competitor.description}
                  </p>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-xs font-lora text-[#888]">
                      MARKET PARTICIPANT
                    </div>
                    <div className={`w-4 h-4 border border-[#1a1a1a] ${
                      selectedIds.includes(competitor.id) ? 'bg-[#1a1a1a]' : ''
                    }`}></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          {competitors.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="font-lora text-lg text-[#666] mb-4">
                All competitors have been removed from consideration.
              </p>
              <button
                onClick={() => setCompetitors(mockCompetitors)}
                className="letterpress-btn"
              >
                Restore Competitors
              </button>
            </motion.div>
          )}

          {competitors.length > 0 && (
            <div className="text-center">
              <div className="mb-4">
                <p className="font-lora text-sm text-[#666]">
                  {selectedIds.length} competitor{selectedIds.length !== 1 ? 's' : ''} selected
                </p>
              </div>
              <motion.button
                onClick={handleAnalyze}
                className="letterpress-btn text-lg px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedIds.length === 0}
                whileHover={selectedIds.length > 0 ? { x: 2, y: 2 } : {}}
                transition={{ duration: 0.1 }}
              >
                Analyze & Build My Report
              </motion.button>
            </div>
          )}
        </motion.div>
      </main>
    </div>
    </ProtectedRoute>
  );
}