'use client';

import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { scaleSqrt } from 'd3-scale';
import countries from '../../data/countries-110m.json';

interface BubbleMapProps {
  data: { city: string; coordinates: [number, number]; revenue: number; spend: number }[];
  title?: string;
}

export const BubbleMap = ({ data, title }: BubbleMapProps) => {
  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const sizeScale = scaleSqrt().domain([0, maxRevenue]).range([0, 20]);

  return (
    <div className="bg-gray-700 p-4 rounded-lg mb-8 text-white">
      {title && <h3 className="text-white font-bold mb-2">{title}</h3>}
      <ComposableMap projection="geoMercator">
        <Geographies geography={countries}>
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#2d3748"
                stroke="#555"
                strokeWidth={0.5}
              />
            ))
          }
        </Geographies>
        {data.map(({ city, coordinates, revenue }) => (
          <Marker key={city} coordinates={coordinates}>
            <circle r={sizeScale(revenue)} fill="#82ca9d" stroke="#fff" strokeWidth={0.5} />
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
};
