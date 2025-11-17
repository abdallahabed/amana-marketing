'use client';

import React, { useEffect, useState } from 'react';
import { CardMetric } from '../../src/components/ui/card-metric';
import { LineChart } from '../../src/components/ui/line-chart';

export default function DeviceViewPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch marketing data from your API route
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/marketing'); // points to your API route
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching marketing data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6 text-white">Loading Device View...</div>;
  }

  // Calculate metrics for Desktop and Mobile
  const desktopData = data.filter((item) => item.device === 'Desktop');
  const mobileData = data.filter((item) => item.device === 'Mobile');

  const totalClicks = (arr: any[]) => arr.reduce((sum, item) => sum + item.clicks, 0);
  const totalSpend = (arr: any[]) => arr.reduce((sum, item) => sum + item.spend, 0);
  const totalRevenue = (arr: any[]) => arr.reduce((sum, item) => sum + item.revenue, 0);

  const weeklyData = data.reduce((acc: any[], item) => {
    const weekExists = acc.find((w) => w.week === item.week);
    if (weekExists) {
      weekExists.clicks += item.clicks;
      weekExists.spend += item.spend;
      weekExists.revenue += item.revenue;
    } else {
      acc.push({ week: item.week, clicks: item.clicks, spend: item.spend, revenue: item.revenue });
    }
    return acc;
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Device View</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardMetric title="Desktop Clicks" value={totalClicks(desktopData)} />
        <CardMetric title="Desktop Spend" value={`$${totalSpend(desktopData)}`} />
        <CardMetric title="Desktop Revenue" value={`$${totalRevenue(desktopData)}`} />

        <CardMetric title="Mobile Clicks" value={totalClicks(mobileData)} />
        <CardMetric title="Mobile Spend" value={`$${totalSpend(mobileData)}`} />
        <CardMetric title="Mobile Revenue" value={`$${totalRevenue(mobileData)}`} />
      </div>

      {/* Line Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          title="Weekly Spend"
          data={weeklyData.map((item) => ({ week: item.week, spend: item.spend, revenue: item.revenue }))}
        />
        <LineChart
          title="Weekly Revenue"
          data={weeklyData.map((item) => ({ week: item.week, spend: item.spend, revenue: item.revenue }))}
        />
      </div>
    </div>
  );
}
