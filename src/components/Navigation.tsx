
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
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm">J</span>
          </div>
          <span className="text-xl font-bold text-gray-900">JAYVEER MOBILE</span>
        </div>
        
        <div className="flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-gray-900",
                location.pathname === item.path
                  ? "text-gray-900 border-b-2 border-gray-900 pb-1"
                  : "text-gray-600"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
