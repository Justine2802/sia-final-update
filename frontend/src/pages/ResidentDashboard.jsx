import React, { useEffect, useState } from 'react';
import { BookOpen, AlertCircle, Award, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { enrollmentsAPI, incidentsAPI, certificatesAPI } from '@/services/api';
import Loading from '@/components/Loading';
import { Link } from 'react-router-dom';

function ResidentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ enrollments: 0, incidents: 0, certificates: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real app, pass user.id to filter these calls
        setStats({ enrollments: 2, incidents: 0, certificates: 1 });
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5 transition-all hover:shadow-md">
      <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-opacity-100`}>
        <Icon size={28} className={color.replace('bg-', 'text-')} />
      </div>
      <div>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-black text-gray-900 leading-tight">{value}</p>
      </div>
    </div>
  );

  if (loading) return <Loading />;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Welcome, {user?.name.split(' ')[0]}!</h1>
          <p className="text-gray-500 font-medium mt-1">Check your latest social assistance records and status.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-gray-100 text-sm font-bold text-gray-600">
          <Calendar size={18} className="text-blue-500" /> {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard icon={BookOpen} label="Enrolled Programs" value={stats.enrollments} color="bg-emerald-500" />
        <StatCard icon={AlertCircle} label="Pending Incidents" value={stats.incidents} color="bg-orange-500" />
        <StatCard icon={Award} label="My Certificates" value={stats.certificates} color="bg-violet-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Snapshot */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-lg font-black text-gray-800">My Profile</h2>
            <Link to="/resident-profile" className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1">
              VIEW FULL PROFILE <ArrowRight size={14} />
            </Link>
          </div>
          <div className="p-8 grid grid-cols-2 gap-y-6">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Full Name</p>
              <p className="text-md font-bold text-gray-900">{user?.name}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email</p>
              <p className="text-md font-bold text-gray-900">{user?.email}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Account Type</p>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black rounded-md uppercase">
                {user?.role}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Member Since</p>
              <p className="text-md font-bold text-gray-900">April 2026</p>
            </div>
          </div>
        </div>

        {/* Recent Programs Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-lg font-black text-gray-800">My Programs</h2>
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">
              2 Active
            </span>
          </div>
          <div className="p-6 space-y-4">
            {[
              { name: 'Senior Citizen Pension', date: 'Applied March 2026', status: 'Active' },
              { name: 'Rice Distribution', date: 'Applied February 2026', status: 'Active' }
            ].map((prog, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm text-emerald-500">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{prog.name}</p>
                    <p className="text-xs text-gray-400 font-medium">{prog.date}</p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-emerald-600 uppercase bg-white px-2 py-1 rounded border border-emerald-100">
                  {prog.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResidentDashboard;



