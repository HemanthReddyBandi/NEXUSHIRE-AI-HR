import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BotIcon, 
  HistoryIcon, 
  RocketIcon, 
  TrendingUpIcon,
  AwardIcon,
  UsersIcon,
  ClockIcon,
  StarIcon,
  ShieldIcon,
  ZapIcon,
  BrainIcon,
  TargetIcon
} from './icons/Icons';

interface WelcomeScreenProps {
  onStart: () => void;
  onViewHistory: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onViewHistory }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    interviews: 15247,
    successRate: 94.8,
    improvement: 2.4,
    satisfaction: 4.9
  });
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3);
    }, 4000);
    
    // Simulate counting animation
    const timer = setTimeout(() => {
      setStats(prev => ({
        ...prev,
        interviews: 15428,
        successRate: 95.1
      }));
    }, 1000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Mock Interviews',
      description: 'Practice with adaptive AI that responds to your answers in real-time, creating dynamic interview scenarios.',
      color: 'from-cyan-500 to-blue-500',
      metrics: ['98.7% Accuracy', 'Real-time Feedback', 'Adaptive Difficulty']
    },
    {
      icon: '📊',
      title: 'Comprehensive Analytics',
      description: 'Get detailed insights into your performance with speech analysis, content evaluation, and improvement tracking.',
      color: 'from-blue-500 to-purple-500',
      metrics: ['25+ Metrics', 'Progress Tracking', 'Personalized Insights']
    },
    {
      icon: '👥',
      title: 'Expert Community',
      description: 'Connect with HR professionals and industry experts for personalized coaching and career guidance.',
      color: 'from-purple-500 to-pink-500',
      metrics: ['750+ Experts', '1:1 Coaching', 'Industry Networks']
    }
  ];

  const testimonials = [
    {
      name: 'Alex Chen',
      role: 'Senior Engineer at Google',
      content: 'The AI interview practice helped me land my dream job at Google. The feedback was incredibly detailed!',
      score: 9.8,
      avatar: 'AC'
    },
    {
      name: 'Maria Rodriguez',
      role: 'Product Manager at Amazon',
      content: 'As a career switcher, the practice interviews gave me the confidence I needed. Highly recommend!',
      score: 9.5,
      avatar: 'MR'
    },
    {
      name: 'David Kim',
      role: 'Data Scientist at Microsoft',
      content: 'The technical questions were spot-on for FAANG interviews. Practice paid off!',
      score: 9.7,
      avatar: 'DK'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full animate-float" style={{animationDelay: '10s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '5s'}}></div>
      </div>

      <div className="relative z-10 min-h-screen p-6 md:p-8">
        {/* Header Navigation */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 md:mb-16 gap-6 p-4 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/50 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <BrainIcon className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-ping"></div>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                FUTURE FORUM
              </span>
              <p className="text-xs text-gray-400">AI & HUMANITY INTERVIEWS</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onViewHistory}
              className="px-6 py-2.5 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 text-gray-300 rounded-lg hover:text-white hover:border-cyan-500/30 transition-all flex items-center gap-2"
            >
              <HistoryIcon className="w-5 h-5" />
              View History
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-block mb-6 md:mb-8">
            <div className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30">
              <span className="text-cyan-400 text-sm font-semibold">INTRODUCING AURA AI v2.4</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
              Master Interviews
            </span>
            <br />
            <span className="text-white">with Advanced</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              AI Technology
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed">
            Transform your interview skills with our state-of-the-art AI interview assistant. 
            Get real-time feedback, connect with HR professionals, and land your dream job with confidence.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 md:mb-12">
            {[
              { value: stats.interviews.toLocaleString(), label: 'Interviews Completed', icon: '📈', color: 'cyan' },
              { value: `${stats.successRate}%`, label: 'Success Rate', icon: '🏆', color: 'blue' },
              { value: `+${stats.improvement}`, label: 'Avg. Improvement', icon: '📊', color: 'purple' },
              { value: `${stats.satisfaction}/5`, label: 'User Satisfaction', icon: '⭐', color: 'yellow' }
            ].map((stat, idx) => (
              <div 
                key={idx} 
                className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/50 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300 hover:scale-105"
              >
                <div className="text-3xl mb-3">{stat.icon}</div>
                <div className={`text-3xl md:text-4xl font-bold text-${stat.color}-300 mb-2`}>{stat.value}</div>
                <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12 md:mb-16">
            <button
              onClick={() => {
                if (onStart) onStart();
                else navigate('/setup');
              }}
              className="group relative px-8 md:px-12 py-4 md:py-5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl text-lg md:text-xl font-semibold hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <span className="relative flex items-center gap-3">
                Start Free Trial
                <RocketIcon className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            
            <button
              onClick={onViewHistory}
              className="px-8 md:px-12 py-4 md:py-5 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-xl text-lg md:text-xl font-semibold hover:border-cyan-500/50 hover:bg-gray-800/80 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <HistoryIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
              View Your Progress
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8 md:mb-12">
            Why Choose Future Forum?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`group relative bg-gradient-to-br from-gray-800/30 to-gray-900/30 border rounded-2xl p-6 md:p-8 transition-all duration-500 hover:scale-105 ${activeFeature === index ? 'border-cyan-500/50 shadow-2xl shadow-cyan-500/20' : 'border-gray-700/50 hover:border-cyan-500/30'}`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color}/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500`}></div>
                
                <div className="relative">
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${feature.color}/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl md:text-3xl">{feature.icon}</span>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">{feature.description}</p>
                  
                  <div className="space-y-2">
                    {feature.metrics.map((metric, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${feature.color}`}></div>
                        <span className="text-gray-300">{metric}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8 md:mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                number: '1',
                title: 'Setup Your Profile',
                description: 'Upload your resume and select target role',
                icon: '⚙️'
              },
              {
                number: '2',
                title: 'AI Interview Practice',
                description: 'Engage in realistic mock interviews',
                icon: '🤖'
              },
              {
                number: '3',
                title: 'Get Detailed Feedback',
                description: 'Receive comprehensive performance analysis',
                icon: '📊'
              },
              {
                number: '4',
                title: 'Improve & Repeat',
                description: 'Track progress and continue practicing',
                icon: '📈'
              }
            ].map((step, index) => (
              <div 
                key={index}
                className="relative group"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/50 rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-6 mx-auto">
                    {step.icon}
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8 md:mb-12">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="relative group"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/50 rounded-2xl p-6 md:p-8">
                  <div className="text-6xl text-cyan-400/20 mb-4">"</div>
                  <p className="text-gray-300 italic mb-6 md:mb-8 leading-relaxed">{testimonial.content}</p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="text-white font-bold">{testimonial.name}</h4>
                        <p className="text-gray-400 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                        {testimonial.score}
                      </div>
                      <div className="text-gray-400 text-sm">Score</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trusted Companies */}
        <div className="mb-16 md:mb-20">
          <h3 className="text-xl md:text-2xl font-bold text-center text-gray-400 mb-6 md:mb-8">
            Trusted by candidates at leading companies
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
            {['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Tesla', 'Adobe'].map((company, idx) => (
              <div 
                key={idx}
                className="text-lg md:text-xl font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer hover:scale-110 transition-transform"
              >
                {company}
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-blue-900/20 to-purple-900/20"></div>
          
          <div className="relative z-10 text-center p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6">
              Ready to Transform Your Interview Skills?
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-8 md:mb-12 max-w-2xl mx-auto">
              Join thousands of successful candidates who have landed their dream jobs with Future Forum.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button 
                onClick={() => {
                  if (onStart) onStart();
                  else navigate('/setup');
                }}
                className="px-8 md:px-12 py-4 md:py-5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl text-lg md:text-xl font-semibold hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <RocketIcon className="w-5 h-5 md:w-6 md:h-6" />
                Start Free Trial
              </button>
              <button 
                onClick={onViewHistory}
                className="px-8 md:px-12 py-4 md:py-5 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700 text-white rounded-xl text-lg md:text-xl font-semibold hover:border-cyan-500/50 hover:bg-gray-800/80 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <HistoryIcon className="w-5 h-5 md:w-6 md:h-6" />
                View Demo
              </button>
            </div>
            
            <p className="text-gray-500 text-sm mt-6 md:mt-8">
              Free trial includes 3 AI interviews • Cancel anytime • No commitment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;