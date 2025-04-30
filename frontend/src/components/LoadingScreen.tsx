import React from 'react';
import { BaseIcon, GroqIcon, ScreenpipeIcon } from './icons';

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-white to-gray-50 flex items-center justify-center z-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-fade-in">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <BaseIcon className="w-16 h-16 text-primary animate-pulse" />
          </div>

          {/* Loading message */}
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-3">
            Starting up PeerHire
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Our servers are spinning up. This may take a few seconds...
          </p>

          {/* Tech stack */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center">
              <BaseIcon className="w-10 h-10 text-primary mb-2" />
              <span className="text-sm text-gray-600 text-center">Base Network</span>
            </div>
            <div className="flex flex-col items-center">
              <GroqIcon className="w-10 h-10 text-accent mb-2" />
              <span className="text-sm text-gray-600 text-center">Grok AI</span>
            </div>
            <div className="flex flex-col items-center">
              <ScreenpipeIcon className="w-10 h-10 text-success mb-2" />
              <span className="text-sm text-gray-600 text-center">Screenpipe</span>
            </div>
          </div>

          {/* Loading bar */}
          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full"
              style={{
                width: '90%',
                animation: 'progress 2s ease-in-out infinite'
              }}
            />
          </div>

          {/* Render info */}
          <p className="text-xs text-gray-500 text-center">
            Hosted on Render • Serverless Infrastructure
          </p>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 90%; }
          100% { width: 95%; }
        }
      `}</style>
    </div>
  );
};