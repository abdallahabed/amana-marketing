'use client';

import { Navbar } from '../../src/components/ui/navbar';
import { CardMetric } from '../../src/components/ui/card-metric';
import { Footer } from '../../src/components/ui/footer';
import { Users, TrendingUp, Target } from 'lucide-react';
import rawMarketingData from '../../public/data/marketing.json';
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// =======================================================
// TYPES
// =======================================================

interface MarketingRow {
  // put the fields you actually have in marketing.json here
  // mark optional if some rows might not include them
  gender?: 'male' | 'female' | string;
  age?: string;
  spend?: number;
  revenue?: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  // other optional fields (city, date, device...) can be added as needed
  [key: string]: any;
}

interface BarChartRow {
  age: string;
  spend: number;
  revenue: number;
}

interface BarChartProps {
  data: BarChartRow[];
}

interface TableRow {
  age: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: string;
  conversionRate: string;
}

interface TableProps {
  data: TableRow[];
}

// =======================================================
// TYPE-CAST MARKETING DATA (resolve implicit any)
// =======================================================

const marketingDataTyped = (rawMarketingData as unknown) as MarketingRow[];

// =======================================================
// BAR CHART COMPONENT
// =======================================================

const BarChart = ({ data }: BarChartProps) => (
  <div className="bg-gray-700 p-4 text-white mb-8 rounded-lg">
    <h3 className="text-white font-bold mb-2">Spend & Revenue by Age Group</h3>
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#888" />
          <XAxis dataKey="age" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip />
          <Legend />
          <Bar dataKey="spend" name="Spend" fill="#8884d8" />
          <Bar dataKey="revenue" name="Revenue" fill="#82ca9d" />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

// =======================================================
// TABLE COMPONENT
// =======================================================

const Table = ({ data }: TableProps) => {
  if (!data || data.length === 0) {
    return <div className="text-white mb-8">No data available.</div>;
  }

  // ensure stable column order
  const columns = ['age', 'impressions', 'clicks', 'conversions', 'ctr', 'conversionRate'];

  return (
    <div className="overflow-x-auto mb-8">
      <table className="min-w-full text-white border border-gray-500">
        <thead>
          <tr className="bg-gray-800">
            {columns.map((key) => (
              <th key={key} className="px-4 py-2 border text-left">
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t border-gray-600">
              {columns.map((col) => (
                <td key={col} className="px-4 py-2 border">
                  {/* show as-is; numbers will render correctly */}
                  {/* @ts-ignore -- safe because columns are controlled */}
                  {row[col as keyof TableRow] ?? '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// =======================================================
// MAIN PAGE
// =======================================================

export default function DemographicView() {
  const marketingData = marketingDataTyped;

  const maleData: MarketingRow[] = marketingData.filter((d) => d.gender === 'male');
  const femaleData: MarketingRow[] = marketingData.filter((d) => d.gender === 'female');

  const totalMaleClicks = maleData.reduce((s, d) => s + (d.clicks ?? 0), 0);
  const totalMaleSpend = maleData.reduce((s, d) => s + (d.spend ?? 0), 0);
  const totalMaleRevenue = maleData.reduce((s, d) => s + (d.revenue ?? 0), 0);

  const totalFemaleClicks = femaleData.reduce((s, d) => s + (d.clicks ?? 0), 0);
  const totalFemaleSpend = femaleData.reduce((s, d) => s + (d.spend ?? 0), 0);
  const totalFemaleRevenue = femaleData.reduce((s, d) => s + (d.revenue ?? 0), 0);

  const spendByAge: Record<string, number> = {};
  const revenueByAge: Record<string, number> = {};

  marketingData.forEach((d) => {
    const age = d.age ?? 'Unknown';
    spendByAge[age] = (spendByAge[age] || 0) + (d.spend ?? 0);
    revenueByAge[age] = (revenueByAge[age] || 0) + (d.revenue ?? 0);
  });

  const barData: BarChartRow[] = Object.keys(spendByAge).map((age) => ({
    age,
    spend: spendByAge[age],
    revenue: revenueByAge[age] ?? 0,
  }));

  // TABLE DATA BUILDER
  const prepareTableData = (genderData: MarketingRow[]): TableRow[] => {
    const ageGroups = Array.from(new Set(genderData.map((d) => d.age ?? 'Unknown')));

    return ageGroups.map((age) => {
      const groupData = genderData.filter((d) => (d.age ?? 'Unknown') === age);

      const impressions = groupData.reduce((sum, d) => sum + (d.impressions ?? 0), 0);
      const clicks = groupData.reduce((sum, d) => sum + (d.clicks ?? 0), 0);
      const conversions = groupData.reduce((sum, d) => sum + (d.conversions ?? 0), 0);

      const ctr = impressions ? ((clicks / impressions) * 100).toFixed(2) : '0.00';
      const conversionRate = clicks ? ((conversions / clicks) * 100).toFixed(2) : '0.00';

      return { age, impressions, clicks, conversions, ctr, conversionRate };
    });
  };

  const maleTableData = prepareTableData(maleData);
  const femaleTableData = prepareTableData(femaleData);

  return (
    <div className="flex h-screen bg-gray-900">
      <Navbar />

      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-12">
          <div className="px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-5xl font-bold">Demographic View</h1>
          </div>
        </section>

        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <CardMetric title="Total Clicks (Male)" value={totalMaleClicks} icon={<Users />} />
            <CardMetric title="Total Spend (Male)" value={totalMaleSpend} icon={<TrendingUp />} />
            <CardMetric title="Total Revenue (Male)" value={totalMaleRevenue} icon={<Target />} />
            <CardMetric title="Total Clicks (Female)" value={totalFemaleClicks} icon={<Users />} />
            <CardMetric title="Total Spend (Female)" value={totalFemaleSpend} icon={<TrendingUp />} />
            <CardMetric title="Total Revenue (Female)" value={totalFemaleRevenue} icon={<Target />} />
          </div>

          <BarChart data={barData} />

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
