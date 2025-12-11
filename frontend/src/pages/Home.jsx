import { Link } from 'react-router-dom';
import { Search, TrendingUp, Star, MapPin, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../api/axios';

const Home = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    fetchFeaturedBusinesses();
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

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="card bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Own a Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our platform and reach thousands of potential customers in your local community
          </p>
          <Link to="/register" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg">
            Create Your Business Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
