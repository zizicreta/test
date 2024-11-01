// components/StatsCard.tsx
"use client";

interface StatsCardProps {
  title: string;
  value: string | number;
  percentage: number;
}

export default function StatsCard({ title, value, percentage }: StatsCardProps) {
  return (
    <div className="stats-card">
      <h3>{title}</h3>
      <p>{value}</p>
      <span>{percentage > 0 ? '+' : ''}{percentage}%</span>
    </div>
  );
}
