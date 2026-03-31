import React, {useEffect, useState} from 'react';
import { Zap, DollarSign, Activity } from 'lucide-react';
import { Card, Badge, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell } from '@tremor/react';

// Layout Components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

// Dashboard Components
import KPICard from './components/dashboard/KPICard';
import EVNInvoices from './components/dashboard/EVNInvoices';

// Data
import { chartData } from './data/mockData';
import {getCurrentUser} from "./api/auth";
import {getSummary, getInvoices} from "./api/invoices";

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

  const refreshData = (userId) => {
    if (!userId) return;
    
    getSummary(userId).then(summaryData => {
      if (summaryData) setSummary(summaryData);
    }).catch(err => console.error("Summary fetch error:", err));

    getInvoices(userId).then(invoiceData => {
      if (invoiceData) setInvoices(invoiceData);
    }).catch(err => console.error("Invoices fetch error:", err));
  };

  useEffect(() => {
    getCurrentUser()
      .then((data) => {
        if (data) {
          setUser(data);
          const userId = data.id || data.sub;
          refreshData(userId);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user:", err);
        setUser(null);
      });
  }, []);

  const renderContent = () => {
    if (activeTab === 'gmail') {
      return <EVNInvoices />;
    }

    return (
      <div className="space-y-6 lg:space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            Good afternoon, {user?.name || 'Guest'}
          </h1>
          <p className="text-sm lg:text-base text-slate-500">Here's the current state of your energy ecosystem.</p>
        </div>

        {/* Context Card */}
        <Card className="bg-indigo-600 border-none shadow-lg shadow-indigo-200/50 p-4 lg:p-6 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Campsite Facility Optimization</h3>
              <p className="text-indigo-100 text-sm max-w-lg">
                Your primary facility is currently running {summary.alerts ? 'above' : 'within'} seasonal average.
                {summary.alerts && " " + summary.alerts}
              </p>
            </div>
            <Badge color="indigo" className="bg-white/20 text-white border-none shrink-0">Optimization Ready</Badge>
          </div>
        </Card>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <KPICard
            title="Prev. Month Consumption"
            value={`${(summary.prev_month_kwh || 0).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kWh`}
            icon={Zap}
            data={chartData}
            color="indigo"
          />
          <KPICard
            title="Prev. Month Cost"
            value={`${(summary.prev_month_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ден`}
            icon={DollarSign}
            data={chartData}
            color="emerald"
          />
          <KPICard
            title="Avg. Daily Usage"
            value={`${(summary.avg_daily_usage || 0).toFixed(2)} kWh`}
            icon={Activity}
            data={chartData}
            color="amber"
          />
          <KPICard
            title="Total Consumption"
            value={`${(summary.total_kwh || 0).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kWh`}
            icon={Zap}
            data={chartData}
            color="blue"
          />
          <KPICard
            title="Total Cost"
            value={`${(summary.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ден`}
            icon={DollarSign}
            data={chartData}
            color="cyan"
          />
        </div>

        {/* Invoices Table */}
        <div className="overflow-hidden">
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
                    <TableHeaderCell>kWh</TableHeaderCell>
                    <TableHeaderCell>Due Date</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoices.slice(0, 5).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-slate-900">{item.invoice_number || 'Manual'}</TableCell>
                      <TableCell>{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} ден</TableCell>
                      <TableCell>{item.kwh || 'N/A'}</TableCell>
                      <TableCell>{item.due_date || item.created_at}</TableCell>
                    </TableRow>
                  ))}
                  {invoices.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-slate-500">No invoices found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased overflow-x-hidden">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <Header 
          userName={user?.name} 
          onMenuToggle={() => setSidebarOpen(true)}
        />

        {/* Content Area */}
        <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
