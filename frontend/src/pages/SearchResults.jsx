import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { Search, MapPin, Phone, Mail, Heart, Eye, Filter, X, Sparkles, Star, ChevronDown, UtensilsCrossed, ShoppingBag, Stethoscope, GraduationCap, Laptop, Scissors, Car, Home as HomeIcon, Clapperboard, Briefcase, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const categories = [
  { value: 'Restaurant', label: 'Restaurant', icon: UtensilsCrossed, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  { value: 'Retail', label: 'Retail', icon: ShoppingBag, color: 'text-pink-600', bgColor: 'bg-pink-50' },
  { value: 'Healthcare', label: 'Healthcare', icon: Stethoscope, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { value: 'Education', label: 'Education', icon: GraduationCap, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  { value: 'Technology', label: 'Technology', icon: Laptop, color: 'text-violet-600', bgColor: 'bg-violet-50' },
  { value: 'Beauty & Spa', label: 'Beauty & Spa', icon: Scissors, color: 'text-rose-600', bgColor: 'bg-rose-50' },
  { value: 'Automotive', label: 'Automotive', icon: Car, color: 'text-slate-600', bgColor: 'bg-slate-50' },
  { value: 'Real Estate', label: 'Real Estate', icon: HomeIcon, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  { value: 'Entertainment', label: 'Entertainment', icon: Clapperboard, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  { value: 'Professional Services', label: 'Professional Services', icon: Briefcase, color: 'text-cyan-600', bgColor: 'bg-cyan-50' },
  { value: 'Other', label: 'Other', icon: MoreHorizontal, color: 'text-gray-600', bgColor: 'bg-gray-50' }
];

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, isRegularUser } = useAuth();
  
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  
  // Filters
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 9
  });

  useEffect(() => {
    fetchBusinesses();
  }, [searchParams]);

  useEffect(() => {
    if (isRegularUser) {
      fetchFavorites();
    }
  }, [isRegularUser]);

  const fetchBusinesses = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        keyword: searchParams.get('keyword') || '',
        category: searchParams.get('category') || '',
        city: searchParams.get('city') || '',
        sortBy: searchParams.get('sortBy') || 'popular',
        page: searchParams.get('page') || 1,
        limit: 9
      };
      
      const { data } = await api.get('/businesses', { params });
      setBusinesses(data.data || []);
      setPagination({
        total: data.total || 0,
        page: data.currentPage || 1,
        pages: data.totalPages || 1,
        limit: 9
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch businesses');
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const { data } = await api.get('/favorites');
      const favIds = new Set(data.data.map(fav => fav.business._id));
      setFavorites(favIds);
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    }
  };

  const toggleFavorite = async (businessId) => {
    if (!isAuthenticated) {
      alert('Please login to add favorites');
      return;
    }
    
    if (!isRegularUser) {
      alert('Only regular users can add favorites');
      return;
    }

    try {
      if (favorites.has(businessId)) {
        await api.delete(`/favorites/${businessId}`);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(businessId);
          return newSet;
        });
      } else {
        await api.post(`/favorites/${businessId}`);
        setFavorites(prev => new Set(prev).add(businessId));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update favorite');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (keyword) params.keyword = keyword;
    if (category) params.category = category;
    if (city) params.city = city;
    params.page = 1;
    setSearchParams(params);
  };

  const clearFilters = () => {
    setKeyword('');
    setCategory('');
    setCity('');
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    const params = Object.fromEntries(searchParams);
    params.page = newPage;
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-purple-50/10">
      {/* Premium Header Section */}
      <div className="relative bg-gradient-to-br from-[#4C82F7] via-[#5B8BF8] to-[#6B9FFF] text-white rounded-b-[3rem] shadow-xl overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#4C82F7]/30 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/10 rounded-full mb-6 border border-white/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-bold text-white">Explore Marketplace</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">Discover Local Businesses</h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium">
            {loading ? 'Searching...' : `${pagination.total} businesses ready to serve you`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        
        {/* Premium Search & Filters Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200/60 p-8 mb-12 hover:shadow-lg transition-shadow duration-300">
          <form onSubmit={handleSearch} className="space-y-7">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-[#4C82F7]/10 rounded-xl flex items-center justify-center">
                  <Search className="w-5 h-5 text-[#4C82F7]" />
                </div>
                <input
                  type="text"
                  placeholder="Search for businesses, services, or keywords..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-[4.5rem] pr-5 py-4 rounded-xl border border-gray-200 bg-white focus:border-[#4C82F7] focus:ring-4 focus:ring-[#4C82F7]/10 outline-none transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium shadow-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-sm hover:shadow-md ${
                  showFilters
                    ? 'bg-gradient-to-r from-[#4C82F7] to-[#6B9FFF] text-white scale-105'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-[#4C82F7]'
                }`}
              >
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline">Filters</span>
              </button>
              <button type="submit" className="px-8 py-4 bg-gradient-to-r from-[#4C82F7] to-[#6B9FFF] text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg">
                Search
              </button>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-7 border-t-2 border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Category</label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full pl-14 pr-12 py-4 rounded-xl border-2 border-gray-200 bg-white hover:border-[#4C82F7]/50 focus:border-[#4C82F7] focus:ring-4 focus:ring-[#4C82F7]/10 outline-none transition-all duration-300 text-gray-900 font-semibold shadow-sm hover:shadow-md appearance-none cursor-pointer"
                      style={{ backgroundImage: 'none' }}
                    >
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                    {/* Icon Container */}
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      {category ? (
                        (() => {
                          const selectedCat = categories.find(c => c.value === category);
                          if (selectedCat) {
                            const Icon = selectedCat.icon;
                            return (
                              <div className={`w-8 h-8 rounded-lg ${selectedCat.bgColor} flex items-center justify-center`}>
                                <Icon className={`w-4 h-4 ${selectedCat.color}`} />
                              </div>
                            );
                          }
                          return null;
                        })()
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4C82F7]/10 to-[#6B9FFF]/10 flex items-center justify-center">
                          <Filter className="w-4 h-4 text-[#4C82F7]" />
                        </div>
                      )}
                    </div>
                    {/* Chevron Icon */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">City</label>
                  <input
                    type="text"
                    placeholder="Enter city name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-4 rounded-xl border border-gray-200 bg-white focus:border-[#4C82F7] focus:ring-4 focus:ring-[#4C82F7]/10 outline-none transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium shadow-sm"
                  />
                </div>
                <div className="md:col-span-2 flex gap-3">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md"
                  >
                    <X className="w-4 h-4" />
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Active Filters Display */}
          {(keyword || category || city) && (
            <div className="flex flex-wrap gap-3 mt-7 pt-7 border-t-2 border-gray-100">
              <span className="text-sm font-bold text-gray-700 my-auto flex items-center gap-2">
                <Star className="w-4 h-4 text-[#4C82F7]" />
                Active Filters:
              </span>
              {keyword && (
                <span className="px-4 py-2 bg-gradient-to-r from-[#4C82F7]/10 to-[#6B9FFF]/10 text-[#4C82F7] rounded-xl text-sm font-bold border border-[#4C82F7]/30 shadow-sm">
                  "{keyword}"
                </span>
              )}
              {category && (
                <span className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-xl text-sm font-bold border border-indigo-200/60 shadow-sm">
                  {category}
                </span>
              )}
              {city && (
                <span className="px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 rounded-xl text-sm font-bold border border-purple-200/60 shadow-sm">
                  {city}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200/60 rounded-xl shadow-sm mb-12 p-6 flex items-start gap-4">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <X className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-red-900 mb-1">Error</p>
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden animate-pulse border border-gray-200/60 shadow-sm">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-56"></div>
                <div className="p-6 space-y-4">
                  <div className="bg-gray-200 h-6 rounded-xl w-3/4"></div>
                  <div className="bg-gray-200 h-4 rounded-lg w-full"></div>
                  <div className="bg-gray-200 h-4 rounded-lg w-2/3"></div>
                  <div className="flex gap-3 pt-2">
                    <div className="bg-gray-200 h-4 rounded-lg w-24"></div>
                    <div className="bg-gray-200 h-4 rounded-lg w-20"></div>
                  </div>
                  <div className="bg-gray-200 h-10 rounded-xl w-full mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : businesses.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-md p-20 text-center">
            <div className="text-8xl mb-8">🔍</div>
            <h3 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">No businesses found</h3>
            <p className="text-gray-600 text-lg font-medium mb-10 max-w-md mx-auto leading-relaxed">Try adjusting your search criteria or clear filters to explore all businesses</p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#4C82F7] to-[#6B9FFF] text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            {/* Premium Business Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {businesses.map((business) => (
                <Link
                  key={business._id}
                  to={`/business/${business._id}`}
                  className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] hover:-translate-y-2"
                >
                  {/* Business Image Container */}
                  <div className="relative h-56 bg-gradient-to-br from-[#4C82F7]/5 to-[#6B9FFF]/5 overflow-hidden">
                    {business.logo ? (
                      <img
                        src={business.logo}
                        alt={business.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-500">
                        🏢
                      </div>
                    )}
                    
                    {/* Floating Favorite Button */}
                    {isRegularUser && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(business._id);
                        }}
                        className={`absolute top-4 right-4 w-11 h-11 rounded-xl shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-md flex items-center justify-center ${
                          favorites.has(business._id)
                            ? 'bg-gradient-to-br from-red-500 to-pink-500 text-white'
                            : 'bg-white/90 text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${favorites.has(business._id) ? 'fill-current' : ''}`} />
                      </button>
                    )}

                    {/* Floating Category Pill Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-4 py-2 bg-white/95 backdrop-blur-md text-[#4C82F7] font-bold rounded-xl shadow-lg text-xs border border-[#4C82F7]/20">
                        {business.category}
                      </span>
                    </div>

                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Business Info Card */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-[#4C82F7] transition-colors line-clamp-1">
                      {business.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 font-medium">
                      {business.description}
                    </p>

                    {/* Contact Info Grid */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#4C82F7]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 text-[#4C82F7]" />
                        </div>
                        <span className="text-sm text-gray-700 font-medium line-clamp-1 pt-1">
                          {business.location.address}, {business.location.city}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Phone className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-sm text-gray-700 font-medium">{business.contact.phone}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="text-sm text-gray-700 font-medium truncate">{business.contact.email}</span>
                      </div>
                    </div>

                    {/* Footer with Views */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 px-3 py-1.5 rounded-lg border border-yellow-200/60">
                        <Eye className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-bold text-yellow-700">{business.views} views</span>
                      </div>
                      <div className="text-[#4C82F7] font-bold text-sm group-hover:translate-x-1 transition-transform">
                        View Details →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Premium Pagination */}
            {pagination.pages > 1 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-md p-8 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="text-base font-bold text-gray-700">
                  Page <span className="text-[#4C82F7]">{pagination.page}</span> of {pagination.pages}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-6 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-bold hover:bg-white hover:border-[#4C82F7] hover:text-[#4C82F7] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    Previous
                  </button>
                  
                  <div className="hidden sm:flex items-center gap-2">
                    {[...Array(Math.min(pagination.pages, 5))].map((_, i) => {
                      let pageNum;
                      if (pagination.pages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-12 h-12 rounded-xl font-bold transition-all duration-300 ${
                            pagination.page === pageNum
                              ? 'bg-gradient-to-r from-[#4C82F7] to-[#6B9FFF] text-white shadow-lg scale-110'
                              : 'text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="px-6 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-bold hover:bg-white hover:border-[#4C82F7] hover:text-[#4C82F7] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
