// src/components/Layout.tsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

// Remove the children prop from the component definition
const Layout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const toggleSidebar = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <div className="d-flex">
      <Sidebar onToggleCollapse={toggleSidebar} />
      <main 
        style={{ 
          marginLeft: sidebarCollapsed ? '70px' : '250px', 
          transition: 'margin-left 0.3s ease',
          width: 'calc(100% - ' + (sidebarCollapsed ? '70px' : '250px') + ')',
          minHeight: '100vh',
          overflow: 'auto'
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;