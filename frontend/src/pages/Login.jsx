import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Alert from '@/components/Alert';
import { authAPI } from '@/services/api';
import logo from '@/assets/logo.png'; 

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formData.role === 'admin') {
        if (formData.email === 'admin@sia.com' && formData.password === 'admin123') {
          login({ id: 1, name: 'Administrator', email: formData.email, role: 'admin' });
          setAlert({ type: 'success', message: 'Login successful!' });
          setTimeout(() => navigate('/'), 1500);
        } else {
          setAlert({ type: 'error', message: 'Invalid admin credentials' });
        }
      } else {
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
      setAlert({ type: 'error', message: error.response?.data?.message || 'Invalid credentials' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-md overflow-hidden">
        {/* Adjusted Logo and Header Area */}
        <div className="pt-12 pb-6 px-8 text-center bg-white">
          <div className="mb-6 inline-flex">
            <img 
              src={logo} 
              alt="Simplipika Logo" 
              className="w-48 h-auto object-contain" 
              onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=Logo'} 
            />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">SIA System</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Social Assistance Information System</p>
        </div>

        <div className="px-8 pb-8">
          {alert && (
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-0 border border-gray-100 rounded-lg overflow-hidden bg-gray-50 p-1">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'admin' })}
                  className={`py-2.5 text-xs font-bold rounded-md transition-all ${
                    formData.role === 'admin' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Administrator
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'resident' })}
                  className={`py-2.5 text-xs font-bold rounded-md transition-all ${
                    formData.role === 'resident' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Resident
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm"
                  placeholder="admin@sia.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md shadow-blue-100 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>

        <div className="bg-gray-50 border-t border-gray-100 py-6 text-center">
          <p className="text-xs text-gray-500 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-bold">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;


