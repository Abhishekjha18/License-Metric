// src/pages/DashboardPage.tsx
import React from 'react';
import { Container, Row, Col, Card, ListGroup, Badge, Alert } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const DashboardPage: React.FC = () => {
  const overallScore = 85;
  const driveStats = {
    totalDrives: 28,
    totalTime: '15h',
    totalMiles: 423,
  };

  const recentDrives = [
    {
      id: 1,
      title: 'Morning Commute',
      date: 'March 15, 2025',
      duration: '27 min',
      distance: '12.4 miles',
      score: 88,
    },
    {
      id: 2,
      title: 'Evening Drive',
      date: 'March 15, 2025',
      duration: '20 min',
      distance: '9.2 miles',
      score: 72,
    },
    {
      id: 3,
      title: 'Highway Trip',
      date: 'March 14, 2025',
      duration: '58 min',
      distance: '76 miles',
      score: 96,
    },
  ];

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header
          title="Dashboard"
          showButton
          buttonText="Start New Drive"
          onButtonClick={() => alert('Starting new drive...')}
        />
        <Container fluid>
          <Row>
            <Col>
              <h5 className="text-muted">
                Sunday, March 16, 2025
              </h5>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col lg={4} className="mb-3">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Overall Driving Score</Card.Title>
                  <h1 className="display-4">
                    {overallScore}
                  </h1>
                  <p className="text-muted mb-1">Smoothness: 82%</p>
                  <p className="text-muted mb-1">Consistency: 80%</p>
                  <p className="text-muted mb-1">Safety: 91%</p>
                  <p className="text-muted mb-1">Efficiency: 79%</p>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4} className="mb-3">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Drive Statistics</Card.Title>
                  <Row>
                    <Col>
                      <h3>{driveStats.totalDrives}</h3>
                      <p className="text-muted">Total Drives</p>
                    </Col>
                    <Col>
                      <h3>{driveStats.totalTime}</h3>
                      <p className="text-muted">Total Time</p>
                    </Col>
                    <Col>
                      <h3>{driveStats.totalMiles}</h3>
                      <p className="text-muted">Miles Driven</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4} className="mb-3">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Recent Drives</Card.Title>
                  <ListGroup variant="flush">
                    {recentDrives.map((drive) => (
                      <ListGroup.Item key={drive.id}>
                        <div className="d-flex justify-content-between">
                          <div>
                            <strong>{drive.title}</strong>
                            <div className="text-muted small">
                              {drive.date} ~ {drive.duration} ~ {drive.distance}
                            </div>
                          </div>
                          <Badge
                            bg={drive.score >= 85 ? 'success' : drive.score >= 70 ? 'warning' : 'danger'}
                            className="align-self-center"
                          >
                            {drive.score}
                          </Badge>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col lg={12}>
              <Alert variant="info" className="shadow-sm">
                <strong>Driving Tips:</strong> Reduce hard braking events to improve your overall
                safety score. Try to maintain more consistent speeds on highways.
              </Alert>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default DashboardPage;
