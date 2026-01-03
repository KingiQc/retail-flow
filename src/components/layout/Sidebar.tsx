import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut,
  LayoutDashboard,
  Tags
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  const navItems = [
    { path: '/pos', label: 'Point of Sale', icon: ShoppingCart, roles: ['admin', 'cashier'] },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin'] },
    { path: '/products', label: 'Products', icon: Package, roles: ['admin'] },
    { path: '/inventory', label: 'Inventory', icon: Tags, roles: ['admin'] },
    { path: '/reports', label: 'Sales Reports', icon: BarChart3, roles: ['admin'] },
    { path: '/users', label: 'Users', icon: Users, roles: ['admin'] },
    { path: '/settings', label: 'Settings', icon: Settings, roles: ['admin', 'cashier'] },
  ];

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.role || 'cashier')
  );

  return (
    <aside className="w-64 bg-sidebar flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          StylePOS
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'sidebar-nav-item',
                isActive && 'sidebar-nav-item-active'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-sidebar-accent mb-3">
          <div className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-semibold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.name}
            </p>
            <p className="text-xs text-sidebar-foreground/60 capitalize">
              {user?.role}
            </p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="sidebar-nav-item w-full text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
