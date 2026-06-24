import logoSidebar from '../assets/logo_sidebar.png';

const SideBar = () => {
  return (
    <aside className='w-64 bg-white border-r min-h-screen flex flex-col'>
      <img src={logoSidebar} alt="ddd" />
       <div className="p-5 border-b">
        <h1 className="text-xl font-bold text-blue-600">
          Velocity RMS
        </h1>
        <p className="text-xs text-gray-500">
          Floor Management
        </p>
      </div>
    </aside>
  )
}

export default SideBar