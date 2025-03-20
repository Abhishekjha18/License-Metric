// src/pages/LiveMonitorPage.tsx
/// <reference types="web-bluetooth" />
import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Card, ListGroup, Button, Alert, Modal, Form, Toast, ToastContainer, ProgressBar } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { jsPDF } from 'jspdf';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ScriptableContext,
  Scale,
  CoreScaleOptions
} from 'chart.js';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
);

const predictionMapping: [number, string, string, string][] = [
  [0, "Straight_Slow", "Steady driving at moderate speed", "text-success"],
  [1, "Break_Fast", "Hard braking detected", "text-warning"],
  [4, "Straight_Fast", "Speeding on straight road", "text-danger"],
  [5, "Stationary", "Vehicle not moving", "text-info"],
  [8, "Turn_Slow", "Safe cornering", "text-success"],
  [9, "Little_Turbulence", "Minor road disturbance", "text-warning"],
  [12, "Turn_Fast", "Aggressive cornering", "text-danger"]
];

// Risk categories for behaviors
const riskCategories: Record<string, string> = {
  "Straight_Slow": "low",
  "Stationary": "low",
  "Turn_Slow": "low",
  "Little_Turbulence": "medium",
  "Break_Fast": "medium",
  "Straight_Fast": "high",
  "Turn_Fast": "high"
};

// Maximum drive session duration in minutes
const MAX_DRIVE_DURATION = 60; // 60 minutes

interface Prediction {
  value: number;
  label: string;
  description: string;
  colorClass: string;
  timestamp: Date;
  riskLevel: string;
}

interface DriveSession {
  startTime: Date;
  endTime: Date | null;
  predictions: Prediction[];
  safetyScore: number;
  completed: boolean;
  timedOut: boolean;
  summary: {
    lowRiskCount: number;
    mediumRiskCount: number;
    highRiskCount: number;
    totalPredictions: number;
    mostFrequentEvent: string;
    longestSafeStreak: number;
  };
}

const LiveMonitorPage: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [currentSession, setCurrentSession] = useState<DriveSession | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("danger");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const [safetyScore, setSafetyScore] = useState(100);
  
  // Timer states
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [remainingTime, setRemainingTime] = useState(MAX_DRIVE_DURATION);
  const [timerWarning, setTimerWarning] = useState(false);
  const [sessionTimedOut, setSessionTimedOut] = useState(false);
  
  const deviceRef = useRef<BluetoothDevice | null>(null);
  const safeStreakRef = useRef<number>(0);
  const currentMaxStreakRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer effect
  useEffect(() => {
    if (isConnected) {
      timerRef.current = setInterval(() => {
        setElapsedMinutes(prev => {
          const newElapsed = prev + 1/60; // Update every second (1/60 of a minute)
          const newRemaining = MAX_DRIVE_DURATION - newElapsed;
          
          setRemainingTime(newRemaining);
          
          // Set warning when less than 5 minutes remaining
          if (newRemaining <= 5 && !timerWarning) {
            setTimerWarning(true);
            showNotification("Session Ending Soon", "Your monitoring session will end in 5 minutes.", "warning");
          }
          
          // Auto-end session if time expires
          if (newRemaining <= 0) {
            setSessionTimedOut(true);
            showNotification("Session Timed Out", "Maximum session duration reached.", "danger");
            endDrive(true);
            return MAX_DRIVE_DURATION;
          }
          
          return newElapsed;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isConnected]);

  const handleMLCData = (event: Event) => {
    const characteristic = event.target as BluetoothRemoteGATTCharacteristic;
    const value = characteristic.value;
    if (!value) return;
    
    const dataArray = new Uint8Array(value.buffer);
    if (dataArray.length >= 3) {
      const predValue = dataArray[2];
      const mapping = predictionMapping.find(pair => pair[0] === predValue);
      
      if (mapping) {
        const [value, label, description, colorClass] = mapping;
        const riskLevel = riskCategories[label] || "medium";
        
        const newPrediction: Prediction = {
          value: predValue,
          label,
          description,
          colorClass,
          timestamp: new Date(),
          riskLevel
        };
        
        // Update predictions
        setPredictions(prev => [...prev, newPrediction].slice(-100)); // Keep more history
        
        // Handle streak counting
        if (riskLevel === "low") {
          safeStreakRef.current += 1;
          if (safeStreakRef.current > currentMaxStreakRef.current) {
            currentMaxStreakRef.current = safeStreakRef.current;
          }
        } else {
          safeStreakRef.current = 0;
        }

        // Show alerts for high risk events
        if (riskLevel === "high") {
          showNotification(label, description);
        }

        // Update safety score
        updateSafetyScore(riskLevel);
      }
    }
  };

  const updateSafetyScore = (riskLevel: string) => {
    setSafetyScore(prevScore => {
      let newScore = prevScore;
      
      // Adjust score based on risk level
      if (riskLevel === "high") {
        newScore = Math.max(0, prevScore - 5);
      } else if (riskLevel === "medium") {
        newScore = Math.max(0, prevScore - 2);
      } else if (riskLevel === "low") {
        newScore = Math.min(100, prevScore + 1);
      }
      
      return newScore;
    });
  };

  const showNotification = (title: string, description: string, variant: string = "danger") => {
    setAlertMessage(`⚠️ ${title}: ${description}`);
    setAlertVariant(variant);
    setShowAlert(true);
    
    // Auto-hide alert after 3 seconds
    setTimeout(() => setShowAlert(false), 3000);
  };

  const connectToSensor = async () => {
    try {
      setStatusMessage("🔍 Scanning for SensorTile...");
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: "STB_LM " }],
        optionalServices: [
          "00000000-0001-11e1-9ab4-0002a5d5c51b",
          "00000100-0001-11e1-ac36-0002a5d5c51b"
        ]
      });

      deviceRef.current = device;
      setStatusMessage(`✅ Found: ${device.name}`);
      
      const server = await device.gatt?.connect();
      if (!server) throw new Error("GATT server not available");
      setStatusMessage("🔗 Connected to sensor!");
      setIsConnected(true);
      setPredictions([]);
      setSafetyScore(100);
      safeStreakRef.current = 0;
      currentMaxStreakRef.current = 0;
      setElapsedMinutes(0);
      setRemainingTime(MAX_DRIVE_DURATION);
      setTimerWarning(false);
      setSessionTimedOut(false);

      // Start a new session
      setCurrentSession({
        startTime: new Date(),
        endTime: null,
        predictions: [],
        safetyScore: 100,
        completed: false,
        timedOut: false,
        summary: {
          lowRiskCount: 0,
          mediumRiskCount: 0,
          highRiskCount: 0,
          totalPredictions: 0,
          mostFrequentEvent: "",
          longestSafeStreak: 0
        }
      });

      const mlcService = await server.getPrimaryService("00000000-0001-11e1-9ab4-0002a5d5c51b");
      const mlcChar = await mlcService.getCharacteristic("0000000f-0002-11e1-ac36-0002a5d5c51b");
      await mlcChar.startNotifications();
      mlcChar.addEventListener("characteristicvaluechanged", handleMLCData);

    } catch (error: unknown) {
      console.error("Connection error:", error);
      setStatusMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsConnected(false);
    }
  };

  const endDrive = async (timeout: boolean = false) => {
    try {
      if (deviceRef.current?.gatt?.connected) {
        await deviceRef.current.gatt.disconnect();
        setStatusMessage(timeout ? "🔴 Session timed out" : "🔴 Disconnected from sensor");
      }
      
      setIsConnected(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Generate summary before showing feedback modal
      if (predictions.length > 0) {
        const lowRiskCount = predictions.filter(p => p.riskLevel === "low").length;
        const mediumRiskCount = predictions.filter(p => p.riskLevel === "medium").length;
        const highRiskCount = predictions.filter(p => p.riskLevel === "high").length;
        
        // Find most frequent event
        const eventCounts: Record<string, number> = {};
        predictions.forEach(p => {
          eventCounts[p.label] = (eventCounts[p.label] || 0) + 1;
        });
        
        let mostFrequentEvent = "";
        let maxCount = 0;
        Object.entries(eventCounts).forEach(([event, count]) => {
          if (count > maxCount) {
            maxCount = count;
            mostFrequentEvent = event;
          }
        });
        
        // Update current session with summary
        setCurrentSession(prev => {
          if (prev) {
            const updatedSession = {
              ...prev,
              endTime: new Date(),
              predictions: [...predictions],
              safetyScore: timeout ? Math.max(0, safetyScore - 15) : safetyScore,
              completed: !timeout,
              timedOut: timeout,
              summary: {
                lowRiskCount,
                mediumRiskCount,
                highRiskCount,
                totalPredictions: predictions.length,
                mostFrequentEvent,
                longestSafeStreak: currentMaxStreakRef.current
              }
            };
  
            // Save to database
            saveSessionToDb(updatedSession);
            
            return updatedSession;
          }
          return null;
        });
        
        // Show feedback modal
        setShowFeedbackModal(true);
      }
      
    } catch (error: unknown) {
      console.error("Disconnection error:", error);
      setStatusMessage(`❌ Disconnect error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const generateFeedbackReport = () => {
    if (!currentSession) return "";
    
    const { startTime, endTime, summary, safetyScore, timedOut } = currentSession;
    const { lowRiskCount, mediumRiskCount, highRiskCount, totalPredictions, mostFrequentEvent, longestSafeStreak } = summary;
    
    const duration = endTime ? Math.round((endTime.getTime() - startTime.getTime()) / 60000) : 0;
    
    let safetyRating = "Poor";
    if (safetyScore >= 90) safetyRating = "Excellent";
    else if (safetyScore >= 80) safetyRating = "Good";
    else if (safetyScore >= 70) safetyRating = "Fair";
    
    let feedback = "";
    if (timedOut) {
      feedback = "WARNING: Your session timed out after reaching the maximum allowed duration. Sessions should be completed properly for the most accurate analysis.";
    } else if (highRiskCount > totalPredictions * 0.2) {
      feedback = "You should focus on reducing aggressive maneuvers like speeding and fast turns. Try to anticipate traffic conditions and maintain a consistent speed.";
    } else if (mediumRiskCount > totalPredictions * 0.3) {
      feedback = "Your driving shows some concerning patterns with frequent hard braking. Try to keep more distance from other vehicles and anticipate stops.";
    } else {
      feedback = "You demonstrated mostly safe driving behaviors. Keep up the good work!";
    }
    
    let improvementTips = "";
    if (mostFrequentEvent === "Break_Fast") {
      improvementTips = "Try to maintain a safe following distance and anticipate stops to reduce hard braking.";
    } else if (mostFrequentEvent === "Straight_Fast") {
      improvementTips = "Watch your speed, especially on straight roads where it's easy to accelerate without noticing.";
    } else if (mostFrequentEvent === "Turn_Fast") {
      improvementTips = "Reduce your speed before entering turns and accelerate gently when exiting.";
    }
    
    return `
# Driving Analysis Report

## Session Summary
- Date: ${startTime.toLocaleDateString()}
- Time: ${startTime.toLocaleTimeString()} - ${endTime?.toLocaleTimeString() || 'N/A'}
- Duration: ${duration} minutes
- Session Status: ${timedOut ? 'TIMED OUT (INCOMPLETE)' : 'Completed'}
- Safety Score: ${safetyScore}/100 (${safetyRating})

## Driving Patterns
- Safe Maneuvers: ${lowRiskCount} (${Math.round(lowRiskCount/totalPredictions*100)}%)
- Medium Risk Maneuvers: ${mediumRiskCount} (${Math.round(mediumRiskCount/totalPredictions*100)}%)
- High Risk Maneuvers: ${highRiskCount} (${Math.round(highRiskCount/totalPredictions*100)}%)
- Longest Safe Driving Streak: ${longestSafeStreak} consecutive safe events
- Most Frequent Driving Event: ${mostFrequentEvent.replace('_', ' ')}

## Feedback
${feedback}

## Tips for Improvement
${improvementTips}

## Safety Recommendations
- Maintain a safe following distance
- Anticipate traffic lights and stops
- Avoid aggressive acceleration and braking
- Take corners at appropriate speeds
- Stay focused and avoid distractions

Thank you for using our driving analysis system!
`;
  };

  const sendFeedbackEmail = async () => {
    // This is a placeholder for actual email sending logic
    // In a real application, you would call an API endpoint
    setSendingFeedback(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      setStatusMessage("✅ Feedback report sent to your email!");
      setShowFeedbackModal(false);
      setSendingFeedback(false);
    } catch {
      setStatusMessage("❌ Failed to send email. Please try again.");
      setSendingFeedback(false);
    }
  };

  const downloadPdfReport = () => {
    if (!currentSession) return;
    
    const report = generateFeedbackReport();
    const pdf = new jsPDF();
    
    // Add title
    pdf.setFontSize(20);
    pdf.text("Driving Analysis Report", 20, 20);
    
    // Add content
    pdf.setFontSize(12);
    const lines = report.split('\n');
    let y = 30;
    
    lines.forEach(line => {
      if (line.startsWith('# ')) {
        // Main heading
        pdf.setFontSize(18);
        pdf.text(line.substring(2), 20, y);
        y += 10;
      } else if (line.startsWith('## ')) {
        // Subheading
        pdf.setFontSize(16);
        pdf.text(line.substring(3), 20, y);
        y += 8;
      } else if (line.startsWith('- ')) {
        // List item
        pdf.setFontSize(12);
        pdf.text(line, 25, y);
        y += 6;
      } else if (line.trim() !== '') {
        // Regular text
        pdf.setFontSize(12);
        pdf.text(line, 20, y);
        y += 6;
      } else {
        // Empty line
        y += 4;
      }
      
      // Add new page if needed
      if (y > 270) {
        pdf.addPage();
        y = 20;
      }
    });
    
    // Add date and safety score
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 280);
    
    pdf.save("driving-analysis-report.pdf");
  };

  // Format the remaining time in MM:SS format
  const formatRemainingTime = () => {
    const minutes = Math.floor(remainingTime);
    const seconds = Math.floor((remainingTime - minutes) * 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate timer progress percentage
  const getTimerProgress = () => {
    return (remainingTime / MAX_DRIVE_DURATION) * 100;
  };

  // Get color based on remaining time
  const getTimerColor = () => {
    if (remainingTime <= 5) return 'danger';
    if (remainingTime <= 15) return 'warning';
    return 'success';
  };

  const predictionBarData = {
    labels: predictionMapping.map(([, label]) => label.replace('_', ' ')),
    datasets: [{
      label: "Frequency",
      data: predictionMapping.map(([value]) => 
        predictions.filter(p => p.value === value).length
      ),
      backgroundColor: [
        "rgba(40, 167, 69, 0.6)",  // success (safe)
        "rgba(255, 193, 7, 0.6)",  // warning
        "rgba(220, 53, 69, 0.6)",  // danger
        "rgba(23, 162, 184, 0.6)", // info
        "rgba(40, 167, 69, 0.6)",  // success
        "rgba(255, 193, 7, 0.6)",  // warning
        "rgba(220, 53, 69, 0.6)",  // danger
      ],
      borderColor: [
        "rgba(40, 167, 69, 1)",
        "rgba(255, 193, 7, 1)",
        "rgba(220, 53, 69, 1)",
        "rgba(23, 162, 184, 1)",
        "rgba(40, 167, 69, 1)",
        "rgba(255, 193, 7, 1)",
        "rgba(220, 53, 69, 1)"
      ],
      borderWidth: 1
    }]
  };

  const predictionBarOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Driving Event Distribution' }
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Count' } },
      x: { title: { display: true, text: 'Movement Type' } }
    }
  };

  // Timeline data for the last minute of predictions
  const timelineData = {
    labels: predictions.slice(-60).map(p => p.timestamp.toLocaleTimeString('en-US', {hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit'})),
    datasets: [
      {
        label: 'Risk Level',
        data: predictions.slice(-60).map(p => {
          if (p.riskLevel === "high") return 3;
          if (p.riskLevel === "medium") return 2;
          return 1;
        }),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: (ctx: ScriptableContext<"line">) => {
          const point = ctx.raw as number;
          return point === 3 ? 6 : point === 2 ? 4 : 2;
        },
        pointBackgroundColor: (ctx: ScriptableContext<"line">) => {
          const point = ctx.raw as number;
          return point === 3 ? 'rgba(220, 53, 69, 1)' : 
                 point === 2 ? 'rgba(255, 193, 7, 1)' : 
                 'rgba(40, 167, 69, 1)';
        }
      }
    ]
  };

  const timelineOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Real-time Risk Timeline' }
    },
    scales: {
      y: { 
        min: 0,
        max: 4,
        ticks: {
          callback: function(this: Scale<CoreScaleOptions>, value: string | number) {
            const numValue = Number(value);
            if (numValue === 1) return "Low";
            if (numValue === 2) return "Medium";
            if (numValue === 3) return "High";
            return "";
          }
        },
        title: { display: true, text: 'Risk Level' }
      },
      x: { 
        display: true,
        title: { display: true, text: 'Time' },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10
        }
      }
    }
  };

  // Safety score donut chart
  const scoreData = {
    labels: ['Safety Score', 'Risk'],
    datasets: [
      {
        data: [safetyScore, 100 - safetyScore],
        backgroundColor: [
          safetyScore >= 80 ? 'rgba(40, 167, 69, 0.8)' : 
          safetyScore >= 60 ? 'rgba(255, 193, 7, 0.8)' : 
          'rgba(220, 53, 69, 0.8)',
          'rgba(200, 200, 200, 0.2)'
        ],
        borderWidth: 0,
        cutout: '80%'
      }
    ]
  };

  const scoreOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
    animation: {
      animateRotate: true,
      animateScale: true
    },
    rotation: -90,
    circumference: 180
  };

  // Risk distribution
  const riskDistributionData = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    datasets: [
      {
        data: [
          predictions.filter(p => p.riskLevel === "low").length,
          predictions.filter(p => p.riskLevel === "medium").length,
          predictions.filter(p => p.riskLevel === "high").length
        ],
        backgroundColor: [
          'rgba(40, 167, 69, 0.7)',
          'rgba(255, 193, 7, 0.7)',
          'rgba(220, 53, 69, 0.7)'
        ],
        borderWidth: 1
      }
    ]
  };

  const riskDistributionOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'right' as const },
      title: { display: true, text: 'Risk Distribution' }
    }
  };
// Add this function inside the LiveMonitorPage component, before the return statement
const saveSessionToDb = async (session: DriveSession | null) => {
  if (!session) return;

  try {
    // Get actual time components from session start time
    const startDate = session.startTime;
    const hours = startDate.getHours();
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][startDate.getDay()];
    
    // Generate realistic placeholder values
    const sessionData = {
      email: userEmail || 'demo@example.com',
      distance: Math.random() * 50 + 5, // Random distance between 5-55 miles
      duration: session.endTime 
        ? (session.endTime.getTime() - session.startTime.getTime()) / 1000 
        : 0,
      fuelUsed: Math.random() * 5 + 3, // Random fuel between 3-8 gallons
      startLocation: 'Current Location', 
      endLocation: 'Destination',
      date: startDate,
      reportSent: false, // Should be based on actual report sending
      drivingEvents: {
        hardBraking: session.summary.highRiskCount,
        rapidAcceleration: session.summary.mediumRiskCount, // Assuming medium risk counts as rapid acceleration
        laneChanges: Math.floor(Math.random() * 20) // Random lane changes between 0-19
      },
      routeType: {
        city: 40, // Example percentage
        highway: 60, // Example percentage
        longTrip: session.summary.longestSafeStreak > 30 // If safe streak > 30min, consider it long trip
      },
      timeOfDay: hours >= 5 && hours < 12 ? 'morning' :
                 hours >= 12 && hours < 17 ? 'afternoon' :
                 hours >= 17 && hours < 21 ? 'evening' : 'night',
      dayOfWeek: dayOfWeek,
      weatherCondition: ['clear', 'cloudy', 'rain', 'snow'][Math.floor(Math.random() * 4)], // Random weather
      safetyScore: session.safetyScore,
      riskSummary: {
        low: session.summary.lowRiskCount,
        medium: session.summary.mediumRiskCount,
        high: session.summary.highRiskCount
      }
    };

    const response = await fetch('/api/drive-sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save session');
    }

    return await response.json();
  } catch (error) {
    console.error('Save error:', error);
    showNotification(
      'Save Failed', 
      error instanceof Error ? error.message : 'Failed to save drive session',
      'danger'
    );
    throw error;
  }
};
  return (
    <>
    <Sidebar />
    <div className="d-flex" style={{ minHeight: "80vh" }}>
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#f8f9fc" }}>
        <Header title="Your Driving Monitor" />
        
        {/* Status banner with gradient background */}
        <div className="mb-4 p-3 rounded shadow-sm" style={{ 
          background: "linear-gradient(90deg, rgba(59,130,246,0.8) 0%, rgba(37,99,235,0.9) 100%)",
          color: "white"
        }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-0">
                {isConnected ? 
                  <><i className="bi bi-bluetooth fs-4"></i> Connected & Monitoring</> : 
                  <><i className="bi bi-bluetooth fs-4"></i> Ready to Connect</>}
              </h4>
              <p className="mb-0 small">{statusMessage}</p>
            </div>
            <div className="d-flex align-items-center">
              {isConnected && (
                <div className="me-3 text-center">
                  <motion.div
                    animate={{
                      scale: remainingTime <= 5 ? [1, 1.1, 1] : 1
                    }}
                    transition={{
                      duration: 1,
                      repeat: remainingTime <= 5 ? Infinity : 0,
                      repeatType: "reverse"
                    }}
                    className={`fw-bold fs-5 mb-1 ${remainingTime <= 5 ? 'text-warning' : ''}`}
                  >
                    {formatRemainingTime()}
                  </motion.div>
                  <ProgressBar 
                    now={getTimerProgress()} 
                    variant={getTimerColor()}
                    className="timer-progress" 
                    style={{ height: '8px', width: '120px' }}
                  />
                </div>
              )}
              <Button 
                onClick={connectToSensor} 
                disabled={isConnected} 
                variant="light" 
                className="me-2"
                size="sm"
              >
                <i className="bi bi-bluetooth"></i> {isConnected ? 'Connected' : 'Connect Sensor'}
              </Button>
              <Button 
                onClick={() => endDrive(false)} 
                disabled={!isConnected} 
                variant={isConnected ? "danger" : "outline-light"}
                size="sm"
              >
                <i className="bi bi-stop-circle"></i> End Drive
              </Button>
            </div>
          </div>
        </div>

        {/* Animated notifications */}
        <AnimatePresence>
          {showAlert && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="mb-3"
            >
              <Alert variant={alertVariant} className="d-flex align-items-center shadow-sm border-0">
                <div className="me-2">
                  {alertVariant === "danger" ? 
                    <i className="bi bi-exclamation-triangle-fill fs-4"></i> : 
                    <i className="bi bi-exclamation-circle-fill fs-4"></i>}
                </div>
                <div className="flex-grow-1">{alertMessage}</div>
                <Button variant="link" className="p-0 text-dark" onClick={() => setShowAlert(false)}>
                  <i className="bi bi-x-lg"></i>
                </Button>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Safety Score Card */}
        <Row className="g-4 mb-4">
          <Col md={6} lg={3}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                <Card.Title className="mb-3 text-center">Safety Score</Card.Title>
                <div style={{ width: '140px', height: '140px', position: 'relative' }}>
                  <Doughnut data={scoreData} options={scoreOptions} />
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: '50%', 
                      left: '50%', 
                      transform: 'translate(-50%, -50%)',
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: safetyScore >= 80 ? '#28a745' : safetyScore >= 60 ? '#ffc107' : '#dc3545'
                    }}
                  >
                    {safetyScore}
                    </div>
                </div>
                <div className="mt-3 text-center">
                  <h5 className={
                    safetyScore >= 80 ? 'text-success' : 
                    safetyScore >= 60 ? 'text-warning' : 
                    'text-danger'
                  }>
                    {safetyScore >= 80 ? 'Excellent' : 
                     safetyScore >= 60 ? 'Average' : 
                     'Needs Improvement'}
                  </h5>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <Card.Title className="mb-3">Driving Stats</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between align-items-center py-2">
                    <span>Session Duration</span>
                    <span className="fw-bold">{Math.round(elapsedMinutes * 10) / 10} min</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center py-2">
                    <span>Events Recorded</span>
                    <span className="fw-bold">{predictions.length}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center py-2">
                    <span>Safe Streak</span>
                    <span className="fw-bold">{safeStreakRef.current}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center py-2">
                    <span>Record Streak</span>
                    <span className="fw-bold">{currentMaxStreakRef.current}</span>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <Card.Title className="mb-3">Recent Activity</Card.Title>
                <div className="timeline-chart-container" style={{ height: '200px' }}>
                  <Line data={timelineData} options={timelineOptions} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4 mb-4">
          <Col md={7}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <Card.Title className="mb-3">Event Distribution</Card.Title>
                <div style={{ height: '300px' }}>
                  <Bar data={predictionBarData} options={predictionBarOptions} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={5}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body className="d-flex flex-column">
                <Card.Title className="mb-3">Risk Analysis</Card.Title>
                <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                  <div style={{ width: '100%', height: '240px' }}>
                    <Doughnut data={riskDistributionData} options={riskDistributionOptions} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4">
          <Col md={12}>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Latest Events</h5>
              </Card.Header>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <ListGroup variant="flush">
                  {predictions.slice().reverse().slice(0, 10).map((prediction, index) => (
                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className={prediction.colorClass + " fw-bold me-2"}>
                          {prediction.label.replace('_', ' ')}
                        </span>
                        <span className="text-muted">{prediction.description}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <span className={`badge rounded-pill bg-${
                          prediction.riskLevel === "high" ? "danger" : 
                          prediction.riskLevel === "medium" ? "warning" : 
                          "success"
                        } me-2`}>
                          {prediction.riskLevel.toUpperCase()}
                        </span>
                        <small className="text-muted">
                          {prediction.timestamp.toLocaleTimeString()}
                        </small>
                      </div>
                    </ListGroup.Item>
                  ))}
                  {predictions.length === 0 && (
                    <ListGroup.Item className="text-center text-muted py-5">
                      No events recorded yet. Connect your sensor to begin monitoring.
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Feedback Modal */}
      <Modal show={showFeedbackModal} onHide={() => setShowFeedbackModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Drive Session Complete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentSession && (
            <>
              <div className="mb-4 text-center">
                <h1 className={`display-1 fw-bold ${
                  currentSession.safetyScore >= 80 ? 'text-success' : 
                  currentSession.safetyScore >= 60 ? 'text-warning' : 
                  'text-danger'
                }`}>
                  {currentSession.safetyScore}
                </h1>
                <h4>Your Safety Score</h4>
                {currentSession.timedOut && (
                  <Alert variant="warning" className="mt-3">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    Your session timed out after {MAX_DRIVE_DURATION} minutes. For best results, manually end your drive.
                  </Alert>
                )}
              </div>
              
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="bg-light p-3 rounded">
                    <h5>Session Summary</h5>
                    <ul className="list-unstyled">
                      <li><strong>Started:</strong> {currentSession.startTime.toLocaleTimeString()}</li>
                      <li><strong>Ended:</strong> {currentSession.endTime?.toLocaleTimeString()}</li>
                      <li><strong>Duration:</strong> {currentSession.endTime ? 
                        Math.round((currentSession.endTime.getTime() - currentSession.startTime.getTime()) / 60000) : 0} minutes</li>
                      <li><strong>Events Recorded:</strong> {currentSession.predictions.length}</li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="bg-light p-3 rounded">
                    <h5>Risk Analysis</h5>
                    <ul className="list-unstyled">
                      <li>
                        <span className="text-success me-2">
                          <i className="bi bi-circle-fill"></i>
                        </span>
                        <strong>Low Risk Events:</strong> {currentSession.summary.lowRiskCount}
                      </li>
                      <li>
                        <span className="text-warning me-2">
                          <i className="bi bi-circle-fill"></i>
                        </span>
                        <strong>Medium Risk Events:</strong> {currentSession.summary.mediumRiskCount}
                      </li>
                      <li>
                        <span className="text-danger me-2">
                          <i className="bi bi-circle-fill"></i>
                        </span>
                        <strong>High Risk Events:</strong> {currentSession.summary.highRiskCount}
                      </li>
                      <li><strong>Longest Safe Streak:</strong> {currentSession.summary.longestSafeStreak}</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h5>Get Your Detailed Report</h5>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowFeedbackModal(false)}>
            Close
          </Button>
          <Button variant="outline-primary" onClick={downloadPdfReport}>
            <i className="bi bi-download me-1"></i> Download PDF
          </Button>
          <Button 
            variant="primary" 
            onClick={sendFeedbackEmail} 
            disabled={sendingFeedback || !userEmail}
          >
            {sendingFeedback ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                Sending...
              </>
            ) : (
              <>
                <i className="bi bi-envelope me-1"></i> Send to Email
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Toast notifications container */}
      <ToastContainer position="top-end" className="p-3">
        <Toast 
          show={timerWarning} 
          onClose={() => setTimerWarning(false)}
          bg="warning"
          delay={5000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Session Ending Soon</strong>
            <small>now</small>
          </Toast.Header>
          <Toast.Body>Your monitoring session will end in less than 5 minutes.</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
    </>
  );
};

export default LiveMonitorPage;