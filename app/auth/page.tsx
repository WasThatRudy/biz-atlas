'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { AuthForm } from '@/components/auth/auth-form';
import { authService } from '@/lib/auth';

function AuthPageContent() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Set mode based on query parameter
  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'signup') {
      setMode('signup');
    } else {
      setMode('login');
    }
  }, [searchParams]);

  // Note: Removed automatic redirect to dashboard for logged-in users

  const handleAuthSuccess = () => {
    // Redirect to landing page after successful authentication
    router.push('/');
  };

  const handleModeSwitch = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          variants={headerVariants}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="font-playfair text-4xl font-bold text-[#1a1a1a] mb-2"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            The BizAtlas Chronicle
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Chart your competitive landscape with unprecedented clarity
          </motion.p>
        </motion.div>

        {/* Auth Form */}
        <motion.div 
          variants={itemVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <AuthForm
            mode={mode}
            onSuccess={handleAuthSuccess}
            onModeSwitch={handleModeSwitch}
          />
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="text-center mt-8 text-sm text-gray-500"
          variants={itemVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            By continuing, you agree to our{' '}
            <motion.a 
              href="#" 
              className="underline hover:text-gray-700"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Terms of Service
            </motion.a>{' '}
            and{' '}
            <motion.a 
              href="#" 
              className="underline hover:text-gray-700"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Privacy Policy
            </motion.a>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8f5f0] flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a1a1a] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}
