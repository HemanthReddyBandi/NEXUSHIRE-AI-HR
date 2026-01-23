// HomePage.tsx
'use client';
import React, { useEffect, useState } from 'react';
import AuthPage from './Auth';

interface HomePageProps {
  onLogin?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onLogin }) => {
  const [scrollY, setScrollY] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    // Feature rotation
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3);
    }, 4000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Mock Interviews',
      description: 'Practice with adaptive AI that responds to your answers in real-time, creating dynamic interview scenarios.',
      stats: '98.7% Accuracy',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: '👥',
      title: 'Live HR Experts Network',
      description: 'Connect with certified HR professionals and industry experts for personalized coaching and feedback.',
      stats: '750+ Experts',
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: '📊',
      title: 'Advanced Analytics Dashboard',
      description: 'Comprehensive performance tracking with detailed insights and improvement recommendations.',
      stats: '25+ Metrics',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  if (showAuth) return <AuthPage onLoginSuccess={onLogin} />;

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          33% { transform: translateY(-30px) translateX(30px) rotate(120deg); }
          66% { transform: translateY(20px) translateX(-20px) rotate(240deg); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(50px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.5); }
          50% { box-shadow: 0 0 40px rgba(6, 182, 212, 0.8); }
        }
        
        .animate-float {
          animation: float 20s infinite ease-in-out;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s infinite;
        }
        
        .scroll-transition {
          opacity: 0;
          transform: translateY(50px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .scroll-transition.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        {/* Floating Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-40 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full animate-float" style={{animationDelay: '10s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '5s'}}></div>
        </div>

        {/* Navigation Header */}
        <header 
          className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 transition-all duration-300 ${
            scrollY > 50 
              ? 'bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/50 shadow-xl' 
              : 'bg-transparent'
          }`}
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-white to-gray-100 rounded-lg"></div>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-ping"></div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  NEXUSHIRE-AI
                </span>
                <p className="text-xs text-gray-400">AI & HUMANITY INTERVIEWS</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {['Features', 'How It Works', 'Pricing', 'Testimonials'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-gray-300 hover:text-white transition-colors group relative py-2"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <button 
                className="px-6 py-2.5 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50"
              >
                Login
              </button>
              <button 
                onClick={() => setShowAuth(true)}
                className="px-8 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300"
              >
                Get Started
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              {/* Animated Badge */}
              <div className="inline-block mb-8 animate-slide-up">
                <div className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30">
                  <span className="text-cyan-400 text-sm font-semibold">INTRODUCING AURA AI v2.4</span>
                </div>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
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
              
              <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Transform your interview skills with AURA AI, our state-of-the-art interview assistant. 
                Get real-time feedback, connect with HR professionals, and land your dream job with confidence.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button 
                  onClick={() => window.location.href = '/interview'}
                  className="group relative px-10 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl text-lg font-semibold hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <span className="relative flex items-center gap-3">
                    Start AI Interview 
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
                
                <button 
                  onClick={() => window.location.href = '/experts'}
                  className="px-10 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-lg font-semibold hover:border-cyan-500/50 hover:bg-gray-800/80 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-1.205a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Connect with HR Experts
                </button>
              </div>
            </div>

            {/* Trusted Companies */}
            <div className="mt-32 text-center">
              <p className="text-gray-500 mb-8 text-lg">Trusted by candidates at leading companies</p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-70">
                {['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix'].map((company) => (
                  <div 
                    key={company}
                    className="text-xl font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {company}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-6 md:px-12 bg-gray-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Enterprise-Grade Interview Platform
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Our comprehensive suite of tools prepares you for any interview scenario with precision
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`group relative bg-gray-800/30 border rounded-2xl p-8 transition-all duration-500 hover:scale-105 ${
                    activeFeature === index 
                      ? 'border-cyan-500/50 shadow-2xl shadow-cyan-500/20' 
                      : 'border-gray-700/50 hover:border-cyan-500/30'
                  }`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color}/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500`}></div>
                  
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color}/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-2xl">{feature.icon}</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-400 mb-6 leading-relaxed">{feature.description}</p>
                    
                    <div className={`flex items-center gap-2 text-sm font-semibold text-transparent bg-gradient-to-r ${feature.color} bg-clip-text`}>
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${feature.color}`}></div>
                      {feature.stats}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Features */}
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              {[
                {
                  title: 'Speech & Tone Analysis',
                  description: 'Advanced NLP algorithms analyze speech patterns, tone, and confidence levels.',
                  icon: '🎤'
                },
                {
                  title: 'Industry-Specific Modules',
                  description: 'Tailored preparation for tech, finance, consulting, healthcare, and more.',
                  icon: '🏢'
                },
                {
                  title: 'Resume Optimization',
                  description: 'AI-powered resume analysis with ATS compatibility checks and personalized suggestions.',
                  icon: '📄'
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300"
                >
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                How It Transforms Your Preparation
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Our proven process prepares you for success in any interview scenario
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  number: '1',
                  title: 'Personalized Assessment',
                  description: 'Complete our initial assessment to identify strengths and target roles.'
                },
                {
                  number: '2',
                  title: 'AI-Powered Practice',
                  description: 'Engage in realistic mock interviews with adaptive AI responses.'
                },
                {
                  number: '3',
                  title: 'Detailed Feedback',
                  description: 'Receive comprehensive feedback on content, delivery, and communication.'
                },
                {
                  number: '4',
                  title: 'Expert Coaching',
                  description: 'Refine skills with personalized coaching from industry professionals.'
                }
              ].map((step, index) => (
                <div 
                  key={index}
                  className="relative group"
                >
                  <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-6 mx-auto">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-6 md:px-12 bg-gray-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { value: '15K+', label: 'Successful Candidates', color: 'from-cyan-400 to-blue-400' },
                { value: '94%', label: 'Success Rate', color: 'from-blue-400 to-purple-400' },
                { value: '650+', label: 'Industry Experts', color: 'from-purple-400 to-pink-400' },
                { 
                  value: '4.9', 
                  label: 'User Satisfaction', 
                  color: 'from-yellow-400 to-orange-400',
                  stars: true 
                }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-8 text-center hover:border-cyan-500/30 transition-all duration-300"
                >
                  <div className={`text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-4`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-lg mb-3">{stat.label}</div>
                  {stat.stars && (
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Success Stories
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Hear from professionals who transformed their careers
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Sarah Johnson',
                  role: 'Senior Software Engineer at Google',
                  content: '"InterviewAI completely changed my approach. The AI feedback was incredibly detailed and helped me identify weak spots. I went from multiple rejections to three offers in one month!"',
                  initials: 'SJ'
                },
                {
                  name: 'Michael Rodriguez',
                  role: 'Product Manager at Amazon',
                  content: '"The speech analysis feature was a game-changer. I never realized how many filler words I used. My communication improved dramatically and I aced my final round at Amazon."',
                  initials: 'MR'
                },
                {
                  name: 'Emily Patterson',
                  role: 'Data Scientist at Microsoft',
                  content: '"As a career switcher from finance to tech, I was completely lost. InterviewAI\'s industry-specific modules and expert coaching prepared me thoroughly for my dream job."',
                  initials: 'EP'
                }
              ].map((testimonial, index) => (
                <div 
                  key={index}
                  className="relative group"
                >
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8">
                    <div className="text-6xl text-cyan-400/20 mb-4">"</div>
                    <p className="text-gray-300 italic mb-8 leading-relaxed">{testimonial.content}</p>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {testimonial.initials}
                      </div>
                      <div>
                        <h4 className="text-white font-bold">{testimonial.name}</h4>
                        <p className="text-gray-400 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 px-6 md:px-12 bg-gray-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Flexible Plans for Every Career Stage
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Choose the plan that fits your interview preparation needs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Starter',
                  price: '$29',
                  period: 'per month',
                  features: [
                    '5 AI Mock Interviews monthly',
                    'Basic Speech Analysis',
                    'Performance Dashboard',
                    'Email Support'
                  ],
                  buttonText: 'Get Started',
                  popular: false
                },
                {
                  name: 'Professional',
                  price: '$79',
                  period: 'per month',
                  features: [
                    'Unlimited AI Mock Interviews',
                    'Advanced Speech & Tone Analysis',
                    '2 Live Expert Sessions monthly',
                    'Resume Optimization',
                    'Priority Support'
                  ],
                  buttonText: 'Get Started',
                  popular: true
                },
                {
                  name: 'Enterprise',
                  price: '$149',
                  period: 'per month',
                  features: [
                    'Everything in Professional',
                    'Unlimited Live Expert Sessions',
                    'Custom Interview Scenarios',
                    'Dedicated Success Manager',
                    'Multi-User Access'
                  ],
                  buttonText: 'Contact Sales',
                  popular: false
                }
              ].map((plan, index) => (
                <div 
                  key={index}
                  className={`relative border rounded-2xl p-8 transition-all duration-300 hover:scale-105 ${
                    plan.popular 
                      ? 'border-cyan-500/50 bg-gradient-to-b from-gray-800/50 to-gray-900/50 shadow-2xl shadow-cyan-500/20' 
                      : 'border-gray-700/50 bg-gray-800/20'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-6 py-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-semibold rounded-full">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="text-5xl font-bold text-white mb-1">{plan.price}</div>
                    <div className="text-gray-400">{plan.period}</div>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-gray-300">
                        <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:shadow-xl hover:shadow-cyan-500/25'
                        : 'bg-gray-800/50 border border-gray-700 text-white hover:border-cyan-500/50 hover:bg-gray-800/80'
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 md:px-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-blue-900/20 to-purple-900/20"></div>
          
          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Interview Skills?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join thousands of successful candidates who have landed their dream jobs with Future Forum.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button 
                onClick={() => window.location.href = '/auth?register=true'}
                className="px-12 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl text-lg font-semibold hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300"
              >
                Start Free Trial
              </button>
              <button 
                onClick={() => window.location.href = '/demo'}
                className="px-12 py-4 bg-gray-800/50 border border-gray-700 text-white rounded-xl text-lg font-semibold hover:border-cyan-500/50 hover:bg-gray-800/80 transition-all duration-300"
              >
                Schedule Demo
              </button>
            </div>
            
            <p className="text-gray-500 text-sm mt-8">
              Free plan includes 3 AI interviews • Cancel anytime • No commitment
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800/50 py-12 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl"></div>
                  <div>
                    <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      FUTURE FORUM
                    </span>
                    <p className="text-xs text-gray-500">AI & HUMANITY INTERVIEWS</p>
                  </div>
                </div>
                <p className="text-gray-400">
                  The world's most advanced AI-powered interview preparation platform.
                </p>
                <div className="flex gap-4 mt-6">
                  {['Twitter', 'LinkedIn', 'Facebook', 'Instagram'].map((social) => (
                    <button key={social} className="w-10 h-10 rounded-lg bg-gray-800/50 hover:bg-gray-800/80 transition-colors flex items-center justify-center">
                      <span className="text-gray-400">{social.charAt(0)}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {[
                {
                  title: 'Platform',
                  links: ['Features', 'How It Works', 'Pricing', 'Success Stories']
                },
                {
                  title: 'Resources',
                  links: ['Interview Tips', 'Industry Guides', 'Resume Templates', 'Blog & Insights']
                },
                {
                  title: 'Company',
                  links: ['About Us', 'Careers', 'Privacy Policy', 'Terms of Service']
                }
              ].map((column, index) => (
                <div key={index}>
                  <h4 className="text-lg font-bold text-white mb-6">{column.title}</h4>
                  <ul className="space-y-3">
                    {column.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="pt-8 border-t border-gray-800/50 text-center text-gray-500">
              <p>© {new Date().getFullYear()} NEXUSHIRE-AI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;