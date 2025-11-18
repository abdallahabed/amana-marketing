'use client';

import { Navbar } from '../../src/components/ui/navbar';
import { Footer } from '../../src/components/ui/footer';
import { BubbleMap } from '../../src/components/ui/bubble-map';
import marketingDataRaw from '../../public/data/marketing.json' assert { type: 'json' };

// Define TypeScript type for your data
interface MarketingItem {
  region: string;
  revenue: number;
  spend: number;
  [key: string]: any; // allow extra fields if needed
}

// Cast the imported JSON to an array of MarketingItem
const marketingData = marketingDataRaw as MarketingItem[];

// Map your regions to coordinates
const cityCoordinates: Record<string, [number, number]> = {
  'City A': [-74.006, 40.7128],   // Example: New York
  'City B': [-118.2437, 34.0522]  // Example: Los Angeles
};

export default function RegionView() {
  // Transform marketing data for BubbleMap, only include valid coordinates
  const regionData = marketingData
    .map(item => {
      const coords = cityCoordinates[item.region];
      if (!coords) return null; // skip if no coordinates
      return {
        city: item.region,
        coordinates: coords,
        revenue: item.revenue,
        spend: item.spend
      };
    })
    .filter(Boolean) as { city: string; coordinates: [number, number]; revenue: number; spend: number }[];

  return (
    <div className="flex h-screen bg-gray-900">
      <Navbar />

      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-12">
          <div className="px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-5xl font-bold">Region View</h1>
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
