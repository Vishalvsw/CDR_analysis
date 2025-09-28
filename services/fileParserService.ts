
import * as XLSX from 'xlsx';
import { CdrRecord } from '../types';

const normalizeHeader = (header: string): string => {
  return header.trim().toLowerCase().replace(/\s+/g, '').replace(/[\(\)]/g, '');
};

const REQUIRED_COLUMNS = ['date', 'time', 'duration'];

export const parseExcelFile = (file: File): Promise<CdrRecord[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        if (!e.target?.result) {
          return reject(new Error('File could not be read.'));
        }
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Use header option to get raw headers
        const jsonDataRaw: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
        
        if (jsonDataRaw.length < 2) {
          return resolve([]);
        }

        const rawHeaders: string[] = jsonDataRaw[0];
        const normalizedHeaders = rawHeaders.map(normalizeHeader);

        // Check for required columns
        for (const col of REQUIRED_COLUMNS) {
            if (!normalizedHeaders.includes(col)) {
                reject(new Error(`Missing required column: "${col}". Please ensure your file includes Date, Time, and Duration.`));
                return;
            }
        }
        
        const jsonData = XLSX.utils.sheet_to_json<CdrRecord>(worksheet, {
            raw: false, // get formatted text
            dateNF: 'yyyy-mm-dd', // format dates
        });
        
        const formattedData = jsonData.map(row => {
            const newRow: CdrRecord = {};
            for (const key in row) {
                const normalizedKey = normalizeHeader(key);
                // Combine date and time into a single datetime field for easier processing
                if (normalizedKey === 'date' && row['Time']) {
                  const dateStr = row[key];
                  const timeStr = row['Time'];
                  // Attempt to create a valid Date object
                  const dateTime = new Date(`${dateStr} ${timeStr}`);
                  newRow['datetime'] = isNaN(dateTime.getTime()) ? `${dateStr} ${timeStr}` : dateTime;
                }
                newRow[normalizedKey] = row[key];
            }
            return newRow;
        });

        resolve(formattedData);
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        reject(new Error('Failed to parse the Excel file. It might be corrupted or in an unsupported format.'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};
