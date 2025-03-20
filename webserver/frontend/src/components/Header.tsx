// src/components/Header.tsx
import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';

interface HeaderProps {
  title?: string;
  showButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showButton = false,
  buttonText,
  onButtonClick,
}) => {
  return (
    <Navbar bg="light" expand="sm" className="mb-3 shadow-sm">
      <Container fluid>
        <Navbar.Brand className="fw-bold">{title || 'Dashboard'}</Navbar.Brand>
        {showButton && (
          <Button variant="primary" onClick={onButtonClick}>
            {buttonText}
          </Button>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
