import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const Header = ({ userName }) => (
  <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
    <div className="flex items-center gap-3 text-slate-400 max-w-md w-full">
      <Search size={18} />
      <input 
        type="text" 
        placeholder="Search metrics, reports..." 
        className="bg-transparent border-none focus:ring-0 text-sm w-full text-slate-600"
      />
    </div>
    <div className="flex items-center gap-6">
      <div className="relative cursor-pointer text-slate-400 hover:text-indigo-600 transition-colors">
        <Bell size={20} />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
      </div>
      <div className="flex items-center gap-3 pl-6 border-l border-slate-100 cursor-pointer group">
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
          <User size={18} />
        </div>
        <span className="text-sm font-semibold text-slate-700">{userName}</span>
      </div>
    </div>
  </header>
);

export default Header;
