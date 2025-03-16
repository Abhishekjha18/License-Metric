// src/pages/BenchmarksPage.tsx
import React from 'react';
import { Container, Row, Col, Card, Table, Badge, Alert } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const BenchmarksPage: React.FC = () => {
  const userScore = 85;
  const similarDriversScore = 78;
  const allDriversScore = 72;

  const categories = [
    {
      category: 'Smoothness',
      yourScore: '82%',
      similarDrivers: '68%',
      allDrivers: '76%',
      percentile: '89th',
    },
    {
      category: 'Consistency',
      yourScore: '80%',
      similarDrivers: '65%',
      allDrivers: '73%',
      percentile: '84th',
    },
    {
      category: 'Safety',
      yourScore: '91%',
      similarDrivers: '78%',
      allDrivers: '82%',
      percentile: '93rd',
    },
    {
      category: 'Efficiency',
      yourScore: '79%',
      similarDrivers: '67%',
      allDrivers: '70%',
      percentile: '76th',
    },
  ];

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header title="Benchmarks" />
        <Container fluid>
          <Row>
            <Col className="d-flex justify-content-between align-items-center">
              <h6 className="text-muted">Sunday, March 16, 2025</h6>
              <div>
                <span className="me-2">Compare to:</span>
                <Badge bg="primary">All Drivers</Badge>
              </div>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col lg={6} className="mb-3">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Overall Score Comparison</Card.Title>
                  <div className="d-flex align-items-center mb-2">
                    <div className="me-3">You:</div>
                    <h4 className="mb-0 text-primary">{userScore}</h4>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <div className="me-3">Similar Drivers:</div>
                    <h4 className="mb-0 text-success">{similarDriversScore}</h4>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="me-3">All Drivers:</div>
                    <h4 className="mb-0 text-secondary">{allDriversScore}</h4>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6} className="mb-3">
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title>Score by Categories</Card.Title>
                  <Table hover responsive>
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Your Score</th>
                        <th>Similar Drivers</th>
                        <th>All Drivers</th>
                        <th>Percentile</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.category}</td>
                          <td>{item.yourScore}</td>
                          <td>{item.similarDrivers}</td>
                          <td>{item.allDrivers}</td>
                          <td>{item.percentile}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <Alert variant="info" className="shadow-sm">
                <Alert.Heading>Benchmark Insights</Alert.Heading>
                <p className="mb-0">
                  You rank higher than 87% of all drivers in overall score. Focus on improving
                  efficiency to match your excellent safety scores.
                </p>
              </Alert>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default BenchmarksPage;
