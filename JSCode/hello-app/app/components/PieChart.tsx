// components/PieChart.tsx
"use client";

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart() {
  const data = {
    labels: ['Current Customers', 'New Customers'],
    datasets: [
      { data: [52, 48], backgroundColor: ['#1f77b4', '#ff7f0e'] },
    ],
  };
  return <Pie data={data} />;
}
