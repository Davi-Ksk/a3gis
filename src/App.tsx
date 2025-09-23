import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./providers/AuthProvider"
import { ProtectedRoute } from "./components/shared/ProtectedRoute"
import { Layout } from "./components/shared/Layout"
import { LoginPage } from "./pages/LoginPage"
import { DashboardPage } from "./pages/DashboardPage"
import { ProjectDetailPage } from "./pages/ProjectDetailPage"
import { UsersPage } from "./pages/UsersPage"
import { TeamsPage } from "./pages/TeamsPage"
import { ProjectPage } from "./pages/ProjectPage"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="project/:projectId" element={<ProjectDetailPage />} />
            <Route path="projects" element={<ProjectPage />} />

            {/* Admin only routes */}
            <Route
              path="users"
              element={
                <ProtectedRoute adminOnly>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="teams"
              element={
                <ProtectedRoute adminOnly>
                  <TeamsPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
