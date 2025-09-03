'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence, } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  name: z.string().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSuccess?: () => void;
  onModeSwitch?: () => void;
}

export function AuthForm({ mode, onSuccess, onModeSwitch }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { login, signup } = useAuth();

  const isSignup = mode === 'signup';

  const form = useForm<any>({
    resolver: zodResolver(isSignup ? signupSchema : loginSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  const onSubmit = async (data: LoginFormData | SignupFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let success;
      
      if (isSignup) {
        success = await signup(data.email, data.password, (data as SignupFormData).name);
      } else {
        success = await login(data.email, data.password);
      }

      if (success) {
        setSuccess(`${isSignup ? 'Account created' : 'Login'} successful!`);
        reset();
        onSuccess?.();
      } else {
        setError(`${isSignup ? 'Signup' : 'Login'} failed. Please try again.`);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      className="w-full max-w-md mx-auto newspaper-border p-6 sm:p-8"
      variants={formVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div 
        className="space-y-1 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.h2 
          className="text-2xl font-playfair font-bold text-center text-[#1a1a1a]"
          key={isSignup ? 'signup' : 'login'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </motion.h2>
        <motion.p 
          className="font-lora text-center text-[#666]"
          key={isSignup ? 'signup-desc' : 'login-desc'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          {isSignup 
            ? 'Enter your details to create your account' 
            : 'Enter your credentials to access your account'
          }
        </motion.p>
      </motion.div>
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
          
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="p-3 border border-green-600 bg-green-50 text-green-800 font-lora text-sm"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <AnimatePresence>
            {isSignup && (
              <motion.div 
                className="space-y-2"
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <label htmlFor="name" className="block font-lora font-medium text-[#1a1a1a]">Name</label>
                <motion.input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  {...register('name')}
                  disabled={isLoading}
                  className="w-full p-3 border border-[#1a1a1a] bg-[#f8f5f0] font-lora focus:outline-none focus:ring-1 focus:ring-[#8b5a2b] text-[#1a1a1a] placeholder-[#666]"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
                {errors.name && (
                  <motion.p 
                    className="text-sm text-red-600 font-lora"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {errors.name?.message as string}
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            className="space-y-2"
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
          >
            <label htmlFor="email" className="block font-lora font-medium text-[#1a1a1a]">Email</label>
            <motion.input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register('email')}
              disabled={isLoading}
              className="w-full p-3 border border-[#1a1a1a] bg-[#f8f5f0] font-lora focus:outline-none focus:ring-1 focus:ring-[#8b5a2b] text-[#1a1a1a] placeholder-[#666]"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
            {errors.email && (
              <motion.p 
                className="text-sm text-red-600 font-lora"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {errors.email.message as string}
              </motion.p>
            )}
          </motion.div>

          <motion.div 
            className="space-y-2"
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
          >
            <label htmlFor="password" className="block font-lora font-medium text-[#1a1a1a]">Password</label>
            <motion.input
              id="password"
              type="password"
              placeholder={isSignup ? 'Create a password (min 6 characters)' : 'Enter your password'}
              {...register('password')}
              disabled={isLoading}
              className="w-full p-3 border border-[#1a1a1a] bg-[#f8f5f0] font-lora focus:outline-none focus:ring-1 focus:ring-[#8b5a2b] text-[#1a1a1a] placeholder-[#666]"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
            {errors.password && (
              <motion.p 
                className="text-sm text-red-600 font-lora"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {errors.password.message as string}
              </motion.p>
            )}
          </motion.div>

          <motion.button 
            type="submit" 
            className="letterpress-btn w-full text-base px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={isLoading}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSignup ? 'Create Account' : 'Sign In'}
          </motion.button>
        </form>

        <motion.div 
          className="text-center text-sm"
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
        >
          <span className="font-lora text-[#666]">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
          </span>{' '}
          <motion.button
            type="button"
            onClick={onModeSwitch}
            className="font-lora font-medium text-[#8b5a2b] hover:underline"
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {isSignup ? 'Sign in' : 'Sign up'}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
