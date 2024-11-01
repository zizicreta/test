// components/Sidebar.tsx
import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>CRM</h2>
      <nav>
        <Link href="/"><span className="emoji">📊</span> Dashboard</Link>
        <Link href="/projects"><span className="emoji">📁</span> Projects</Link>
        <Link href="/analytics"><span className="emoji">📈</span> Analytics</Link>
        <Link href="/reports"><span className="emoji">📑</span> Reports</Link>
      </nav>
    </div>
  );
}
