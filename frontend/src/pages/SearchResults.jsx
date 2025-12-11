import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { Search, MapPin, Phone, Mail, Heart, Eye, Filter, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const categories = [
  'Restaurant',
  'Retail',
  'Healthcare',
  'Education',
  'Technology',
  'Beauty & Spa',
  'Automotive',
  'Real Estate',
  'Entertainment',
  'Professional Services',
  'Other'
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
        sortBy: searchParams.get('sortBy') || 'popular', // Default to most viewed
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Discover Local Businesses</h1>
          <p className="text-slate-600">
            {loading ? 'Searching...' : `${pagination.total} businesses found`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search & Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search businesses..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
              <button type="submit" className="btn-primary">
                Search
              </button>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <label className="input-label">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="input-label">City</label>
                  <input
                    type="text"
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="md:col-span-2 flex gap-2">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Active Filters Display */}
          {(keyword || category || city) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200">
              <span className="text-sm font-medium text-slate-700">Filters:</span>
              {keyword && (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                  "{keyword}"
                </span>
              )}
              {category && (
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-200">
                  {category}
                </span>
              )}
              {city && (
                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-200">
                  {city}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-6 border border-red-200">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse border border-slate-200">
                <div className="bg-slate-200 h-48 rounded-xl mb-4"></div>
                <div className="bg-slate-200 h-6 rounded mb-2"></div>
                <div className="bg-slate-200 h-4 rounded w-3/4 mb-3"></div>
                <div className="bg-slate-200 h-4 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : businesses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">No businesses found</h3>
            <p className="text-slate-600 mb-6">Try adjusting your search criteria or explore all businesses</p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Business Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {businesses.map((business) => (
                <div key={business._id} className="card overflow-hidden group">
                  {/* Business Logo/Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden">
                    {business.logo ? (
                      <img
                        src={`http://localhost:8000${business.logo}`}
                        alt={business.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        🏢
                      </div>
                    )}
                    
                    {/* Favorite Button */}
                    {isRegularUser && (
                      <button
                        onClick={() => toggleFavorite(business._id)}
                        className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition-all duration-200 ${
                          favorites.has(business._id)
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-white text-slate-400 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${favorites.has(business._id) ? 'fill-current' : ''}`} />
                      </button>
                    )}

                    {/* Category Badge */}
                    <div className="absolute bottom-3 left-3">
                      <span className="badge bg-white/90 backdrop-blur-sm text-slate-700 shadow-lg">
                        {business.category}
                      </span>
                    </div>
                  </div>

                  {/* Business Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {business.name}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {business.description}
                    </p>

                    {/* Location */}
                    <div className="flex items-start gap-2 text-sm text-slate-600 mb-2">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        {business.location.address}, {business.location.city}
                      </span>
                    </div>

                    {/* Contact */}
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{business.contact.phone}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{business.contact.email}</span>
                    </div>

                    {/* Views */}
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                      <Eye className="w-4 h-4" />
                      <span>{business.views} views</span>
                    </div>

                    {/* View Details Button */}
                    <Link
                      to={`/business/${business._id}`}
                      className="block text-center btn-primary w-full"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-slate-600">
                  Showing page {pagination.page} of {pagination.pages}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  
                  <div className="hidden sm:flex items-center gap-1">
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
                          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                            pagination.page === pageNum
                              ? 'bg-slate-900 text-white'
                              : 'text-slate-700 hover:bg-slate-100'
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
                    className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
