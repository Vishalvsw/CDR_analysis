import React from 'react';
import { SummaryStats as SummaryStatsType } from '../types';

interface SummaryStatsProps {
  stats: SummaryStatsType;
}

// FIX: Replaced JSX.Element with React.ReactNode to resolve "Cannot find namespace 'JSX'" error.
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-slate-800 p-6 rounded-lg shadow-lg flex items-center space-x-4">
    <div className="flex-shrink-0 bg-slate-700 rounded-md p-3">
        {icon}
    </div>
    <div>
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const SummaryStats: React.FC<SummaryStatsProps> = ({ stats }) => {
  const icons = {
    totalCalls: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
    duration: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    imeis: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
    dateRange: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Calls" value={stats.totalCalls.toLocaleString()} icon={icons.totalCalls} />
      <StatCard title="Total Duration" value={stats.totalDurationFormatted} icon={icons.duration} />
      <StatCard title="Unique IMEIs" value={stats.uniqueImeis.toLocaleString()} icon={icons.imeis} />
      <StatCard title="Date Range" value={stats.dateRange} icon={icons.dateRange} />
    </div>
  );
};

export default SummaryStats;