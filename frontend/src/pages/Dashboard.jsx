import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { 
  Plus, Edit2, Trash2, Eye, MapPin, Phone, Mail, 
  Building2, Upload, X, Save, ChevronDown, UtensilsCrossed, 
  ShoppingBag, Stethoscope, GraduationCap, Laptop, Scissors, 
  Car, Home as HomeIcon, Clapperboard, Briefcase, MoreHorizontal 
} from 'lucide-react';

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

const Dashboard = () => {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); 
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: ''
    },
    contact: {
      phone: '',
      email: '',
      website: ''
    },
    services: []
  });

  const [newService, setNewService] = useState({ name: '', description: '', price: '' });

  useEffect(() => {
    fetchBusiness();
  }, []);

  const fetchBusiness = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/businesses/my/profile');
      if (data.data) {
        setBusiness(data.data);
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        setError(err.response?.data?.message || 'Failed to fetch business');
      }
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      name: '',
      description: '',
      category: '',
      location: { address: '', city: '', state: '', zipCode: '' },
      contact: { phone: '', email: '', website: '' },
      services: []
    });
    setLogoFile(null);
    setLogoPreview('');
    setShowModal(true);
  };

  const openEditModal = () => {
    setModalMode('edit');
    setFormData({
      name: business.name,
      description: business.description,
      category: business.category,
      location: { ...business.location },
      contact: { ...business.contact },
      services: [...business.services]
    });
    setLogoFile(null);
    setLogoPreview(business.logo ? `http://localhost:8000${business.logo}` : '');
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Logo size must be less than 5MB');
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const addService = () => {
    if (newService.name.trim()) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, { ...newService }]
      }));
      setNewService({ name: '', description: '', price: '' });
    }
  };

  const removeService = (index) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('location', JSON.stringify(formData.location));
      submitData.append('contact', JSON.stringify(formData.contact));
      submitData.append('services', JSON.stringify(formData.services));
      
      if (logoFile) {
        submitData.append('logo', logoFile);
      }

      let response;
      if (modalMode === 'create') {
        response = await api.post('/businesses', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await api.put(`/businesses/${business._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setBusiness(response.data.data);
      setSuccess(`Business ${modalMode === 'create' ? 'created' : 'updated'} successfully!`);
      setShowModal(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save business');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your business? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      await api.delete(`/businesses/${business._id}`);
      setBusiness(null);
      setSuccess('Business deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete business');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-16 h-16 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Business Dashboard</h1>
            <p className="text-slate-600 mt-2">Manage your business profile</p>
          </div>
          
          {business ? (
            <button onClick={openEditModal} className="btn-primary flex items-center gap-2">
              <Edit2 className="w-5 h-5" />
              Edit Business
            </button>
          ) : (
            <button onClick={openCreateModal} className="btn-primary flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Business
            </button>
          )}
        </div>

        {/* Messages */}
        {success && (
          <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl mb-6 border border-green-200">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-6 border border-red-200">
            {error}
          </div>
        )}

        {/* Business Profile or Empty State */}
        {business ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card overflow-hidden">
                {/* Logo */}
                <div className="relative h-64 bg-gradient-to-br from-blue-100 to-indigo-100">
                  {business.logo ? (
                    <img
                      src={`http://localhost:8000${business.logo}`}
                      alt={business.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-8xl">
                      🏢
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="badge bg-white/90 backdrop-blur-sm text-slate-700 shadow-lg text-base px-4 py-2">
                      {business.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">{business.name}</h2>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{business.views} views</span>
                    </div>
                  </div>

                  <p className="text-slate-700 whitespace-pre-line mb-6">{business.description}</p>

                  <div className="flex gap-3">
                    <Link
                      to={`/business/${business._id}`}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <Eye className="w-5 h-5" />
                      View Public Page
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-xl border border-red-200 flex items-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Services */}
              {business.services && business.services.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Services</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {business.services.map((service, index) => (
                      <div key={index} className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <h4 className="font-semibold text-slate-900 mb-1">{service.name}</h4>
                        {service.description && (
                          <p className="text-sm text-slate-600 mb-2">{service.description}</p>
                        )}
                        {service.price && (
                          <p className="text-sm font-medium text-blue-600">{service.price}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="card p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium text-slate-900">Address</p>
                    <p className="text-sm text-slate-600">
                      {business.location.address}<br />
                      {business.location.city}
                      {business.location.state && `, ${business.location.state}`}
                      {business.location.zipCode && ` ${business.location.zipCode}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <p className="font-medium text-slate-900">Phone</p>
                    <p className="text-sm text-slate-600">{business.contact.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <p className="font-medium text-slate-900">Email</p>
                    <p className="text-sm text-slate-600 break-all">{business.contact.email}</p>
                  </div>
                </div>
                {business.contact.website && (
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-amber-600 mt-1" />
                    <div>
                      <p className="font-medium text-slate-900">Website</p>
                      <a
                        href={business.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 break-all"
                      >
                        {business.contact.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">🏢</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No Business Profile</h2>
            <p className="text-slate-600 mb-6">Create your business profile to get discovered by customers</p>
            <button onClick={openCreateModal} className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Business Profile
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">
                {modalMode === 'create' ? 'Create Business' : 'Edit Business'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Logo Upload */}
              <div>
                <label className="input-label">Business Logo</label>
                <div className="flex items-center gap-4">
                  {logoPreview && (
                    <img src={logoPreview} alt="Logo preview" className="w-24 h-24 object-cover rounded-lg" />
                  )}
                  <label className="btn-secondary cursor-pointer flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload Logo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Business Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="input-label">Category *</label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-14 pr-12 py-3.5 rounded-xl border-2 border-gray-200 bg-white hover:border-[#4C82F7]/50 focus:border-[#4C82F7] focus:ring-4 focus:ring-[#4C82F7]/10 outline-none transition-all duration-300 text-gray-900 font-semibold shadow-sm hover:shadow-md appearance-none cursor-pointer"
                      style={{ backgroundImage: 'none' }}
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                    {/* Icon Container */}
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      {formData.category ? (
                        (() => {
                          const selectedCat = categories.find(c => c.value === formData.category);
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
                          <Building2 className="w-4 h-4 text-[#4C82F7]" />
                        </div>
                      )}
                    </div>
                    {/* Chevron Icon */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="input-label">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="input-field"
                />
              </div>

              {/* Location */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="input-label">Address *</label>
                    <input
                      type="text"
                      name="location.address"
                      value={formData.location.address}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="input-label">City *</label>
                    <input
                      type="text"
                      name="location.city"
                      value={formData.location.city}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="input-label">State</label>
                    <input
                      type="text"
                      name="location.state"
                      value={formData.location.state}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="input-label">Zip Code</label>
                    <input
                      type="text"
                      name="location.zipCode"
                      value={formData.location.zipCode}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Phone *</label>
                    <input
                      type="tel"
                      name="contact.phone"
                      value={formData.contact.phone}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="input-label">Email *</label>
                    <input
                      type="email"
                      name="contact.email"
                      value={formData.contact.email}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="input-label">Website</label>
                    <input
                      type="url"
                      name="contact.website"
                      value={formData.contact.website}
                      onChange={handleInputChange}
                      placeholder="https://"
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Services</h3>
                <div className="space-y-3">
                  {formData.services.map((service, index) => (
                    <div key={index} className="flex items-start gap-2 bg-blue-50 p-3 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{service.name}</p>
                        {service.description && <p className="text-sm text-slate-600">{service.description}</p>}
                        {service.price && <p className="text-sm text-blue-600">{service.price}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="p-1 hover:bg-red-100 rounded text-red-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Service name"
                      value={newService.name}
                      onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                      className="input-field"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={newService.description}
                      onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                      className="input-field"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Price"
                        value={newService.price}
                        onChange={(e) => setNewService(prev => ({ ...prev, price: e.target.value }))}
                        className="input-field"
                      />
                      <button
                        type="button"
                        onClick={addService}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="spinner w-5 h-5"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {modalMode === 'create' ? 'Create Business' : 'Save Changes'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
