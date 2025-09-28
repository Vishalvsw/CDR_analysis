
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex flex-col items-center justify-center z-50">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
        <p className="text-white text-lg mt-4 font-semibold">Analyzing Data with Gemini...</p>
        <p className="text-slate-400 text-sm mt-1">This may take a moment.</p>
    </div>
  );
};

export default Loader;
