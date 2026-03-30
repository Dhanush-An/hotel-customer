import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';

// Management Dashboards
import AdminDashboard from './pages/AdminDashboard';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import HousekeepingDashboard from './pages/HousekeepingDashboard';
import SubAdminDashboard from './pages/SubAdminDashboard';
import RoomBoyDashboard from './pages/RoomBoyDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* --- Hotel Management Portals --- */}
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/receptionist/*" element={<ReceptionistDashboard />} />
        <Route path="/housekeeping/*" element={<HousekeepingDashboard />} />
        <Route path="/subadmin/*" element={<SubAdminDashboard />} />
        <Route path="/roomboy/*" element={<RoomBoyDashboard />} />
        
        {/* Catch-all: Redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
