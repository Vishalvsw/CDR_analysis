
import React from 'react';

interface AnalysisCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-slate-800 p-4 sm:p-6 rounded-lg shadow-lg ${className}`}>
      <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
      <div className="h-full">
        {children}
      </div>
    </div>
  );
};

export default AnalysisCard;
