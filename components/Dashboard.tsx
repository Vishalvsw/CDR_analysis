import React from 'react';
import { AnalysisResult, CdrRecord } from '../types';
import SummaryStats from './SummaryStats';
import { CallTypePieChart, CallsPerDayLineChart, ManufacturerBarChart } from './Charts';
import TopListTable from './TopListTable';
import LocationMap from './LocationMap';
import { exportToPdf, exportToExcel, exportToCsv } from '../services/exportService';

interface DashboardProps {
  analysisResult: AnalysisResult;
  cdrData: CdrRecord[];
  fileName: string;
  onReset: () => void;
  lastUpdated: Date | null;
}

const Dashboard: React.FC<DashboardProps> = ({ analysisResult, cdrData, fileName, onReset, lastUpdated }) => {
  
    const handlePdfExport = () => {
        exportToPdf('analysis-dashboard', fileName);
    };

    const handleExcelExport = () => {
        exportToExcel(analysisResult, fileName);
    };

    const handleCsvExport = () => {
        exportToCsv(cdrData, fileName);
    };

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-800 p-4 rounded-lg shadow-lg">
            <div>
                <h2 className="text-xl font-bold text-white">Analysis for: <span className="text-cyan-400">{fileName}</span></h2>
                {lastUpdated && (
                    <div className="flex items-center text-xs text-slate-400 mt-1">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 animate-pulse text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>Last updated: {lastUpdated.toLocaleTimeString()} (refreshes automatically)</span>
                    </div>
                )}
            </div>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <button onClick={handleExcelExport} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">Export Excel</button>
                <button onClick={handleCsvExport} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">Export CSV</button>
                <button onClick={handlePdfExport} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">Export PDF</button>
                <button onClick={onReset} className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">New Analysis</button>
            </div>
        </div>

        <div id="analysis-dashboard" className="p-4 bg-slate-900">
            <SummaryStats stats={analysisResult.summaryStats} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                 <div className="lg:col-span-1">
                    <TopListTable title="Top Crimes" data={analysisResult.crimeAnalysis.topCrimes} headers={['Crime', 'Count', '%']} />
                </div>
                <div className="lg:col-span-1">
                     <TopListTable title="Top B-Parties" data={analysisResult.callAnalysis.topBParties} headers={['B-Party', 'Count']} />
                </div>
                <div className="lg:col-span-1">
                     <TopListTable title="Top IMEIs" data={analysisResult.deviceAnalysis.topImeis} headers={['IMEI', 'Count']} />
                </div>
                <div className="lg:col-span-3">
                    <CallsPerDayLineChart data={analysisResult.callAnalysis.callsPerDay} />
                </div>
                <div className="lg:col-span-1 h-96">
                    <CallTypePieChart data={analysisResult.callAnalysis.callTypeDistribution} />
                </div>
                <div className="lg:col-span-2 h-96">
                    <ManufacturerBarChart data={analysisResult.deviceAnalysis.imeiManufacturerDistribution} />
                </div>
                <div className="lg:col-span-3 h-96">
                   <LocationMap data={cdrData} />
                </div>
                 <div className="lg:col-span-3">
                     <TopListTable title="Calls by Main City" data={analysisResult.locationAnalysis.callsByCity} headers={['City', 'Count']} />
                </div>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;