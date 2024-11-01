// app/page.tsx
/* import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import ChartComponent from '../components/ChartComponent';
import PieChart from '../components/PieChart';
import OrdersTable from '../components/OrdersTable'; */

export default function Home() {
  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '2rem' }}>
      Hello World!
    </main>   
  );
}

/* export default function Dashboard() {
  return (
    <div className="dashboard">
      <Sidebar />
      <main>
        <Header />
        <section className="stats">
          <StatsCard title="Active Orders" value="250+" percentage={0.51} />
          <StatsCard title="Total Sells" value="$2,968.05" percentage={1.51} />
          <StatsCard title="Total Revenue" value="$1,549.45" percentage={2.83} />
        </section>
        <section className="charts">
          <ChartComponent />
          <PieChart />
        </section>
        <section className="orders">
          <OrdersTable />
        </section>
      </main>
    </div>
  );
}
 */