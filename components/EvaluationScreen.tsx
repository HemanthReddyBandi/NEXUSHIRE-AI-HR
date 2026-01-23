// EvaluationScreen.tsx
import React, { useState, useEffect } from 'react';
import { BotIcon, SparklesIcon, BrainIcon, ChartIcon, ZapIcon } from './icons/Icons';

const messages = [
  { text: "Analyzing your responses...", icon: BrainIcon },
  { text: "Evaluating communication clarity and confidence...", icon: ChartIcon },
  { text: "Assessing technical knowledge against your resume...", icon: ZapIcon },
  { text: "Compiling feedback and scores...", icon: SparklesIcon },
  { text: "Generating your personalized report...", icon: BotIcon },
  { text: "Finalizing the results...", icon: SparklesIcon }
];

const EvaluationScreen: React.FC = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
    }, 3000);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 150);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, []);

  const CurrentIcon = messages[currentMessageIndex].icon;

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
          <div className="absolute inset-0 border-4 border-dashed border-purple-500/20 rounded-full animate-spin-slow"></div>
          <div className="absolute inset-8 border-4 border-dashed border-indigo-500/20 rounded-full animate-spin-slow-reverse"></div>
          <div className="absolute inset-16 border-4 border-dashed border-blue-500/20 rounded-full animate-spin-slower"></div>
        </div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 text-center p-8 md:p-12 rounded-3xl bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-xl border border-purple-500/20 shadow-2xl shadow-purple-500/10 max-w-2xl mx-auto">
        {/* Main Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 rounded-full blur-xl animate-pulse"></div>
          <div className="relative inline-flex items-center justify-center w-32 h-32 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500/30">
            <CurrentIcon className="w-20 h-20 text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text animate-pulse" />
          </div>
          
          {/* Orbiting elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute w-4 h-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${i * 120}deg) translateY(-80px) rotate(-${i * 120}deg)`,
                  animation: `orbit 3s linear infinite`,
                  animationDelay: `${i * 1}s`
                }}
              ></div>
            ))}
          </div>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-400 animate-gradient">
            Evaluation in Progress
          </span>
        </h2>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Processing your interview</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            >
              <div className="h-full bg-gradient-to-r from-white/20 via-white/10 to-transparent w-1/3 ml-auto animate-shimmer"></div>
            </div>
          </div>
        </div>

        {/* Animated message */}
        <div className="min-h-[60px] flex items-center justify-center mb-8">
          <div className="text-2xl font-semibold text-white transition-all duration-500">
            {messages[currentMessageIndex].text}
          </div>
        </div>

        {/* Loading indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gradient-to-b from-purple-400 to-indigo-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>

        {/* Stats preview */}
        <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-gray-700/50">
          {[
            { label: 'Questions', value: '5' },
            { label: 'Analysis', value: 'Real-time' },
            { label: 'Accuracy', value: 'AI-Powered' }
          ].map((stat, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-gray-900/30 border border-gray-700/50">
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes orbit {
          from { transform: rotate(0deg) translateY(-80px) rotate(0deg); }
          to { transform: rotate(360deg) translateY(-80px) rotate(-360deg); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes spin-slower {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 25s linear infinite;
        }
        
        .animate-spin-slower {
          animation: spin-slower 30s linear infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default EvaluationScreen;