import React from 'react';

const LoadingSpinner = ({ fullScreen = false, message = "Synchronizing..." }) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-8 p-12 bg-white rounded-[2.5rem] skeuo-raised border border-slate-100 shadow-2xl">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-[6px] border-indigo-500/10 border-t-indigo-600 animate-spin shadow-inner"></div>
        <div className="absolute inset-3 rounded-full border-[6px] border-purple-500/5 border-b-purple-500 animate-[spin_2s_linear_infinite_reverse]"></div>
      </div>
      {message && (
        <div className="space-y-2 text-center">
          <p className="text-slate-900 font-black text-lg tracking-tight animate-pulse font-outfit">{message}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Please Wait</p>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-md flex items-center justify-center z-[100] p-10">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
