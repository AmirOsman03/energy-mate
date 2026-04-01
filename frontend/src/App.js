import React, {useEffect, useState} from 'react';

// Layout Components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

// Pages
import Dashboard from './pages/Dashboard';
import GmailInvoices from './pages/GmailInvoices';

// API
import {getCurrentUser} from "./api/auth";
import {getSummary, getInvoices} from "./api/invoices";

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState({
    total_kwh: 0,
    total_amount: 0,
    prev_month_kwh: 0,
    prev_month_amount: 0,
    avg_daily_usage: 0
  });

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

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
      return <GmailInvoices />;
    }

    return (
      <Dashboard 
        user={user} 
        summary={summary} 
        invoices={invoices} 
      />
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
