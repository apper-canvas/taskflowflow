import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from './components/ApperIcon';
import { routeArray } from './config/routes';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-surface border-b border-surface-200 z-40">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          <div className="flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors"
            >
              <ApperIcon name="Menu" size={20} />
            </button>
            <h1 className="text-xl font-heading font-bold text-primary ml-2">
              TaskFlow
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-surface-600">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>All systems running</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-surface border-r border-surface-200 flex-col z-40">
          <nav className="flex-1 p-4 space-y-2">
            {routeArray.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-surface-700 hover:bg-surface-100'
                  }`
                }
              >
                <ApperIcon name={route.icon} size={18} className="mr-3" />
                {route.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={closeMobileMenu}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="absolute left-0 top-0 h-full w-64 bg-surface shadow-xl"
            >
              <div className="p-4 border-b border-surface-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-heading font-bold text-primary">
                    TaskFlow
                  </h2>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 rounded-lg hover:bg-surface-100"
                  >
                    <ApperIcon name="X" size={18} />
                  </button>
                </div>
              </div>
              <nav className="p-4 space-y-2">
                {routeArray.map((route) => (
                  <NavLink
                    key={route.id}
                    to={route.path}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-surface-700 hover:bg-surface-100'
                      }`
                    }
                  >
                    <ApperIcon name={route.icon} size={18} className="mr-3" />
                    {route.label}
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;