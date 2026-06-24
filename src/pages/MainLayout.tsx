import React from 'react'
import SideBar from '../components/SideBar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <>
      <SideBar />

      <main className="ml-64 min-h-screen">
        <Outlet />
      </main>
    </>
  )
}

export default MainLayout