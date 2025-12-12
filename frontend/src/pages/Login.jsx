import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogIn, Mail, Lock, AlertCircle, Store, TrendingUp, Users, Shield, Check } from 'lucide-react';
import logo from '../assets/Print_Transparent.svg';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Floating Geometric Shapes - Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-[#4C82F7]/20 to-[#6B9FFF]/10 rounded-full blur-3xl"></div>
        
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-purple-200/30 to-pink-200/20 rounded-full blur-3xl"></div>
        
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-[#4C82F7]/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/3 left-1/3 w-40 h-40 bg-indigo-200/20 rounded-full blur-2xl"></div>
        
        <div className="absolute top-20 right-1/3 w-24 h-24 border-2 border-[#4C82F7]/10 rounded-2xl rotate-12"></div>
        <div className="absolute bottom-40 right-20 w-16 h-16 border-2 border-purple-300/30 rounded-xl rotate-45"></div>
        <div className="absolute top-1/2 left-20 w-20 h-20 border-2 border-pink-300/20 rounded-2xl -rotate-12"></div>
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

            {/* Hero Headline */}
            <h1 className="text-5xl font-extrabold text-gray-900 mb-5 leading-tight">
              Empowering Local<br />
              <span className="bg-gradient-to-r from-[#4C82F7] to-[#6B9FFF] bg-clip-text text-transparent">
                Businesses
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed font-medium">
              Connect, Discover, and Grow with our<br />Community Marketplace
            </p>

            {/* Feature List */}
            <div className="space-y-4 mb-8">
              {[
                { icon: TrendingUp, text: 'Real-time analytics and insights' },
                { icon: Users, text: 'Connect with thousands of customers' },
                { icon: Shield, text: 'Secure and trusted platform' }
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-3 group">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#4C82F7]/10 rounded-xl flex items-center justify-center group-hover:bg-[#4C82F7]/20 transition-colors">
                    <feature.icon className="w-5 h-5 text-[#4C82F7]" />
                  </div>
                  <span className="text-base text-gray-700 font-semibold">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: '500+', label: 'Businesses' },
                { value: '10K+', label: 'Users' },
                { value: '50K+', label: 'Connections' }
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-2xl font-extrabold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-600 font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Card */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16 relative z-10">
          <div className="w-full max-w-md">
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

            {/* Login Card */}
            <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 p-10">
              <div className="mb-10">
                <h2 className="text-4xl font-extrabold text-gray-900 mb-3">
                  Welcome Back
                </h2>
                <p className="text-gray-600 text-lg font-medium">Sign in to access your dashboard</p>
              </div>

              {error && (
                <div className="mb-8 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700 font-semibold">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
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

                {/* Remember Me */}
                <div className="flex items-center">
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:bg-[#4C82F7] peer-checked:border-[#4C82F7] transition-all flex items-center justify-center">
                        {formData.rememberMe && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-[#4C82F7] transition-colors">
                      Remember me
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-[#4C82F7] to-[#6B9FFF] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      <span>Sign In</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600 font-medium">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-[#4C82F7] hover:text-[#6B9FFF] font-bold transition-colors">
                    Create one now
                  </Link>
                </p>
              </div>
            </div>

            {/* Footer Links - Mobile */}
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
  );
};

export default Login;
