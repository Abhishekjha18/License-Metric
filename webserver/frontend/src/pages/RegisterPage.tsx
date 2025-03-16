// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Optionally update profile with name here using updateProfile()
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Registration Error:', error.message);
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
            <h2 className="mb-4">Register</h2>
            <Form onSubmit={handleRegister}>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter your full name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
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
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Enter a password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100 mb-3">
                REGISTER
              </Button>
            </Form>
            <div className="text-center">
              <span className="text-muted">Already have an account?</span>{' '}
              <Link to="/login">Log In</Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
