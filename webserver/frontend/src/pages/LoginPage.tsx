// src/pages/LoginPage.tsx
import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  return (
    <Container fluid className="vh-100">
      <Row className="h-100">
        {/* Left Side Branding */}
        <Col
          md={6}
          className="d-none d-md-flex flex-column justify-content-center align-items-center text-white"
          style={{ backgroundColor: '#4e73df' }}
        >
          <h1 className="mb-3">DRIVE ANALYTICS</h1>
          <p className="mb-5" style={{ maxWidth: '400px', textAlign: 'center' }}>
            Improve your driving with real-time ML analysis
          </p>
          {/* Add an icon or illustration here if desired */}
          <div style={{ fontSize: '5rem' }}>🚘</div>
        </Col>

        {/* Right Side Login Form */}
        <Col
          md={6}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <div style={{ maxWidth: '400px', width: '100%' }}>
            <h2 className="mb-4">Log In to Your Account</h2>
            <p className="text-muted mb-4">Access your driving analytics dashboard</p>
            <Form>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" placeholder="Enter your email" />
              </Form.Group>
              <Form.Group controlId="formPassword" className="mb-3">
                <div className="d-flex justify-content-between">
                  <Form.Label>Password</Form.Label>
                  <Link to="#" className="small">
                    Forgot?
                  </Link>
                </div>
                <Form.Control type="password" placeholder="Enter your password" />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100 mb-3">
                LOG IN
              </Button>
            </Form>
            <div className="text-center text-muted mb-2">Or continue with</div>
            <div className="d-flex justify-content-center mb-4">
              <Button variant="outline-secondary" className="me-2">
                Google
              </Button>
              <Button variant="outline-secondary">Apple</Button>
            </div>
            <div className="text-center">
              <span className="text-muted">Don’t have an account?</span>{' '}
              <Link to="#">Create one now</Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
