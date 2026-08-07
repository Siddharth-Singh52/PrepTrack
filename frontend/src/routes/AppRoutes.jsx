import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";
import Questions from "../pages/Questions";
import RevisionCenter from "../pages/RevisionCenter";
import QuestionDetails from "../pages/QuestionDetails";
import PlacementTracker from "../pages/PlacementTracker";
import Layout from "../components/layout/Layout";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={ <Register />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/questions" element={
          <ProtectedRoute>
            <Layout>
              <Questions />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/revision" element={
          <ProtectedRoute>
            <Layout>
              <RevisionCenter />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/questions/:id" element={
          <ProtectedRoute>
            <Layout>
              <QuestionDetails />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/placements" element={
          <ProtectedRoute>
            <Layout>
              <PlacementTracker />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;