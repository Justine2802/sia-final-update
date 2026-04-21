import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Alert from '@/components/Alert';
import { LogIn } from 'lucide-react';
import { authAPI } from '@/services/api';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin', // admin or resident
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.role === 'admin') {
        if (formData.email === 'admin@sia.com' && formData.password === 'admin123') {
          login({
            id: 1,
            name: 'Administrator',
            email: formData.email,
            role: 'admin',
          });
          setAlert({ type: 'success', message: 'Login successful!' });
          setTimeout(() => navigate('/'), 1500);
        } else {
          setAlert({ type: 'error', message: 'Invalid admin credentials' });
        }
      } else {
        // Resident login - verify with backend
        const response = await authAPI.loginResident({
          email: formData.email,
          password: formData.password,
        });

        const resident = response.data.data;
        login({
          id: resident.id,
          name: `${resident.first_name} ${resident.last_name}`,
          email: resident.email,
          role: 'resident',
        });
        setAlert({ type: 'success', message: 'Login successful!' });
        setTimeout(() => navigate('/resident-dashboard'), 1500);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid credentials';
      setAlert({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4 inline-flex">
            <LogIn size={40} className="text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">SIA System</h1>
          <p className="text-blue-100">Social Assistance Information System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}

          <form onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Login As
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'admin' })}
                  className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                    formData.role === 'admin'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'resident' })}
                  className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                    formData.role === 'resident'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Resident
                </button>
              </div>
            </div>

            {/* Demo Credentials Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm">
              {formData.role === 'admin' ? (
                <>
                  <p className="font-semibold text-gray-800 mb-2">Demo Admin Credentials:</p>
                  <p className="text-gray-700">Email: <span className="font-mono">admin@sia.com</span></p>
                  <p className="text-gray-700">Password: <span className="font-mono">admin123</span></p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-gray-800 mb-2">Resident Login:</p>
                  <p className="text-gray-700">Use your registered email and password</p>
                </>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder={formData.role === 'admin' ? 'admin@sia.com' : 'your@email.com'}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder={formData.role === 'admin' ? 'admin123' : '••••••••'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors mb-4"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            {/* Register Link */}
            <p className="text-center text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:underline font-medium">
                Register here
              </Link>
            </p>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-600 text-sm mt-6">
            Protected by authentication system
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
