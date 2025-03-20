import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { FirebaseError } from 'firebase/app';
import { FcGoogle } from 'react-icons/fc';
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Logo from '../components/Logo';
import '../styles/authpages.css';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Password strength validation
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  
  const passwordStrength = [hasMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length;
  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 4) return "Medium";
    return "Strong";
  };
  
  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "danger";
    if (passwordStrength <= 4) return "warning";
    return "success";
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (passwordStrength < 3) {
      setError("Please use a stronger password");
      return;
    }
    
    if (!termsAgreed) {
      setError("You must agree to the Terms and Privacy Policy");
      return;
    }
    
    setLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with name
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      
      navigate('/live-monitor');
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        let errorMessage = 'Registration failed';
        
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'This email is already registered';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address format';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password is too weak';
            break;
        }
        
        setError(errorMessage);
        console.error('Registration Error:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError(null);
    setLoading(true);
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/live-monitor');
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        setError('Google sign-up failed. Please try again.');
        console.error('Google Register Error:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="vh-100 register-container">
      <Row className="h-100">
        <Col
          md={6}
          className="d-none d-md-flex flex-column justify-content-center align-items-center text-white left-panel"
        >
          <div className="left-panel-content text-center">
            <Logo size="large" />
            <h1 className="mb-3 fw-bold">LICENSE METRIC</h1>
            <p className="mb-5" style={{ maxWidth: '400px' }}>
              Join thousands of drivers who are improving their skills and saving money with our AI-powered analytics.
            </p>
            <div className="hero-image">
              <div style={{ fontSize: '6rem' }}>🚘</div>
              <div className="hero-overlay"></div>
            </div>
            <div className="features-list mt-4">
              <div className="feature-item">
                <FaCheckCircle className="feature-icon" /> Real-time driving analysis
              </div>
              <div className="feature-item">
                <FaCheckCircle className="feature-icon" /> Personalized improvement tips
              </div>
              <div className="feature-item">
                <FaCheckCircle className="feature-icon" /> Track fuel efficiency
              </div>
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

              <h2 className="mb-4 auth-title">Create Your Account</h2>
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleRegister}>
                <Form.Group controlId="formName" className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control-lg"
                    required
                    disabled={loading}
                  />
                </Form.Group>
                
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
                  <Form.Label>Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
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
                  
                  {password && (
                    <div className="password-strength mt-2">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span>Password strength:</span>
                        <span className={`text-${getPasswordStrengthColor()}`}>{getPasswordStrengthText()}</span>
                      </div>
                      <div className="progress" style={{ height: '8px' }}>
                        <div 
                          className={`progress-bar bg-${getPasswordStrengthColor()}`} 
                          role="progressbar" 
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                          aria-valuenow={passwordStrength} 
                          aria-valuemin={0} 
                          aria-valuemax={5}
                        ></div>
                      </div>
                      <div className="password-requirements mt-2">
                        <div className={hasMinLength ? "text-success" : "text-muted"}>
                          {hasMinLength ? <FaCheckCircle className="me-1" /> : <FaTimesCircle className="me-1" />}
                          At least 8 characters
                        </div>
                        <div className={hasUpperCase && hasLowerCase ? "text-success" : "text-muted"}>
                          {hasUpperCase && hasLowerCase ? <FaCheckCircle className="me-1" /> : <FaTimesCircle className="me-1" />}
                          Upper and lowercase letters
                        </div>
                        <div className={hasNumber ? "text-success" : "text-muted"}>
                          {hasNumber ? <FaCheckCircle className="me-1" /> : <FaTimesCircle className="me-1" />}
                          At least one number
                        </div>
                        <div className={hasSpecialChar ? "text-success" : "text-muted"}>
                          {hasSpecialChar ? <FaCheckCircle className="me-1" /> : <FaTimesCircle className="me-1" />}
                          At least one special character
                        </div>
                      </div>
                    </div>
                  )}
                </Form.Group>
                
                <Form.Group controlId="formConfirmPassword" className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="form-control-lg"
                      required
                      disabled={loading}
                    />
                    <Button 
                      variant="link" 
                      className="password-toggle" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <Form.Text className="text-danger">
                      Passwords don't match
                    </Form.Text>
                  )}
                </Form.Group>
                
                <Form.Group controlId="formTerms" className="mb-4">
                  <Form.Check 
                    type="checkbox" 
                    label={
                      <span>
                        I agree to the <Link to="/terms" target="_blank">Terms of Service</Link> and{' '}
                        <Link to="/privacy" target="_blank">Privacy Policy</Link>
                      </span>
                    }
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    required
                    disabled={loading}
                  />
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 mb-3 btn-lg"
                  disabled={loading}
                >
                  {loading ? <Spinner animation="border" size="sm" /> : 'REGISTER'}
                </Button>
              </Form>
              
              <div className="separator my-4">
                <span>OR</span>
              </div>
              
              <Button 
                variant="outline-secondary" 
                className="w-100 mb-4 google-btn"
                onClick={handleGoogleRegister}
                disabled={loading}
              >
                <FcGoogle size={24} className="me-2" /> Continue with Google
              </Button>
              
              <div className="text-center">
                <span className="text-muted">Already have an account?</span>{' '}
                <Link to="/login" className="text-primary fw-bold">Log In</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;