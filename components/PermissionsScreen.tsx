import React, { useState } from 'react';
import { CameraIcon, MicIcon, ShieldIcon, LockIcon, CheckCircleIcon } from './icons/Icons';

interface PermissionsScreenProps {
  onPermissionsGranted: (stream: MediaStream) => void;
}

const PermissionsScreen: React.FC<PermissionsScreenProps> = ({ onPermissionsGranted }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [grantedPermissions, setGrantedPermissions] = useState({
    camera: false,
    microphone: false
  });

  const handleRequestPermissions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setGrantedPermissions({ camera: true, microphone: true });
      
      // Simulate processing delay for better UX
      setTimeout(() => {
        onPermissionsGranted(stream);
      }, 1000);
    } catch (err) {
      console.error("Permission denied:", err);
      setError("Permissions for camera and microphone are required to start the interview. Please enable them in your browser settings and try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full animate-float" style={{animationDelay: '10s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '5s'}}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6 md:p-8">
        <div className="w-full max-w-4xl">
          <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl shadow-cyan-500/10 p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="relative inline-block mb-6">
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl"></div>
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center">
                  <ShieldIcon className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 mb-4">
                Device Permissions
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                We need access to your camera and microphone for the video interview. Your privacy is important to us, and the recordings are only used for analysis.
              </p>
            </div>

            {/* Permissions Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div className="relative group">
                <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-8 text-center hover:border-cyan-500/50 transition-all duration-300">
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl ${grantedPermissions.camera ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20' : 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10'} flex items-center justify-center border ${grantedPermissions.camera ? 'border-green-500/30' : 'border-cyan-500/30'}`}>
                    <CameraIcon className={`w-10 h-10 ${grantedPermissions.camera ? 'text-green-400' : 'text-cyan-400'}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Camera Access</h3>
                  <p className="text-gray-400 mb-6">
                    Required for video recording and face analysis
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    {grantedPermissions.camera ? (
                      <>
                        <CheckCircleIcon className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-medium">Granted</span>
                      </>
                    ) : (
                      <span className="text-gray-400">Pending</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-8 text-center hover:border-blue-500/50 transition-all duration-300">
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl ${grantedPermissions.microphone ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20' : 'bg-gradient-to-br from-blue-500/10 to-purple-500/10'} flex items-center justify-center border ${grantedPermissions.microphone ? 'border-green-500/30' : 'border-blue-500/30'}`}>
                    <MicIcon className={`w-10 h-10 ${grantedPermissions.microphone ? 'text-green-400' : 'text-blue-400'}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Microphone Access</h3>
                  <p className="text-gray-400 mb-6">
                    Required for speech recognition and voice analysis
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    {grantedPermissions.microphone ? (
                      <>
                        <CheckCircleIcon className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-medium">Granted</span>
                      </>
                    ) : (
                      <span className="text-gray-400">Pending</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Info */}
            <div className="mb-10">
              <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <LockIcon className="w-8 h-8 text-green-400 flex-shrink-0" />
                  <div>
                    <h4 className="text-xl font-bold text-white mb-3">Privacy & Security</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        <span className="text-gray-300">End-to-end encryption</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        <span className="text-gray-300">GDPR compliant</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        <span className="text-gray-300">No third-party sharing</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        <span className="text-gray-300">Auto-delete after 30 days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-8">
                <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse"></div>
                    <p className="text-red-300 font-medium">Permission Required</p>
                  </div>
                  <p className="text-red-300/80">{error}</p>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="space-y-6">
              <button
                onClick={handleRequestPermissions}
                disabled={isLoading || (grantedPermissions.camera && grantedPermissions.microphone)}
                className={`w-full py-5 px-6 rounded-xl text-xl font-bold transition-all transform ${isLoading || (grantedPermissions.camera && grantedPermissions.microphone) 
                  ? 'bg-gradient-to-r from-gray-700 to-gray-800 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/25'
                } shadow-xl shadow-cyan-500/30`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Requesting Permissions...</span>
                  </div>
                ) : grantedPermissions.camera && grantedPermissions.microphone ? (
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircleIcon className="w-6 h-6 text-green-400" />
                    <span>All Permissions Granted</span>
                  </div>
                ) : (
                  'Grant All Permissions'
                )}
              </button>

              {/* Bottom Text */}
              <div className="text-center">
                <p className="text-gray-500 text-sm">
                  Your data is encrypted and never shared with third parties
                </p>
                <div className="flex items-center justify-center gap-2 mt-4 text-gray-400">
                  <ShieldIcon className="w-4 h-4" />
                  <span className="text-sm">256-bit encryption • GDPR compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionsScreen;