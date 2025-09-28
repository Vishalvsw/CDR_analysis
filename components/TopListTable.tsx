import React from 'react';
import AnalysisCard from './AnalysisCard';

interface TopListTableProps {
  title: string;
  // FIX: Loosened the type of `data` to accept arrays of any object.
  // This resolves assignability issues from specific types like `NameCount[]` in parent components
  // and also resolves the comparison error below by making the cell value `any`.
  data: Array<{ [key: string]: any }>;
  headers: string[];
}

const TopListTable: React.FC<TopListTableProps> = ({ title, data, headers }) => {
  if (!data || data.length === 0) {
    return (
      <AnalysisCard title={title}>
        <div className="flex items-center justify-center h-full text-slate-400">
          No data available for this category.
        </div>
      </AnalysisCard>
    );
  }
  
  const dataKeys = Object.keys(data[0]);

  return (
    <AnalysisCard title={title}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-slate-400 uppercase bg-slate-700">
            <tr>
              {headers.map((header, index) => (
                <th key={index} scope="col" className="px-4 py-3">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-slate-700 hover:bg-slate-600/50">
                {dataKeys.map((key, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3">
                    {typeof row[key] === 'number' && row[key] < 100 ? parseFloat(row[key].toString()).toFixed(2) : row[key].toLocaleString()}
                    {headers[cellIndex] === '%' && '%'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AnalysisCard>
  );
};

export default TopListTable;