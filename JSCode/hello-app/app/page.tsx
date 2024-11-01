// app/page.tsx
"use client";

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsCard from './components/StatsCard';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';
import ProfileCard from './components/ProfileCard';

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="p-6 flex-1 bg-gray-100">
        <Header />
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatsCard title="Active Orders" value="250+" percentage={0.51} />
          <StatsCard title="Total Sells" value="$2,968.05" percentage={1.51} />
          <StatsCard title="Total Revenue" value="$1,549.45" percentage={2.83} />
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-gray-700 mb-4">Revenue</h3>
            <BarChart />
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-gray-700 mb-4">Customers</h3>
            <PieChart />
          </div>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <ProfileCard />
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-2xl font-bold">$25,456.02</h4>
            <p className="text-gray-600 mb-2">Your earnings this month</p>
            <button className="bg-green-500 text-white px-3 py-1 rounded">Withdraw Earnings</button>
          </div>
        </section>
      </main>
    </div>
  );
}
