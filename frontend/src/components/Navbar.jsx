import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Store, Heart, LayoutDashboard, LogOut, User, Settings, Home, Search as SearchIcon, Menu, X as CloseIcon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import logo from '../assets/Print_Transparent.svg';

const Navbar = () => {
  const { isAuthenticated, user, logout, isBusinessOwner, isRegularUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuRef = useRef(null);
  const isHomePage = location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Handle click outside for user menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  // Dynamic classes based on page
  const getNavbarClasses = () => {
    if (isHomePage) {
      // Home page: sticky positioning, stays visible while scrolling
      return 'sticky top-4 z-50 px-6 lg:px-8';
    } else {
      // Other pages: normal flow, scrolls with content
      return 'relative z-50 px-6 lg:px-8 py-4';
    }
  };

  return (
    <nav className={getNavbarClasses()}>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-3 group">
                <img 
                  src={logo} 
                  alt="Nexzio Logo" 
                  className="h-24 w-auto group-hover:scale-105 transition-all duration-300"
                />
                <span className="text-2xl font-extrabold bg-gradient-to-r from-[#4C82F7] to-[#6B9FFF] bg-clip-text text-transparent">
                  Nexzio
                </span>
              </Link>

              {/* Navigation Links */}
              {isAuthenticated && (
                <div className="hidden md:flex items-center space-x-2">
                  <Link
                    to="/"
                    className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                      isActive('/')
                        ? 'bg-gradient-to-r from-[#4C82F7]/10 to-[#6B9FFF]/10 text-[#4C82F7] shadow-sm'
                        : 'text-gray-700 hover:text-[#4C82F7] hover:bg-[#4C82F7]/5'
                    }`}
                  >
                    <Home className="w-5 h-5" />
                    <span>Home</span>
                  </Link>

                  <Link
                    to="/search"
                    className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                      isActive('/search')
                        ? 'bg-gradient-to-r from-[#4C82F7]/10 to-[#6B9FFF]/10 text-[#4C82F7] shadow-sm'
                        : 'text-gray-700 hover:text-[#4C82F7] hover:bg-[#4C82F7]/5'
                    }`}
                  >
                    <SearchIcon className="w-5 h-5" />
                    <span>Explore</span>
                  </Link>

                  {isRegularUser && (
                    <Link
                      to="/favorites"
                      className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                        isActive('/favorites')
                          ? 'bg-gradient-to-r from-[#4C82F7]/10 to-[#6B9FFF]/10 text-[#4C82F7] shadow-sm'
                          : 'text-gray-700 hover:text-[#4C82F7] hover:bg-[#4C82F7]/5'
                      }`}
                    >
                      <Heart className="w-5 h-5" />
                      <span>Favorites</span>
                    </Link>
                  )}

                  {isBusinessOwner && (
                    <Link
                      to="/dashboard"
                      className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                        isActive('/dashboard')
                          ? 'bg-gradient-to-r from-[#4C82F7]/10 to-[#6B9FFF]/10 text-[#4C82F7] shadow-sm'
                          : 'text-gray-700 hover:text-[#4C82F7] hover:bg-[#4C82F7]/5'
                      }`}
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      <span>Dashboard</span>
                    </Link>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              {isAuthenticated && (
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-[#4C82F7]/10 hover:text-[#4C82F7] transition-all duration-300"
                >
                  {showMobileMenu ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              )}

              {/* User Section */}
              <div className="flex items-center space-x-3">
                {isAuthenticated ? (
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-3 bg-gradient-to-br from-[#4C82F7]/5 to-[#6B9FFF]/5 hover:from-[#4C82F7]/10 hover:to-[#6B9FFF]/10 border border-[#4C82F7]/20 px-4 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-[#4C82F7] to-[#6B9FFF] rounded-xl flex items-center justify-center shadow-md">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-bold text-gray-800 hidden md:inline">{user?.name?.split(' ')[0]}</span>
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-gray-200/60 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-6 py-5 bg-gradient-to-br from-[#4C82F7]/5 to-[#6B9FFF]/5 border-b border-gray-200">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-14 h-14 bg-gradient-to-br from-[#4C82F7] to-[#6B9FFF] rounded-2xl flex items-center justify-center shadow-lg">
                              <User className="w-7 h-7 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-base font-extrabold text-gray-900">{user?.name}</p>
                              <p className="text-xs font-bold text-[#4C82F7] bg-white/70 px-3 py-1 rounded-lg inline-block mt-1 shadow-sm">
                                {user?.role === 'business_owner' ? 'Business Owner' : 'Member'}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 truncate bg-white/60 px-3 py-1.5 rounded-lg font-medium">{user?.email}</p>
                        </div>
                        
                        <div className="py-2">
                          <Link
                            to="/profile"
                            onClick={() => setShowUserMenu(false)}
                            className="w-full text-left px-6 py-3.5 text-sm text-gray-700 hover:bg-[#4C82F7]/10 flex items-center gap-3 transition-all duration-200 group"
                          >
                            <div className="w-10 h-10 bg-[#4C82F7]/10 rounded-xl flex items-center justify-center group-hover:bg-[#4C82F7]/20 transition-colors">
                              <Settings className="w-5 h-5 text-[#4C82F7]" />
                            </div>
                            <span className="font-bold">Profile Settings</span>
                          </Link>
                          <button
                            onClick={() => {
                              handleLogout();
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-6 py-3.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-all duration-200 group"
                          >
                            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-red-100 transition-colors">
                              <LogOut className="w-5 h-5 text-red-600" />
                            </div>
                            <span className="font-bold">Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link
                      to="/login"
                      className="px-5 py-2.5 text-gray-700 hover:text-[#4C82F7] font-semibold rounded-xl hover:bg-[#4C82F7]/5 transition-all duration-300"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      className="px-6 py-2.5 bg-gradient-to-r from-[#4C82F7] to-[#6B9FFF] text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isAuthenticated && showMobileMenu && (
          <div className="md:hidden mt-2 bg-white/95 backdrop-blur-xl border border-gray-200/60 rounded-2xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-3 space-y-1">
              <Link
                to="/"
                onClick={() => setShowMobileMenu(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isActive('/')
                    ? 'bg-gradient-to-r from-[#4C82F7]/10 to-[#6B9FFF]/10 text-[#4C82F7] shadow-sm'
                    : 'text-gray-700 hover:text-[#4C82F7] hover:bg-[#4C82F7]/5'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>

              <Link
                to="/search"
                onClick={() => setShowMobileMenu(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isActive('/search')
                    ? 'bg-gradient-to-r from-[#4C82F7]/10 to-[#6B9FFF]/10 text-[#4C82F7] shadow-sm'
                    : 'text-gray-700 hover:text-[#4C82F7] hover:bg-[#4C82F7]/5'
                }`}
              >
                <SearchIcon className="w-5 h-5" />
                <span>Explore</span>
              </Link>

              {isRegularUser && (
                <Link
                  to="/favorites"
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isActive('/favorites')
                      ? 'bg-gradient-to-r from-[#4C82F7]/10 to-[#6B9FFF]/10 text-[#4C82F7] shadow-sm'
                      : 'text-gray-700 hover:text-[#4C82F7] hover:bg-[#4C82F7]/5'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  <span>Favorites</span>
                </Link>
              )}

              {isBusinessOwner && (
                <Link
                  to="/dashboard"
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isActive('/dashboard')
                      ? 'bg-gradient-to-r from-[#4C82F7]/10 to-[#6B9FFF]/10 text-[#4C82F7] shadow-sm'
                      : 'text-gray-700 hover:text-[#4C82F7] hover:bg-[#4C82F7]/5'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
