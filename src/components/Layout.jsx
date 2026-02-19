import React, { useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

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