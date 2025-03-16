// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // On success, navigate to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login Error:', error.message);
      alert(error.message);
    }
  };

  return (
    <Container fluid className="vh-100">
      <Row className="h-100">
        <Col
          md={6}
          className="d-none d-md-flex flex-column justify-content-center align-items-center text-white"
          style={{ backgroundColor: '#4e73df' }}
        >
          <h1 className="mb-3">DRIVE ANALYTICS</h1>
          <p className="mb-5" style={{ maxWidth: '400px', textAlign: 'center' }}>
            Improve your driving with real-time ML analysis
          </p>
          <div style={{ fontSize: '5rem' }}>🚘</div>
        </Col>
        <Col md={6} className="d-flex flex-column justify-content-center align-items-center">
          <div style={{ maxWidth: '400px', width: '100%' }}>
            <h2 className="mb-4">Log In</h2>
            <Form onSubmit={handleLogin}>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formPassword" className="mb-3">
                <div className="d-flex justify-content-between">
                  <Form.Label>Password</Form.Label>
                  <Link to="#">Forgot?</Link>
                </div>
                <Form.Control 
                  type="password" 
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100 mb-3">
                LOG IN
              </Button>
            </Form>
            <div className="text-center">
              <span className="text-muted">Don’t have an account?</span>{' '}
              <Link to="/register">Create one now</Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
