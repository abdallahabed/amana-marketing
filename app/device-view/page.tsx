'use client';

import React, { useEffect, useState } from 'react';
import { CardMetric } from '../../src/components/ui/card-metric';
import { LineChart } from '../../src/components/ui/line-chart';

export default function DeviceViewPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/marketing');
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

  // Device filters
  const desktopData = data.filter((item) => item.device === 'Desktop');
  const mobileData = data.filter((item) => item.device === 'Mobile');

  // Helpers
  const totalClicks = (arr: any[]) => arr.reduce((sum, item) => sum + item.clicks, 0);
  const totalSpend = (arr: any[]) => arr.reduce((sum, item) => sum + item.spend, 0);
  const totalRevenue = (arr: any[]) => arr.reduce((sum, item) => sum + item.revenue, 0);

  const formatCurrency = (n: number) => `$${n.toLocaleString()}`;

  // Weekly grouping (sorted)
  const weeklyData = data
    .reduce((acc: any[], item) => {
      const existing = acc.find((w) => w.week === item.week);
      if (existing) {
        existing.clicks += item.clicks;
        existing.spend += item.spend;
        existing.revenue += item.revenue;
      } else {
        acc.push({
          week: item.week,
          clicks: item.clicks,
          spend: item.spend,
          revenue: item.revenue,
        });
      }
      return acc;
    }, [])
    .sort((a, b) => a.week - b.week);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Device View</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardMetric title="Desktop Clicks" value={totalClicks(desktopData)} />
        <CardMetric title="Desktop Spend" value={formatCurrency(totalSpend(desktopData))} />
        <CardMetric title="Desktop Revenue" value={formatCurrency(totalRevenue(desktopData))} />

        <CardMetric title="Mobile Clicks" value={totalClicks(mobileData)} />
        <CardMetric title="Mobile Spend" value={formatCurrency(totalSpend(mobileData))} />
        <CardMetric title="Mobile Revenue" value={formatCurrency(totalRevenue(mobileData))} />
      </div>

      {/* Line Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          title="Weekly Spend"
          data={weeklyData.map((item) => ({
            week: String(item.week),
            spend: item.spend,
          }))}
        />

        <LineChart
          title="Weekly Revenue"
          data={weeklyData.map((item) => ({
            week: String(item.week),
            revenue: item.revenue,
          }))}
        />
      </div>
    </div>
  );
}
