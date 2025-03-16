// src/components/Sidebar.tsx
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';


const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="d-flex flex-column bg-dark text-white vh-100" style={{ width: '250px' }}>
      <div className="p-3 mb-2 border-bottom">
        <h4 className="text-white">DRIVE ANALYTICS</h4>
        <p className="small">Improve your driving with real-time ML analysis</p>
      </div>
      <Nav variant="pills" className="flex-column">
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/dashboard"
            active={location.pathname === '/dashboard'}
            className="text-white"
          >
            Dashboard
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/live-monitor"
            active={location.pathname === '/live-monitor'}
            className="text-white"
          >
            Live Monitor
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/benchmarks"
            active={location.pathname === '/benchmarks'}
            className="text-white"
          >
            Benchmarks
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/history"
            active={location.pathname === '/history'}
            className="text-white"
          >
            History
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/analytics"
            active={location.pathname === '/analytics'}
            className="text-white"
          >
            Analytics
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/settings"
            active={location.pathname === '/settings'}
            className="text-white"
          >
            Settings
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <div className="mt-auto p-3 border-top">
        <div className="d-flex align-items-center">
          <img
            src="../assets/profile.png"
            alt="User Avatar"
            className="rounded-circle me-2"
          />
          <div>
            <div className="fw-bold">Alex Johnson</div>
            <div className="text-muted" style={{ fontSize: '0.8rem' }}>View Profile</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
