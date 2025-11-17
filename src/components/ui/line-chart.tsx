'use client';

import { LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LineChartProps {
  data: { week: string; spend: number; revenue: number }[];
  title?: string;
}

export const LineChart = ({ data, title }: LineChartProps) => (
  <div className="bg-gray-700 p-4 text-white rounded-lg mb-8">
    {title && <h3 className="text-white font-bold mb-2">{title}</h3>}
    <ResponsiveContainer width="100%" height={300}>
      <ReLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#888" />
        <XAxis dataKey="week" stroke="#fff" />
        <YAxis stroke="#fff" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="spend" stroke="#8884d8" />
        <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
      </ReLineChart>
    </ResponsiveContainer>
  </div>
);
