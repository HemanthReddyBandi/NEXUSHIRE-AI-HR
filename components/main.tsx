// MainApp.tsx
import React, { useState, useEffect } from 'react';
import HistoryScreen from './HistoryScreen';
import ReportScreen from './ReportScreen';
import { InterviewReport } from '../types';

const MainApp: React.FC = () => {
  const [currentReport, setCurrentReport] = useState<InterviewReport | null>(null);
  const [history, setHistory] = useState<InterviewReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // Load history from AI API
  useEffect(() => {
    fetchInterviewHistory();
  }, []);

  const fetchInterviewHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/history');
      const data: InterviewReport[] = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartNew = () => {
    // Start new interview flow
    window.location.href = '/interview';
  };

  const handleViewReport = (report: InterviewReport) => {
    setCurrentReport(report);
    setShowReport(true);
  };

  const handleBackToHistory = () => {
    setShowReport(false);
    setCurrentReport(null);
  };

  if (showReport && currentReport) {
    return (
      <ReportScreen
        report={currentReport}
        onStartNew={handleStartNew}
        onViewHistory={handleBackToHistory}
      />
    );
  }

  return (
    <HistoryScreen
      onStartNew={handleStartNew}
      onViewReport={handleViewReport}
      history={history}
      isLoading={isLoading}
    />
  );
};

export default MainApp;