
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { CdrRecord, AnalysisResult } from './types';
import { parseExcelFile } from './services/fileParserService';
import { analyzeCdrData } from './services/geminiService';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';

const App: React.FC = () => {
    const [cdrData, setCdrData] = useState<CdrRecord[] | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [currentFile, setCurrentFile] = useState<File | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const isRefreshing = useRef(false);

    const handleFileProcess = useCallback(async (file: File) => {
        setIsLoading(true);
        setError(null);
        setFileName(file.name);
        setCurrentFile(file);
        setAnalysisResult(null);
        setCdrData(null);
        setLastUpdated(null);

        try {
            const data = await parseExcelFile(file);
            if (data.length === 0) {
                throw new Error("The uploaded file seems to be empty or in an unsupported format.");
            }
            setCdrData(data);

            const result = await analyzeCdrData(data);
            setAnalysisResult(result);
            setLastUpdated(new Date());
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during processing.';
            setError(`Failed to process file. ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const handleReset = () => {
        setCdrData(null);
        setAnalysisResult(null);
        setError(null);
        setIsLoading(false);
        setFileName('');
        setCurrentFile(null);
        setLastUpdated(null);
    };

    const handleRefresh = useCallback(async () => {
        if (!currentFile || isRefreshing.current) {
            return;
        }
    
        isRefreshing.current = true;
        console.log("Auto-refreshing data...");
    
        try {
            const data = await parseExcelFile(currentFile);
            const result = await analyzeCdrData(data);
            
            if (analysisResult) { // Only update if user is still on the dashboard
                setCdrData(data);
                setAnalysisResult(result);
                setLastUpdated(new Date());
                console.log("Data refreshed successfully.");
            }
        } catch (err) {
            console.error("Auto-refresh failed:", err);
            // Do not show a blocking error for a background refresh
        } finally {
            isRefreshing.current = false;
        }
    }, [currentFile, analysisResult]);

    useEffect(() => {
        if (analysisResult && currentFile) {
            const intervalId = setInterval(() => {
                handleRefresh();
            }, 60000); // Refresh every 60 seconds

            return () => {
                clearInterval(intervalId);
            };
        }
    }, [analysisResult, currentFile, handleRefresh]);

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white tracking-tight">AI-Powered CDR Analysis Dashboard</h1>
                <p className="text-slate-400 mt-2">Upload an Excel file to generate an interactive report.</p>
            </header>
            <main className="max-w-7xl mx-auto">
                {isLoading && <Loader />}
                {error && <ErrorMessage message={error} onClear={() => setError(null)} />}

                {!isLoading && !analysisResult && !error && (
                    <FileUpload onFileProcess={handleFileProcess} />
                )}

                {!isLoading && analysisResult && cdrData && (
                    <Dashboard
                        analysisResult={analysisResult}
                        cdrData={cdrData}
                        fileName={fileName}
                        onReset={handleReset}
                        lastUpdated={lastUpdated}
                    />
                )}
            </main>
             <footer className="text-center mt-12 text-slate-500 text-sm">
                <p>Powered by React, Tailwind CSS, and Gemini API</p>
            </footer>
        </div>
    );
};

export default App;
