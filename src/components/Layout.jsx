import React, { useState } from 'react'
import Navbar from './Navbar.jsx'
import Sidebar from './Sidebar.jsx'

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="app-shell min-h-screen">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />
      <main
        className={`page-main ${
          sidebarOpen ? 'main-offset-wide' : 'main-offset-compact'
        }`}
      >
        <div className="page-container">{children}</div>
      </main>
    </div>
  )
}