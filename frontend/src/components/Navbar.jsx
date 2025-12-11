import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Store, Heart, LayoutDashboard, LogOut, Search, User } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { isAuthenticated, user, logout, isBusinessOwner } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl group-hover:scale-110 transition-transform duration-200">
              <Store className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold font-display gradient-text">
              LocalBiz
            </span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search businesses..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/search?keyword=${e.target.value}`);
                  }
                }}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {!isBusinessOwner && (
                  <Link
                    to="/favorites"
                    className="flex items-center space-x-1 text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                    <span className="hidden sm:inline text-sm font-medium">Favorites</span>
                  </Link>
                )}

                {isBusinessOwner && (
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-1 text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="hidden sm:inline text-sm font-medium">Dashboard</span>
                  </Link>
                )}

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">{user?.name}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 animate-slide-down">
                      <div className="px-4 py-2 border-b border-slate-200">
                        <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                        <p className="text-xs text-slate-500">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-slate-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
