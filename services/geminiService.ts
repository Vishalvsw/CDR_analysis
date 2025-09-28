
import { GoogleGenAI, Type } from "@google/genai";
import { CdrRecord, AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    summaryStats: {
      type: Type.OBJECT,
      properties: {
        totalCalls: { type: Type.NUMBER },
        totalDurationSec: { type: Type.NUMBER },
        totalDurationFormatted: { type: Type.STRING },
        uniqueImeis: { type: Type.NUMBER },
        uniqueImsis: { type: Type.NUMBER },
        roamingCalls: { type: Type.NUMBER },
        dateRange: { type: Type.STRING },
      },
      required: ['totalCalls', 'totalDurationSec', 'totalDurationFormatted', 'uniqueImeis', 'uniqueImsis', 'roamingCalls', 'dateRange']
    },
    crimeAnalysis: {
      type: Type.OBJECT,
      properties: {
        topCrimes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              count: { type: Type.NUMBER },
              percentage: { type: Type.NUMBER },
            },
            required: ['name', 'count', 'percentage']
          }
        }
      },
       required: ['topCrimes']
    },
    callAnalysis: {
      type: Type.OBJECT,
      properties: {
        topBParties: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, count: { type: Type.NUMBER } }, required: ['name', 'count'] } },
        callTypeDistribution: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, value: { type: Type.NUMBER } }, required: ['name', 'value'] } },
        callsPerDay: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { date: { type: Type.STRING }, count: { type: Type.NUMBER } }, required: ['date', 'count'] } }
      },
      required: ['topBParties', 'callTypeDistribution', 'callsPerDay']
    },
    locationAnalysis: {
      type: Type.OBJECT,
      properties: {
        callsByCity: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, count: { type: Type.NUMBER } }, required: ['name', 'count'] } }
      },
      required: ['callsByCity']
    },
    deviceAnalysis: {
      type: Type.OBJECT,
      properties: {
        topImeis: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, count: { type: Type.NUMBER } }, required: ['name', 'count'] } },
        imeiManufacturerDistribution: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, value: { type: Type.NUMBER } }, required: ['name', 'value'] } }
      },
      required: ['topImeis', 'imeiManufacturerDistribution']
    }
  },
  required: ['summaryStats', 'crimeAnalysis', 'callAnalysis', 'locationAnalysis', 'deviceAnalysis']
};

export async function analyzeCdrData(data: CdrRecord[]): Promise<AnalysisResult> {
  const sampleData = data.length > 500 ? data.slice(0, 500) : data; // Use a sample to avoid oversized prompts
  const prompt = `
    You are an expert data analyst specializing in Call Detail Records (CDR). 
    I will provide a JSON array of CDR records. Perform a comprehensive analysis and return the results in a single, structured JSON object that strictly conforms to the provided schema.

    The CDR data may contain the following columns, but some may be missing:
    'CdrNo', 'B Party', 'Date', 'Time', 'Duration', 'Call Type', 'First Cell ID', 'First Cell ID Address', 'Last Cell ID', 'Last Cell ID Address', 'IMEI', 'IMSI', 'Roaming', 'Main City(First CellID)', 'Sub City (First CellID)', 'Lat-Long-Azimuth (First CellID)', 'Crime', 'Circle', 'Operator', 'LRN', 'CallForward', 'RoamingOriginated', 'B Party Provider', 'B Party Circle', 'B Party Operator', 'Type', 'IMEI Manufacturer', 'Device Type'

    Perform the following analyses based on the FULL dataset statistics (even though I am only sending a sample):
    1.  **Summary Stats:**
        *   Calculate total calls, total duration (in seconds and HH:MM:SS), unique IMEIs, unique IMSIs, roaming calls, and the date range (min to max date).
    2.  **Crime Analysis:**
        *   Provide the top 10 crimes by frequency, including count and percentage.
    3.  **Call Analysis:**
        *   Top 10 B Parties by call count.
        *   Distribution of call types (e.g., 'Incoming', 'Outgoing').
        *   Number of calls per day, sorted chronologically.
    4.  **Location Analysis:**
        *   Call counts by 'Main City(First CellID)'.
    5.  **Device Analysis:**
        *   Top 10 IMEIs by call count.
        *   Distribution of IMEI manufacturers.

    Handle missing or inconsistent data gracefully. If a column is missing for an analysis, return an empty array for that specific result.
    
    The total record count from the original file is ${data.length}. Please use this for percentage calculations.
    Here is a sample of the CDR data:
    ${JSON.stringify(sampleData)}
    `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as AnalysisResult;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from AI. The model may be unable to process the data format.");
  }
}
