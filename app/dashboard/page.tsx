'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { InteractiveNewspaperLoader } from '@/components/loader/NewspaperLoader';
import { useAuth } from '@/lib/auth-context';
import { useState, useEffect } from 'react';
import { 
  Search, 
  TrendingUp, 
  Megaphone, 
  DollarSign, 
  BarChart3, 
  Users 
} from 'lucide-react';

interface TaskStatus {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
  updatedAt: string;
  startedAt: string;
  result?: any;
}

interface CompleteStatusResponse {
  success: boolean;
  message: string;
  taskId?: string;
  status?: string;
  data?: any;
}

interface TaskStatusResponse {
  success: boolean;
  taskStatus: TaskStatus;
}

type ReportSection = 'competitorMonitoring' | 'growthOpportunities' | 'marketingEngine' | 'priceOptimization' | 'marketTrends' | 'targetPersonas';

const sectionTitles = {
  competitorMonitoring: 'Competitor Monitoring',
  growthOpportunities: 'Growth Opportunities', 
  marketingEngine: 'Marketing Engine',
  priceOptimization: 'Price Optimization',
  marketTrends: 'Market Trends',
  targetPersonas: 'Target Personas'
};

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);
  const [taskStatus, setTaskStatus] = useState<TaskStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const { getAuthHeader } = useAuth();

  const sections: ReportSection[] = ['competitorMonitoring', 'growthOpportunities', 'marketingEngine', 'priceOptimization', 'marketTrends', 'targetPersonas'];
  
  const sectionIcons = {
    competitorMonitoring: Search,
    growthOpportunities: TrendingUp,
    marketingEngine: Megaphone,
    priceOptimization: DollarSign,
    marketTrends: BarChart3,
    targetPersonas: Users
  };

  const [hoveredPage, setHoveredPage] = useState<number | null>(null);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    fetchReportData();
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        prevPage();
      } else if (event.key === 'ArrowRight') {
        nextPage();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage]);

  const fetchReportData = async () => {
    try {
      const response = await fetch('/api/complete-status', {
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }

      const data: CompleteStatusResponse = await response.json();

      if (data.success) {
        if (data.data) {
          // Data is already available (cached)
          setReportData(data.data);
          setIsLoading(false);
        } else if (data.taskId) {
          // Need to poll for task status
          pollTaskStatus(data.taskId);
        }
      } else {
        throw new Error(data.message || 'Failed to get report data');
      }
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  const pollTaskStatus = async (taskId: string) => {
    const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:4000';
    
    const poll = async () => {
      try {
        const response = await fetch(`${BACKEND_BASE_URL}/growth/task-status/${taskId}`, {
          headers: getAuthHeader(),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch task status');
        }

        const data: TaskStatusResponse = await response.json();

        if (data.success) {
          setTaskStatus(data.taskStatus);

          if (data.taskStatus.status === 'completed' && data.taskStatus.result) {
            setReportData(data.taskStatus.result.data);
            setIsLoading(false);
          } else if (data.taskStatus.status === 'failed') {
            throw new Error('Task failed to complete');
          } else {
            // Continue polling
            setTimeout(poll, 2000);
          }
        } else {
          throw new Error('Failed to get task status');
        }
      } catch (err) {
        console.error('Error polling task status:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsLoading(false);
      }
    };

    poll();
  };

  const renderCompetitorMonitoring = () => (
    <div className="space-y-8">
      <article>
        <h3 className="text-3xl font-playfair font-bold mb-6 border-b-2 border-[#1a1a1a] pb-3">
          COMPETITOR MONITORING
        </h3>
        
        <div className="newspaper-border p-6 mb-6">
          <h4 className="text-2xl font-playfair font-bold mb-4 text-[#8b5a2b]">
            {reportData.competitorMonitoring?.growth_headline || 'Market Intelligence Report'}
          </h4>
          <p className="font-lora leading-relaxed text-lg">
            {reportData.competitorMonitoring?.opportunity_analysis || 'Analysis in progress...'}
          </p>
        </div>

        <div className="space-y-6">
          <div className="newspaper-border p-6">
            <h4 className="text-xl font-playfair font-bold mb-4">Feature Request Leaderboard</h4>
            <div className="space-y-4">
              {reportData.competitorMonitoring?.feature_request_leaderboard?.map((feature: any, index: number) => (
                <div key={index} className="border-l-4 border-[#8b5a2b] pl-4 py-3">
                  <h5 className="font-playfair font-bold text-[#8b5a2b] mb-2">{feature.feature_idea}</h5>
                  <p className="font-lora text-sm text-[#666] mb-2">Request Frequency: {feature.request_frequency}</p>
                  <p className="font-lora text-sm leading-relaxed">{feature.justification}</p>
                </div>
              )) || (
                <p className="font-lora text-sm text-[#666]">No feature requests data available</p>
              )}
            </div>
          </div>

          {reportData.competitorAnalysis && reportData.competitorAnalysis.length > 0 && (
            <div className="newspaper-border p-6">
              <h4 className="text-xl font-playfair font-bold mb-4">Competitor Analysis</h4>
              <div className="space-y-4">
                {reportData.competitorAnalysis.map((competitor: any, index: number) => (
                  <div key={index} className="border-b border-[#e9e4d9] pb-4 last:border-b-0">
                    <h5 className="font-playfair font-bold text-lg mb-2">{competitor.company_name}</h5>
                    <p className="font-lora text-sm text-[#666] mb-3 leading-relaxed">{competitor.core_product_summary}</p>
                    <div className="text-xs font-lora text-[#888]">
                      <strong>Main Weakness:</strong> {competitor.main_weakness}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );

  const renderGrowthOpportunities = () => (
    <div className="space-y-8">
      <article>
        <h3 className="text-3xl font-playfair font-bold mb-6 border-b-2 border-[#1a1a1a] pb-3">
          GROWTH OPPORTUNITIES
        </h3>
        
        <div className="newspaper-border p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-2xl font-playfair font-bold">Growth Score</h4>
            <span className="text-3xl font-bold text-[#8b5a2b]">
              {reportData.growthOpportunities?.growth_score || 'N/A'}
            </span>
          </div>
          <p className="font-lora text-lg">
            {reportData.growthOpportunities?.market_positioning_recommendation || 'Analysis in progress...'}
          </p>
        </div>

        <div className="space-y-6">
          <div className="newspaper-border p-6">
            <h4 className="text-xl font-playfair font-bold mb-4">Top Opportunities</h4>
            <div className="space-y-4">
              {reportData.growthOpportunities?.top_opportunities?.map((opportunity: any, index: number) => (
                <div key={index} className="border-l-4 border-[#8b5a2b] pl-4 py-3">
                  <h5 className="font-playfair font-bold text-[#8b5a2b] mb-2">{opportunity.opportunity_name}</h5>
                  <div className="font-lora text-sm space-y-2">
                    <p><strong>Market Demand:</strong> {opportunity.market_demand}</p>
                    <p><strong>Competitor Gap:</strong> {opportunity.competitor_gap}</p>
                    <p><strong>Implementation Effort:</strong> {opportunity.implementation_effort}</p>
                    <p><strong>Revenue Potential:</strong> {opportunity.revenue_potential}</p>
                  </div>
                </div>
              )) || (
                <p className="font-lora text-sm text-[#666]">No opportunities data available</p>
              )}
            </div>
          </div>

          <div className="newspaper-border p-6">
            <h4 className="text-xl font-playfair font-bold mb-4">Next Quarter Focus</h4>
            <div className="bg-[#f0f0f0] p-4 rounded">
              <h5 className="font-playfair font-bold text-lg mb-2">
                {reportData.growthOpportunities?.next_quarter_focus || 'Focus Area TBD'}
              </h5>
              <p className="font-lora text-sm leading-relaxed">
                This will be the primary strategic focus for the upcoming quarter, 
                based on market analysis and competitive positioning.
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );

  const renderMarketingEngine = () => (
    <div className="space-y-8">
      <article>
        <h3 className="text-3xl font-playfair font-bold mb-6 border-b-2 border-[#1a1a1a] pb-3">
          MARKETING ENGINE
        </h3>
        
        <div className="newspaper-border p-6 mb-6">
          <h4 className="text-2xl font-playfair font-bold mb-4">Content Strategy Overview</h4>
          <p className="font-lora leading-relaxed text-lg">
            {reportData.marketingEngine?.content_strategy_overview || 'Content strategy analysis in progress...'}
          </p>
        </div>

        <div className="space-y-6">
          <div className="newspaper-border p-6">
            <h4 className="text-xl font-playfair font-bold mb-4">Content Ideas</h4>
            <div className="space-y-4">
              {reportData.marketingEngine?.content_ideas?.map((content: any, index: number) => (
                <div key={index} className="border-l-4 border-[#8b5a2b] pl-4 py-3">
                  <h5 className="font-playfair font-bold text-[#8b5a2b] mb-2">{content.title}</h5>
                  <p className="font-lora text-sm text-[#666] mb-2">Format: {content.format}</p>
                  <p className="font-lora text-sm mb-2 leading-relaxed">{content.angle}</p>
                  <div className="text-xs font-lora text-[#888]">
                    Expected Engagement: {content.expected_engagement}
                  </div>
                </div>
              )) || (
                <p className="font-lora text-sm text-[#666]">No content ideas available</p>
              )}
            </div>
          </div>

          <div className="newspaper-border p-6">
            <h4 className="text-xl font-playfair font-bold mb-4">Viral Content Opportunity</h4>
            <div className="bg-[#f0f0f0] p-4 rounded mb-4">
              <p className="font-lora text-sm leading-relaxed">
                {reportData.marketingEngine?.viral_content_opportunity || 'Viral content analysis in progress...'}
              </p>
            </div>
            
            <h5 className="font-playfair font-bold mb-2">Trending Hashtags</h5>
            <div className="flex flex-wrap gap-2">
              {reportData.marketingEngine?.trending_hashtags?.map((hashtag: string, index: number) => (
                <span key={index} className="bg-[#1a1a1a] text-[#f8f5f0] px-2 py-1 text-xs font-lora">
                  {hashtag}
                </span>
              )) || (
                <span className="font-lora text-sm text-[#666]">No hashtags available</span>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );

  const renderPriceOptimization = () => (
    <div className="space-y-8">
      <article>
        <h3 className="text-3xl font-playfair font-bold mb-6 border-b-2 border-[#1a1a1a] pb-3">
          PRICE OPTIMIZATION
        </h3>
        
        <div className="newspaper-border p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-2xl font-playfair font-bold">Pricing Health Score</h4>
            <span className="text-3xl font-bold text-[#8b5a2b]">
              {reportData.priceOptimization?.pricing_health_score || 'N/A'}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="newspaper-border p-6">
            <h4 className="text-xl font-playfair font-bold mb-4">Optimization Recommendations</h4>
            <div className="space-y-4">
              {reportData.priceOptimization?.optimization_recommendations?.map((rec: any, index: number) => (
                <div key={index} className="border-l-4 border-[#8b5a2b] pl-4 py-3">
                  <h5 className="font-playfair font-bold text-[#8b5a2b] mb-2">{rec.recommendation_type}</h5>
                  <p className="font-lora text-sm mb-2 leading-relaxed">{rec.suggested_change}</p>
                  <div className="font-lora text-xs space-y-1">
                    <p><strong>Revenue Impact:</strong> {rec.revenue_impact}</p>
                    <p><strong>Risk Level:</strong> {rec.risk_level}</p>
                    <p><strong>Timeline:</strong> {rec.implementation_timeline}</p>
                  </div>
                </div>
              )) || (
                <p className="font-lora text-sm text-[#666]">No recommendations available</p>
              )}
            </div>
          </div>

          <div className="newspaper-border p-6">
            <h4 className="text-xl font-playfair font-bold mb-4">Pricing Analysis</h4>
            <div className="space-y-4">
              <div className="border-b border-[#e9e4d9] pb-4">
                <h5 className="font-playfair font-bold text-[#8b5a2b] mb-2">Competitor Advantage</h5>
                <p className="font-lora text-sm leading-relaxed">{reportData.priceOptimization?.competitor_advantage || 'Analysis pending'}</p>
              </div>
              <div className="border-b border-[#e9e4d9] pb-4">
                <h5 className="font-playfair font-bold text-[#8b5a2b] mb-2">Pricing Vulnerability</h5>
                <p className="font-lora text-sm leading-relaxed">{reportData.priceOptimization?.pricing_vulnerability || 'Analysis pending'}</p>
              </div>
              <div>
                <h5 className="font-playfair font-bold text-[#8b5a2b] mb-2">Upsell Opportunities</h5>
                <ul className="font-lora text-sm list-disc list-inside space-y-1">
                  {reportData.priceOptimization?.upsell_opportunities?.map((opp: string, index: number) => (
                    <li key={index}>{opp}</li>
                  )) || <li>Analysis pending</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );

  const renderMarketTrends = () => (
    <div className="space-y-8">
      <article>
        <h3 className="text-3xl font-playfair font-bold mb-6 border-b-2 border-[#1a1a1a] pb-3">
          MARKET TRENDS
        </h3>
        
        <div className="newspaper-border p-6 mb-6">
          <h4 className="text-2xl font-playfair font-bold mb-4 text-[#8b5a2b]">
            {reportData.marketTrends?.market_headline || 'Market Intelligence Report'}
          </h4>
        </div>

        <div className="space-y-6">
          <div className="newspaper-border p-6">
            <h4 className="text-xl font-playfair font-bold mb-4">Recent Activity Summary</h4>
            <p className="font-lora text-sm leading-relaxed">
              {reportData.marketTrends?.recent_activity_summary || 'Activity analysis in progress...'}
            </p>
          </div>

          <div className="newspaper-border p-6">
            <h4 className="text-xl font-playfair font-bold mb-4">Emerging Trends</h4>
            <p className="font-lora text-sm leading-relaxed">
              {reportData.marketTrends?.emerging_trends || 'Trend analysis in progress...'}
            </p>
          </div>

          <div className="newspaper-border p-6">
            <h4 className="text-xl font-playfair font-bold mb-4">Potential Threats</h4>
            <p className="font-lora text-sm leading-relaxed">
              {reportData.marketTrends?.potential_threats || 'Threat analysis in progress...'}
            </p>
          </div>

          <div className="newspaper-border p-6">
            <h4 className="text-xl font-playfair font-bold mb-4">Partnership Opportunity</h4>
            <p className="font-lora text-sm leading-relaxed">
              {reportData.marketTrends?.partnership_opportunity || 'Partnership analysis in progress...'}
            </p>
          </div>
        </div>
      </article>
    </div>
  );

  const renderTargetPersonas = () => (
    <div className="space-y-8">
      <article>
        <h3 className="text-3xl font-playfair font-bold mb-6 border-b-2 border-[#1a1a1a] pb-3">
          TARGET PERSONAS
        </h3>
        
        <div className="space-y-6">
          {reportData.targetPersonas?.map((persona: any, index: number) => (
            <div key={index} className="newspaper-border p-6">
              <h4 className="text-2xl font-playfair font-bold mb-4 text-[#8b5a2b]">
                {persona.persona_name}
              </h4>
              <p className="font-lora text-lg mb-4">{persona.job_title}</p>
              <p className="font-lora text-sm text-[#666] mb-6 leading-relaxed">{persona.demographics}</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-playfair font-bold mb-3 text-lg">Core Pain Points</h5>
                  <ul className="font-lora text-sm space-y-2">
                    {persona.core_pain_points?.map((pain: string, painIndex: number) => (
                      <li key={painIndex} className="flex items-start">
                        <span className="text-[#8b5a2b] mr-2">•</span>
                        <span className="leading-relaxed">{pain}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-playfair font-bold mb-3 text-lg">Watering Holes</h5>
                  <p className="font-lora text-sm leading-relaxed">
                    {persona.watering_holes || 'Analysis pending...'}
                  </p>
                </div>
              </div>
            </div>
          )) || (
            <div className="newspaper-border p-6">
              <p className="font-lora text-sm text-[#666]">Persona analysis in progress...</p>
            </div>
          )}
        </div>
      </article>
    </div>
  );

  const renderSection = (section: ReportSection) => {
    switch (section) {
      case 'competitorMonitoring':
        return renderCompetitorMonitoring();
      case 'growthOpportunities':
        return renderGrowthOpportunities();
      case 'marketingEngine':
        return renderMarketingEngine();
      case 'priceOptimization':
        return renderPriceOptimization();
      case 'marketTrends':
        return renderMarketTrends();
      case 'targetPersonas':
        return renderTargetPersonas();
      default:
        return renderCompetitorMonitoring();
    }
  };

  const nextPage = () => {
    if (currentPage < sections.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };
  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#f8f5f0]">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto text-center">
              <div className="newspaper-border p-8">
                <h1 className="text-2xl font-playfair font-bold mb-4 text-red-600">
                  Error Loading Report
                </h1>
                <p className="font-lora text-lg text-[#666] mb-6">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="letterpress-btn"
                >
                  Try Again
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
        
        <InteractiveNewspaperLoader 
          isLoading={isLoading} 
          loadingText="Compiling Your Report..."
          progress={taskStatus?.progress}
        />

                <AnimatePresence>
          {!isLoading && reportData && (
            <div className="min-h-screen">
                            {/* Page Navigation Header */}
              <div className="border-b-2 border-[#1a1a1a] p-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 0}
                      className="letterpress-btn text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>
                    <span className="font-lora text-sm">
                      Page {currentPage + 1} of {sections.length}
                    </span>
                    <button
                      onClick={nextPage}
                      disabled={currentPage === sections.length - 1}
                      className="letterpress-btn text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                  
                  <div className="flex space-x-3 relative">
                    {sections.map((section, index) => {
                      const IconComponent = sectionIcons[section];
                      return (
                        <div key={index} className="relative">
                          <button
                            onClick={() => goToPage(index)}
                            onMouseEnter={() => setHoveredPage(index)}
                            onMouseLeave={() => setHoveredPage(null)}
                            className={`w-10 h-10 rounded-full transition-all duration-200 flex items-center justify-center ${
                              currentPage === index 
                                ? 'bg-[#1a1a1a] text-[#f8f5f0]' 
                                : 'bg-[#e9e4d9] text-[#1a1a1a] hover:bg-[#d4c5a0]'
                            }`}
                          >
                            <IconComponent size={18} />
                          </button>
                          
                          {/* Custom Tooltip */}
                          {hoveredPage === index && (
          <motion.div 
                              initial={{ opacity: 0, y: 10, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                              className="absolute bottom-full left-0 right-0 mb-2 z-50 pointer-events-none flex justify-center"
                            >
                              <div className="bg-[#1a1a1a] text-[#f8f5f0] px-3 py-2 rounded-md text-sm font-lora whitespace-nowrap shadow-lg relative">
                                {sectionTitles[section]}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#1a1a1a]"></div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                      </div>
                    </div>
                    
              {/* Main Content with Page Turning Animation */}
              <main className="p-8">
                <div className="max-w-6xl mx-auto relative">
                  <motion.div
                    key={currentPage}
                    initial={{ 
                      opacity: 0, 
                      rotateY: 75, 
                      x: 300,
                      scale: 0.9,
                      transformOrigin: 'left center'
                    }}
                    animate={{ 
                      opacity: 1, 
                      rotateY: 0, 
                      x: 0,
                      scale: 1,
                      transformOrigin: 'left center'
                    }}
                    exit={{ 
                      opacity: 0, 
                      rotateY: -75, 
                      x: -300,
                      scale: 0.9,
                      transformOrigin: 'right center'
                    }}
                    transition={{ 
                      duration: 1.0,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      type: "spring",
                      stiffness: 80,
                      damping: 25
                    }}
                    style={{ 
                      transformStyle: 'preserve-3d',
                      perspective: '1200px'
                    }}
                    className="min-h-[80vh] relative z-20"
                  >
                    {/* Newspaper Header */}
                    {currentPage === 0 ? (
                      <header className="newspaper-border p-8 mb-8">
                        <div className="text-center border-b-2 border-[#1a1a1a] pb-6 mb-6">
                          <h1 className="text-4xl font-playfair font-black tracking-tight mb-2">
                            THE BIZATLAS CHRONICLE
                          </h1>
                          <div className="text-sm tracking-wider text-[#666] mb-4">
                            COMPETITIVE INTELLIGENCE • SPECIAL EDITION • {currentDate.toUpperCase()}
                          </div>
                      </div>
                      
                        <div className="text-center">
                          <h2 className="text-2xl font-playfair font-bold mb-4">
                            {sectionTitles[sections[currentPage]].toUpperCase()}
                          </h2>
                          <p className="font-lora text-lg text-[#666]">
                            Comprehensive Analysis • {reportData.summary?.totalCompetitors || 0} Competitors Analyzed
                          </p>
                        </div>
                      </header>
                    ) : (
                      <header className="border-b border-[#1a1a1a] pb-4 mb-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <h1 className="text-lg font-playfair font-bold tracking-tight">
                              THE BIZATLAS CHRONICLE
                            </h1>
                            <div className="text-xs tracking-wider text-[#666]">
                              {currentDate.toUpperCase()}
                            </div>
                          </div>
                          <div className="text-right">
                            <h2 className="text-lg font-playfair font-bold">
                              {sectionTitles[sections[currentPage]].toUpperCase()}
                            </h2>
                            <div className="text-xs text-[#666]">
                              Page {currentPage + 1}
                            </div>
                          </div>
                      </div>
                      </header>
                    )}

                    {/* Section Content */}
                    <div className="newspaper-border p-8 min-h-[60vh] relative overflow-hidden">
                      {/* Subtle page curl effect */}
                      <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-transparent via-transparent to-black/5 pointer-events-none"></div>
                      {renderSection(sections[currentPage])}
                    </div>
                    

                  </motion.div>
                  </div>
              </main>
              </div>
          )}
        </AnimatePresence>
    </div>
    </ProtectedRoute>
  );
}