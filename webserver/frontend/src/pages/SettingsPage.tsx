// src/pages/SettingsPage.tsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Nav } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'vehicle' | 'notifications' | 'privacy'>('profile');

  const handleSelectTab = (tab: 'profile' | 'vehicle' | 'notifications' | 'privacy') => {
    setActiveTab(tab);
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header title="Settings" />
        <Container fluid>
          {/* Date Row */}
          <Row>
            <Col>
              <h6 className="text-muted">Sunday, March 16, 2025</h6>
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
                  {activeTab === 'profile' && (
                    <>
                      <h5 className="mb-3">Account Information</h5>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control type="text" placeholder="Alex Johnson" />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type="email" placeholder="alex.johnson@example.com" />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="formPhone">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control type="text" placeholder="(123) 456-7890" />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="formLicense">
                            <Form.Label>Driver License</Form.Label>
                            <Form.Control type="text" placeholder="(WA)" />
                          </Form.Group>
                        </Col>
                      </Row>

                      <hr />

                      <h5 className="mb-3">Driving Habits</h5>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="formPrimaryUse">
                            <Form.Label>Primary Use</Form.Label>
                            <Form.Select defaultValue="commute">
                              <option value="commute">Commuting</option>
                              <option value="rideshare">Rideshare/Delivery</option>
                              <option value="personal">Personal Trips</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="formWeeklyMileage">
                            <Form.Label>Weekly Mileage</Form.Label>
                            <Form.Control type="text" placeholder="100-150 mi" />
                          </Form.Group>
                        </Col>
                      </Row>

                      <div className="text-end">
                        <Button variant="primary">SAVE CHANGES</Button>
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
                </Card.Body>
              </Card>
            </Col>

            {/* Subscription / Plan Info (Right Column) */}
            {activeTab === 'profile' && (
              <Col lg={4}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <h5>Current Plan: Premium (Annual)</h5>
                    <p className="mb-1">Next billing date: May 12, 2025</p>
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
