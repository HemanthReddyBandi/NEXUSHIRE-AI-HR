
import React from 'react';
import { useInterview } from './hooks/useInterview';
import WelcomeScreen from './components/WelcomeScreen';
import SetupScreen from './components/SetupScreen';
import PermissionsScreen from './components/PermissionsScreen';
import InterviewScreen from './components/InterviewScreen';
import EvaluationScreen from './components/EvaluationScreen';
import ReportScreen from './components/ReportScreen';
import HistoryScreen from './components/HistoryScreen';
import { AppState } from './types';

const App: React.FC = () => {
  const {
    appState,
    startSetup,
    startPermissionCheck,
    startInterview,
    finishInterview,
    viewHistory,
    viewReport,
    startNewInterview,
    interviewState,
    dispatch,
  } = useInterview();

  const renderContent = () => {
    switch (appState) {
      case AppState.WELCOME:
        return <WelcomeScreen onStart={startSetup} onViewHistory={viewHistory} />;
      case AppState.SETUP:
        return <SetupScreen onSetupComplete={startPermissionCheck} />;
      case AppState.PERMISSIONS:
        return <PermissionsScreen onPermissionsGranted={startInterview} />;
      case AppState.INTERVIEW:
        return <InterviewScreen onFinish={finishInterview} interviewState={interviewState} dispatch={dispatch} />;
      case AppState.EVALUATION:
        return <EvaluationScreen />;
      case AppState.REPORT:
        return <ReportScreen report={interviewState.report} onStartNew={startNewInterview} onViewHistory={viewHistory} />;
      case AppState.HISTORY:
        return <HistoryScreen onStartNew={startNewInterview} onViewReport={viewReport} interviewState={interviewState} />;
      default:
        return <WelcomeScreen onStart={startSetup} onViewHistory={viewHistory} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
