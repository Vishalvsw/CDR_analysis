import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { AnalysisResult, CdrRecord } from '../types';

export const exportToPdf = async (elementId: string, fileName: string): Promise<void> => {
    const input = document.getElementById(elementId);
    if (!input) {
        console.error(`Element with id ${elementId} not found.`);
        return;
    }

    const canvas = await html2canvas(input, {
      scale: 2, // Higher scale for better quality
      backgroundColor: '#0f172a', // Match app background
      useCORS: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${fileName.replace(/\.xlsx?$/, '')}_report.pdf`);
};


export const exportToExcel = (analysis: AnalysisResult, fileName: string): void => {
    const wb = XLSX.utils.book_new();

    // Summary Sheet
    const summaryData = [
        ['Metric', 'Value'],
        ['Total Calls', analysis.summaryStats.totalCalls],
        ['Total Duration', analysis.summaryStats.totalDurationFormatted],
        ['Unique IMEIs', analysis.summaryStats.uniqueImeis],
        ['Unique IMSIs', analysis.summaryStats.uniqueImsis],
        ['Roaming Calls', analysis.summaryStats.roamingCalls],
        ['Date Range', analysis.summaryStats.dateRange],
    ];
    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

    // Top Crimes
    const topCrimesWs = XLSX.utils.json_to_sheet(analysis.crimeAnalysis.topCrimes);
    XLSX.utils.book_append_sheet(wb, topCrimesWs, 'Top Crimes');
    
    // Top B-Parties
    const topBPartiesWs = XLSX.utils.json_to_sheet(analysis.callAnalysis.topBParties);
    XLSX.utils.book_append_sheet(wb, topBPartiesWs, 'Top B-Parties');

    // Calls by City
    const callsByCityWs = XLSX.utils.json_to_sheet(analysis.locationAnalysis.callsByCity);
    XLSX.utils.book_append_sheet(wb, callsByCityWs, 'Calls by City');

    // Calls Per Day
    const callsPerDayWs = XLSX.utils.json_to_sheet(analysis.callAnalysis.callsPerDay);
    XLSX.utils.book_append_sheet(wb, callsPerDayWs, 'Calls Per Day');

    XLSX.writeFile(wb, `${fileName.replace(/\.xlsx?$/, '')}_analysis.xlsx`);
};

export const exportToCsv = (data: CdrRecord[], fileName: string): void => {
    const ws = XLSX.utils.json_to_sheet(data);
    const csvOutput = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName.replace(/\.xlsx?$/, '')}_data.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};