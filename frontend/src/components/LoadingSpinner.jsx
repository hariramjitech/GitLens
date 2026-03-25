import React from 'react';

const LoadingSpinner = ({ fullScreen = false, message = "Synchronizing..." }) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-6 p-10 bg-[#0a0a0a] rounded-[2rem] border border-white/5 shadow-2xl backdrop-blur-3xl animate-in zoom-in duration-500">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-white/5 border-t-white/40 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-2 border-white/5 border-b-white/20 animate-[spin_1.5s_linear_infinite_reverse]"></div>
      </div>
      {message && (
        <div className="space-y-1 text-center">
          <p className="text-white/80 font-semibold text-sm tracking-tight animate-pulse">{message}</p>
          <p className="text-[9px] text-white/20 font-semibold uppercase tracking-[0.2em]">System Active</p>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-10">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
