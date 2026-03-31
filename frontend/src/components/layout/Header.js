import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, ChevronDown, LogOut, X, Menu } from 'lucide-react';
import LoginButton from "../ui/LoginButton";
import { logout } from "../../api/auth";

const Header = ({ userName, onMenuToggle, children }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsModalOpen(false);
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 relative z-40 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <button onClick={onMenuToggle} className="lg:hidden p-2 text-slate-500 dark:text-slate-400">
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 max-w-md w-full">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none focus:ring-0 text-sm w-full text-slate-600 dark:text-slate-300"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-6">
        {/* Toggle Button Container */}
        <div className="flex items-center">{children}</div>

        <div className="relative text-slate-400 dark:text-slate-500 hover:text-indigo-600 cursor-pointer">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </div>

        {userName ? (
          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100 dark:border-slate-800 cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                <User size={18} />
              </div>
              <span className="hidden sm:inline text-sm font-semibold text-slate-700 dark:text-slate-200">{userName}</span>
              <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1">
                <button onClick={() => setIsModalOpen(true)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <LoginButton />
        )}
      </div>

      {/* Logout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-sm w-full p-6 border dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Are you sure?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">You will be signed out of your account.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300">Cancel</button>
              <button onClick={handleLogout} className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg">Logout</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
export default Header;