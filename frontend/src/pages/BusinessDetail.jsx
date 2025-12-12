import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { 
  MapPin, Phone, Mail, Globe, Heart, Eye, ArrowLeft, 
  Clock, DollarSign, Star, Building2 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const BusinessDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isRegularUser } = useAuth();
  
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchBusinessDetail();
    if (isRegularUser) {
      checkFavoriteStatus();
    }
  }, [id, isRegularUser]);

  const fetchBusinessDetail = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/businesses/${id}`);
      setBusiness(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch business details');
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const { data } = await api.get(`/favorites/check/${id}`);
      setIsFavorite(data.isFavorite);
    } catch (err) {
      console.error('Failed to check favorite status:', err);
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      alert('Please login to add favorites');
      navigate('/login');
      return;
    }
    
    if (!isRegularUser) {
      alert('Only regular users can add favorites');
      return;
    }

    try {
      if (isFavorite) {
        await api.delete(`/favorites/${id}`);
        setIsFavorite(false);
      } else {
        await api.post(`/favorites/${id}`);
        setIsFavorite(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update favorite');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-16 h-16 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading business details...</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Business Not Found</h2>
          <p className="text-slate-600 mb-6">{error || 'This business could not be found'}</p>
          <Link to="/search" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="btn-secondary inline-flex items-center gap-2 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Business Header */}
            <div className="card overflow-hidden">
              {/* Logo/Image */}
              <div className="relative h-64 md:h-80 bg-gradient-to-br from-blue-100 to-indigo-100">
                {business.logo ? (
                  <img
                    src={business.logo}
                    alt={business.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-8xl">
                    🏢
                  </div>
                )}
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="badge bg-white/90 backdrop-blur-sm text-slate-700 shadow-lg text-base px-4 py-2">
                    {business.category}
                  </span>
                </div>
              </div>

              {/* Business Info */}
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                    {business.name}
                  </h1>
                  
                  {/* Favorite Button */}
                  {isRegularUser && (
                    <button
                      onClick={toggleFavorite}
                      className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
                        isFavorite
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-white text-slate-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  )}
                </div>

                {/* Views Counter */}
                <div className="flex items-center gap-2 text-slate-600 mb-6">
                  <Eye className="w-5 h-5" />
                  <span>{business.views} views</span>
                </div>

                {/* Description */}
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">About</h3>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                    {business.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Services Section */}
            {business.services && business.services.length > 0 && (
              <div className="card p-6 md:p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Star className="w-6 h-6 text-amber-500" />
                  Services Offered
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {business.services.map((service, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100"
                    >
                      <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        {service.name}
                      </h4>
                      {service.description && (
                        <p className="text-sm text-slate-600 mb-2">{service.description}</p>
                      )}
                      {service.price && (
                        <p className="text-sm font-medium text-blue-600 flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {service.price}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Contact Information */}
            <div className="card p-6 sticky top-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Contact Information</h2>
              
              <div className="space-y-4">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 mb-1">Address</p>
                    <p className="text-slate-600 text-sm">
                      {business.location.address}<br />
                      {business.location.city}
                      {business.location.state && `, ${business.location.state}`}
                      {business.location.zipCode && ` ${business.location.zipCode}`}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 mb-1">Phone</p>
                    <a
                      href={`tel:${business.contact.phone}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      {business.contact.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Mail className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 mb-1">Email</p>
                    <a
                      href={`mailto:${business.contact.email}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium break-all"
                    >
                      {business.contact.email}
                    </a>
                  </div>
                </div>

                {/* Website */}
                {business.contact.website && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Globe className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 mb-1">Website</p>
                      <a
                        href={business.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium break-all"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}

                {/* Business Hours Info */}
                <div className="flex items-start gap-3 pt-4 border-t border-slate-200">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Clock className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 mb-1">Member Since</p>
                    <p className="text-slate-600 text-sm">
                      {new Date(business.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
                <a
                  href={`tel:${business.contact.phone}`}
                  className="btn-primary w-full text-center block"
                >
                  <Phone className="w-5 h-5 inline-block mr-2" />
                  Call Now
                </a>
                <a
                  href={`mailto:${business.contact.email}`}
                  className="btn-secondary w-full text-center block"
                >
                  <Mail className="w-5 h-5 inline-block mr-2" />
                  Send Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetail;
