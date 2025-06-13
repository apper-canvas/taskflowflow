import Dashboard from '@/components/pages/Dashboard';
import Archive from '@/components/pages/Archive';
import Settings from '@/components/pages/Settings';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  archive: {
    id: 'archive',
    label: 'Archive',
    path: '/archive',
    icon: 'Archive',
    component: Archive
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  }
};

export const routeArray = Object.values(routes);
export default routes;