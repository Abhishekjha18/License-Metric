// src/pages/LiveMonitorPage.tsx
import React from 'react';
import { Container, Row, Col, Card, ListGroup, Badge, Button } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LiveMonitorPage: React.FC = () => {
  // Placeholder data for "Current Route" line chart
  const routeData = {
    labels: ['0 mi', '2 mi', '4 mi', '6 mi', '8 mi'],
    datasets: [
      {
        label: 'Route Progress',
        data: [0, 2, 5, 6, 8],
        borderColor: '#4e73df',
        backgroundColor: 'rgba(78, 115, 223, 0.2)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const routeOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const recentEvents = [
    { time: '10:21 AM', event: 'Moderate Acceleration', impact: '-3 pts' },
    { time: '10:15 AM', event: 'Smooth Lane Change', impact: '+2 pts' },
  ];

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header title="Live Monitor" />
        <Container fluid>
          <Row>
            <Col className="d-flex justify-content-between align-items-center">
              <h6 className="text-muted">Sunday, March 16, 2025 10:24 AM</h6>
              <div>
                <Badge bg="danger" className="me-2">
                  RECORDING
                </Badge>
                <Button variant="outline-primary">End Drive</Button>
              </div>
            </Col>
          </Row>

          <Row className="mt-3">
            {/* Current Route */}
            <Col lg={6} className="mb-3">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Current Route</Card.Title>
                  <Line data={routeData} options={routeOptions} />
                  <p className="text-muted mt-2">~ 7 mi to destination</p>
                </Card.Body>
              </Card>
            </Col>

            {/* Current Stats */}
            <Col lg={3} className="mb-3">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Current Stats</Card.Title>
                  <div className="mb-2">
                    <strong>Current Speed</strong>
                    <div>37 mph</div>
                  </div>
                  <div className="mb-2">
                    <strong>Engine RPM</strong>
                    <div>2100</div>
                  </div>
                  <div className="mb-2">
                    <strong>Current MPG</strong>
                    <div>28.4</div>
                  </div>
                  <div className="mb-2">
                    <strong>Duration</strong>
                    <div>14:37</div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Real-time Driving Score */}
            <Col lg={3} className="mb-3">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Real-time Driving Score</Card.Title>
                  <h2 className="text-center mb-3">83</h2>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="py-1">
                      Smoothness <span className="float-end">85%</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="py-1">
                      Consistency <span className="float-end">80%</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="py-1">
                      Safety <span className="float-end">92%</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="py-1">
                      Eco Driving <span className="float-end">78%</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={6} className="mb-3">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Recent Events</Card.Title>
                  <ListGroup variant="flush">
                    {recentEvents.map((evt, idx) => (
                      <ListGroup.Item key={idx}>
                        <div className="d-flex justify-content-between">
                          <div>
                            <strong>{evt.event}</strong>
                            <div className="text-muted small">{evt.time}</div>
                          </div>
                          <div className="text-muted">{evt.impact}</div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default LiveMonitorPage;
