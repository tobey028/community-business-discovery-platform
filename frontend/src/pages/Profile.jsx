import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import { User, Mail, Save, AlertCircle, CheckCircle, Shield, Lock, Calendar, Sparkles, Check, X } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Password requirements checker
  const getPasswordRequirements = () => {
    const requirements = [
      { label: 'At least 8 characters', met: formData.newPassword.length >= 8 },
      { label: 'One uppercase letter', met: /[A-Z]/.test(formData.newPassword) },
      { label: 'One number', met: /[0-9]/.test(formData.newPassword) },
      { label: 'One special character (!@#$%...)', met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) }
    ];
    return requirements;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    // Validate new password if provided
    if (formData.newPassword) {
      if (formData.newPassword.length < 8) {
        setError('New password must be at least 8 characters long');
        return;
      }

      if (!/[A-Z]/.test(formData.newPassword)) {
        setError('New password must contain at least one uppercase letter');
        return;
      }

      if (!/[0-9]/.test(formData.newPassword)) {
        setError('New password must contain at least one number');
        return;
      }

      if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword)) {
        setError('New password must contain at least one special character (!@#$%^&*(),.?":{}|<>)');
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
    }

    setLoading(true);

    try {
      const updateData = { name: formData.name };
      
      if (formData.currentPassword && formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const { data } = await api.put('/auth/update-profile', updateData);
      
      if (data.data.token) {
        localStorage.setItem('token', data.data.token);
      }
      
      setSuccess('Profile updated successfully!');
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 py-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-gradient-to-r from-[#4C82F7]/10 to-[#6B9FFF]/10 rounded-full mb-6 border border-[#4C82F7]/20">
            <Sparkles className="w-4 h-4 text-[#4C82F7]" />
            <span className="text-sm font-bold text-[#4C82F7]">Account Settings</span>
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Profile Settings</h1>
          <p className="text-xl text-gray-600 font-medium">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Summary Card */}
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
            {/* Gradient Header Background */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-[#4C82F7] to-[#6B9FFF]"></div>
            
            <div className="relative p-8">
              <div className="text-center">
                {/* Avatar with Ring */}
                <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-[#4C82F7] to-[#6B9FFF] rounded-2xl mb-6 shadow-xl ring-4 ring-white">
                  <User className="w-14 h-14 text-white" />
                </div>
                
                {/* User Info */}
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">{user?.name}</h3>
                <p className="text-sm text-gray-600 mb-4 font-medium">{user?.email}</p>
                
                {/* Role Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4C82F7]/10 to-[#6B9FFF]/10 text-[#4C82F7] rounded-xl text-sm font-bold border border-[#4C82F7]/20 shadow-sm">
                  <Shield className="w-4 h-4" />
                  {user?.role === 'business_owner' ? 'Business Owner' : 'Member'}
                </div>
              </div>

              {/* Account Details */}
              <div className="mt-8 pt-8 border-t border-gray-200/60 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#4C82F7]/10 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-[#4C82F7]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Member since</p>
                      <p className="text-sm font-bold text-gray-900">
                        {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                      <Shield className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Account Type</p>
                      <p className="text-sm font-bold text-gray-900">
                        {user?.role === 'business_owner' ? 'Business' : 'Personal'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm p-8 md:p-10">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Edit Profile</h2>

              {/* Messages */}
              {error && (
                <div className="mb-8 flex items-start gap-4 p-5 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200/60 rounded-xl shadow-sm">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-red-900 mb-1">Error</p>
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="mb-8 flex items-start gap-4 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200/60 rounded-xl shadow-sm">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-green-900 mb-1">Success</p>
                    <p className="text-sm text-green-700 font-medium">{success}</p>
                  </div>
                </div>
              )}

              <div className="space-y-7">
                {/* Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#4C82F7]/10 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-[#4C82F7]" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-16 pr-5 py-4 rounded-xl border border-gray-200 bg-white focus:border-[#4C82F7] focus:ring-4 focus:ring-[#4C82F7]/10 outline-none transition-all text-gray-900 font-medium placeholder-gray-400"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full pl-16 pr-5 py-4 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-500 cursor-not-allowed font-medium"
                    />
                  </div>
                  <p className="mt-2.5 text-xs text-gray-500 font-medium flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Email cannot be changed
                  </p>
                </div>

                {/* Password Section Divider */}
                <div className="relative pt-4 pb-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-gray-100"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white/80 backdrop-blur-sm px-5 py-2 text-sm font-bold text-gray-700 flex items-center gap-2 rounded-lg border border-gray-200 shadow-sm">
                      <Lock className="w-4 h-4 text-[#4C82F7]" />
                      Change Password (Optional)
                    </span>
                  </div>
                </div>

                {/* Password Fields Group */}
                <div className="space-y-5 pt-2">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Current Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full pl-16 pr-5 py-4 rounded-xl border border-gray-200 bg-white focus:border-[#4C82F7] focus:ring-4 focus:ring-[#4C82F7]/10 outline-none transition-all font-medium placeholder-gray-400"
                        placeholder="Enter current password"
                      />
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                        <Lock className="w-5 h-5 text-green-600" />
                      </div>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full pl-16 pr-5 py-4 rounded-xl border border-gray-200 bg-white focus:border-[#4C82F7] focus:ring-4 focus:ring-[#4C82F7]/10 outline-none transition-all font-medium placeholder-gray-400"
                        placeholder="Enter new password"
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                        <Lock className="w-5 h-5 text-green-600" />
                      </div>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-16 pr-5 py-4 rounded-xl border border-gray-200 bg-white focus:border-[#4C82F7] focus:ring-4 focus:ring-[#4C82F7]/10 outline-none transition-all font-medium placeholder-gray-400"
                        placeholder="Confirm new password"
                      />
                    </div>
                    
                    {/* Password Requirements Indicator */}
                    {formData.newPassword && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-xs font-bold text-gray-700 mb-2">Password Requirements:</p>
                        <div className="space-y-1.5">
                          {getPasswordRequirements().map((req, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              {req.met ? (
                                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                </div>
                              ) : (
                                <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                                  <X className="w-3 h-3 text-gray-500" strokeWidth={3} />
                                </div>
                              )}
                              <span className={`text-xs font-semibold transition-colors ${
                                req.met ? 'text-green-600' : 'text-gray-500'
                              }`}>
                                {req.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#4C82F7] to-[#6B9FFF] text-white py-4 rounded-xl font-bold hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
