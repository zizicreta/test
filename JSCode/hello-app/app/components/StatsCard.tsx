// components/StatsCard.tsx
"use client";

interface StatsCardProps {
  title: string;
  value: string | number;
  percentage: number;
}

export default function StatsCard({ title, value, percentage }: StatsCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex flex-col">
      <p className="text-gray-600">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
      <span className={`text-sm ${percentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {percentage > 0 ? '+' : ''}{percentage}%
      </span>
    </div>
  );
}
