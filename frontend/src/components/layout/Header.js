import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, ChevronDown, LogOut, X, Menu } from 'lucide-react';
import LoginButton from "../ui/LoginButton";
import { logout } from "../../api/auth";

const Header = ({ userName, onMenuToggle }) => {
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
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 relative z-40">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuToggle}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900"
        >
          <Menu size={24} />
        </button>
        
        <div className="flex items-center gap-3 text-slate-400 max-w-md w-full">
          <Search size={18} className="shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none focus:ring-0 text-sm w-full text-slate-600 truncate"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-6">
        <div className="relative cursor-pointer text-slate-400 hover:text-indigo-600 transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </div>

        {userName ? (
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-2 lg:gap-3 pl-4 lg:pl-6 border-l border-slate-100 cursor-pointer group"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shrink-0">
                <User size={18} />
              </div>
              <span className="hidden sm:inline text-sm font-semibold text-slate-700">{userName}</span>
              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </div>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="pl-4 lg:pl-6 border-l border-slate-100">
            <LoginButton />
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-slate-900">Are you sure?</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-slate-500 text-sm mb-6">
              You will be signed out of your account. You can always sign back in anytime.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
              >
                Yes, logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
