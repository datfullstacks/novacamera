'use client';

import { HTMLAttributes } from 'react';

interface RevenueDataPoint {
  month: string;
  revenue: number;
}

interface RevenueChartProps extends HTMLAttributes<HTMLDivElement> {
  data: RevenueDataPoint[];
}

export default function RevenueChart({
  data,
  className = '',
  ...props
}: RevenueChartProps) {
  // Calculate max revenue for scaling
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);
  const chartHeight = 200; // pixels

  return (
    <div className={`w-full ${className}`} {...props}>
      {/* Chart Container */}
      <div className="relative w-full" style={{ height: `${chartHeight + 60}px` }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
          <span>{(maxRevenue).toLocaleString('vi-VN')}₫</span>
          <span>{(maxRevenue * 0.75).toLocaleString('vi-VN')}₫</span>
          <span>{(maxRevenue * 0.5).toLocaleString('vi-VN')}₫</span>
          <span>{(maxRevenue * 0.25).toLocaleString('vi-VN')}₫</span>
          <span>0₫</span>
        </div>

        {/* Chart Area */}
        <div className="absolute left-16 right-0 top-0 bottom-12 flex items-end justify-around gap-1 border-b border-l border-gray-200">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="w-full border-t border-gray-100" />
            ))}
          </div>

          {/* Bars */}
          {data.map((point, index) => {
            const barHeight = (point.revenue / maxRevenue) * chartHeight;
            const barColor = point.revenue > 0 ? 'bg-blue-500' : 'bg-gray-200';

            return (
              <div key={index} className="flex-1 flex flex-col items-center group relative">
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                  {point.revenue.toLocaleString('vi-VN')}₫
                </div>

                {/* Bar */}
                <div
                  className={`w-full ${barColor} rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer`}
                  style={{ height: `${barHeight}px`, minHeight: point.revenue > 0 ? '4px' : '0px' }}
                />
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="absolute left-16 right-0 bottom-0 flex justify-around text-xs text-gray-600">
          {data.map((point, index) => (
            <span key={index} className="flex-1 text-center">
              {point.month}
            </span>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded" />
          <span className="text-gray-600">Doanh thu</span>
        </div>
      </div>
    </div>
  );
}
