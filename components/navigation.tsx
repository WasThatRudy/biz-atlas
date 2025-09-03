'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Handle ESC key press and click outside
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showAuthModal) {
          closeModal();
        }
        if (isMobileMenuOpen) {
          closeMobileMenu();
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (isMobileMenuOpen) {
        const target = e.target as Element;
        if (!target.closest('nav')) {
          closeMobileMenu();
        }
      }
    };

    document.addEventListener('keydown', handleEscKey);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showAuthModal, isMobileMenuOpen]);

  return (
    <>
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-[#1a1a1a] bg-[#f8f5f0] py-3 sm:py-4 mb-6 sm:mb-8"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl sm:text-3xl font-playfair font-bold tracking-tight hover:text-[#8b5a2b] transition-colors">
              BizAtlas
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-6 items-center text-sm lg:text-base">
              <Link href="/dashboard" className="font-lora hover:text-[#8b5a2b] transition-colors border-b border-transparent hover:border-[#8b5a2b]">
                Dashboard
              </Link>
              
              {isLoggedIn ? (
                <>
                  <span className="font-lora text-sm text-[#666] hidden lg:inline">Welcome back!</span>
                  <button 
                    onClick={handleLogout}
                    className="font-lora hover:text-[#8b5a2b] transition-colors"
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
              
              <Link href="/setup?path=startup" className="letterpress-btn hover:translate-x-0.5 hover:translate-y-0.5 transition-transform px-4 py-2">
                Start New Report
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 hover:bg-[#e8e5e0] transition-colors rounded"
              aria-label="Toggle mobile menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`bg-[#1a1a1a] block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
                <span className={`bg-[#1a1a1a] block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`bg-[#1a1a1a] block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-[#1a1a1a] mt-3 pt-3"
            >
              <div className="flex flex-col space-y-3">
                <Link 
                  href="/dashboard" 
                  className="font-lora hover:text-[#8b5a2b] transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
                
                {isLoggedIn ? (
                  <button 
                    onClick={() => { handleLogout(); closeMobileMenu(); }}
                    className="font-lora hover:text-[#8b5a2b] transition-colors py-2 text-left"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => { setIsSignUp(false); setShowAuthModal(true); closeMobileMenu(); }}
                      className="font-lora hover:text-[#8b5a2b] transition-colors py-2 text-left"
                    >
                      Login
                    </button>
                    <button 
                      onClick={() => { setIsSignUp(true); setShowAuthModal(true); closeMobileMenu(); }}
                      className="font-lora px-4 py-2 border border-[#1a1a1a] hover:bg-[#8b5a2b] hover:text-white transition-colors text-center"
                    >
                      Sign Up
                    </button>
                  </>
                )}
                
                <Link 
                  href="/setup?path=startup" 
                  className="letterpress-btn text-center py-3"
                  onClick={closeMobileMenu}
                >
                  Start New Report
                </Link>
              </div>
            </motion.div>
          )}
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
            className="bg-[#f8f5f0] newspaper-border p-6 sm:p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl sm:text-2xl font-playfair font-bold text-center mb-4 sm:mb-6">
              {isSignUp ? 'Join The Chronicle' : 'Welcome Back'}
            </h2>
            
            <form onSubmit={handleAuth} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block font-lora font-medium mb-2 text-sm sm:text-base">Email</label>
                <input 
                  type="email" 
                  required
                  className="w-full p-2.5 sm:p-3 border border-[#1a1a1a] bg-[#f8f5f0] font-lora focus:outline-none focus:ring-1 focus:ring-[#8b5a2b] text-sm sm:text-base"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block font-lora font-medium mb-2 text-sm sm:text-base">Password</label>
                <input 
                  type="password" 
                  required
                  className="w-full p-2.5 sm:p-3 border border-[#1a1a1a] bg-[#f8f5f0] font-lora focus:outline-none focus:ring-1 focus:ring-[#8b5a2b] text-sm sm:text-base"
                  placeholder="Your password"
                />
              </div>
              
              {isSignUp && (
                <div>
                  <label className="block font-lora font-medium mb-2 text-sm sm:text-base">Confirm Password</label>
                  <input 
                    type="password" 
                    required
                    className="w-full p-2.5 sm:p-3 border border-[#1a1a1a] bg-[#f8f5f0] font-lora focus:outline-none focus:ring-1 focus:ring-[#8b5a2b] text-sm sm:text-base"
                    placeholder="Confirm your password"
                  />
                </div>
              )}
              
              <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                <button 
                  type="submit"
                  className="letterpress-btn flex-1 text-sm sm:text-base py-2 sm:py-3"
                >
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </button>
                <button 
                  type="button"
                  onClick={closeModal}
                  className="px-3 sm:px-4 py-2 border border-[#1a1a1a] font-lora hover:bg-gray-100 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
            
            <div className="text-center mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-[#1a1a1a]">
              <p className="font-lora text-xs sm:text-sm text-[#666] mb-2 sm:mb-3">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </p>
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-lora text-[#8b5a2b] hover:underline text-sm sm:text-base"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
            
            <div className="text-center mt-3 sm:mt-4">
              <p className="font-lora text-xs text-[#666] mb-2">Or continue with:</p>
              <button 
                onClick={handleAuth}
                className="w-full p-2.5 sm:p-3 border border-[#1a1a1a] font-lora hover:bg-gray-100 transition-colors text-sm sm:text-base"
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