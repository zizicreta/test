// components/Sidebar.tsx
"use client";

import Link from 'next/link';
import { FaHome, FaChartLine, FaProjectDiagram, FaFileAlt, FaStore, FaSignOutAlt } from 'react-icons/fa';

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white flex flex-col p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">CRM</h2>
      </div>
      <nav className="flex-1 space-y-4">
        <h3 className="text-gray-400">Overview</h3>
        <Link href="/" className="flex items-center text-gray-400 hover:text-white">
          <FaHome className="mr-2" /> Dashboard
        </Link>
        <Link href="/projects" className="flex items-center text-gray-400 hover:text-white">
          <FaProjectDiagram className="mr-2" /> Projects
        </Link>
        <Link href="/analytics" className="flex items-center text-gray-400 hover:text-white">
          <FaChartLine className="mr-2" /> Analytics
        </Link>
        <Link href="/reports" className="flex items-center text-gray-400 hover:text-white">
          <FaFileAlt className="mr-2" /> Reports
        </Link>
      </nav>
      <div className="mt-auto flex items-center text-gray-400">
        <img src="/profile.jpg" alt="Profile" className="w-10 h-10 rounded-full mr-3" />
        <div>
          <p>Aston Agar</p>
          <span className="text-sm">aston@crm.com</span>
        </div>
      </div>
    </aside>
  );
}
