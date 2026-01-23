
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/dashboard';
import HRDashboard from './components/Hr-Dashboard';
import InterviewScheduling from './components/InterviewScheduling';
import CandidateManagement from './components/CandidateManagement';
import HRInterviewHistory from './components/HRInterviewHistory';
import InterviewEvaluation from './components/InterviewEvaluation';
import InterviewScreen from './components/InterviewScreen';
import CandidateDashboard from './components/CandidateDashboard';
import WelcomeScreen from './components/WelcomeScreen';
import App from './App';
import SetupScreen from './components/SetupScreen';
import PermissionsScreen from './components/PermissionsScreen';
import InterviewLiveConferencePage from './components/InterviewLiveConferencePage';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/hr-dashboard" element={<HRDashboard />} />
        <Route path="/hr/dashboard" element={<HRDashboard />} />
        <Route path="/hr" element={<HRDashboard />} />
        <Route path="/hr/schedule" element={<InterviewScheduling />} />
        <Route path="/hr/candidates" element={<CandidateManagement />} />
        <Route path="/hr/history" element={<HRInterviewHistory />} />
        <Route path="/hr/evaluate/:id" element={<InterviewEvaluation />} />
        <Route path="/hr/interview/:id" element={<InterviewScreen />} />
        <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route path="/interview" element={<App />} />
        <Route path="/interview/:sessionId" element={<InterviewLiveConferencePage />} />
        <Route path="/setup" element={<SetupScreen onSetupComplete={(jobRole, resume) => { window.location.href = '/dashboard'; }} />} />
        <Route path="/permissions" element={<PermissionsScreen onPermissionsGranted={() => { window.location.href = '/dashboard'; }} />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
