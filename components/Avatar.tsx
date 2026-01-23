// Avatar.tsx
import React from 'react';
import { BotIcon } from './icons/Icons';

interface AvatarProps {
  isSpeaking: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ isSpeaking }) => {
  return (
    <div className="relative">
      {/* Outer pulsing rings */}
      <div
        className={`absolute -inset-6 rounded-full transition-all duration-1000 ${
          isSpeaking ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute inset-0 rounded-full bg-purple-500/20 animate-ping"></div>
        <div className="absolute inset-3 rounded-full bg-indigo-500/20 animate-ping delay-200"></div>
      </div>

      {/* Main avatar */}
      <div
        className={`relative w-44 h-44 rounded-3xl bg-gradient-to-br from-gray-900 to-black
        flex items-center justify-center border-2 shadow-2xl transition-all duration-500
        ${isSpeaking ? 'border-purple-500 scale-110' : 'border-purple-500/40 scale-100'}`}
      >
        {/* Inner glow */}
        <div className="absolute inset-3 rounded-2xl bg-purple-600/10"></div>

        {/* Robot Face */}
        <div className="relative flex flex-col items-center gap-4 z-10">
          
          {/* Eyes */}
          <div className="flex gap-6">
            <div className={`w-4 h-4 rounded-full bg-cyan-400 shadow-lg ${isSpeaking ? 'animate-blink' : ''}`}></div>
            <div className={`w-4 h-4 rounded-full bg-cyan-400 shadow-lg ${isSpeaking ? 'animate-blink delay-150' : ''}`}></div>
          </div>

          {/* Mouth (voice synced) */}
          <div
            className={`w-14 rounded-md bg-gradient-to-r from-purple-400 to-indigo-400
            transition-all duration-300 ${
              isSpeaking ? 'h-5 animate-mouth' : 'h-2'
            }`}
          ></div>
        </div>

        {/* AI Icon subtle background */}
        <BotIcon className="absolute w-28 h-28 text-purple-500/10" />
      </div>

      {/* Voice bars */}
      {isSpeaking && (
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-1.5 h-6 bg-purple-400 rounded-full animate-speak"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      )}


    </div>
  );
};

export default Avatar;
