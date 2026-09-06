import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { AppLayout } from '../components/layout/AppLayout.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';

import { Login } from '../pages/Login.jsx';
import { Register } from '../pages/Register.jsx';
import { Dashboard } from '../pages/Dashboard.jsx';
import { Questions } from '../pages/Questions.jsx';
import { QuestionDetails } from '../pages/QuestionDetails.jsx';
import { RevisionCenter } from '../pages/RevisionCenter.jsx';
import { PlacementTracker } from '../pages/PlacementTracker.jsx';
import { Goals } from '../pages/Goals.jsx';
import { Insights } from '../pages/Insights.jsx';
import { ResumeAnalyzer } from '../pages/ResumeAnalyzer.jsx';
import { Profile } from '../pages/Profile.jsx';
import { NotFound } from '../pages/NotFound.jsx';

const ProtectedRoute = ({ children, title }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <LoadingSpinner text="Authenticating session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout title={title}>{children}</AppLayout>;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Public Auth Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected App Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute title="Dashboard">
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/questions"
        element={
          <ProtectedRoute title="DSA Problem Bank">
            <Questions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/questions/:id"
        element={
          <ProtectedRoute title="Problem Details & Notes">
            <QuestionDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/revisions"
        element={
          <ProtectedRoute title="Revision Center">
            <RevisionCenter />
          </ProtectedRoute>
        }
      />
      <Route
        path="/placements"
        element={
          <ProtectedRoute title="Placement Tracker">
            <PlacementTracker />
          </ProtectedRoute>
        }
      />
      <Route
        path="/goals"
        element={
          <ProtectedRoute title="Preparation Goals">
            <Goals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/insights"
        element={
          <ProtectedRoute title="Preparation Insights">
            <Insights />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume-analyzer"
        element={
          <ProtectedRoute title="ATS Resume Analyzer">
            <ResumeAnalyzer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute title="Candidate Profile">
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
