'use client';

import { Navbar } from '../../src/components/ui/navbar';
import { CardMetric } from '../../src/components/ui/card-metric';
import { Footer } from '../../src/components/ui/footer';
import { Users, TrendingUp, Target } from 'lucide-react';
import marketingData from '../../src/data/marketing.json';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// BarChart component
const BarChart = ({ data }) => (
  <div className="bg-gray-700 p-4 text-white mb-8 rounded-lg">
    <h3 className="text-white font-bold mb-2">Spend & Revenue by Age Group</h3>
    <ResponsiveContainer width="100%" height={300}>
      <ReBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#888" />
        <XAxis dataKey="age" stroke="#fff" />
        <YAxis stroke="#fff" />
        <Tooltip />
        <Legend />
        <Bar dataKey="spend" fill="#8884d8" />
        <Bar dataKey="revenue" fill="#82ca9d" />
      </ReBarChart>
    </ResponsiveContainer>
  </div>
);

// Table component
const Table = ({ data }) => (
  <div className="overflow-x-auto mb-8">
    <table className="min-w-full text-white border border-gray-500">
      <thead>
        <tr className="bg-gray-800">
          {Object.keys(data[0] || {}).map((key) => (
            <th key={key} className="px-4 py-2 border">{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} className="border-t border-gray-600">
            {Object.values(row).map((val, j) => (
              <td key={j} className="px-4 py-2 border">{val}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function DemographicView() {
  // Separate male and female data
  const maleData = marketingData.filter(d => d.gender === 'male');
  const femaleData = marketingData.filter(d => d.gender === 'female');

  // Cards metrics
  const totalMaleClicks = maleData.reduce((sum, d) => sum + d.clicks, 0);
  const totalMaleSpend = maleData.reduce((sum, d) => sum + d.spend, 0);
  const totalMaleRevenue = maleData.reduce((sum, d) => sum + d.revenue, 0);

  const totalFemaleClicks = femaleData.reduce((sum, d) => sum + d.clicks, 0);
  const totalFemaleSpend = femaleData.reduce((sum, d) => sum + d.spend, 0);
  const totalFemaleRevenue = femaleData.reduce((sum, d) => sum + d.revenue, 0);

  // Bar chart data
  const spendByAge = {};
  const revenueByAge = {};
  marketingData.forEach(d => {
    spendByAge[d.age] = (spendByAge[d.age] || 0) + d.spend;
    revenueByAge[d.age] = (revenueByAge[d.age] || 0) + d.revenue;
  });

  const barData = Object.keys(spendByAge).map(age => ({
    age,
    spend: spendByAge[age],
    revenue: revenueByAge[age],
  }));

  // Prepare table data
  const prepareTableData = (genderData) => {
    const ageGroups = [...new Set(genderData.map(d => d.age))];
    return ageGroups.map(age => {
      const groupData = genderData.filter(d => d.age === age);
      const impressions = groupData.reduce((sum, d) => sum + d.impressions, 0);
      const clicks = groupData.reduce((sum, d) => sum + d.clicks, 0);
      const conversions = groupData.reduce((sum, d) => sum + d.conversions, 0);
      const ctr = (clicks / impressions) * 100 || 0;
      const conversionRate = (conversions / clicks) * 100 || 0;
      return { age, impressions, clicks, conversions, ctr: ctr.toFixed(2), conversionRate: conversionRate.toFixed(2) };
    });
  };

  const maleTableData = prepareTableData(maleData);
  const femaleTableData = prepareTableData(femaleData);

  return (
    <div className="flex h-screen bg-gray-900">
      <Navbar />
      
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-12">
          <div className="px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-5xl font-bold">Demographic View</h1>
          </div>
        </section>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <CardMetric title="Total Clicks (Male)" value={totalMaleClicks} icon={<Users />} />
            <CardMetric title="Total Spend (Male)" value={totalMaleSpend} icon={<TrendingUp />} />
            <CardMetric title="Total Revenue (Male)" value={totalMaleRevenue} icon={<Target />} />

            <CardMetric title="Total Clicks (Female)" value={totalFemaleClicks} icon={<Users />} />
            <CardMetric title="Total Spend (Female)" value={totalFemaleSpend} icon={<TrendingUp />} />
            <CardMetric title="Total Revenue (Female)" value={totalFemaleRevenue} icon={<Target />} />
          </div>

          {/* Bar Chart */}
          <BarChart data={barData} />

          {/* Tables */}
          <h2 className="text-xl font-bold text-white mb-4">Campaign Performance (Male)</h2>
          <Table data={maleTableData} />

          <h2 className="text-xl font-bold text-white mb-4 mt-6">Campaign Performance (Female)</h2>
          <Table data={femaleTableData} />
        </div>

        <Footer />
      </div>
    </div>
  );
}
