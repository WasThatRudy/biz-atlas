'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useAuth } from '@/lib/auth-context';

interface Competitor {
  _id: string;
  name: string;
  url: string;
  shortDescription: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface CompetitorsData {
  totalCompetitors: number;
  competitors: Competitor[];
}

export default function Competitors() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getAuthHeader } = useAuth();
  
  const path = searchParams.get('path');
  const isStartup = path === 'startup';

  useEffect(() => {
    // Load competitors data from localStorage
    const competitorsData = localStorage.getItem('competitors_data');
    if (competitorsData) {
      try {
        const data: CompetitorsData = JSON.parse(competitorsData);
        const competitorsList = data.competitors || [];
        setCompetitors(competitorsList);
        // Select all competitors by default
        setSelectedIds(competitorsList.map(comp => comp._id));
      } catch (err) {
        console.error('Error parsing competitors data:', err);
        setError('Failed to load competitors data. Please try again.');
      }
    } else {
      setError('No competitors data found. Please start over.');
    }
    setIsLoading(false);
  }, []);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleAnalyze = async () => {
    if (selectedIds.length === 0) return;

    try {
      // Get rejected competitors (those not selected)
      const rejectedCompetitors = competitors
        .filter(comp => !selectedIds.includes(comp._id))
        .map(comp => ({ _id: comp._id }));

      // Call step-2 API to mark rejected competitors
      if (rejectedCompetitors.length > 0) {
        const response = await fetch('/api/company/get-competitors-step-2', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          body: JSON.stringify({
            rejectedCompetitors: rejectedCompetitors
          }),
        });

        if (!response.ok) {
          console.error('Failed to update rejected competitors');
        }
      }

      // Proceed to analysis based on path
      if (isStartup) {
        // New Business Venture - use launchpad analysis
        router.push('/dashboard-b');
      } else {
        // Existing Business - use competitive intelligence
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error updating competitors:', error);
      // Still proceed to analysis even if step-2 fails
      if (isStartup) {
        router.push('/dashboard-b');
      } else {
        router.push('/dashboard');
      }
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#f8f5f0]">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto text-center">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-8"></div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="newspaper-border p-6">
                      <div className="h-6 bg-gray-300 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#f8f5f0]">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto text-center">
              <div className="newspaper-border p-8">
                <h1 className="text-2xl font-playfair font-bold mb-4 text-red-600">
                  Error Loading Competitors
                </h1>
                <p className="font-lora text-lg text-[#666] mb-6">
                  {error}
                </p>
                <button
                  onClick={() => router.push('/setup')}
                  className="letterpress-btn"
                >
                  Start Over
                </button>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

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
              Review Your Competitors
            </h1>
            <p className="font-lora text-lg text-[#666]">
              All competitors are selected by default. Remove any you don't want to include in your analysis.
            </p>
            <p className="font-lora text-sm text-[#888] mt-2">
              Found {competitors.length} competitors • {selectedIds.length} selected
            </p>
          </header>

          <div className="newspaper-divider mb-8"></div>

          <AnimatePresence mode="popLayout">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {competitors.map((competitor) => (
                <motion.div
                  key={competitor._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, x: -100 }}
                  transition={{ duration: 0.2 }}
                  className={`newspaper-border p-6 cursor-pointer transition-all hover:shadow-sm ${
                    selectedIds.includes(competitor._id) ? 'bg-[#eee8dd]' : ''
                  }`}
                  onClick={() => toggleSelection(competitor._id)}
                >
                  <div className="mb-3">
                    <h3 className="font-playfair font-bold text-lg leading-tight">
                      {competitor.name}
                    </h3>
                  </div>
                  <p className="font-lora text-sm text-[#666] leading-relaxed mb-3">
                    {competitor.shortDescription}
                  </p>
                  
                  {competitor.url && (
                    <div className="mb-3">
                      <a
                        href={competitor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="font-lora text-xs text-[#8b5a2b] hover:underline"
                      >
                        {competitor.url}
                      </a>
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-xs font-lora text-[#888]">
                      MARKET PARTICIPANT
                    </div>
                    <div className={`w-4 h-4 border border-[#1a1a1a] ${
                      selectedIds.includes(competitor._id) ? 'bg-[#1a1a1a]' : ''
                    }`}></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

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
                {selectedIds.length === 0 ? 'Select Competitors to Continue' : `Analyze ${selectedIds.length} Competitor${selectedIds.length !== 1 ? 's' : ''}`}
              </motion.button>
            </div>
          )}
        </motion.div>
      </main>
    </div>
    </ProtectedRoute>
  );
}