
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { useState } from 'react';

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Inventory', path: '/inventory' },
    { name: 'Invoices', path: '/invoices' },
    { name: 'Transactions', path: '/transactions' },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xs sm:text-sm">J</span>
          </div>
          <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            JAYVEER MOBILE
          </span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4 lg:space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-blue-600 relative px-2 py-1",
                location.pathname === item.path
                  ? "text-blue-600"
                  : "text-slate-600"
              )}
            >
              {item.name}
              {location.pathname === item.path && (
                <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-slate-200">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600 px-3 py-2 rounded-lg",
                  location.pathname === item.path
                    ? "text-blue-600 bg-blue-50"
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
