'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { User, LogOut, Menu, X } from 'lucide-react';

export function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
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
  }, [isMobileMenuOpen]);

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
              
              {isAuthenticated ? (
                <div className="flex items-center gap-4 group">
                  <div className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    <span className="font-lora text-sm text-[#666] hidden lg:inline">
                      Welcome, {user?.name || user?.email}!
                    </span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="font-lora hover:text-[#8b5a2b] transition-all duration-200 flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link 
                    href="/auth?mode=login"
                    className="font-lora hover:text-[#8b5a2b] transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/auth?mode=signup"
                    className="font-lora px-4 py-2 border border-[#1a1a1a] hover:bg-[#8b5a2b] hover:text-white transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
              

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
                
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-2 py-2">
                      <User className="h-4 w-4" />
                      <span className="font-lora text-sm text-[#666]">
                        {user?.name || user?.email}
                      </span>
                    </div>
                    <button 
                      onClick={() => { handleLogout(); closeMobileMenu(); }}
                      className="font-lora hover:text-[#8b5a2b] transition-colors py-2 text-left flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/auth?mode=login"
                      className="font-lora hover:text-[#8b5a2b] transition-colors py-2"
                      onClick={closeMobileMenu}
                    >
                      Login
                    </Link>
                    <Link 
                      href="/auth?mode=signup"
                      className="font-lora px-4 py-2 border border-[#1a1a1a] hover:bg-[#8b5a2b] hover:text-white transition-colors text-center"
                      onClick={closeMobileMenu}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
                

              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>


    </>
  );
}