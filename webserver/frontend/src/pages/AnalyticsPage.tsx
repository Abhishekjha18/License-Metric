// src/pages/AnalyticsPage.tsx
import React from 'react';
import { Container, Row, Col, Card, Table, Alert } from 'react-bootstrap';
import { Radar, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  RadialLinearScale, // Required for Radar charts
  PointElement,
  LineElement,
  BarElement,
  RadarController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

// Register all necessary components with ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale, // Register RadialLinearScale here
  PointElement,
  LineElement,
  BarElement,
  RadarController,
  Title,
  Tooltip,
  Legend
);

const AnalyticsPage: React.FC = () => {
  // Radar Chart Data (Driving Patterns)
  const radarData = {
    labels: ['City', 'Highway', 'Long Trips', 'Weekend', 'Night', 'Rain/Snow', 'Weekday'],
    datasets: [
      {
        label: 'Driving Patterns',
        data: [15, 25, 10, 18, 20, 5, 30],
        backgroundColor: 'rgba(78, 115, 223, 0.2)',
        borderColor: 'rgba(78, 115, 223, 1)',
        borderWidth: 2,
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 0,
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  // Bar Chart Data (Fuel Economy Trends)
  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'MPG',
        data: [22, 25, 23, 27, 24],
        backgroundColor: 'rgba(28, 200, 138, 0.6)',
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 0,
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const drivingHabitsAnalysis = [
    { label: 'Hard Braking Events', value: '2 per 100 miles', comparison: 'Lower than avg' },
    { label: 'Rapid Acceleration', value: '3 per 100 miles', comparison: 'Average' },
    { label: 'Lane Changes', value: '5 per 100 miles', comparison: 'Higher than avg' },
  ];

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header title="Analytics" />
        <Container fluid>
          <Row>
            <Col>
              <h6 className="text-muted">Sunday, March 16, 2025</h6>
            </Col>
          </Row>

          <Row className="mt-3">
            {/* Radar Chart Container */}
            <Col lg={6} className="mb-3">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Driving Patterns</Card.Title>
                  <div
                    style={{
                      height: '300px',
                      position: 'relative',
                      overflow: 'hidden',
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    <Radar
                      key="radar-chart"
                      data={radarData}
                      options={radarOptions}
                      redraw
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Bar Chart Container */}
            <Col lg={6} className="mb-3">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Fuel Economy Trends</Card.Title>
                  <div
                    style={{
                      height: '300px',
                      position: 'relative',
                      overflow: 'hidden',
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    <Bar
                      key="bar-chart"
                      data={barData}
                      options={barOptions}
                      redraw
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mt-3">
            {/* Driving Habits Analysis Table */}
            <Col lg={6} className="mb-3">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Driving Habits Analysis</Card.Title>
                  <Table hover responsive>
                    <thead>
                      <tr>
                        <th>Habit</th>
                        <th>Value</th>
                        <th>Comparison</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drivingHabitsAnalysis.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.label}</td>
                          <td>{item.value}</td>
                          <td>{item.comparison}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>

            {/* Insights Alert */}
            <Col lg={6} className="mb-3">
              <Alert variant="success" className="shadow-sm h-100">
                <Alert.Heading>Insights</Alert.Heading>
                <p className="mb-0">
                  Your fuel efficiency has improved by 26% over the last 3 months. You now outperform
                  75% of drivers with similar vehicles. Consider reducing rapid accelerations to improve
                  your efficiency score further.
                </p>
              </Alert>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default AnalyticsPage;