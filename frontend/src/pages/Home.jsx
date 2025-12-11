import { Link } from 'react-router-dom';
import { Search, TrendingUp, Star, MapPin, ArrowRight, Heart, Users, Award, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user, isBusinessOwner } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [stats, setStats] = useState({ totalBusinesses: 0, totalUsers: 0, totalViews: 0 });

  useEffect(() => {
    fetchFeaturedBusinesses();
    fetchStats();
  }, []);

  const fetchFeaturedBusinesses = async () => {
    try {
      const { data } = await api.get('/businesses?limit=6&sortBy=popular');
      setBusinesses(data.data);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/businesses');
      const totalBusinesses = data.pagination?.total || data.data?.length || 0;
      const totalViews = data.data?.reduce((sum, b) => sum + (b.views || 0), 0) || 0;
      setStats({
        totalBusinesses,
        totalUsers: Math.floor(totalBusinesses * 1.5), // Approximate
        totalViews
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const categories = [
    { name: 'Restaurant', emoji: '🍽️', color: 'from-orange-400 to-red-500' },
    { name: 'Retail', emoji: '🛍️', color: 'from-pink-400 to-purple-500' },
    { name: 'Healthcare', emoji: '🏥', color: 'from-blue-400 to-cyan-500' },
    { name: 'Technology', emoji: '💻', color: 'from-indigo-400 to-blue-500' },
    { name: 'Beauty & Spa', emoji: '💅', color: 'from-rose-400 to-pink-500' },
    { name: 'Education', emoji: '📚', color: 'from-green-400 to-emerald-500' },
  ];

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      window.location.href = `/search?keyword=${searchKeyword}`;
    }
  };

  return (
    <div className="page-transition">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold font-display mb-6 animate-fade-in">
              Discover Amazing <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Local Businesses
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 animate-slide-up">
              Connect with the best services in your community
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto animate-slide-up">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-slate-900 border-2 border-white/20 focus:border-white outline-none transition-all shadow-lg"
                />
              </div>
              <button onClick={handleSearch} className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg flex items-center justify-center space-x-2">
                <span>Search</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Wave Shape */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="rgb(248, 250, 252)"/>
          </svg>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mb-4">
            Browse by Category
          </h2>
          <p className="text-lg text-slate-600">Find exactly what you're looking for</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/search?category=${category.name}`}
              className="group card card-hover p-6 text-center"
            >
              <div className={`text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-200`}>
                {category.emoji}
              </div>
              <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Businesses */}
      <div className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mb-2 flex items-center">
                <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
                Popular Businesses
              </h2>
              <p className="text-lg text-slate-600">Trending in your area</p>
            </div>
            <Link to="/search" className="btn-outline hidden md:flex items-center space-x-2">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="h-48 bg-slate-200 rounded-xl mb-4"></div>
                  <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <Link
                  key={business._id}
                  to={`/business/${business._id}`}
                  className="card card-hover overflow-hidden group"
                >
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 relative overflow-hidden">
                    {business.logo ? (
                      <img
                        src={`http://localhost:8000${business.logo}`}
                        alt={business.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        {business.category === 'Restaurant' && '🍽️'}
                        {business.category === 'Retail' && '🛍️'}
                        {business.category === 'Technology' && '💻'}
                        {business.category === 'Healthcare' && '🏥'}
                        {business.category === 'Education' && '📚'}
                        {business.category === 'Beauty & Spa' && '💅'}
                        {!['Restaurant', 'Retail', 'Technology', 'Healthcare', 'Education', 'Beauty & Spa'].includes(business.category) && '🏢'}
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className="badge bg-white/90 backdrop-blur-sm text-blue-600 font-semibold shadow-lg">
                        {business.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {business.name}
                    </h3>
                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                      {business.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{business.location.city}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{business.views} views</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-10 md:hidden">
            <Link to="/search" className="btn-primary inline-flex items-center space-x-2">
              <span>View All Businesses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-4xl font-bold text-slate-900 mb-1">{stats.totalBusinesses}</div>
                  <div className="text-slate-600 font-medium">Active Businesses</div>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-blue-500 rounded-full"></div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-4xl font-bold text-slate-900 mb-1">{stats.totalUsers}</div>
                  <div className="text-slate-600 font-medium">Happy Customers</div>
                </div>
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-4/5 bg-indigo-500 rounded-full"></div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-4xl font-bold text-slate-900 mb-1">{stats.totalViews}</div>
                  <div className="text-slate-600 font-medium">Profile Views</div>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-purple-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Action Card */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isBusinessOwner ? (
            <div className="relative">
              <div className="absolute inset-0 bg-slate-900 rounded-[2.5rem]"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-[2.5rem]"></div>
              <div className="relative p-10 md:p-16 lg:p-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="inline-block px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm mb-6">
                      <span className="text-white/90 text-sm font-medium">For Business Owners</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                      Welcome back,<br />{user?.name?.split(' ')[0]}
                    </h2>
                    <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                      Check your dashboard to see latest views, manage your business details, and connect with more customers.
                    </p>
                    <Link 
                      to="/dashboard" 
                      className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-semibold hover:bg-slate-50 transition-all shadow-lg group"
                    >
                      Go to Dashboard
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  <div className="hidden md:flex justify-end">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                        <TrendingUp className="w-8 h-8 text-white mb-3" />
                        <div className="text-2xl font-bold text-white">Track</div>
                        <div className="text-sm text-slate-300">Analytics</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 mt-8">
                        <Star className="w-8 h-8 text-white mb-3" />
                        <div className="text-2xl font-bold text-white">Manage</div>
                        <div className="text-sm text-slate-300">Services</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-[2.5rem] p-10 md:p-16 lg:p-20 border border-slate-200">
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-5 py-2 bg-white rounded-full shadow-sm mb-8">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-slate-700">Your Personal Collection</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                  Hey {user?.name?.split(' ')[0]},<br />find your favorites
                </h2>
                <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                  Bookmark businesses you love and keep them organized in one place. Never lose track of great services again.
                </p>
                <Link 
                  to="/favorites" 
                  className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-semibold hover:bg-slate-800 transition-all shadow-lg group"
                >
                  <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  My Favorites
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
