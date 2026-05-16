import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuthContext as useAuth } from './context/AuthContext';
import { useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import {
  LoadingSpinner,
  Navbar,
} from "./components";

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import Explore from './pages/Explore';
import Announcements from './pages/Announcements';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

const RouteGuard = ({ children, isPrivate }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;

  if (isPrivate) {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  }

  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

const PrivateRoute = ({ children }) => (
  <RouteGuard isPrivate>{children}</RouteGuard>
);

const PublicRoute = ({ children }) => (
  <RouteGuard isPrivate={false}>{children}</RouteGuard>
);

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Navbar />}

      <main className={isAuthenticated ? "pt-16" : ""}>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/profile/:userId?" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/explore" element={<PrivateRoute><Explore /></PrivateRoute>} />
          <Route path="/announcements" element={<PrivateRoute><Announcements /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  );
};

export default App;