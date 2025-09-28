
import React, { useState, useCallback } from 'react';

interface FileUploadProps {
  onFileProcess: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileProcess }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileProcess(e.target.files[0]);
    }
  };
  
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileProcess(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, [onFileProcess]);

  return (
    <div className="max-w-2xl mx-auto">
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`flex justify-center items-center w-full px-6 py-12 border-2 border-dashed rounded-lg transition-colors duration-300
        ${isDragging ? 'border-cyan-400 bg-slate-700' : 'border-slate-600 bg-slate-800 hover:border-slate-500'}`}
      >
        <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          <p className="mt-5 text-lg font-semibold text-slate-200">Drop your CDR file here</p>
          <p className="mt-1 text-sm text-slate-400">or click to browse</p>
          <label htmlFor="file-upload" className="relative cursor-pointer mt-4 inline-block">
            <span className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200">
                Select File
            </span>
            <input 
                id="file-upload" 
                name="file-upload" 
                type="file" 
                className="sr-only" 
                onChange={handleFileChange}
                accept=".xlsx, .xls"
            />
          </label>
           <p className="mt-4 text-xs text-slate-500">Supports .xlsx and .xls files</p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
