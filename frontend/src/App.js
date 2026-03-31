import React, {useEffect, useState} from 'react';
import { Zap, DollarSign, Activity } from 'lucide-react';
import { Card, Badge } from '@tremor/react';

// Layout Components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

// Dashboard Components
import KPICard from './components/dashboard/KPICard';
import FeatureTable from './components/dashboard/FeatureTable';
import EVNInvoices from './components/dashboard/EVNInvoices';

// Data
import { chartData, featureData } from './data/mockData';
import {getCurrentUser} from "./api/auth";
import {getSummary} from "./api/invoices";

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [summary, setSummary] = useState({
    total_kwh: 0,
    total_amount: 0,
    prev_month_kwh: 0,
    prev_month_amount: 0,
    avg_daily_usage: 0
  });

  useEffect(() => {
    getCurrentUser()
      .then((data) => {
        if (data) {
          setUser(data);
          // Fetch summary once user is loaded
          const userId = data.id || data.sub;
          getSummary(userId).then(summaryData => {
            if (summaryData) setSummary(summaryData);
          });
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
            value={`${summary.prev_month_kwh?.toLocaleString()} kWh`}
            icon={Zap}
            data={chartData}
            color="indigo"
          />
          <KPICard
            title="Prev. Month Cost"
            value={`${summary.prev_month_amount?.toLocaleString()} ден`}
            icon={DollarSign}
            data={chartData}
            color="emerald"
          />
          <KPICard
            title="Avg. Daily Usage"
            value={`${summary.avg_daily_usage} kWh`}
            icon={Activity}
            data={chartData}
            color="amber"
          />
        </div>

        {/* Table Section */}
        <div className="overflow-hidden">
          <FeatureTable data={featureData} />
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
