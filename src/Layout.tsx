import React from 'react'
import Header from './component/header/Header'
import { NavLink, Outlet } from 'react-router-dom'

const Layout: React.FC = () => {
  return (
    <div>
      <Header />
      <main className="c-main">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout