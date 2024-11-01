// components/Sidebar.tsx
"use client";

import Link from 'next/link';
import { FaChartLine, FaStore, FaProjectDiagram, FaComments } from 'react-icons/fa';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>CRM</h2>
      <nav>
        <Link href="/"><FaChartLine /> Dashboard</Link>
        <Link href="/projects"><FaProjectDiagram /> Projects</Link>
        <Link href="/analytics"><FaStore /> Analytics</Link>
        <Link href="/reports"><FaComments /> Reports</Link>
      </nav>
    </div>
  );
}
