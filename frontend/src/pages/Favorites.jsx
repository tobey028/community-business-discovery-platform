import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Heart, MapPin, Phone, Mail, Eye, Trash2 } from 'lucide-react';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/favorites');
      setFavorites(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (businessId) => {
    if (!window.confirm('Remove this business from your favorites?')) {
      return;
    }

    try {
      await api.delete(`/favorites/${businessId}`);
      setFavorites(prev => prev.filter(fav => fav.business._id !== businessId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove favorite');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-16 h-16 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
            <Heart className="w-10 h-10 text-red-500 fill-current" />
            My Favorites
          </h1>
          <p className="text-slate-600 mt-2">
            {favorites.length === 0 
              ? 'You haven\'t added any favorites yet' 
              : `You have ${favorites.length} favorite ${favorites.length === 1 ? 'business' : 'businesses'}`
            }
          </p>
        </div>

        
        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-6 border border-red-200">
            {error}
          </div>
        )}

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No Favorites Yet</h2>
            <p className="text-slate-600 mb-6">
              Start exploring businesses and add them to your favorites!
            </p>
            <Link to="/search" className="btn-primary inline-flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Discover Businesses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map(({ business, createdAt }) => (
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
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFavorite(business._id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-500 hover:text-white text-red-500 transition-all duration-200"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

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

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-slate-500 mb-4 pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>{business.views} views</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                      <span>Added {createdAt ? new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently'}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Link
                      to={`/business/${business._id}`}
                      className="block text-center btn-primary w-full"
                    >
                      View Details
                    </Link>
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`tel:${business.contact.phone}`}
                        className="text-center px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 font-medium rounded-lg border border-green-200 transition-colors"
                      >
                        <Phone className="w-4 h-4 inline-block mr-1" />
                        Call
                      </a>
                      <a
                        href={`mailto:${business.contact.email}`}
                        className="text-center px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium rounded-lg border border-purple-200 transition-colors"
                      >
                        <Mail className="w-4 h-4 inline-block mr-1" />
                        Email
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Card */}
        {favorites.length > 0 && (
          <div className="card p-6 mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Keep discovering great businesses!
                </h3>
                <p className="text-slate-600 text-sm">
                  You've saved {favorites.length} {favorites.length === 1 ? 'business' : 'businesses'} to your favorites
                </p>
              </div>
              <Link to="/search" className="btn-primary flex items-center gap-2">
                Discover More
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
