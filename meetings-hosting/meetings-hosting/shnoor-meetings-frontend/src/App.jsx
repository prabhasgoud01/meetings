import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MeetingRoom from './pages/MeetingRoom';
import CalendarPage from './pages/CalendarPage';
import CallsPage from './pages/CallsPage';
import LeftMeetingPage from './pages/LeftMeetingPage';
import LobbyPage from './pages/LobbyPage';
import LandingPage from './pages/LandingPage';
import { applyThemePreference, getMeetingPreferences } from './utils/meetingUtils';

function App() {
  useEffect(() => {
    applyThemePreference(getMeetingPreferences().theme);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes (Authenticated Workspace) */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/room/:id" element={<ProtectedRoute><LobbyPage /></ProtectedRoute>} />
          <Route path="/meeting/:id" element={<ProtectedRoute><MeetingRoom /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
          <Route path="/calls" element={<ProtectedRoute><CallsPage /></ProtectedRoute>} />
          <Route path="/left-meeting/:id" element={<ProtectedRoute><LeftMeetingPage /></ProtectedRoute>} />

          {/* Catch-all: redirect to entry page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
