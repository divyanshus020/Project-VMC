import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, Shield, BarChart3, Users, DollarSign, TrendingUp, LogOut } from 'lucide-react';

// Simulated routing state
const useRouter = () => {
  const [currentRoute, setCurrentRoute] = useState('/login');
  
  const navigate = (path) => {
    setCurrentRoute(path);
  };
  
  return { currentRoute, navigate };
};

// Admin Dashboard Component
const AdminDashboard = ({ onLogout }) => {
  const stats = [
    { title: 'Total Users', value: '2,547', change: '+12%', icon: Users, color: 'blue' },
    { title: 'Revenue', value: '$45,230', change: '+8%', icon: DollarSign, color: 'green' },
    { title: 'Orders', value: '1,234', change: '+23%', icon: BarChart3, color: 'purple' },
    { title: 'Growth', value: '15.3%', change: '+5%', icon: TrendingUp, color: 'orange' }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-800">Admin Dashboard</h1>
              <p className="text-slate-600 text-lg">Welcome back, Administrator</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: { bg: 'bg-blue-50 border-blue-200', icon: 'text-blue-600', badge: 'bg-blue-500' },
              green: { bg: 'bg-green-50 border-green-200', icon: 'text-green-600', badge: 'bg-green-500' },
              purple: { bg: 'bg-purple-50 border-purple-200', icon: 'text-purple-600', badge: 'bg-purple-500' },
              orange: { bg: 'bg-orange-50 border-orange-200', icon: 'text-orange-600', badge: 'bg-orange-500' }
            };
            
            return (
              <div
                key={index}
                className={`${colorClasses[stat.color].bg} border-2 ${colorClasses[stat.color].bg.includes(stat.color) ? colorClasses[stat.color].bg.replace('50', '200').replace('bg-', 'border-') : ''} rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`w-8 h-8 ${colorClasses[stat.color].icon}`} />
                  <span className={`${colorClasses[stat.color].badge} text-white text-sm font-semibold px-3 py-1 rounded-full`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-slate-600 text-sm font-medium mb-2">{stat.title}</h3>
                <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
              </div>
            );
          })}
        </div>
        
        {/* Additional Content */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { action: 'New user registered', time: '2 minutes ago', type: 'success' },
                { action: 'Order #1234 completed', time: '5 minutes ago', type: 'info' },
                { action: 'Payment processed', time: '10 minutes ago', type: 'success' },
                { action: 'System backup completed', time: '1 hour ago', type: 'info' }
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className={`w-3 h-3 rounded-full ${activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                  <div className="flex-1">
                    <p className="text-slate-800 font-medium">{activity.action}</p>
                    <p className="text-slate-500 text-sm">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Add User', icon: Users, color: 'blue' },
                { label: 'View Reports', icon: BarChart3, color: 'green' },
                { label: 'Settings', icon: Shield, color: 'purple' },
                { label: 'Analytics', icon: TrendingUp, color: 'orange' }
              ].map((action, i) => {
                const Icon = action.icon;
                return (
                  <button
                    key={i}
                    className={`p-4 rounded-xl border-2 border-${action.color}-200 bg-${action.color}-50 hover:bg-${action.color}-100 transition-all duration-300 group`}
                  >
                    <Icon className={`w-6 h-6 text-${action.color}-600 mx-auto mb-2`} />
                    <p className={`text-${action.color}-800 font-medium text-sm`}>{action.label}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Login Component
const AdminLogin = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
    setLoginError('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setLoginError('');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple validation - in real app, this would be API call
    if (formData.username === 'admin' && formData.password === 'admin123') {
      onLogin();
    } else {
      setLoginError('Invalid username or password. Try: admin/admin123');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
        </div>
        
        <div className="relative bg-white backdrop-blur-lg bg-opacity-90 rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center text-white">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Admin Portal</h1>
            <p className="text-blue-100">Secure administrative access</p>
          </div>

          {/* Form */}
          <div className="p-8">
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 animate-fade-in">
                <p className="text-sm font-medium">{loginError}</p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange('username')}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                      errors.username ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                    placeholder="Enter your username"
                  />
                </div>
                {errors.username && (
                  <p className="text-red-500 text-sm mt-2 font-medium">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                      errors.password ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-2 font-medium">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>

            {/* Demo Credentials */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-sm text-slate-600 font-semibold mb-2">Demo Credentials</p>
                <p className="text-xs text-slate-500">
                  Username: <span className="font-bold text-slate-700">admin</span> | 
                  Password: <span className="font-bold text-slate-700">admin123</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component with Routing
const App = () => {
  const { currentRoute, navigate } = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };

  // Route rendering
  const renderRoute = () => {
    if (currentRoute === '/login' || !isAuthenticated) {
      return <AdminLogin onLogin={handleLogin} />;
    }
    
    if (currentRoute === '/dashboard' && isAuthenticated) {
      return <AdminDashboard onLogout={handleLogout} />;
    }
    
    // Default to login
    return <AdminLogin onLogin={handleLogin} />;
  };

  return (
    <div className="min-h-screen">
      {renderRoute()}
    </div>
  );
};

export default App;