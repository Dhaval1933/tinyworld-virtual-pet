import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Loading from './components/common/Loading';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import GameRoomPage from './pages/GameRoomPage';
import ShopPage from './pages/ShopPage';
import ActivitiesPage from './pages/ActivitiesPage';
import ProgressPage from './pages/ProgressPage';
import SettingsPage from './pages/SettingsPage';

/**
 * Protected route wrapper — redirects to login if not authenticated.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Loading fullScreen message="Entering TinyWorld..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

/**
 * Guest route — redirects to game if already authenticated.
 */
function GuestRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return <Loading fullScreen message="Entering TinyWorld..." />;
  if (isAuthenticated) {
    // If onboarding not done, go there first
    if (!user?.onboardingCompleted) return <Navigate to="/onboarding" replace />;
    return <Navigate to="/room" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />
      </Route>

      {/* Protected routes */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/room" element={<GameRoomPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
