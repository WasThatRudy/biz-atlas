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
  Users, 
  Target,
  DollarSign, 
  Rocket 
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

type ReportSection = 'competitorAnalysis' | 'feasibility' | 'targetAudience' | 'featurePrioritization' | 'pricingSuggestion' | 'launchpad';

const sectionTitles = {
  competitorAnalysis: 'Competitor Analysis',
  feasibility: 'Feasibility Assessment', 
  targetAudience: 'Target Audience',
  featurePrioritization: 'Feature Prioritization',
  pricingSuggestion: 'Pricing Strategy',
  launchpad: 'Launch Strategy'
};

const sectionIcons = {
  competitorAnalysis: Search,
  feasibility: TrendingUp,
  targetAudience: Users,
  featurePrioritization: Target,
  pricingSuggestion: DollarSign,
  launchpad: Rocket
};

export default function DashboardB() {
  const { getAuthHeader } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);
  const [taskStatus, setTaskStatus] = useState<TaskStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hoveredPage, setHoveredPage] = useState<number | null>(null);

  const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:4000';

  const fetchReportData = async () => {
    try {
      const response = await fetch('/api/launchpad/complete-analysis', {
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }

      const data: CompleteStatusResponse = await response.json();
      
      if (data.success && data.data) {
        // Data is already available (cached)
        setReportData(data.data);
        setIsLoading(false);
      } else if (data.taskId) {
        // Need to poll for task completion
        setTaskStatus({
          id: data.taskId,
          status: 'pending',
          progress: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          startedAt: new Date().toISOString()
        });
        pollTaskStatus(data.taskId);
      } else {
        throw new Error(data.message || 'Unknown error occurred');
      }
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  const pollTaskStatus = async (taskId: string) => {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/launchpad/task-status/${taskId}`, {
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
          setError('Analysis failed. Please try again.');
          setIsLoading(false);
        } else {
          // Continue polling
          setTimeout(() => pollTaskStatus(taskId), 2000);
        }
      } else {
        throw new Error('Failed to get task status');
      }
    } catch (err) {
      console.error('Error polling task status:', err);
      setError('Failed to get analysis status. Please refresh the page.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const nextPage = () => {
    if (currentPage < Object.keys(sectionTitles).length - 1) {
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
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="letterpress-btn"
              >
                Retry
              </button>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#f8f5f0]">
          <Navigation />
          <InteractiveNewspaperLoader 
            isLoading={isLoading} 
            loadingText="Analyzing Your Business Venture..."
            progress={taskStatus?.progress}
          />
        </div>
      </ProtectedRoute>
    );
  }

  if (!reportData) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#f8f5f0]">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">No Data Available</h1>
              <p className="text-gray-600">No analysis data found. Please try again.</p>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  const sections = Object.keys(sectionTitles) as ReportSection[];
  const currentSection = sections[currentPage];
  const currentTitle = sectionTitles[currentSection];

  const renderCompetitorAnalysis = () => (
    <div className="space-y-8">
      <article>
        <div className="p-6 mb-6">
          <h4 className="text-2xl font-playfair font-bold mb-4 text-[#8b5a2b]">
            Competitive Landscape Analysis
          </h4>
          <p className="font-lora leading-relaxed text-lg">
            Comprehensive analysis of key competitors in the AI/LLM space, their strengths, weaknesses, and market positioning.
          </p>
        </div>

        {reportData.competitorAnalysis && reportData.competitorAnalysis.length > 0 && (
          <div className="space-y-6">
            <div className="p-6">
              <h4 className="text-xl font-playfair font-bold mb-4">Detailed Competitor Profiles</h4>
              <div className="space-y-6">
                {reportData.competitorAnalysis.map((competitor: any, index: number) => (
                  <div key={index} className="border border-[#e9e4d9] p-6 bg-[#f9f9f9]">
                    <h5 className="font-playfair font-bold text-xl mb-3 text-[#8b5a2b]">{competitor.company_name}</h5>
                    <p className="font-lora text-sm text-[#666] mb-4 leading-relaxed">{competitor.core_product_summary}</p>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h6 className="font-playfair font-bold mb-3">Key Features</h6>
                        <ul className="font-lora text-sm space-y-2">
                          {competitor.key_features?.map((feature: string, featureIndex: number) => (
                            <li key={featureIndex} className="flex items-start">
                              <span className="text-[#8b5a2b] mr-2">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h6 className="font-playfair font-bold mb-3">Pricing Tiers</h6>
                        <div className="space-y-2">
                          {competitor.pricing_tiers?.map((tier: any, tierIndex: number) => (
                            <div key={tierIndex} className="p-3 bg-white rounded border">
                              <div className="font-playfair font-semibold text-sm">{tier.tier_name} - {tier.price_per_month}</div>
                              <div className="font-lora text-xs text-[#666]">{tier.target_customer}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h6 className="font-playfair font-bold mb-3 text-[#8b5a2b]">Strengths</h6>
                        <ul className="font-lora text-sm space-y-2">
                          {competitor.simulated_customer_reviews?.common_praises?.map((praise: string, praiseIndex: number) => (
                            <li key={praiseIndex} className="flex items-start">
                              <span className="text-[#8b5a2b] mr-2">✓</span>
                              <span>{praise}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h6 className="font-playfair font-bold mb-3 text-[#8b5a2b]">Weaknesses</h6>
                        <ul className="font-lora text-sm space-y-2">
                          {competitor.simulated_customer_reviews?.common_complaints?.map((complaint: string, complaintIndex: number) => (
                            <li key={complaintIndex} className="flex items-start">
                              <span className="text-[#8b5a2b] mr-2">✗</span>
                              <span>{complaint}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-[#f0f0f0] border-l-4 border-[#8b5a2b]">
                      <h6 className="font-playfair font-bold mb-2">Main Weakness</h6>
                      <p className="font-lora text-sm">{competitor.main_weakness}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </article>
    </div>
  );

  const renderFeasibility = () => (
    <div className="space-y-8">
      <article>
        <div className="p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-2xl font-playfair font-bold">Feasibility Assessment</h4>
            <span className="text-3xl font-bold text-[#8b5a2b]">
              {reportData.feasibility?.feasibility_score || 'N/A'}
            </span>
          </div>
          <p className="font-lora leading-relaxed text-lg">
            {reportData.feasibility?.market_gap_analysis || 'Analysis in progress...'}
          </p>
        </div>

        <div className="space-y-6">
          <div className="p-6">
            <h4 className="text-xl font-playfair font-bold mb-4">Competitor Weaknesses & Opportunities</h4>
            <div className="space-y-4">
              {reportData.feasibility?.competitor_weaknesses?.map((weakness: any, index: number) => (
                <div key={index} className="border-l-4 border-[#8b5a2b] pl-4 py-3">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-playfair font-bold text-[#8b5a2b]">{weakness.competitor}</h5>
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-[#f0f0f0] text-[#1a1a1a]">
                      {weakness.opportunity_size} Opportunity
                    </span>
                  </div>
                  <p className="font-lora text-sm leading-relaxed">{weakness.weakness}</p>
                </div>
              )) || (
                <p className="font-lora text-sm text-[#666]">No weakness analysis available</p>
              )}
            </div>
          </div>

          <div className="p-6">
            <h4 className="text-xl font-playfair font-bold mb-4">Validation Recommendations</h4>
            <div className="bg-[#f0f0f0] p-4 rounded">
              <p className="font-lora text-sm leading-relaxed">
                {reportData.feasibility?.validation_recommendation || 'Validation recommendations pending...'}
              </p>
            </div>
          </div>

          <div className="p-6">
            <h4 className="text-xl font-playfair font-bold mb-4">Risk Factors</h4>
            <div className="space-y-3">
              {reportData.feasibility?.risk_factors?.map((risk: string, index: number) => (
                <div key={index} className="p-3 bg-[#f0f0f0] border-l-4 border-[#8b5a2b]">
                  <div className="flex items-start">
                    <span className="text-[#8b5a2b] mr-2 mt-1">⚠️</span>
                    <p className="font-lora text-sm leading-relaxed">{risk}</p>
                  </div>
                </div>
              )) || (
                <p className="font-lora text-sm text-[#666]">No risk factors identified</p>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );


  const renderTargetAudience = () => (
    <div className="space-y-8">
      <article>
        <div className="p-6 mb-6">
          <h4 className="text-2xl font-playfair font-bold mb-4 text-[#8b5a2b]">
            Target Audience Analysis
          </h4>
          <p className="font-lora leading-relaxed text-lg">
            Detailed personas representing your ideal customers, their pain points, and where to reach them.
          </p>
        </div>

        <div className="space-y-6">
          {reportData.targetAudience?.map((persona: any, index: number) => (
            <div key={index} className="p-6">
              <h4 className="text-2xl font-playfair font-bold mb-4 text-[#8b5a2b]">
                {persona.persona_name}
              </h4>
              <p className="font-playfair text-lg mb-4">{persona.job_title}</p>
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
                  <p className="font-lora text-sm leading-relaxed">{persona.watering_holes || 'Analysis pending...'}</p>
                </div>
              </div>
            </div>
          )) || (
            <div className="p-6">
              <p className="font-lora text-sm text-[#666]">Persona analysis in progress...</p>
            </div>
          )}
        </div>
      </article>
    </div>
  );

  const renderFeaturePrioritization = () => (
    <div className="space-y-8">
      <article>
        <div className="p-6 mb-6">
          <h4 className="text-2xl font-playfair font-bold mb-4 text-[#8b5a2b]">
            Feature Prioritization & MVP Strategy
          </h4>
          <p className="font-lora leading-relaxed text-lg">
            Strategic roadmap for building your minimum viable product with prioritized features and launch timeline.
          </p>
        </div>

        <div className="space-y-6">
          <div className="p-6">
            <h4 className="text-xl font-playfair font-bold mb-4">MVP Features</h4>
            <div className="space-y-4">
              {reportData.featurePrioritization?.mvp_features?.map((feature: any, index: number) => (
                <div key={index} className="border-l-4 border-[#8b5a2b] pl-4 py-3">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-playfair font-bold text-[#8b5a2b]">{feature.feature_name}</h5>
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-[#f0f0f0] text-[#1a1a1a]">
                      {feature.priority} Priority
                    </span>
                  </div>
                  <p className="font-lora text-sm leading-relaxed">{feature.justification}</p>
                </div>
              )) || (
                <p className="font-lora text-sm text-[#666]">No MVP features defined</p>
              )}
            </div>
          </div>

          <div className="p-6">
            <h4 className="text-xl font-playfair font-bold mb-4">Launch Roadmap</h4>
            <div className="space-y-4">
              {reportData.featurePrioritization?.launch_roadmap && Object.entries(reportData.featurePrioritization.launch_roadmap).map(([phase, tasks]: [string, any]) => (
                <div key={phase} className="border border-[#e9e4d9] rounded p-4">
                  <h5 className="font-playfair font-bold text-lg mb-3 capitalize text-[#8b5a2b]">
                    {phase.replace('_', ' ')} Phase
                  </h5>
                  <ul className="font-lora text-sm space-y-2">
                    {Array.isArray(tasks) && tasks.map((task: string, taskIndex: number) => (
                      <li key={taskIndex} className="flex items-start">
                        <span className="text-[#8b5a2b] mr-2">•</span>
                        <span className="leading-relaxed">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );

  const renderPricingSuggestion = () => (
    <div className="space-y-8">
      <article>
        <div className="p-6 mb-6">
          <h4 className="text-2xl font-playfair font-bold mb-4 text-[#8b5a2b]">
            Pricing Strategy & Monetization
          </h4>
          <p className="font-lora leading-relaxed text-lg">
            Data-driven pricing recommendations based on competitive analysis and market positioning.
          </p>
        </div>

        <div className="space-y-6">
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xl font-playfair font-bold mb-4">Recommended Pricing Model</h4>
                <div className="bg-[#f0f0f0] p-4 rounded">
                  <h5 className="font-playfair font-bold text-lg mb-2">{reportData.pricingSuggestion?.suggested_model || 'TBD'}</h5>
                  <p className="font-lora text-sm text-[#666] mb-2">
                    Suggested Price: {reportData.pricingSuggestion?.suggested_price_per_month || 'TBD'}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="text-xl font-playfair font-bold mb-4">Premium Upsell Idea</h4>
                <div className="bg-[#f0f0f0] p-4 rounded border-l-4 border-[#8b5a2b]">
                  <p className="font-lora text-sm font-semibold text-[#1a1a1a]">
                    {reportData.pricingSuggestion?.premium_upsell_idea || 'Premium features TBD'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h4 className="text-xl font-playfair font-bold mb-4">Pricing Recommendation Summary</h4>
            <div className="bg-[#f9f9f9] p-4 rounded">
              <p className="font-lora text-sm leading-relaxed">
                {reportData.pricingSuggestion?.recommendation_summary || 'Pricing analysis in progress...'}
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );

  const renderLaunchpad = () => (
    <div className="space-y-8">
      <article>
        <div className="p-6 mb-6">
          <h4 className="text-2xl font-playfair font-bold mb-4 text-[#8b5a2b]">
            {reportData.launchpad?.newspaper_headline || 'Launch Strategy Report'}
          </h4>
          <p className="font-lora leading-relaxed text-lg">
            {reportData.launchpad?.market_pulse_summary || 'Market analysis in progress...'}
          </p>
        </div>

        <div className="space-y-6">
          <div className="p-6">
            <h4 className="text-xl font-playfair font-bold mb-4">Key Competitor Weaknesses</h4>
            <div className="space-y-4">
              {reportData.launchpad?.competitor_weakness_summary?.map((competitor: any, index: number) => (
                <div key={index} className="border-l-4 border-[#8b5a2b] pl-4 py-3">
                  <h5 className="font-playfair font-bold text-[#8b5a2b] mb-2">{competitor.competitor_name}</h5>
                  <p className="font-lora text-sm leading-relaxed">{competitor.weakness}</p>
                </div>
              )) || (
                <p className="font-lora text-sm text-[#666]">No competitor weakness analysis available</p>
              )}
            </div>
          </div>

          <div className="p-6">
            <h4 className="text-xl font-playfair font-bold mb-4">Market Opportunity Summary</h4>
            <div className="bg-[#f0f0f0] p-4 rounded">
              <p className="font-lora text-sm leading-relaxed">
                Based on the comprehensive analysis, there's a clear market opportunity to address the pain points 
                identified in the competitive landscape. The key is to focus on simplicity, predictable pricing, 
                and user-friendly interfaces that the current market leaders are failing to provide.
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'competitorAnalysis':
        return renderCompetitorAnalysis();
      case 'feasibility':
        return renderFeasibility();
      case 'targetAudience':
        return renderTargetAudience();
      case 'featurePrioritization':
        return renderFeaturePrioritization();
      case 'pricingSuggestion':
        return renderPricingSuggestion();
      case 'launchpad':
        return renderLaunchpad();
      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f8f5f0]">
        <Navigation />
        
        <main className="container mx-auto px-4 py-8">
          {/* Navigation Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className="letterpress-btn disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-lg font-bold font-playfair">
                Page {currentPage + 1} of {sections.length}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === sections.length - 1}
                className="letterpress-btn disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              {sections.map((section, index) => {
                const IconComponent = sectionIcons[section];
                return (
                  <div key={section} className="relative">
                    <button
                      onClick={() => goToPage(index)}
                      onMouseEnter={() => setHoveredPage(index)}
                      onMouseLeave={() => setHoveredPage(null)}
                      className={`p-2 rounded-full transition-colors ${
                        currentPage === index 
                          ? 'bg-[#8b5a2b] text-white' 
                          : 'bg-white text-[#8b5a2b] hover:bg-[#f0f0f0]'
                      }`}
                    >
                      <IconComponent size={20} />
                    </button>
                    
                    <AnimatePresence>
                      {hoveredPage === index && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute bottom-full left-0 right-0 mb-2 z-50 pointer-events-none flex justify-center"
                        >
                          <div className="bg-[#1a1a1a] text-white px-3 py-1 rounded text-sm whitespace-nowrap">
                            {sectionTitles[section]}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Header */}
          {currentPage === 0 ? (
            <header className="newspaper-border p-8 mb-8">
              <div className="text-center border-b-2 border-[#1a1a1a] pb-6 mb-6">
                <h1 className="text-4xl font-playfair font-black tracking-tight mb-2">
                  THE BIZATLAS CHRONICLE
                </h1>
                <div className="text-sm tracking-wider text-[#666] mb-4">
                  BUSINESS VENTURE ANALYSIS • SPECIAL EDITION • {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }).toUpperCase()}
                </div>
              </div>
              
              <div className="text-center">
                <h2 className="text-2xl font-playfair font-bold mb-4">
                  {currentTitle.toUpperCase()}
                </h2>
                <p className="font-lora text-lg text-[#666]">
                  Comprehensive Analysis • {reportData.summary?.totalCompetitors || 0} Competitors Analyzed • Feasibility Score: {reportData.summary?.feasibilityScore || 'N/A'}
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
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }).toUpperCase()}
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-lg font-playfair font-bold">
                    {currentTitle.toUpperCase()}
                  </h2>
                  <div className="text-xs text-[#666]">
                    Page {currentPage + 1}
                  </div>
                </div>
              </div>
            </header>
          )}

          {/* Content */}
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
            {/* Section Content */}
            <div className="newspaper-border p-8 min-h-[60vh] relative overflow-hidden">
              {/* Subtle page curl effect */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-transparent via-transparent to-black/5 pointer-events-none"></div>
              {renderCurrentSection()}
            </div>
          </motion.div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
