import React, { useState, useEffect } from 'react';
import { Nav, Button, Collapse } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  onToggleCollapse?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggleCollapse }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Navigation items with icons
  const navItems = [
    { path: '/live-monitor', label: 'Live Monitor', icon: 'bi-activity' },
    { path: '/history', label: 'History', icon: 'bi-clock-history' },
    { path: '/analytics', label: 'Analytics', icon: 'bi-graph-up' },
    { path: '/benchmarks', label: 'Benchmarks', icon: 'bi-trophy' },
    { path: '/settings', label: 'Settings', icon: 'bi-gear' },
  ];

  // Notify parent component when sidebar is collapsed/expanded
  useEffect(() => {
    if (onToggleCollapse) {
      onToggleCollapse(collapsed);
    }
  }, [collapsed, onToggleCollapse]);

  return (
    <div 
      className={`sidebar d-flex flex-column bg-dark text-white ${collapsed ? 'collapsed' : ''}`} 
      style={{ 
        width: collapsed ? '70px' : '250px',
        position: 'fixed',
        height: '100vh',
        transition: 'width 0.3s ease',
        zIndex: 1030,
        overflowX: 'hidden',
        overflowY: 'auto',
        left: 0,
        top: 0
      }}
    >
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        {!collapsed && (
          <div>
            <h4 className="text-white m-0">
              <i className="bi bi-car-front me-2"></i>
              License Metrics
            </h4>
            <p className="small text-light mb-0">Real-time Driving Feedback System</p>
          </div>
        )}
        {collapsed && (
          <div className="text-center w-100">
            <i className="bi bi-car-front fs-4"></i>
          </div>
        )}
        <Button 
          variant="link" 
          className="text-white p-0 border-0" 
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <i className={`bi ${collapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
        </Button>
      </div>

      <Nav variant="pills" className="flex-column mt-3">
        {navItems.map((item) => (
          <Nav.Item key={item.path}>
            <Nav.Link 
              as={Link} 
              to={item.path} 
              active={location.pathname === item.path}
              className={`d-flex align-items-center ${collapsed ? 'justify-content-center' : ''} p-3 text-white ${location.pathname === item.path ? 'active' : 'nav-link-dark'}`}
            >
              <i className={`bi ${item.icon} ${collapsed ? 'fs-5' : 'me-3'}`}></i>
              {!collapsed && item.label}
              {location.pathname === item.path && collapsed && (
                <span className="position-absolute top-50 end-0 translate-middle-y bg-primary rounded-start" style={{width: '4px', height: '60%'}}></span>
              )}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      {/* Status indicator */}
      {!collapsed && (
        <div className="mx-3 mt-4 p-3 bg-success bg-opacity-25 rounded">
          <div className="d-flex align-items-center">
            <div className="rounded-circle bg-success me-2" style={{width: '10px', height: '10px'}}></div>
            <div className="small">System Connected</div>
          </div>
          <div className="progress mt-2" style={{height: '6px'}}>
            <div className="progress-bar bg-success" style={{width: '85%'}}></div>
          </div>
        </div>
      )}

      <div className="mt-auto p-3 border-top">
        <div 
          className={`d-flex align-items-center ${collapsed ? 'justify-content-center' : ''} cursor-pointer`}
          onClick={() => setShowUserMenu(!showUserMenu)}
          style={{cursor: 'pointer'}}
        >
          {!collapsed && (
            <div className="flex-grow-1">
              <div className="fw-bold">Alex Johnson</div>
              <div className="text-muted small">Safe Driver</div>
            </div>
          )}
          {!collapsed && (
            <i className={`bi ${showUserMenu ? 'bi-chevron-up' : 'bi-chevron-down'} text-muted`}></i>
          )}
        </div>
        
        {!collapsed && (
          <Collapse in={showUserMenu}>
            <div className="mt-3">
              <Nav className="flex-column">
                <Nav.Link className="text-white p-2 ps-0">
                  <i className="bi bi-person me-2"></i> View Profile
                </Nav.Link>
                <Nav.Link className="text-white p-2 ps-0">
                  <i className="bi bi-shield-check me-2"></i> Privacy Settings
                </Nav.Link>
                <Nav.Link className="text-white p-2 ps-0">
                  <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                </Nav.Link>
              </Nav>
            </div>
          </Collapse>
        )}
      </div>

      {/* Custom CSS for the sidebar */}
      <style>
        {`
          .nav-link-dark {
            background-color: transparent !important;
          }
          .nav-link-dark:hover {
            background-color: rgba(255, 255, 255, 0.1) !important;
          }
          .active {
            background-color: #0d6efd !important;
          }
          .sidebar::-webkit-scrollbar {
            width: 5px;
          }
          .sidebar::-webkit-scrollbar-thumb {
            background: #495057;
            border-radius: 10px;
          }
          .sidebar::-webkit-scrollbar-track {
            background: #343a40;
          }
        `}
      </style>
    </div>
  );
};

export default Sidebar;