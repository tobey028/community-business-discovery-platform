import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserPlus, Mail, Lock, User, AlertCircle, Store, Heart, Sparkles, Shield, CheckCircle, Check, X } from 'lucide-react';
import logo from '../assets/Print_Transparent.svg';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate password strength
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }

    if (!/[0-9]/.test(formData.password)) {
      setError('Password must contain at least one number');
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      setError('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register({ name: formData.name, email: formData.email, password: formData.password, role: formData.role });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Password requirements checker
  const getPasswordRequirements = () => {
    const requirements = [
      { label: 'At least 8 characters', met: formData.password.length >= 8 },
      { label: 'One uppercase letter', met: /[A-Z]/.test(formData.password) },
      { label: 'One number', met: /[0-9]/.test(formData.password) },
      { label: 'One special character (!@#$%...)', met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) }
    ];
    return requirements;
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-pink-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-gradient-to-tr from-[#4C82F7]/20 to-[#6B9FFF]/10 rounded-full blur-3xl"></div>
        
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-[#4C82F7]/10 rounded-full blur-2xl"></div>
        
        <div className="absolute top-20 left-1/3 w-24 h-24 border-2 border-purple-300/20 rounded-2xl -rotate-12"></div>
        <div className="absolute bottom-40 left-20 w-16 h-16 border-2 border-[#4C82F7]/10 rounded-xl rotate-45"></div>
        <div className="absolute top-1/2 right-20 w-20 h-20 border-2 border-pink-300/20 rounded-2xl rotate-12"></div>
      </div>

      <div className="relative min-h-screen flex">
        {/* Left Side - Hero Content */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 xl:px-24 relative z-10">
          <div className="max-w-xl">
            {/* Logo */}
            <div className="flex items-center space-x-4 mb-8">
              <img 
                src={logo} 
                alt="Nexzio Logo" 
                className="h-28 w-auto drop-shadow-lg"
              />
              <span className="text-3xl font-extrabold bg-gradient-to-r from-[#4C82F7] to-[#6B9FFF] bg-clip-text text-transparent">
                Nexzio
              </span>
            </div>

            <h2 className="text-5xl font-extrabold text-gray-900 mb-5 leading-tight">
              Join Our Growing<br />
              <span className="bg-gradient-to-r from-[#4C82F7] to-[#6B9FFF] bg-clip-text text-transparent">
                Community
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed font-medium">
              Start connecting with local businesses or showcase your own. It's free and takes less than a minute.
            </p>

            {/* Feature List */}
            <div className="space-y-4 mb-8">
              {[
                { icon: Sparkles, title: 'Instant Setup', desc: 'Get started in under 60 seconds' },
                { icon: Shield, title: 'Secure Platform', desc: 'Your data is protected and private' },
                { icon: CheckCircle, title: 'Free Forever', desc: 'No hidden fees or premium tiers' }
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-3 group">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#4C82F7]/10 rounded-xl flex items-center justify-center group-hover:bg-[#4C82F7]/20 transition-colors">
                    <feature.icon className="w-5 h-5 text-[#4C82F7]" />
                  </div>
                  <span className="text-base text-gray-700 font-semibold">{feature.title}: {feature.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Signup Card */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16 relative z-10">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center space-x-3 mb-10">
              <img 
                src={logo} 
                alt="Nexzio Logo" 
                className="h-20 w-auto drop-shadow-lg"
              />
              <span className="text-2xl font-extrabold bg-gradient-to-r from-[#4C82F7] to-[#6B9FFF] bg-clip-text text-transparent">
                Nexzio
              </span>
            </div>

            {/* Register Card */}
            <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 p-8">
              <div className="mb-8">
                <h2 className="text-4xl font-extrabold text-gray-900 mb-3">
                  Create Account
                </h2>
                <p className="text-gray-600 text-lg font-medium">Join thousands of users and businesses</p>
              </div>

              {error && (
                <div className="mb-8 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700 font-semibold">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Account Type</label>
                  <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'user' })}
                  className={`p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center space-y-3 ${
                    formData.role === 'user'
                      ? 'border-[#4C82F7] bg-[#4C82F7]/5 shadow-md scale-105'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Heart className={`w-7 h-7 ${formData.role === 'user' ? 'text-[#4C82F7]' : 'text-gray-400'}`} />
                  <span className={`text-sm font-bold ${formData.role === 'user' ? 'text-[#4C82F7]' : 'text-gray-700'}`}>
                    Customer
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'business_owner' })}
                  className={`p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center space-y-3 ${
                    formData.role === 'business_owner'
                      ? 'border-[#4C82F7] bg-[#4C82F7]/5 shadow-md scale-105'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Store className={`w-7 h-7 ${formData.role === 'business_owner' ? 'text-[#4C82F7]' : 'text-gray-400'}`} />
                  <span className={`text-sm font-bold ${formData.role === 'business_owner' ? 'text-[#4C82F7]' : 'text-gray-700'}`}>
                    Business Owner
                  </span>
                </button>
              </div>
            </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#4C82F7] focus:ring-4 focus:ring-[#4C82F7]/10 outline-none transition-all duration-300 text-gray-800 placeholder-gray-400 font-medium"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#4C82F7] focus:ring-4 focus:ring-[#4C82F7]/10 outline-none transition-all duration-300 text-gray-800 placeholder-gray-400 font-medium"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#4C82F7] focus:ring-4 focus:ring-[#4C82F7]/10 outline-none transition-all duration-300 text-gray-800 placeholder-gray-400 font-medium"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#4C82F7] focus:ring-4 focus:ring-[#4C82F7]/10 outline-none transition-all duration-300 text-gray-800 placeholder-gray-400 font-medium"
                      placeholder="••••••••"
                    />
                  </div>
                  
                  {/* Password Requirements Indicator */}
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
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 py-4 bg-gradient-to-r from-[#4C82F7] to-[#6B9FFF] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>Create Account</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600 font-medium">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#4C82F7] hover:text-[#6B9FFF] font-bold transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>

              {/* Footer Links */}
              <div className="mt-8 text-center text-sm text-gray-500 space-x-4">
                <button className="hover:text-[#4C82F7] transition-colors font-semibold">Privacy</button>
                <span>•</span>
                <button className="hover:text-[#4C82F7] transition-colors font-semibold">Terms</button>
                <span>•</span>
                <button className="hover:text-[#4C82F7] transition-colors font-semibold">Support</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
