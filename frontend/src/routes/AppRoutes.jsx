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

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={ <Register />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/questions" element={
          <ProtectedRoute>
            <Questions />
          </ProtectedRoute>
        } />

        <Route path="/revision" element={
          <ProtectedRoute>
            <RevisionCenter />
          </ProtectedRoute>
        } />

        <Route path="/questions/:id" element={
          <ProtectedRoute>
              <QuestionDetails />
          </ProtectedRoute>
        } />

        <Route path="/placements" element={
          <ProtectedRoute>
            <PlacementTracker />
          </ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;