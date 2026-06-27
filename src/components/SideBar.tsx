import { HandPlatter, LayoutDashboard, LayoutGrid, LogOut, NotebookText, Settings, Soup } from 'lucide-react';
import logoSidebar from '../assets/logo_sidebar.png';
import { NavLink } from 'react-router-dom';
import { useLogout } from '@/api/hooks';

interface NavItem {
  key: string;
  path: string;
  icon: React.ReactNode;
  label: string;
}

const SideBar = () => {
  const { logout } = useLogout();

  const handleLogout = () => {
    logout();
  };

  const navItems: NavItem[] = [
    {
      key: 'dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className='w-6 h-6' />,
      label: 'Dashboard'
    },
    {
      key: 'tables',
      path: '/table',
      icon: <HandPlatter className='w-6 h-6' />,
      label: 'Tables'
    },
    {
      key: 'orders',
      path: '/order',
      icon: <NotebookText className='w-6 h-6' />,
      label: 'Orders'
    },
    {
      key: 'menu',
      path: '/menu',
      icon: <Soup className='w-6 h-6' />,
      label: 'Menu'
    },
    {
      key: 'category',
      path: '/category',
      icon: <LayoutGrid className='w-6 h-6' />,
      label: 'Category',
    },
  ];

  const bottomItems: NavItem[] = [
    {
      key: 'settings',
      path: '/option',
      icon: <Settings className='w-6 h-6' />,
      label: 'Settings'
    }
  ];

  const renderNavItem = (item: NavItem) => (
    <NavLink
      key={item.key}
      to={item.path}
      className={({ isActive }) =>
        `flex gap-5 text-gray-800 justify-start items-center p-5 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 cursor-pointer ${
          isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
        }`
      }
    >
      <div>{item.icon}</div>
      <div className='font-semibold'>{item.label}</div>
    </NavLink>
  );

  return (
    <aside className='w-64 bg-white border-r border-gray-200 h-screen fixed top-0 left-0 flex flex-col'>
      <div className='flex items-center justify-center'>
        <img src={logoSidebar} className='w-10 h-10' alt="logo" />
        <div className="p-5">
          <h1 className="text-xl font-bold text-blue-600">
            Velocity RMS
          </h1>
          <p className="text-xs text-gray-500">
            Floor Management
          </p>
        </div>
      </div>

      <div className='flex flex-col justify-between flex-1'>
        <div className='flex flex-col w-full gap-1 justify-center mt-3'>
          {navItems.map(renderNavItem)}
        </div>

        <div className='flex flex-col w-full gap-1 justify-center mt-3 border-t border-gray-200'>
          {bottomItems.map(renderNavItem)}
          <div
            onClick={handleLogout}
            className='flex gap-5 text-gray-800 justify-start items-center p-5 hover:bg-red-50 hover:text-red-600 transition-all duration-300 cursor-pointer'
          >
            <div><LogOut className='w-6 h-6' /></div>
            <div className='font-semibold'>Logout</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
