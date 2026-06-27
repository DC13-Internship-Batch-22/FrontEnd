import SideBar from '../components/SideBar'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

const MainLayout = () => {
  return (
    <>
      <SideBar />

      <main className="ml-64 min-h-screen">
        <Header/>
        <Outlet />
      </main>
    </>
  )
}

export default MainLayout
