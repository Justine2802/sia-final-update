import React, { useEffect, useState } from 'react';
import { Users, BookOpen, AlertCircle, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { residentsAPI, programsAPI, incidentsAPI, certificatesAPI } from '@/services/api';

function ResidentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    enrollments: 0,
    incidents: 0,
    certificates: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // For demo: show sample data
        setStats({
          enrollments: 2,
          incidents: 0,
          certificates: 1,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center gap-4">
      <div className={`p-4 rounded-lg ${color}`}>
        <Icon size={32} className="text-white" />
      </div>
      <div>
        <p className="text-gray-600 text-sm">{label}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {user?.name}!</h1>
      <p className="text-gray-600 mb-8">Here's your social assistance information</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={BookOpen}
          label="Active Programs"
          value={stats.enrollments}
          color="bg-green-500"
        />
        <StatCard
          icon={AlertCircle}
          label="Incidents"
          value={stats.incidents}
          color="bg-orange-500"
        />
        <StatCard
          icon={Award}
          label="Certificates"
          value={stats.certificates}
          color="bg-purple-500"
        />
      </div>

      {/* My Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">My Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Name</p>
            <p className="text-lg font-medium text-gray-800">{user?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Email</p>
            <p className="text-lg font-medium text-gray-800">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Account Type</p>
            <p className="text-lg font-medium text-gray-800 capitalize">{user?.role}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Member Since</p>
            <p className="text-lg font-medium text-gray-800">April 2026</p>
          </div>
        </div>
      </div>

      {/* Programs Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">My Programs</h2>
        <div className="space-y-3">
          <div className="border-l-4 border-green-500 pl-4 py-3">
            <h3 className="font-semibold text-gray-800">Senior Citizen Pension</h3>
            <p className="text-sm text-gray-600">Status: <span className="badge badge-success">Active</span></p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4 py-3">
            <h3 className="font-semibold text-gray-800">Rice Distribution</h3>
            <p className="text-sm text-gray-600">Status: <span className="badge badge-success">Active</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResidentDashboard;
