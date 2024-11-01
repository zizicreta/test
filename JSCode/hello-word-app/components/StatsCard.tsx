// components/StatsCard.tsx
import React from 'react';

interface StatsCardProps {
  title: string;          // title은 문자열 타입
  value: string | number; // value는 문자열 또는 숫자 타입
  percentage: number;     // percentage는 숫자 타입
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, percentage }) => {
  return (
    <div className="stats-card">
      <h3>{title}</h3>
      <p>{value}</p>
      <span>{percentage > 0 ? '+' : ''}{percentage}%</span>
    </div>
  );
};

export default StatsCard;
