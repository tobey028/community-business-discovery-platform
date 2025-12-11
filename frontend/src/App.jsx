import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchResults from './pages/SearchResults';
import BusinessDetail from './pages/BusinessDetail';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites';

const ProtectedRoute = ({ children, requireBusinessOwner, requireRegularUser }) => {
  const { isAuthenticated, isBusinessOwner, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner w-16 h-16"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireBusinessOwner && !isBusinessOwner) {
    return <Navigate to="/" />;
  }

  if (requireRegularUser && isBusinessOwner) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function AppContent() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/business/:id" element={<BusinessDetail />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requireBusinessOwner>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute requireRegularUser>
              <Favorites />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
