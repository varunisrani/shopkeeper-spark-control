
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Inventory', path: '/inventory' },
    { name: 'Invoices', path: '/invoices' },
    { name: 'Transactions', path: '/transactions' },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm">J</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            JAYVEER MOBILE
          </span>
        </div>
        
        <div className="flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-blue-600 relative",
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
      </div>
    </nav>
  );
};

export default Navigation;
