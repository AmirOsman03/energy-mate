import React from 'react';
import { Zap, LayoutDashboard, PieChart, BarChart3, Bell, Settings, Mail } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
    active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
  }`}>
    <Icon size={18} strokeWidth={2} />
    <span className="text-sm font-medium">{label}</span>
  </div>
);

const Sidebar = ({ activeTab, onTabChange }) => (
  <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-4">
    <div className="flex items-center gap-2 px-2 mb-8 cursor-pointer" onClick={() => onTabChange('dashboard')}>
      <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
        <Zap size={20} fill="currentColor" />
      </div>
      <span className="font-bold text-xl tracking-tight text-slate-900">EnergyMate</span>
    </div>
    
    <nav className="flex-1 space-y-1">
      <SidebarItem 
        icon={LayoutDashboard} 
        label="Dashboard" 
        active={activeTab === 'dashboard'} 
        onClick={() => onTabChange('dashboard')}
      />
      <SidebarItem 
        icon={Mail} 
        label="Gmail Invoices" 
        active={activeTab === 'gmail'} 
        onClick={() => onTabChange('gmail')}
      />
      <SidebarItem icon={PieChart} label="Analytics" />
      <SidebarItem icon={BarChart3} label="Reports" />
      <SidebarItem icon={Bell} label="Alerts" />
    </nav>

    <div className="pt-4 border-t border-slate-100">
      <SidebarItem icon={Settings} label="Settings" />
    </div>
  </aside>
);

export default Sidebar;
