import { Link } from 'react-router-dom';
import { Search, TrendingUp, Star, MapPin, ArrowRight, Heart, Users, Award, Sparkles, LayoutDashboard } from 'lucide-react';
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
        totalUsers: Math.floor(totalBusinesses * 1.5), 
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
      <div className="relative bg-gradient-to-br from-[#4C82F7] via-[#5B8BF8] to-[#6B9FFF] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-28 md:py-36">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
              Discover Amazing <br />
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                Local Businesses
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 font-medium">
              Connect with the best services in your community
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-14 pr-5 py-5 rounded-2xl text-gray-900 border-2 border-white/20 focus:border-white outline-none transition-all shadow-2xl font-semibold placeholder-gray-400"
                />
              </div>
              <button onClick={handleSearch} className="bg-white text-[#4C82F7] px-10 py-5 rounded-2xl font-bold hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center space-x-3">
                <span>Search</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Wave Shape */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Categories Section */}
      <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-gradient-to-r from-[#4C82F7]/10 to-[#6B9FFF]/10 rounded-full mb-6 border border-[#4C82F7]/20">
              <Sparkles className="w-4 h-4 text-[#4C82F7]" />
              <span className="text-sm font-bold text-[#4C82F7]">Explore Categories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-5 tracking-tight">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600 font-medium">Find exactly what you're looking for</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/search?category=${category.name}`}
                className="group relative bg-white/80 backdrop-blur-sm hover:bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-200/60 hover:border-[#4C82F7]/40 p-8 text-center transition-all duration-300 hover:scale-[1.05] hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#4C82F7]/0 to-[#6B9FFF]/0 group-hover:from-[#4C82F7]/5 group-hover:to-[#6B9FFF]/5 rounded-2xl transition-all duration-300"></div>
                <div className="relative">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {category.emoji}
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-[#4C82F7] transition-colors text-sm">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Businesses */}
      <div className="relative bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-gradient-to-r from-orange-50 to-red-50 rounded-full mb-6 border border-orange-200/60">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-bold text-orange-700">Trending Now</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                Popular Businesses
              </h2>
              <p className="text-xl text-gray-600 font-medium">Discover the most loved local services</p>
            </div>
            <Link 
              to="/search" 
              className="inline-flex items-center gap-3 px-6 py-3.5 bg-white hover:bg-[#4C82F7]/5 border-2 border-[#4C82F7]/40 hover:border-[#4C82F7] text-[#4C82F7] font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 group"
            >
              <span>View All</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden animate-pulse border border-gray-200/60 shadow-sm">
                  <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-200 relative"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded-xl w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="h-4 bg-gray-200 rounded-lg w-24"></div>
                      <div className="h-6 bg-gray-200 rounded-lg w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {businesses.map((business) => (
                <Link
                  key={business._id}
                  to={`/business/${business._id}`}
                  className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] hover:-translate-y-2"
                >
                  {/* Image Container */}
                  <div className="relative h-56 bg-gradient-to-br from-[#4C82F7]/5 to-[#6B9FFF]/5 overflow-hidden">
                    {business.logo ? (
                      <img
                        src={business.logo}
                        alt={business.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-500">
                        {business.category === 'Restaurant' && '🍽️'}
                        {business.category === 'Retail' && '🛍️'}
                        {business.category === 'Technology' && '💻'}
                        {business.category === 'Healthcare' && '🏥'}
                        {business.category === 'Education' && '📚'}
                        {business.category === 'Beauty & Spa' && '💅'}
                        {!['Restaurant', 'Retail', 'Technology', 'Healthcare', 'Education', 'Beauty & Spa'].includes(business.category) && '🏢'}
                      </div>
                    )}
                    {/* Floating Category Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-4 py-2 bg-white/95 backdrop-blur-md text-[#4C82F7] font-bold shadow-lg rounded-xl text-xs border border-[#4C82F7]/20">
                        {business.category}
                      </span>
                    </div>
                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-[#4C82F7] transition-colors line-clamp-1">
                      {business.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 font-medium">
                      {business.description}
                    </p>
                    
                    {/* Footer Info */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#4C82F7]/10 rounded-lg flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-[#4C82F7]" />
                        </div>
                        <span className="text-sm font-bold text-gray-700">{business.location.city}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 px-3 py-1.5 rounded-lg border border-yellow-200/60">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold text-yellow-700">{business.views}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12 md:hidden">
            <Link 
              to="/search" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#4C82F7] to-[#6B9FFF] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <span>View All Businesses</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="relative py-24 bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full mb-6 border border-green-200/60">
              <Award className="w-4 h-4 text-green-600" />
              <span className="text-sm font-bold text-green-700">Platform Growth</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-600 font-medium">Join our growing community today</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-sm border border-gray-200/60 hover:shadow-xl hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4C82F7]/0 to-[#6B9FFF]/0 group-hover:from-[#4C82F7]/5 group-hover:to-[#6B9FFF]/5 rounded-2xl transition-all duration-300"></div>
              <div className="relative">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <div className="text-5xl font-extrabold text-gray-900 mb-2">{stats.totalBusinesses}</div>
                    <div className="text-gray-700 font-bold text-lg">Active Businesses</div>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-[#4C82F7] to-[#6B9FFF] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-[#4C82F7] to-[#6B9FFF] rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="group relative bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-sm border border-gray-200/60 hover:shadow-xl hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-purple-50/0 group-hover:from-indigo-50/50 group-hover:to-purple-50/50 rounded-2xl transition-all duration-300"></div>
              <div className="relative">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <div className="text-5xl font-extrabold text-gray-900 mb-2">{stats.totalUsers}</div>
                    <div className="text-gray-700 font-bold text-lg">Happy Customers</div>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="group relative bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-sm border border-gray-200/60 hover:shadow-xl hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 to-pink-50/0 group-hover:from-purple-50/50 group-hover:to-pink-50/50 rounded-2xl transition-all duration-300"></div>
              <div className="relative">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <div className="text-5xl font-extrabold text-gray-900 mb-2">{stats.totalViews}</div>
                    <div className="text-gray-700 font-bold text-lg">Profile Views</div>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Action Card */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {isBusinessOwner ? (
            <div className="relative overflow-hidden rounded-3xl group">
              {/* Dark gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
              {/* Blue overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#4C82F7]/20 to-[#6B9FFF]/20"></div>
              {/* Animated gradient orbs */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#4C82F7]/30 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-700"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#6B9FFF]/30 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-700"></div>
              
              <div className="relative p-12 md:p-20">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                  <div>
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/10 rounded-xl backdrop-blur-md mb-8 border border-white/20">
                      <LayoutDashboard className="w-4 h-4 text-white" />
                      <span className="text-white/95 text-sm font-bold">For Business Owners</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-8 leading-tight">
                      Welcome back,<br />
                      <span className="bg-gradient-to-r from-[#4C82F7] via-[#5B8BF8] to-[#6B9FFF] bg-clip-text text-transparent">
                        {user?.name?.split(' ')[0]}
                      </span>
                    </h2>
                    <p className="text-xl text-gray-300 mb-10 leading-relaxed font-medium">
                      Check your dashboard to see latest views, manage your business details, and connect with more customers.
                    </p>
                    <Link 
                      to="/dashboard" 
                      className="inline-flex items-center gap-4 bg-white text-gray-900 px-10 py-5 rounded-xl font-bold hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all shadow-2xl group/btn"
                    >
                      Go to Dashboard
                      <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                  <div className="hidden md:flex justify-end">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer">
                        <TrendingUp className="w-10 h-10 text-white mb-4" />
                        <div className="text-3xl font-extrabold text-white mb-2">Track</div>
                        <div className="text-sm text-gray-300 font-semibold">Analytics</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 mt-10 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer">
                        <Star className="w-10 h-10 text-white mb-4" />
                        <div className="text-3xl font-extrabold text-white mb-2">Manage</div>
                        <div className="text-sm text-gray-300 font-semibold">Services</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative bg-gradient-to-br from-white via-pink-50/30 to-red-50/30 rounded-3xl p-12 md:p-20 border border-gray-200/60 shadow-xl overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-red-100/30 to-pink-100/30 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-pink-100/30 to-red-100/30 rounded-full blur-3xl"></div>
              
              <div className="relative max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm mb-10 border border-red-200/60">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-bold text-gray-800">Your Personal Collection</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-8 leading-tight">
                  Hey <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">{user?.name?.split(' ')[0]}</span>,<br />
                  find your favorites
                </h2>
                <p className="text-xl text-gray-600 mb-14 max-w-2xl mx-auto leading-relaxed font-medium">
                  Bookmark businesses you love and keep them organized in one place. Never lose track of great services again.
                </p>
                <Link 
                  to="/favorites" 
                  className="inline-flex items-center gap-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-12 py-6 rounded-xl font-bold hover:shadow-2xl hover:scale-105 active:scale-95 transition-all shadow-xl group"
                >
                  <Heart className="w-6 h-6 group-hover:scale-125 transition-transform" />
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
