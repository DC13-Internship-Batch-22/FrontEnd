import { HandPlatter, LayoutDashboard, LogOut, NotebookText, Settings } from 'lucide-react';
import logoSidebar from '../assets/logo_sidebar.png';
import { NavLink, useNavigate } from 'react-router-dom';


const SideBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    navigate("/login");
  };
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
          <NavLink to={'/dashboard'} className='flex gap-5 text-gray-800 justify-start items-center p-5 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 cursor-pointer'>
            <div>
              <LayoutDashboard className='w-6 h-6' />
            </div>
            <div className='font-semibold'>Dashboard</div>
          </NavLink>
          <NavLink to={'/table'} className='flex gap-5 text-gray-800 justify-start items-center p-5 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 cursor-pointer'>
            <div>
              <HandPlatter className='w-6 h-6' />
            </div>
            <div className='font-semibold'>Tables</div>
          </NavLink>
          <NavLink to={'/order'} className='flex gap-5 text-gray-800 justify-start items-center p-5 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 cursor-pointer'>
            <div>
              <NotebookText className='w-6 h-6' />
            </div>
            <div className='font-semibold'>Orders</div>
          </NavLink>
        </div>
        <div className='flex flex-col w-full gap-1 justify-center mt-3 border-t border-gray-200'>
          <NavLink to={'/option'} className='flex gap-5 text-gray-800 justify-start items-center p-5 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 cursor-pointer'>
            <div>
              <Settings className='w-6 h-6' />
            </div>
            <div className='font-semibold'>Settings</div>
          </NavLink>
          <div
            onClick={handleLogout}
            className='flex gap-5 text-gray-800 justify-start items-center p-5 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 cursor-pointer'
          >
            <div>
              <LogOut className='w-6 h-6' />
            </div>
            <div className='font-semibold'>Logout</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default SideBar