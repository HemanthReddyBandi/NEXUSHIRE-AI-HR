// AuthPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import SVG icons (keeping all the same icons)
const Mail = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6.5v11A2.5 2.5 0 0 0 5.5 20h13A2.5 2.5 0 0 0 21 17.5v-11A2.5 2.5 0 0 0 18.5 4h-13A2.5 2.5 0 0 0 3 6.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 7.5l-9 6-9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Lock = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const User = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M4 20c1.5-3 4.5-5 8-5s6.5 2 8 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const Eye = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const EyeOff = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10.94 10.94a3 3 0 0 0 4.12 4.12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M2 12s4-7 10-7c2.1 0 4 .6 5.8 1.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Shield = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l7 3v5c0 5-3.6 9.7-7 11-3.4-1.3-7-6-7-11V5l7-3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Brain = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3v2M7 7v1M17 7v1M5 13h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 21c-4-1-7-5-7-9s3-6 7-6 7 2 7 6-3 8-7 9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Smartphone = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="7" y="2" width="10" height="20" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M11 18h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22c5.522 0 10-4.478 10-10S17.522 2 12 2 2 6.478 2 12s4.478 10 10 10z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const XCircle = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Briefcase = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="7" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 12v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 12v2M16 12v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const Building = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0H3m14 0h2m-2 0v-5M3 21h18M3 21v-5m0 5v-5h18v5m0-5V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 9h2M9 13h2M9 17h2M13 9h2M13 13h2M13 17h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Phone = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

type AuthMode = 'user-login' | 'user-register' | 'hr-login' | 'hr-register';

interface AuthPageProps {
  onLoginSuccess?: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('user-login');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    employeeId: '', // For HR
    companyCode: '', // For HR
    companyName: '', // For HR register
    phone: '' // For HR register
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    employeeId: '',
    companyCode: '',
    companyName: '',
    phone: ''
  });

  const isLoginMode = authMode === 'user-login' || authMode === 'hr-login';
  const isRegisterMode = authMode === 'user-register' || authMode === 'hr-register';
  const isHrMode = authMode === 'hr-login' || authMode === 'hr-register';
  const isUserMode = authMode === 'user-login' || authMode === 'user-register';

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
      name: '',
      confirmPassword: '',
      employeeId: '',
      companyCode: '',
      companyName: '',
      phone: ''
    };

    // Email validation for all modes except HR login
    if ((isUserMode || authMode === 'hr-register') && !formData.email) {
      newErrors.email = 'Email is required';
    } else if ((isUserMode || authMode === 'hr-register') && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Name validation for all register modes
    if (isRegisterMode && !formData.name) {
      newErrors.name = 'Name is required';
    }

    // Confirm password for all register modes
    if (isRegisterMode) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    // HR specific validations
    if (authMode === 'hr-login') {
      if (!formData.employeeId) {
        newErrors.employeeId = 'Employee ID is required';
      }
      if (!formData.companyCode) {
        newErrors.companyCode = 'Company code is required';
      } else if (formData.companyCode.length < 4) {
        newErrors.companyCode = 'Company code must be at least 4 characters';
      }
    }

    // HR register validations
    if (authMode === 'hr-register') {
      if (!formData.companyName) {
        newErrors.companyName = 'Company name is required';
      }
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Please enter a valid phone number';
      }
      if (!formData.companyCode) {
        newErrors.companyCode = 'Company code is required';
      } else if (formData.companyCode.length < 4) {
        newErrors.companyCode = 'Company code must be at least 4 characters';
      }
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Simulate authentication
      console.log('Form submitted:', { authMode, ...formData });
      
      // Navigate based on auth mode
      if (isUserMode) {
        navigate('/dashboard');
      } else if (isHrMode) {
        navigate('/hr-dashboard');
      }
      
      // Call the callback to trigger dashboard
      if (onLoginSuccess) {
        console.log(`✓ ${isHrMode ? 'HR' : 'User'} authentication successful`);
        onLoginSuccess();
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getSubmitButtonText = () => {
    switch (authMode) {
      case 'user-login': return 'Sign In as Candidate';
      case 'user-register': return 'Register as Candidate';
      case 'hr-login': return 'Sign In as HR';
      case 'hr-register': return 'Register as HR';
      default: return 'Sign In';
    }
  };

  const getFormTitle = () => {
    switch (authMode) {
      case 'user-login': return 'Candidate Login';
      case 'user-register': return 'Candidate Registration';
      case 'hr-login': return 'HR Portal Login';
      case 'hr-register': return 'HR Registration';
      default: return 'Login';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 rounded-full animate-spin-slow"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-12">
          {/* Left Panel - Branding & Info */}
          <div className="flex-1 css-fade-in-left">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-white to-gray-100 rounded-lg"></div>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
                </div>
                <div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    FUTURE FORUM
                  </span>
                  <p className="text-xs text-gray-400">AI & HUMANITY INTERVIEWS</p>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Welcome to the
                <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Future of Interviews
                </span>
              </h1>
              
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                {isHrMode 
                  ? "Access the HR portal to manage interviews, review candidates, and connect with AI-powered insights."
                  : "Practice with AURA AI, connect with HR experts, and master your interview skills."}
              </p>
            </div>

            {/* Features List - Dynamic based on mode */}
            <div className="space-y-4 mb-8">
              {isHrMode ? (
                <>
                  {[
                    { icon: Brain, text: 'AI Candidate Analysis', color: 'purple' },
                    { icon: Shield, text: 'Secure HR Portal', color: 'indigo' },
                    { icon: Briefcase, text: 'Interview Scheduling', color: 'blue' }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${feature.color}-600/20 to-${feature.color}-700/10 flex items-center justify-center`}>
                        <feature.icon className={`w-5 h-5 text-${feature.color}-400`} />
                      </div>
                      <span className="text-gray-300">{feature.text}</span>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {[
                    { icon: Brain, text: 'AI-Powered Mock Interviews', color: 'cyan' },
                    { icon: Shield, text: 'Secure & Private Sessions', color: 'blue' },
                    { icon: Smartphone, text: 'Real-time Voice Analysis', color: 'purple' }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${feature.color}-600/20 to-${feature.color}-700/10 flex items-center justify-center`}>
                        <feature.icon className={`w-5 h-5 text-${feature.color}-400`} />
                      </div>
                      <span className="text-gray-300">{feature.text}</span>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-xl bg-gray-800/30">
                <div className="text-2xl font-bold text-white">25K+</div>
                <div className="text-gray-400 text-sm">{isHrMode ? 'Companies' : 'Candidates'}</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-gray-800/30">
                <div className="text-2xl font-bold text-white">98.7%</div>
                <div className="text-gray-400 text-sm">Success Rate</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-gray-800/30">
                <div className="text-2xl font-bold text-white">4.9</div>
                <div className="text-gray-400 text-sm">Rating</div>
              </div>
            </div>
          </div>

          {/* Right Panel - Auth Form */}
          <div className="flex-1 w-full max-w-md css-fade-in-right">
            <div className={`bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-xl rounded-3xl border shadow-2xl p-8 ${
              isHrMode ? 'border-purple-500/20 shadow-purple-500/10' : 'border-cyan-500/20 shadow-cyan-500/10'
            }`}>
              {/* Form Title */}
              <h2 className="text-2xl font-bold text-white mb-2 text-center">
                {getFormTitle()}
              </h2>
              <p className="text-gray-400 text-center mb-8">
                {isLoginMode 
                  ? (isHrMode ? 'Access HR management portal' : 'Sign in to your candidate account')
                  : (isHrMode ? 'Register for HR portal access' : 'Create a new candidate account')}
              </p>

              {/* Auth Mode Toggle */}
              <div className="grid grid-cols-2 gap-2 mb-8">
                <button
                  onClick={() => setAuthMode('user-login')}
                  className={`py-3 text-center transition-all duration-300 rounded-xl ${
                    authMode === 'user-login' 
                      ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-500/50 text-white font-semibold' 
                      : 'text-gray-400 hover:text-white bg-gray-800/30 border border-gray-700/50'
                  }`}
                >
                  Candidate Login
                </button>
                <button
                  onClick={() => setAuthMode('user-register')}
                  className={`py-3 text-center transition-all duration-300 rounded-xl ${
                    authMode === 'user-register' 
                      ? 'bg-gradient-to-r from-emerald-600/30 to-green-600/30 border border-emerald-500/50 text-white font-semibold' 
                      : 'text-gray-400 hover:text-white bg-gray-800/30 border border-gray-700/50'
                  }`}
                >
                  Candidate Register
                </button>
                <button
                  onClick={() => setAuthMode('hr-login')}
                  className={`py-3 text-center transition-all duration-300 rounded-xl ${
                    authMode === 'hr-login' 
                      ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 border border-purple-500/50 text-white font-semibold' 
                      : 'text-gray-400 hover:text-white bg-gray-800/30 border border-gray-700/50'
                  }`}
                >
                  HR Login
                </button>
                <button
                  onClick={() => setAuthMode('hr-register')}
                  className={`py-3 text-center transition-all duration-300 rounded-xl ${
                    authMode === 'hr-register' 
                      ? 'bg-gradient-to-r from-violet-600/30 to-purple-600/30 border border-violet-500/50 text-white font-semibold' 
                      : 'text-gray-400 hover:text-white bg-gray-800/30 border border-gray-700/50'
                  }`}
                >
                  HR Register
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field (Register only) */}
                {isRegisterMode && (
                  <div>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={isHrMode ? "Full Name" : "Full Name"}
                        className={`w-full pl-12 pr-4 py-3 bg-gray-800/50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                          errors.name ? 'border-red-500/50' : 'border-gray-700/50'
                        } ${isHrMode ? 'focus:ring-purple-500/30' : 'focus:ring-cyan-500/30'}`}
                      />
                      {formData.name && !errors.name && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      )}
                    </div>
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> {errors.name}
                      </p>
                    )}
                  </div>
                )}

                {/* Employee ID Field (HR Login only) */}
                {authMode === 'hr-login' && (
                  <div>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                      <input
                        type="text"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleChange}
                        placeholder="Employee ID"
                        className={`w-full pl-12 pr-4 py-3 bg-gray-800/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all ${
                          errors.employeeId ? 'border-red-500/50' : 'border-gray-700/50'
                        }`}
                      />
                    </div>
                    {errors.employeeId && (
                      <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> {errors.employeeId}
                      </p>
                    )}
                  </div>
                )}

                {/* Email Field (for User Login/Register and HR Register) */}
                {(isUserMode || authMode === 'hr-register') && (
                  <div>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <Mail className="w-5 h-5 text-gray-500" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                        className={`w-full pl-12 pr-4 py-3 bg-gray-800/50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                          errors.email ? 'border-red-500/50' : 'border-gray-700/50'
                        } ${isHrMode ? 'focus:ring-purple-500/30' : 'focus:ring-cyan-500/30'}`}
                      />
                      {formData.email && !errors.email && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      )}
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> {errors.email}
                      </p>
                    )}
                  </div>
                )}

                {/* Company Name Field (HR Register only) */}
                {authMode === 'hr-register' && (
                  <div>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <Building className="w-5 h-5 text-gray-500" />
                      </div>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="Company Name"
                        className={`w-full pl-12 pr-4 py-3 bg-gray-800/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all ${
                          errors.companyName ? 'border-red-500/50' : 'border-gray-700/50'
                        }`}
                      />
                    </div>
                    {errors.companyName && (
                      <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> {errors.companyName}
                      </p>
                    )}
                  </div>
                )}

                {/* Phone Field (HR Register only) */}
                {authMode === 'hr-register' && (
                  <div>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <Phone className="w-5 h-5 text-gray-500" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        className={`w-full pl-12 pr-4 py-3 bg-gray-800/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all ${
                          errors.phone ? 'border-red-500/50' : 'border-gray-700/50'
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> {errors.phone}
                      </p>
                    )}
                  </div>
                )}

                {/* Company Code Field (HR modes) */}
                {(authMode === 'hr-login' || authMode === 'hr-register') && (
                  <div>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <Briefcase className="w-5 h-5 text-gray-500" />
                      </div>
                      <input
                        type="text"
                        name="companyCode"
                        value={formData.companyCode}
                        onChange={handleChange}
                        placeholder="Company Code"
                        className={`w-full pl-12 pr-4 py-3 bg-gray-800/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all ${
                          errors.companyCode ? 'border-red-500/50' : 'border-gray-700/50'
                        }`}
                      />
                    </div>
                    {errors.companyCode && (
                      <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> {errors.companyCode}
                      </p>
                    )}
                  </div>
                )}

                {/* Password Field */}
                <div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Lock className="w-5 h-5 text-gray-500" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className={`w-full pl-12 pr-12 py-3 bg-gray-800/50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.password ? 'border-red-500/50' : 'border-gray-700/50'
                      } ${isHrMode ? 'focus:ring-purple-500/30' : 'focus:ring-cyan-500/30'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password (Register only) */}
                {isRegisterMode && (
                  <div>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <Lock className="w-5 h-5 text-gray-500" />
                      </div>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        className={`w-full pl-12 pr-4 py-3 bg-gray-800/50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                          errors.confirmPassword ? 'border-red-500/50' : 'border-gray-700/50'
                        } ${isHrMode ? 'focus:ring-purple-500/30' : 'focus:ring-cyan-500/30'}`}
                      />
                      {formData.confirmPassword && formData.password === formData.confirmPassword && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      )}
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                )}

                {/* Password Requirements (Register only) */}
                {isRegisterMode && (
                  <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                    <p className="text-sm font-semibold text-gray-300 mb-2">Password must contain:</p>
                    <ul className="space-y-1 text-sm text-gray-400">
                      <li className={`flex items-center gap-2 ${formData.password.length >= 8 ? 'text-green-400' : ''}`}>
                        {formData.password.length >= 8 ? '✓' : '○'} At least 8 characters
                      </li>
                      <li className={`flex items-center gap-2 ${/[A-Z]/.test(formData.password) ? 'text-green-400' : ''}`}>
                        {/[A-Z]/.test(formData.password) ? '✓' : '○'} One uppercase letter
                      </li>
                      <li className={`flex items-center gap-2 ${/\d/.test(formData.password) ? 'text-green-400' : ''}`}>
                        {/\d/.test(formData.password) ? '✓' : '○'} One number
                      </li>
                      <li className={`flex items-center gap-2 ${/[!@#$%^&*]/.test(formData.password) ? 'text-green-400' : ''}`}>
                        {/[!@#$%^&*]/.test(formData.password) ? '✓' : '○'} One special character
                      </li>
                    </ul>
                  </div>
                )}

                {/* Forgot Password (Login modes only) */}
                {isLoginMode && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className={`text-sm transition-colors ${
                        isHrMode ? 'text-purple-400 hover:text-purple-300' : 'text-cyan-400 hover:text-cyan-300'
                      }`}
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                {/* Terms Agreement (Register only) */}
                {isRegisterMode && (
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      className={`mt-1 w-4 h-4 rounded border-gray-700/50 bg-gray-800/50 focus:ring-30 ${
                        isHrMode ? 'text-purple-500 focus:ring-purple-500/30' : 'text-cyan-500 focus:ring-cyan-500/30'
                      }`}
                    />
                    <label htmlFor="terms" className="text-sm text-gray-400">
                      I agree to the{' '}
                      <button type="button" className={`transition-colors ${
                        isHrMode ? 'text-purple-400 hover:text-purple-300' : 'text-cyan-400 hover:text-cyan-300'
                      }`}>
                        Terms of Service
                      </button>{' '}
                      and{' '}
                      <button type="button" className={`transition-colors ${
                        isHrMode ? 'text-purple-400 hover:text-purple-300' : 'text-cyan-400 hover:text-cyan-300'
                      }`}>
                        Privacy Policy
                      </button>
                    </label>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`group relative w-full py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all duration-300 overflow-hidden ${
                    authMode === 'hr-login' 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-purple-500/25' 
                      : authMode === 'hr-register'
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:shadow-violet-500/25'
                      : authMode === 'user-register'
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:shadow-emerald-500/25'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-cyan-500/25'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    {getSubmitButtonText()}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700/50"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gray-900/60 text-gray-400">Or continue with</span>
                  </div>
                </div>

                {/* Social Login (Only for User modes) */}
                {isUserMode && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="py-3 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-gray-600/50 transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="text-gray-300">Google</span>
                    </button>
                    <button
                      type="button"
                      className="py-3 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-gray-600/50 transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <span className="text-gray-300">GitHub</span>
                    </button>
                  </div>
                )}

                {/* Mode Switch Suggestions */}
                <div className="text-center text-gray-400">
                  {authMode === 'user-login' && (
                    <>
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('user-register')}
                        className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                      >
                        Register as Candidate
                      </button>
                      {' '}or{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('hr-login')}
                        className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                      >
                        HR Login
                      </button>
                    </>
                  )}
                  {authMode === 'user-register' && (
                    <>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('user-login')}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                      >
                        Candidate Login
                      </button>
                      {' '}or{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('hr-register')}
                        className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                      >
                        HR Registration
                      </button>
                    </>
                  )}
                  {authMode === 'hr-login' && (
                    <>
                      Need HR account?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('hr-register')}
                        className="text-violet-400 hover:text-violet-300 font-semibold transition-colors"
                      >
                        HR Registration
                      </button>
                      {' '}or{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('user-login')}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                      >
                        Candidate Login
                      </button>
                    </>
                  )}
                  {authMode === 'hr-register' && (
                    <>
                      Already have HR account?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('hr-login')}
                        className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                      >
                        HR Login
                      </button>
                      {' '}or{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('user-register')}
                        className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                      >
                        Candidate Registration
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>

            {/* Security Badge */}
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>256-bit encryption • GDPR compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Floating */}
      <div className="fixed bottom-8 right-8 z-20 css-fade-in-up">
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <button className="relative w-14 h-14 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/25 hover:scale-110 transition-transform">
            <Brain className="w-6 h-6 text-white" />
          </button>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-ping"></div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .css-fade-in-left { animation: cssFadeInLeft 0.6s ease forwards; }
        .css-fade-in-right { animation: cssFadeInRight 0.6s ease forwards; animation-delay: 0.2s; }
        .css-fade-in-up { animation: cssFadeInUp 0.6s ease forwards; animation-delay: 0.8s; }
        @keyframes cssFadeInLeft { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes cssFadeInRight { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes cssFadeInUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
};

export default AuthPage;