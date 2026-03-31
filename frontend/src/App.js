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

  // --- THEME LOGIC ---
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // --- ANIMATION LOGIC ---
  const [animatedData, setAnimatedData] = useState(
    Array.from({ length: 20 }, (_, i) => ({ month: i.toString(), value: 50 }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedData((prev) => {
        const nextData = prev.slice(1);
        const lastValue = prev[prev.length - 1].value;
        const swing = Math.random() * 50 - 25;
        let newValue = Math.min(Math.max(lastValue + swing, 10), 90);
        return [...nextData, { month: Date.now().toString(), value: newValue }];
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // --- DATA FETCHING ---
  useEffect(() => {
    getCurrentUser().then((data) => {
      if (data) {
        setUser(data);
        const userId = data.id || data.sub;
        getSummary(userId).then(setSummary).catch(console.error);
        getInvoices(userId).then(setInvoices).catch(console.error);
      }
    }).catch(err => console.error(err));
  }, []);

  const renderContent = () => {
    if (activeTab === 'gmail') return <EVNInvoices />;

    return (
      <div className="space-y-6 lg:space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Good afternoon, {user?.name || 'Guest'}
          </h1>
          <p className="text-sm lg:text-base text-slate-500 dark:text-slate-400">
            Real-time monitoring of your energy ecosystem.
          </p>
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
          <KPICard title="Prev. Month Consumption" value={`${summary.prev_month_kwh?.toLocaleString()} kWh`} icon={Zap} data={animatedData} color="indigo" />
          <KPICard title="Prev. Month Cost" value={`${summary.prev_month_amount?.toLocaleString()} ден`} icon={DollarSign} data={animatedData} color="emerald" />
          <KPICard title="Avg. Daily Usage" value={`${summary.avg_daily_usage?.toFixed(2)} kWh`} icon={Activity} data={animatedData} color="amber" />
          <KPICard title="Total Consumption" value={`${summary.total_kwh?.toLocaleString()} kWh`} icon={Zap} data={animatedData} color="blue" />
          <KPICard title="Total Cost" value={`${summary.total_amount?.toLocaleString()} ден`} icon={DollarSign} data={animatedData} color="cyan" />
        </div>

        <Card className="border-slate-200 dark:border-slate-800 shadow-sm p-0 overflow-hidden bg-white dark:bg-slate-900">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-slate-50">Recent Invoices</h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHead className="bg-slate-50/50 dark:bg-slate-800/50">
                <TableRow>
                  <TableHeaderCell className="dark:text-slate-300">Invoice #</TableHeaderCell>
                  <TableHeaderCell className="dark:text-slate-300">Amount</TableHeaderCell>
                  <TableHeaderCell className="dark:text-slate-300">Due Date</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.slice(0, 5).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-slate-900 dark:text-slate-100">{item.invoice_number || 'Manual'}</TableCell>
                    <TableCell className="dark:text-slate-400">{item.amount.toLocaleString()} ден</TableCell>
                    <TableCell className="dark:text-slate-400">{item.due_date || item.created_at}</TableCell>
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
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans antialiased overflow-x-hidden transition-colors duration-300">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <main className="flex-1 flex flex-col min-w-0">
        <Header userName={user?.name} onMenuToggle={() => setSidebarOpen(true)} />
        <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full">{renderContent()}</div>
      </main>
    </div>
  );
}

export default App;