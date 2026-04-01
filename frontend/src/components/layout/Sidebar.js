import React from 'react';
import { Zap, LayoutDashboard, Mail, PieChart, BarChart3, Bell, Settings, X, Sun, Moon } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active = false, onClick, className = "" }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
    active 
      ? 'bg-indigo-600 text-white shadow-md' 
      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
  } ${className}`}>
    <Icon size={18} strokeWidth={active ? 2.5 : 2} />
    <span className={`text-sm ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
  </div>
);

const Sidebar = ({ activeTab, onTabChange, isOpen, onClose, theme, toggleTheme }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Top Logo Section */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { onTabChange('dashboard'); onClose(); }}>
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white shadow-lg shadow-indigo-500/20">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">EnergyMate</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-500 hover:text-slate-900 dark:hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <SidebarItem
            icon={LayoutDashboard}
            label="Dashboard"
            active={activeTab === 'dashboard'}
            onClick={() => { onTabChange('dashboard'); onClose(); }}
          />
          <SidebarItem
            icon={Mail}
            label="Gmail Invoices"
            active={activeTab === 'gmail'}
            onClick={() => { onTabChange('gmail'); onClose(); }}
          />
          <SidebarItem
            icon={PieChart}
            label="Analytics"
            active={activeTab === 'analytics'}
            onClick={() => { onTabChange('analytics'); onClose(); }}
          />
          <SidebarItem icon={BarChart3} label="Reports" />
          <SidebarItem icon={Bell} label="Alerts" />
        </nav>

        {/* --- HIGH CONTRAST BOTTOM SECTION --- */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 mt-auto">
          <div className="space-y-1">
            <SidebarItem
              icon={theme === 'light' ? Moon : Sun}
              label={theme === 'light' ? "Switch to Dark" : "Switch to Light"}
              onClick={toggleTheme}
              className="hover:bg-white dark:hover:bg-slate-700 shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
            />
            <SidebarItem
              icon={Settings}
              label="Settings"
              className="hover:bg-white dark:hover:bg-slate-700"
            />
          </div>

          {/* Subtle User Info footer (Optional) */}
          <div className="mt-4 px-3 py-2 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">System Online</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;