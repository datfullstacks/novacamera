'use client';

import { HTMLAttributes } from 'react';
import { StatCard } from '../../atoms/dashboard';

interface StatsGridProps extends HTMLAttributes<HTMLDivElement> {
  stats: Array<{
    title: string;
    value: string | number;
    change?: {
      value: string;
      type: 'positive' | 'negative' | 'neutral';
    };
    icon?: React.ReactNode;
  }>;
}

export default function StatsGrid({
  stats,
  className = '',
  ...props
}: StatsGridProps) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 ${className}`}
      {...props}
    >
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}
