'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy authentication - just toggle login state
    setIsLoggedIn(true);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const closeModal = () => {
    setShowAuthModal(false);
  };

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showAuthModal) {
        closeModal();
      }
    };

    if (showAuthModal) {
      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }
  }, [showAuthModal]);

  return (
    <>
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-[#1a1a1a] bg-[#f8f5f0] py-4 mb-8"
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-playfair font-bold tracking-tight hover:text-[#8b5a2b] transition-colors">
            BizAtlas
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/dashboard" className="font-lora hover:text-[#8b5a2b] transition-colors border-b border-transparent hover:border-[#8b5a2b]">
              Dashboard
            </Link>
            
            {isLoggedIn ? (
              <>
                <span className="font-lora text-sm text-[#666]">Welcome back!</span>
                <button 
                  onClick={handleLogout}
                  className="font-lora text-sm hover:text-[#8b5a2b] transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => { setIsSignUp(false); setShowAuthModal(true); }}
                  className="font-lora hover:text-[#8b5a2b] transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={() => { setIsSignUp(true); setShowAuthModal(true); }}
                  className="font-lora px-4 py-2 border border-[#1a1a1a] hover:bg-[#8b5a2b] hover:text-white transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
            
            <Link href="/setup?path=startup" className="letterpress-btn hover:translate-x-0.5 hover:translate-y-0.5 transition-transform">
              Start New Report
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Auth Modal */}
      {showAuthModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#f8f5f0] newspaper-border p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-playfair font-bold text-center mb-6">
              {isSignUp ? 'Join The Chronicle' : 'Welcome Back'}
            </h2>
            
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block font-lora font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  required
                  className="w-full p-3 border border-[#1a1a1a] bg-[#f8f5f0] font-lora focus:outline-none focus:ring-1 focus:ring-[#8b5a2b]"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block font-lora font-medium mb-2">Password</label>
                <input 
                  type="password" 
                  required
                  className="w-full p-3 border border-[#1a1a1a] bg-[#f8f5f0] font-lora focus:outline-none focus:ring-1 focus:ring-[#8b5a2b]"
                  placeholder="Your password"
                />
              </div>
              
              {isSignUp && (
                <div>
                  <label className="block font-lora font-medium mb-2">Confirm Password</label>
                  <input 
                    type="password" 
                    required
                    className="w-full p-3 border border-[#1a1a1a] bg-[#f8f5f0] font-lora focus:outline-none focus:ring-1 focus:ring-[#8b5a2b]"
                    placeholder="Confirm your password"
                  />
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="submit"
                  className="letterpress-btn flex-1"
                >
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </button>
                <button 
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-[#1a1a1a] font-lora hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
            
            <div className="text-center mt-6 pt-4 border-t border-[#1a1a1a]">
              <p className="font-lora text-sm text-[#666] mb-3">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </p>
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-lora text-[#8b5a2b] hover:underline"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
            
            <div className="text-center mt-4">
              <p className="font-lora text-xs text-[#666] mb-2">Or continue with:</p>
              <button 
                onClick={handleAuth}
                className="w-full p-3 border border-[#1a1a1a] font-lora hover:bg-gray-100 transition-colors"
              >
                Continue with Google
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}