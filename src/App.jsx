import { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/queryClient';
import { router } from './router';
import './config/i18n';
import './index.css';

function App() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const enterFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => setIsFullscreen(true));
    } else {
      setIsFullscreen(true);
    }
  };

  // Fullscreen Overlay - Ref: IOTF3PadInput
  if (!isFullscreen) {
    return (
      <button
        className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center cursor-pointer border-none outline-none select-none overflow-hidden"
        onClick={enterFullscreen}
      >
        <div className="text-center relative">
          {/* Decorative Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10">
            <div className="text-blue-500 text-[8rem] mb-8 flex justify-center">
              <svg className="w-32 h-32 animate-pulse-blue rounded-full p-6 bg-blue-500/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </div>
            <h1 className="text-white font-black text-5xl uppercase tracking-[0.3em] mb-4 italic">
              F1 Pad Input
            </h1>
            <p className="text-blue-500 font-bold text-2xl animate-pulse tracking-widest uppercase">
              Chạm để bắt đầu
            </p>
            <p className="text-zinc-500 text-sm mt-6 uppercase tracking-[0.4em] opacity-40 italic">
              Touch to enter system
            </p>
          </div>
        </div>
      </button>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
