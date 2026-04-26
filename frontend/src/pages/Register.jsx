//register

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Alert from '@/components/Alert';
import { authAPI } from '@/services/api';
import logo from '@/assets/logo.png'; 

const InputField = ({ label, name, type = 'text', value, onChange, error, placeholder }) => (
  <div className="space-y-1">
    <label className="block text-sm font-semibold text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2 bg-gray-50 border ${error ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm`}
    />
    {error && <p className="text-red-500 text-[10px] mt-0.5 font-bold">{error}</p>}
  </div>
);

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '',
    confirmPassword: '', phone: '', address: '', birthDate: '', agreeTerms: false,
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Required';
    if (!formData.email.trim()) newErrors.email = 'Required';
    if (formData.password.length < 6) newErrors.password = 'Min 6 chars';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Mismatch';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await authAPI.registerResident({
        first_name: formData.firstName, last_name: formData.lastName,
        email: formData.email, phone: formData.phone || null,
        birth_date: formData.birthDate, address: formData.address, password: formData.password,
      });
      const resident = response.data.data;
      login({ id: resident.id, name: `${resident.first_name} ${resident.last_name}`, email: resident.email, role: 'resident' });
      setAlert({ type: 'success', message: 'Account created!' });
      setTimeout(() => navigate('/resident-dashboard'), 1500);
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 py-12">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-2xl overflow-hidden">
        {/* Adjusted Logo Header Area */}
        <div className="pt-12 pb-4 px-8 text-center">
          <div className="mb-6 inline-flex">
            <img 
              src={logo} 
              alt="Simplipika Logo" 
              className="w-40 h-auto object-contain" 
              onError={(e) => e.target.src = 'https://via.placeholder.com/120?text=Logo'} 
            />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Create Account</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Join the Social Assistance network</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} error={errors.firstName} placeholder="Ivan" />
            <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} error={errors.lastName} placeholder="Dequiros" />
            <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} error={errors.email} placeholder="ivan@example.com" />
            <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="0912..." />
            <InputField label="Date of Birth" name="birthDate" type="date" value={formData.birthDate} onChange={handleInputChange} />
            <InputField label="Address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Full Address" />
            <InputField label="Password" name="password" type="password" value={formData.password} onChange={handleInputChange} error={errors.password} />
            <InputField label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} error={errors.confirmPassword} />
          </div>

          <div className="mt-10">
            <label className="flex items-start gap-3 cursor-pointer group mb-6">
              <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleInputChange} className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600" />
              <span className="text-xs text-gray-500 leading-relaxed">
                I agree to the <a href="#" className="text-blue-600 font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 font-bold hover:underline">Privacy Policy</a>
              </span>
            </label>

            <button type="submit" disabled={loading} className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-lg transition-all shadow-lg">
              {loading ? 'Processing...' : 'Register Account'}
            </button>
          </div>
        </form>

        <div className="bg-gray-50 border-t border-gray-100 py-6 text-center">
          <p className="text-xs text-gray-500 font-medium">
            Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;



