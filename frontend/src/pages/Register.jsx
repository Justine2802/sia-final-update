import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Alert from '@/components/Alert';
import { UserPlus } from 'lucide-react';
import { authAPI } from '@/services/api';

const FormField = ({ label, name, type = 'text', placeholder, required = false, error, value, onChange }) => (
  <div className="form-group">
    <label className="form-label">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`form-input ${error ? 'border-red-500' : ''}`}
    />
    {error && <p className="error-message">{error}</p>}
  </div>
);

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    birthDate: '',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (formData.birthDate && new Date(formData.birthDate) > new Date()) {
      newErrors.birthDate = 'Birth date cannot be in the future';
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setAlert({ type: 'error', message: 'Please correct the errors below' });
      return;
    }

    setLoading(true);

    try {
      // Call backend API to register resident
      const response = await authAPI.registerResident({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone || null,
        birth_date: formData.birthDate,
        address: formData.address,
        password: formData.password,
      });

      // Auto-login the new resident
      const resident = response.data.data;
      login({
        id: resident.id,
        name: `${resident.first_name} ${resident.last_name}`,
        email: resident.email,
        role: 'resident',
      });

      setAlert({ type: 'success', message: 'Registration successful! Redirecting...' });
      setTimeout(() => navigate('/resident-dashboard'), 1500);
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      setAlert({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4 inline-flex">
            <UserPlus size={40} className="text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Register</h1>
          <p className="text-green-100">Create your Social Assistance Account</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}

          <form onSubmit={handleSubmit}>
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField
                label="First Name"
                name="firstName"
                placeholder="John"
                required
                error={errors.firstName}
                value={formData.firstName}
                onChange={handleInputChange}
              />
              <FormField
                label="Last Name"
                name="lastName"
                placeholder="Doe"
                required
                error={errors.lastName}
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>

            {/* Email */}
            <FormField
              label="Email Address"
              name="email"
              type="email"
              placeholder="your@email.com"
              required
              error={errors.email}
              value={formData.email}
              onChange={handleInputChange}
            />

            {/* Phone */}
            <FormField
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="+63 912 345 6789"
              error={errors.phone}
              value={formData.phone}
              onChange={handleInputChange}
            />

            {/* Birth Date */}
            <FormField
              label="Date of Birth"
              name="birthDate"
              type="date"
              error={errors.birthDate}
              value={formData.birthDate}
              onChange={handleInputChange}
            />

            {/* Address */}
            <div className="form-group mb-4">
              <label className="form-label">Address</label>
              <textarea
                name="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleInputChange}
                className="form-textarea"
                rows="2"
              />
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                error={errors.password}
                value={formData.password}
                onChange={handleInputChange}
              />
              <FormField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                error={errors.confirmPassword}
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm">
              <p className="font-semibold text-gray-800 mb-2">Password Requirements:</p>
              <ul className="text-gray-700 space-y-1">
                <li>✓ At least 6 characters long</li>
                <li>✓ Match in both fields</li>
              </ul>
            </div>

            {/* Terms Checkbox */}
            <div className="mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className={`w-4 h-4 rounded ${errors.agreeTerms ? 'border-red-500' : ''}`}
                />
                <span className="text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.agreeTerms && <p className="error-message mt-1">{errors.agreeTerms}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-lg transition-colors mb-4"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            {/* Login Link */}
            <p className="text-center text-gray-600 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                Login here
              </Link>
            </p>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-600 text-sm mt-6">
            Your information is secure and protected
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
