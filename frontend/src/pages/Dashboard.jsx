import React, { useEffect, useState } from 'react';
import { Users, BookOpen, AlertCircle, Award, TrendingUp, Calendar } from 'lucide-react';
import { residentsAPI, programsAPI, incidentsAPI, certificatesAPI } from '@/services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Loading from '@/components/Loading';

function Dashboard() {
  const [stats, setStats] = useState({ residents: 0, programs: 0, incidents: 0, certificates: 0 });
  const [loading, setLoading] = useState(true);

  // Mock data for charts
  const chartData = [
    { name: 'Jan', requests: 12 }, { name: 'Feb', requests: 19 }, { name: 'Mar', requests: 15 },
    { name: 'Apr', requests: 22 }, { name: 'May', requests: 30 }, { name: 'Jun', requests: 25 },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [res, prog, inc, cert] = await Promise.all([
          residentsAPI.getAll(), programsAPI.getAll(), incidentsAPI.getAll(), certificatesAPI.getAll()
        ]);
        setStats({
          residents: res.data?.length || 0,
          programs: prog.data?.length || 0,
          incidents: inc.data?.length || 0,
          certificates: cert.data?.length || 0,
        });
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color, trend }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
          <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
        <span className="flex items-center gap-1 text-green-500 text-xs font-bold">
          <TrendingUp size={14} /> {trend}
        </span>
      </div>
      <div>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-black text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );

  if (loading) return <Loading />;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Main Dashboard</h1>
          <p className="text-gray-500 font-medium">Monitoring system activity and resident assistance.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-sm font-bold text-gray-600">
          <Calendar size={16} /> April 2026
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Total Residents" value={stats.residents} color="bg-blue-500" trend="+12%" />
        <StatCard icon={BookOpen} label="Programs" value={stats.programs} color="bg-emerald-500" trend="+2%" />
        <StatCard icon={AlertCircle} label="Active Incidents" value={stats.incidents} color="bg-orange-500" trend="Stable" />
        <StatCard icon={Award} label="Certificates Issued" value={stats.certificates} color="bg-violet-500" trend="+18%" />
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            Service Request Trends <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full uppercase">Monthly</span>
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Area type="monotone" dataKey="requests" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRequests)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg text-white">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-blue-400 uppercase text-xs tracking-widest">
            System Insights
          </h3>
          <div className="space-y-6 mt-8">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-gray-400 text-xs">Resident Verification Rate</p>
                <p className="text-2xl font-bold">94.2%</p>
              </div>
              <div className="w-24 bg-gray-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[94%]"></div>
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-gray-400 text-xs">Program Utilization</p>
                <p className="text-2xl font-bold">78.0%</p>
              </div>
              <div className="w-24 bg-gray-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[78%]"></div>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-800">
              <p className="text-sm text-gray-300 italic font-medium leading-relaxed">
                "The current social assistance distribution is 15% more efficient than last quarter."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
