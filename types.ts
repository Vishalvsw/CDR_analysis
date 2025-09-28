
export interface CdrRecord {
  [key: string]: string | number | Date;
}

export interface SummaryStats {
  totalCalls: number;
  totalDurationSec: number;
  totalDurationFormatted: string;
  uniqueImeis: number;
  uniqueImsis: number;
  roamingCalls: number;
  dateRange: string;
}

export interface NameValue {
    name: string;
    value: number;
}

export interface NameCount {
    name: string;
    count: number;
}

export interface NameCountPercent {
    name: string;
    count: number;
    percentage: number;
}

export interface DateCount {
    date: string;
    count: number;
}

export interface AnalysisResult {
  summaryStats: SummaryStats;
  crimeAnalysis: {
    topCrimes: NameCountPercent[];
  };
  callAnalysis: {
    topBParties: NameCount[];
    callTypeDistribution: NameValue[];
    callsPerDay: DateCount[];
  };
  locationAnalysis: {
    callsByCity: NameCount[];
  };
  deviceAnalysis: {
    topImeis: NameCount[];
    imeiManufacturerDistribution: NameValue[];
  };
}

// For react-leaflet map
export interface GeoPoint {
    lat: number;
    lng: number;
    count: number;
}
