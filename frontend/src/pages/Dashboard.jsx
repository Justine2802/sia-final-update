import React, { useEffect, useState } from 'react';
import { Users, BookOpen, AlertCircle, Award } from 'lucide-react';
import { residentsAPI, programsAPI, incidentsAPI, certificatesAPI } from '@/services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    residents: 0,
    programs: 0,
    incidents: 0,
    certificates: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [resRes, progRes, incRes, certRes] = await Promise.all([
          residentsAPI.getAll(),
          programsAPI.getAll(),
          incidentsAPI.getAll(),
          certificatesAPI.getAll(),
        ]);

        setStats({
          residents: resRes.data?.length || 0,
          programs: progRes.data?.length || 0,
          incidents: incRes.data?.length || 0,
          certificates: certRes.data?.length || 0,
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          label="Total Residents"
          value={stats.residents}
          color="bg-blue-500"
        />
        <StatCard
          icon={BookOpen}
          label="Programs"
          value={stats.programs}
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

      {/* Quick Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">System Overview</h2>
        <p className="text-gray-600 mb-4">
          Welcome to the Social Assistance Information System. Manage residents, programs, incidents, and certificates from this dashboard.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Access comprehensive resident management tools
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Track social assistance programs and enrollments
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            Document and manage incident reports
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            Issue and track official certificates
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
