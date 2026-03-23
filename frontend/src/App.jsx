import { BrowserRouter, Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import Login from './components/Login';
import DashboardPage from './pages/DashboardPage';
import RepoPage from './pages/RepoPage';
import { useAuth } from './context/AuthContext';
import { useEffect } from 'react';
import './App.css';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const urlToken = searchParams.get('token');
  
  if (loading) return null;
  // Allow entry if we have either a context token OR a token in the URL (which DashboardPage will save)
  if (!token && !urlToken) return <Navigate to="/" />;
  
  return children;
};


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/repo/:owner/:repo" 
          element={
            <ProtectedRoute>
              <RepoPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
