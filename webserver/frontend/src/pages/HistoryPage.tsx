// src/pages/HistoryPage.tsx
import React from 'react';
import { Container, Row, Col, Card, Table, Form, Pagination, Badge, Button } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HistoryPage: React.FC = () => {
  // Example data for the line chart
  const chartData = {
    labels: ['Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Overall Score',
        data: [70, 78, 82, 85],
        fill: false,
        borderColor: '#4e73df',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // Example drive records
  const driveRecords = [
    { date: 'Mar 15, 2025', tripName: 'Morning Commute', duration: '27 min', distance: '12.4 miles', score: 88 },
    { date: 'Mar 15, 2025', tripName: 'Evening Drive', duration: '25 min', distance: '10.2 miles', score: 80 },
    { date: 'Mar 14, 2025', tripName: 'Highway Trip', duration: '58 min', distance: '76 miles', score: 96 },
    { date: 'Mar 12, 2025', tripName: 'Evening Drive', duration: '32 min', distance: '15 miles', score: 72 },
    { date: 'Mar 9, 2025', tripName: 'Weekend Errand', duration: '18 min', distance: '5.2 miles', score: 79 },
    // Add more records as needed
  ];

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header title="Drive History" />
        <Container fluid>
          <Row>
            <Col className="d-flex justify-content-between align-items-center">
              <h5 className="text-muted">Sunday, March 16, 2025</h5>
              <Form.Select style={{ width: '200px' }} defaultValue="Last 3 Months">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 3 Months</option>
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </Form.Select>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col lg={6} className="mb-3">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Score Trend</Card.Title>
                  <Line data={chartData} options={chartOptions} />
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6} className="mb-3">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Drive Records</Card.Title>
                  <Table hover responsive className="align-middle">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Trip Name</th>
                        <th>Duration</th>
                        <th>Distance</th>
                        <th>Score</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {driveRecords.map((record, index) => (
                        <tr key={index}>
                          <td>{record.date}</td>
                          <td>{record.tripName}</td>
                          <td>{record.duration}</td>
                          <td>{record.distance}</td>
                          <td>
                            <Badge
                              bg={
                                record.score >= 85
                                  ? 'success'
                                  : record.score >= 70
                                  ? 'warning'
                                  : 'danger'
                              }
                            >
                              {record.score}
                            </Badge>
                          </td>
                          <td>
                            <Button variant="link" size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  {/* Pagination */}
                  <div className="d-flex justify-content-between align-items-center">
                    <small>Page 1 of 7</small>
                    <Pagination size="sm" className="mb-0">
                      <Pagination.Prev />
                      <Pagination.Item active>{1}</Pagination.Item>
                      <Pagination.Item>{2}</Pagination.Item>
                      <Pagination.Item>{3}</Pagination.Item>
                      <Pagination.Item>{4}</Pagination.Item>
                      <Pagination.Item>{5}</Pagination.Item>
                      <Pagination.Next />
                    </Pagination>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default HistoryPage;
