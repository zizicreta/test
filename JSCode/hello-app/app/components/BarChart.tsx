// components/BarChart.tsx
"use client";

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BarChart() {
  const data = {
    labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      { label: 'This Week', data: [20, 30, 45, 60, 70, 85, 90, 95, 100], backgroundColor: '#1f77b4' },
      { label: 'This Month', data: [30, 45, 50, 65, 75, 95, 110, 125, 130], backgroundColor: '#ff7f0e' },
    ],
  };
  return <Bar data={data} />;
}
