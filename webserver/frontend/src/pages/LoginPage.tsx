import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { FirebaseError } from 'firebase/app';
import { FcGoogle } from 'react-icons/fc';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Logo from '../components/Logo';
import '../styles/authpages.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // After successful login, redirect
      const destination = location.state?.from?.pathname || '/live-monitor';
      navigate(destination, { replace: true });
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        let errorMessage = 'Failed to sign in';
        
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address format';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This account has been disabled';
            break;
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again later';
            break;
        }
        
        setError(errorMessage);
        console.error('Login Error:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/live-monitor');
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        setError('Google sign-in failed. Please try again.');
        console.error('Google Login Error:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="vh-100 login-container">
      <Row className="h-100">
        <Col
          md={6}
          className="d-none d-md-flex flex-column justify-content-center align-items-center text-white left-panel"
        >
          <div className="left-panel-content text-center">
            <Logo size="large" />
            <h1 className="mb-3 fw-bold">DRIVE ANALYTICS</h1>
            <p className="mb-5" style={{ maxWidth: '400px' }}>
              Improve your driving performance with our AI-powered analytics platform. Get real-time feedback and actionable insights.
            </p>
            <div className="hero-image">
              <div style={{ fontSize: '6rem' }}>🚘</div>
              <div className="hero-overlay"></div>
            </div>
            <div className="mt-5 testimonial-section">
              <p className="testimonial">
                "Drive Analytics transformed my driving habits and saved me 15% on fuel costs in just one month!"
              </p>
              <p className="testimonial-author">— Michael R., Professional Driver</p>
            </div>
          </div>
        </Col>
        <Col md={6} className="d-flex flex-column justify-content-center align-items-center right-panel">
          <Card className="auth-card shadow">
            <Card.Body className="p-4 p-md-5">
              <div className="d-md-none text-center mb-4">
                <Logo size="medium" />
                <h2 className="brand-name">DRIVE ANALYTICS</h2>
              </div>

              <h2 className="mb-4 auth-title">Welcome Back</h2>
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control-lg"
                    required
                    disabled={loading}
                  />
                </Form.Group>
                
                <Form.Group controlId="formPassword" className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <Form.Label>Password</Form.Label>
                    <Link to="/forgot-password" className="text-primary">Forgot Password?</Link>
                  </div>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control-lg"
                      required
                      disabled={loading}
                    />
                    <Button 
                      variant="link" 
                      className="password-toggle" 
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </div>
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 mb-3 btn-lg"
                  disabled={loading}
                >
                  {loading ? <Spinner animation="border" size="sm" /> : 'LOG IN'}
                </Button>
              </Form>
              
              <div className="separator my-4">
                <span>OR</span>
              </div>
              
              <Button 
                variant="outline-secondary" 
                className="w-100 mb-4 google-btn"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <FcGoogle size={24} className="me-2" /> Continue with Google
              </Button>
              
              <div className="text-center">
                <span className="text-muted">Don't have an account?</span>{' '}
                <Link to="/register" className="text-primary fw-bold">Create one now</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;