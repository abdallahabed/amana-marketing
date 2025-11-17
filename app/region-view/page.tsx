'use client';

import { Navbar } from '../../src/components/ui/navbar';
import { Footer } from '../../src/components/ui/footer';
import { BubbleMap } from '../../src/components/ui/bubble-map';
import marketingData from '../../src/data/marketing.json';

export default function RegionView() {
  // Map your regions to coordinates
  const cityCoordinates: Record<string, [number, number]> = {
    'City A': [-74.006, 40.7128], // New York
    'City B': [-118.2437, 34.0522] // Los Angeles
  };

  // Transform marketing data for BubbleMap
  const regionData = marketingData.map(item => ({
    city: item.region,
    coordinates: cityCoordinates[item.region],
    revenue: item.revenue,
    spend: item.spend
  }));

  return (
    <div className="flex h-screen bg-gray-900">
      <Navbar />

      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-12">
          <div className="px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-5xl font-bold">
                Region View
              </h1>
            </div>
          </div>
        </section>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <BubbleMap data={regionData} title="Revenue & Spend by Region" />
        </div>

        <Footer />
      </div>
    </div>
  );
}
