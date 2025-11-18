'use client';
import { Navbar } from '../../src/components/ui/navbar';
import { Footer } from '../../src/components/ui/footer';
import marketingData from '../../public/data/marketing.json';
import { LineChart } from '../../src/components/ui/line-chart';

export default function WeeklyView() {
  // Group data by week
  const weeks = [...new Set(marketingData.map(d => d.week))];

  const weeklyData = weeks.map(week => {
    const weekData = marketingData.filter(d => d.week === week);
    const spend = weekData.reduce((sum, d) => sum + d.spend, 0);
    const revenue = weekData.reduce((sum, d) => sum + d.revenue, 0);
    return {
      week: String(week),   // ✅ FIXED HERE
      spend,
      revenue,
    };
  });

  return (
    <div className="flex h-screen bg-gray-900">
      <Navbar />

      <div className="flex-1 flex flex-col">
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-12 text-center">
          <h1 className="text-3xl md:text-5xl font-bold">Weekly View</h1>
        </section>

        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <LineChart data={weeklyData} title="Revenue & Spend by Week" />
        </div>

        <Footer />
      </div>
    </div>
  );
}
