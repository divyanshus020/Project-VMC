import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Shield } from 'lucide-react';
import { loginAdmin } from '../lib/api';

const AdminLogin = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    setLoginError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Min 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setLoginError('');

    try {
      const response = await loginAdmin({ 
        email: formData.email, 
        password: formData.password 
      });
      
      // Check if login was successful
      if (response.success) {
        // Store admin token and data
        if (response.token) {
          localStorage.setItem('adminToken', response.token);
        }
        if (response.admin) {
          localStorage.setItem('adminData', JSON.stringify(response.admin));
        }
        
        // Call the onLogin callback if provided
        if (onLogin) {
          onLogin(response.admin);
        }
        
        // Navigate to admin dashboard
        navigate('/admin/dashboard', { replace: true });
        
      } else {
        // Handle failed login
        setLoginError(response.error || 'Login failed');
      }
      
    } catch (err) {
      console.error('Login error:', err);
      setLoginError(
        err?.response?.data?.message || 
        err?.message || 
        'An error occurred during login'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md relative bg-white backdrop-blur-lg bg-opacity-90 rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center text-white">
          <div className="w-20 h-20 bg-white/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Shield className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Admin Portal</h1>
          <p>Secure administrative access</p>
        </div>

        <form className="p-8" onSubmit={handleSubmit}>
          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              <p className="text-sm font-medium">{loginError}</p>
            </div>
          )}
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email 
                      ? 'border-red-300 bg-red-50 focus:border-red-500' 
                      : 'border-slate-200 bg-white hover:border-slate-300 focus:border-blue-500'
                  }`}
                  placeholder="Enter your admin email"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  className={`w-full pl-12 pr-12 py-4 rounded-xl border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password 
                      ? 'border-red-300 bg-red-50 focus:border-red-500' 
                      : 'border-slate-200 bg-white hover:border-slate-300 focus:border-blue-500'
                  }`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-200 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Secure admin access only
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
