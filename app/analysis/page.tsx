'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Analysis() {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Setting the type...');
  const router = useRouter();

  useEffect(() => {
    const phases = [
      { text: 'Setting the type...', duration: 2000 },
      { text: 'Running the presses...', duration: 3000 },
      { text: 'Extra! Your report is ready.', duration: 1500 }
    ];

    let currentPhase = 0;
    let startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const totalDuration = phases.reduce((sum, phase) => sum + phase.duration, 0);
      
      let phaseElapsed = 0;
      let currentPhaseDuration = 0;
      
      for (let i = 0; i <= currentPhase; i++) {
        if (i < currentPhase) {
          phaseElapsed += phases[i].duration;
        } else {
          currentPhaseDuration = phases[i].duration;
        }
      }
      
      const progressInCurrentPhase = Math.min(elapsed - phaseElapsed, currentPhaseDuration);
      const newProgress = ((phaseElapsed + progressInCurrentPhase) / totalDuration) * 100;
      
      setProgress(newProgress);

      if (elapsed >= phaseElapsed + currentPhaseDuration && currentPhase < phases.length - 1) {
        currentPhase++;
        setStatusText(phases[currentPhase].text);
      }

      if (newProgress >= 100) {
        setTimeout(() => {
          router.push('/report/newly-generated-report-123');
        }, 500);
      }
    };

    const interval = setInterval(updateProgress, 50);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f8f5f0] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto px-4"
      >
        {/* Vintage Printing Press Animation */}
        <motion.div className="mb-12">
          <motion.svg
            className="w-48 h-48 mx-auto"
            viewBox="0 0 200 200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Printing Press Base */}
            <rect x="20" y="140" width="160" height="40" stroke="#1a1a1a" strokeWidth="2" fill="none"/>
            
            {/* Press Mechanism */}
            <rect x="60" y="80" width="80" height="60" stroke="#1a1a1a" strokeWidth="2" fill="none"/>
            
            {/* Moving Press Plate */}
            <motion.rect
              x="70"
              y="90"
              width="60"
              height="8"
              fill="#1a1a1a"
              animate={{
                y: [90, 120, 90]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Paper Stack */}
            <g stroke="#1a1a1a" strokeWidth="1" fill="none">
              <rect x="40" y="155" width="30" height="20"/>
              <rect x="42" y="157" width="30" height="20"/>
              <rect x="44" y="159" width="30" height="20"/>
            </g>
            
            {/* Moving Paper */}
            <motion.rect
              x="130"
              y="155"
              width="30"
              height="20"
              stroke="#1a1a1a"
              strokeWidth="1"
              fill="none"
              animate={{
                x: [130, 140, 130]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Decorative Gears */}
            <motion.circle
              cx="50"
              cy="70"
              r="8"
              stroke="#1a1a1a"
              strokeWidth="1"
              fill="none"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            
            <motion.circle
              cx="150"
              cy="70"
              r="8"
              stroke="#1a1a1a"
              strokeWidth="1"
              fill="none"
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </motion.svg>
        </motion.div>

        <h1 className="text-3xl font-playfair font-bold mb-8">
          Preparing Your Intelligence Report
        </h1>

        <motion.p 
          key={statusText}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-xl font-lora mb-8 text-[#666]"
        >
          {statusText}
        </motion.p>

        {/* Progress Bar */}
        <div className="w-full max-w-md mx-auto mb-8">
          <div className="h-1 border border-[#1a1a1a] bg-[#f8f5f0]">
            <motion.div
              className="h-full bg-[#1a1a1a]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <p className="font-lora text-sm mt-2 text-[#888]">
            {Math.round(progress)}% Complete
          </p>
        </div>

        <div className="newspaper-border p-6">
          <p className="font-lora text-sm leading-relaxed">
            Our editorial team is working diligently to compile your comprehensive competitive intelligence report. 
            This process includes market research, strategic analysis, and expert commentary on your competitive landscape.
          </p>
        </div>
      </motion.div>
    </div>
  );
}