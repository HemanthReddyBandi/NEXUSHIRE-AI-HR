// SetupScreen.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { Resume } from '../types';
import { JOB_ROLES } from '../constants';
import { UploadIcon, BriefcaseIcon, FileTextIcon, SettingsIcon } from './icons/Icons';

interface SetupScreenProps {
  onSetupComplete: (jobRole: string, resume: Resume) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onSetupComplete }) => {
  const [jobRole, setJobRole] = useState(JOB_ROLES[0]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const savedResumes = localStorage.getItem('resumes');
    if (savedResumes) {
      const parsedResumes = JSON.parse(savedResumes);
      setResumes(parsedResumes);
      if (parsedResumes.length > 0) {
        setSelectedResume(parsedResumes[0]);
      }
    }
  }, []);

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 50);
  };

  const handleResumeUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      simulateUpload();
      const reader = new FileReader();
      reader.onload = (e) => {
        setTimeout(() => {
          const content = e.target?.result as string;
          const newResume: Resume = { 
            name: file.name, 
            content,
            uploaded: new Date().toLocaleDateString()
          };
          const updatedResumes = [newResume, ...resumes.filter(r => r.name !== file.name)];
          setResumes(updatedResumes);
          setSelectedResume(newResume);
          localStorage.setItem('resumes', JSON.stringify(updatedResumes));
          setUploadProgress(0);
        }, 1000);
      };
      reader.readAsText(file);
    }
  }, [resumes]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jobRole && selectedResume) {
      console.log("✓ Setup submitted - Job Role:", jobRole);
      onSetupComplete(jobRole, selectedResume);
    } else {
      alert('Please select a job role and upload or select a resume.');
    }
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center p-4">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/30 mb-6">
            <SettingsIcon className="w-10 h-10 text-purple-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-400 mb-4">
            Interview Setup
          </h2>
          <p className="text-gray-300/90 text-lg max-w-2xl mx-auto">
            Configure your mock interview by selecting your target role and uploading your resume for personalized questions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Job Role Selection */}
          <div className="group p-1 rounded-2xl bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-xl border border-purple-500/20 shadow-2xl shadow-purple-500/10">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600/20 to-indigo-600/20 flex items-center justify-center">
                  <BriefcaseIcon className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Target Job Role</h3>
                  <p className="text-gray-400 text-sm">Select the position you're preparing for</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {JOB_ROLES.map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setJobRole(role)}
                    className={`p-4 rounded-xl border transition-all duration-300 transform hover:scale-105 ${
                      jobRole === role 
                        ? 'bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border-purple-500/50 shadow-lg shadow-purple-500/10' 
                        : 'bg-gray-800/30 border-gray-700/50 hover:border-purple-500/30'
                    }`}
                  >
                    <div className="text-left">
                      <div className={`font-semibold mb-1 ${
                        jobRole === role ? 'text-white' : 'text-gray-300'
                      }`}>{role}</div>
                      <div className="text-xs text-gray-500">AI-powered questions</div>
                    </div>
                    {jobRole === role && (
                      <div className="mt-2 w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto"></div>
                    )}
                  </button>
                ))}
              </div>
              
              <div className="mt-6 p-4 rounded-lg bg-gray-900/30 border border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-semibold">Selected:</span>
                  <span className="text-white font-bold">{jobRole}</span>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Questions will be tailored specifically for this role based on industry standards
                </p>
              </div>
            </div>
          </div>

          {/* Resume Upload/Selection */}
          <div className="group p-1 rounded-2xl bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-xl border border-blue-500/20 shadow-2xl shadow-blue-500/10">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 flex items-center justify-center">
                  <FileTextIcon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Resume Upload</h3>
                  <p className="text-gray-400 text-sm">Upload your resume for personalized questions</p>
                </div>
              </div>

              {/* Upload Area */}
              <label 
                htmlFor="resume-upload" 
                className="block border-3 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 hover:border-blue-500/50 hover:bg-gray-800/30 border-gray-700/50 mb-8"
              >
                <input 
                  id="resume-upload" 
                  type="file" 
                  className="hidden" 
                  accept=".txt,.pdf,.md,.doc,.docx" 
                  onChange={handleResumeUpload} 
                />
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 flex items-center justify-center">
                    <UploadIcon className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white mb-2">Upload Resume</div>
                    <p className="text-gray-400">Drag & drop or click to browse</p>
                    <p className="text-gray-500 text-sm mt-2">Supports: TXT, PDF, DOC, DOCX, MD</p>
                  </div>
                </div>
                
                {/* Upload Progress */}
                {uploadProgress > 0 && (
                  <div className="mt-6 max-w-md mx-auto">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </label>

              {/* Previous Resumes */}
              {resumes.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Select Previous Resume
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto pr-4 custom-scrollbar">
                    {resumes.map(resume => (
                      <div
                        key={resume.name}
                        onClick={() => setSelectedResume(resume)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                          selectedResume?.name === resume.name
                            ? 'bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border-purple-500/50'
                            : 'bg-gray-800/30 border-gray-700/50 hover:border-purple-500/30'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              selectedResume?.name === resume.name
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600'
                                : 'bg-gray-700'
                            }`}>
                              <FileTextIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className={`font-semibold ${
                                selectedResume?.name === resume.name ? 'text-white' : 'text-gray-300'
                              }`}>
                                {resume.name}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {resume.uploaded && `Uploaded: ${resume.uploaded}`}
                                {resume.size && ` • ${resume.size}`}
                              </div>
                            </div>
                          </div>
                          {selectedResume?.name === resume.name && (
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Summary & Submit */}
          <div className="group p-1 rounded-2xl bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-xl border border-green-500/20 shadow-2xl shadow-green-500/10">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Ready to Start</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-300">Job Role: <span className="text-white font-semibold">{jobRole}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-300">Resume: <span className="text-white font-semibold">
                        {selectedResume ? selectedResume.name : 'Not selected'}
                      </span></span>
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={!jobRole || !selectedResume}
                  className="group relative px-12 py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-700 disabled:to-gray-800 text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed shadow-2xl shadow-green-500/20 hover:shadow-green-500/30 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <span className="relative flex items-center justify-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Proceed to Permissions
                  </span>
                </button>
              </div>
              
              {(!jobRole || !selectedResume) && (
                <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-red-900/20 to-rose-900/10 border border-red-500/30">
                  <p className="text-red-300 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Please select a job role and upload a resume to continue
                  </p>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(168, 85, 247, 0.3) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.5);
        }
      `}</style>
    </div>
  );
};

export default SetupScreen;