
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { NameValue, DateCount } from '../types';
import AnalysisCard from './AnalysisCard';

const COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

interface ChartProps<T> {
  data: T[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-700 text-white p-2 border border-slate-600 rounded-md shadow-lg">
                <p className="label font-bold">{`${label}`}</p>
                <p className="intro">{`${payload[0].name}: ${payload[0].value.toLocaleString()}`}</p>
            </div>
        );
    }
    return null;
};

export const CallTypePieChart: React.FC<ChartProps<NameValue>> = ({ data }) => (
    <AnalysisCard title="Call Type Distribution">
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    </AnalysisCard>
);

export const CallsPerDayLineChart: React.FC<ChartProps<DateCount>> = ({ data }) => (
    <AnalysisCard title="Calls Per Day" className="col-span-1 md:col-span-2 lg:col-span-3">
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="count" name="Calls" stroke="#06b6d4" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    </AnalysisCard>
);

export const ManufacturerBarChart: React.FC<ChartProps<NameValue>> = ({ data }) => (
    <AnalysisCard title="Device Manufacturers">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis type="category" dataKey="name" width={100} stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Count" fill="#8b5cf6" />
            </BarChart>
        </ResponsiveContainer>
    </AnalysisCard>
);
