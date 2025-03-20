// src/pages/SettingsPage.tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Nav } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'vehicle' | 'notifications' | 'privacy'>('profile');
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    license: '',
    primaryUse: 'commute',
    weeklyMileage: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData({
              fullName: data.fullName || '',
              email: auth.currentUser.email || '',
              phone: data.phone || '',
              license: data.license || '',
              primaryUse: data.primaryUse || 'commute',
              weeklyMileage: data.weeklyMileage || ''
            });
          } else {
            // Set email from auth if no document exists yet
            setUserData({
              ...userData,
              email: auth.currentUser.email || ''
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [auth.currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    const field = id.replace('form', '').toLowerCase();
    setUserData({
      ...userData,
      [field]: value
    });
  };

  const handleSaveChanges = async () => {
    if (!auth.currentUser) return;
    
    setSaving(true);
    setMessage('');
    
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        fullName: userData.fullName,
        phone: userData.phone,
        license: userData.license,
        primaryUse: userData.primaryUse,
        weeklyMileage: userData.weeklyMileage,
        updatedAt: new Date()
      });
      
      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSelectTab = (tab: 'profile' | 'vehicle' | 'notifications' | 'privacy') => {
    setActiveTab(tab);
  };

  // Get current date for display
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header title="Settings" />
        <Container fluid>
          {/* Date Row */}
          <Row>
            <Col>
              <h6 className="text-muted">{currentDate}</h6>
            </Col>
          </Row>

          {/* Tabs */}
          <Nav variant="tabs" className="mt-3" activeKey={activeTab}>
            <Nav.Item>
              <Nav.Link eventKey="profile" onClick={() => handleSelectTab('profile')}>
                Profile
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="vehicle" onClick={() => handleSelectTab('vehicle')}>
                Vehicle
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="notifications" onClick={() => handleSelectTab('notifications')}>
                Notifications
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="privacy" onClick={() => handleSelectTab('privacy')}>
                Privacy
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {/* Tab Content */}
          <Row className="mt-4">
            <Col lg={8}>
              <Card className="shadow-sm">
                <Card.Body>
                  {loading ? (
                    <div className="text-center p-4">Loading...</div>
                  ) : (
                    <>
                      {activeTab === 'profile' && (
                        <>
                          <h5 className="mb-3">Account Information</h5>
                          {message && (
                            <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
                              {message}
                            </div>
                          )}
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3" controlId="formName">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control 
                                  type="text" 
                                  value={userData.fullName}
                                  onChange={handleInputChange}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3" controlId="formEmail">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control 
                                  type="email" 
                                  value={userData.email}
                                  disabled
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3" controlId="formPhone">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control 
                                  type="text" 
                                  value={userData.phone}
                                  onChange={handleInputChange}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3" controlId="formLicense">
                                <Form.Label>Driver License</Form.Label>
                                <Form.Control 
                                  type="text" 
                                  value={userData.license}
                                  onChange={handleInputChange}
                                />
                              </Form.Group>
                            </Col>
                          </Row>

                          <hr />

                          <h5 className="mb-3">Driving Habits</h5>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3" controlId="formPrimaryUse">
                                <Form.Label>Primary Use</Form.Label>
                                <Form.Select 
                                  value={userData.primaryUse}
                                  onChange={handleInputChange}
                                >
                                  <option value="commute">Commuting</option>
                                  <option value="rideshare">Rideshare/Delivery</option>
                                  <option value="personal">Personal Trips</option>
                                </Form.Select>
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3" controlId="formWeeklyMileage">
                                <Form.Label>Weekly Mileage</Form.Label>
                                <Form.Control 
                                  type="text" 
                                  value={userData.weeklyMileage}
                                  onChange={handleInputChange}
                                />
                              </Form.Group>
                            </Col>
                          </Row>

                          <div className="text-end">
                            <Button 
                              variant="primary" 
                              onClick={handleSaveChanges}
                              disabled={saving}
                            >
                              {saving ? 'SAVING...' : 'SAVE CHANGES'}
                            </Button>
                          </div>
                        </>
                      )}

                      {activeTab === 'vehicle' && (
                        <>
                          <h5>Vehicle Settings</h5>
                          <p>Coming soon! (Implement your vehicle details here.)</p>
                        </>
                      )}

                      {activeTab === 'notifications' && (
                        <>
                          <h5>Notification Preferences</h5>
                          <p>Coming soon! (Implement your notification preferences here.)</p>
                        </>
                      )}

                      {activeTab === 'privacy' && (
                        <>
                          <h5>Privacy Settings</h5>
                          <p>Coming soon! (Implement your privacy settings here.)</p>
                        </>
                      )}
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Subscription / Plan Info (Right Column) */}
            {activeTab === 'profile' && (
              <Col lg={4}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <h5>Current Plan: Premium (Annual)</h5>
                    <p className="mb-1">Next billing date: {new Date(new Date().setMonth(new Date().getMonth() + 12)).toLocaleDateString()}</p>
                    <Button variant="outline-primary">Manage Plan</Button>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default SettingsPage;