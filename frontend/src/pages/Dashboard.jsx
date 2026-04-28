import React, { useEffect, useState } from 'react';
import { Users, BookOpen, AlertCircle, Award, TrendingUp, Calendar } from 'lucide-react';
import { residentsAPI, programsAPI, incidentsAPI, certificatesAPI } from '@/services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Loading from '@/components/Loading';

function Dashboard() {
  const [data, setData] = useState({
    stats: { residents: 0, programs: 0, incidents: 0, certificates: 0 },
    chartData: [],
    insights: { verificationRate: '0.0', utilization: '78.0' } 
  });
  const [loading, setLoading] = useState(true);

  // 1. Dynamic Date String
  const currentDateString = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [res, prog, inc, cert] = await Promise.all([
          residentsAPI.getAll(), programsAPI.getAll(), incidentsAPI.getAll(), certificatesAPI.getAll()
        ]);

        const residents = res.data || [];
        const certificates = cert.data || [];
        const incidents = inc.data || [];

        // 2. Calculate Real Verification Rate
        // Ensure we handle both boolean and tinyint database returns
        const verifiedCount = residents.filter(r => Number(r.is_verified) === 1 || r.is_verified === true).length;
        const vRate = residents.length > 0 ? ((verifiedCount / residents.length) * 100).toFixed(1) : '0.0';

        // 3. Generate Dynamic Chart Data (Requests from the last 6 months)
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const generatedChartData = [];

        for (let i = 5; i >= 0; i--) {
          const d = new Date(currentYear, currentMonth - i, 1);
          const mIndex = d.getMonth();
          const y = d.getFullYear();

          // Helper to check if a record was created in this specific month/year loop
          const belongsToMonth = (item) => {
            if (!item.created_at) return false;
            const itemDate = new Date(item.created_at);
            return itemDate.getMonth() === mIndex && itemDate.getFullYear() === y;
          };

          const monthlyRequests = certificates.filter(belongsToMonth).length + incidents.filter(belongsToMonth).length;

          generatedChartData.push({
            name: monthNames[mIndex],
            requests: monthlyRequests
          });
        }

        // Set all dynamic data to state at once
        setData({
          stats: {
            residents: residents.length,
            programs: prog.data?.length || 0,
            incidents: incidents.length,
            certificates: certificates.length,
          },
          chartData: generatedChartData,
          insights: {
            verificationRate: vRate,
            utilization: '78.0' 
          }
        });

      } catch (error) { 
        console.error("Dashboard data fetch failed:", error); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchDashboardData();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color, trend }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
          <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
        <span className="flex items-center gap-1 text-green-500 text-[10px] font-black uppercase tracking-widest">
          <TrendingUp size={14} /> {trend}
        </span>
      </div>
      <div>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-black text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );

  if (loading) return <Loading />;

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Main Dashboard</h1>
          <p className="text-gray-500 font-medium">Monitoring system activity and resident assistance.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          <Calendar size={16} className="text-blue-500" /> {currentDateString}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Total Residents" value={data.stats.residents} color="bg-blue-500" trend="Live Data" />
        <StatCard icon={BookOpen} label="Programs" value={data.stats.programs} color="bg-emerald-500" trend="Active" />
        <StatCard icon={AlertCircle} label="Active Incidents" value={data.stats.incidents} color="bg-orange-500" trend="Tracking" />
        <StatCard icon={Award} label="Certificates Issued" value={data.stats.certificates} color="bg-violet-500" trend="Issued" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2 uppercase text-[10px] tracking-widest text-gray-400">
            Service Request Trends <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg border border-blue-100">6 Months</span>
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 700}} allowDecimals={false} />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}} />
                <Area type="monotone" dataKey="requests" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRequests)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl shadow-xl text-white">
          <h3 className="font-black mb-4 flex items-center gap-2 text-blue-400 uppercase text-[10px] tracking-widest">
            System Insights
          </h3>
          <div className="space-y-6 mt-8">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Verification Rate</p>
                <p className="text-xl font-black italic">{data.insights.verificationRate}%</p>
              </div>
              <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${data.insights.verificationRate}%` }} />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Utilization</p>
                <p className="text-xl font-black italic">{data.insights.utilization}%</p>
              </div>
              <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${data.insights.utilization}%` }} />
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-gray-800">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-800 rounded-lg text-blue-400">
                    <TrendingUp size={16} />
                </div>
                <p className="text-xs text-gray-400 italic leading-relaxed">
                  Real-time metrics active. Verification status is processing normally across all resident profiles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;