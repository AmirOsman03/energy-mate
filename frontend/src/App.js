import React, { useEffect, useState } from 'react';
import { Zap, DollarSign, Activity } from 'lucide-react';
import { Card, Badge, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell } from '@tremor/react';

import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import KPICard from './components/dashboard/KPICard';
import EVNInvoices from './components/dashboard/EVNInvoices';

import { getCurrentUser } from "./api/auth";
import { getSummary, getInvoices } from "./api/invoices";

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState({
    total_kwh: 0,
    total_amount: 0,
    prev_month_kwh: 0,
    prev_month_amount: 0,
    avg_daily_usage: 0
  });

  // --- ANIMATION LOGIC ---
  // Initialize with 15 points of dummy data to fill the sparkline
  const [animatedData, setAnimatedData] = useState(
    Array.from({ length: 15 }, (_, i) => ({ month: i.toString(), value: 30 + Math.random() * 20 }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedData((prev) => {
        const nextData = prev.slice(1); // Remove the oldest point
        const lastValue = prev[prev.length - 1].value;

        // Generate a new value that fluctuates up or down
        const newValue = Math.max(10, lastValue + (Math.random() * 10 - 5));

        return [
          ...nextData,
          {
            month: Date.now().toString(), // Unique index for Recharts to slide
            value: newValue
          }
        ];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const refreshData = (userId) => {
    if (!userId) return;
    getSummary(userId).then(data => data && setSummary(data)).catch(console.error);
    getInvoices(userId).then(data => data && setInvoices(data)).catch(console.error);
  };

  useEffect(() => {
    getCurrentUser().then((data) => {
      if (data) {
        setUser(data);
        refreshData(data.id || data.sub);
      }
    }).catch(err => console.error(err));
  }, []);

  const renderContent = () => {
    if (activeTab === 'gmail') return <EVNInvoices />;

    return (
      <div className="space-y-6 lg:space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            Good afternoon, {user?.name || 'Guest'}
          </h1>
          <p className="text-sm lg:text-base text-slate-500">Here's the current state of your energy ecosystem.</p>
        </div>

        <Card className="bg-indigo-600 border-none shadow-lg p-6 text-white">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Campsite Facility Optimization</h3>
              <p className="text-indigo-100 text-sm max-w-lg">
                Your facility is running {summary.alerts ? 'above' : 'within'} seasonal average.
              </p>
            </div>
            <Badge color="indigo" className="bg-white/20 text-white border-none animate-pulse">Live Feed</Badge>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <KPICard
            title="Prev. Month Consumption"
            value={`${(summary.prev_month_kwh || 0).toLocaleString()} kWh`}
            icon={Zap}
            data={animatedData}
            color="indigo"
          />
          <KPICard
            title="Prev. Month Cost"
            value={`${(summary.prev_month_amount || 0).toLocaleString()} ден`}
            icon={DollarSign}
            data={animatedData}
            color="emerald"
          />
          <KPICard
            title="Avg. Daily Usage"
            value={`${(summary.avg_daily_usage || 0).toFixed(2)} kWh`}
            icon={Activity}
            data={animatedData}
            color="amber"
          />
          <KPICard
            title="Total Consumption"
            value={`${(summary.total_kwh || 0).toLocaleString()} kWh`}
            icon={Zap}
            data={animatedData}
            color="blue"
          />
          <KPICard
            title="Total Cost"
            value={`${(summary.total_amount || 0).toLocaleString()} ден`}
            icon={DollarSign}
            data={animatedData}
            color="cyan"
          />
        </div>

        <Card className="border-slate-200 shadow-sm p-0 overflow-hidden bg-white">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Recent Invoices</h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHead className="bg-slate-50/50">
                <TableRow>
                  <TableHeaderCell>Invoice #</TableHeaderCell>
                  <TableHeaderCell>Amount</TableHeaderCell>
                  <TableHeaderCell>Due Date</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.slice(0, 5).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.invoice_number || 'Manual'}</TableCell>
                    <TableCell>{item.amount.toLocaleString()} ден</TableCell>
                    <TableCell>{item.due_date || item.created_at}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased overflow-x-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 flex flex-col min-w-0">
        <Header userName={user?.name} onMenuToggle={() => setSidebarOpen(true)} />
        <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full">{renderContent()}</div>
      </main>
    </div>
  );
}

export default App;