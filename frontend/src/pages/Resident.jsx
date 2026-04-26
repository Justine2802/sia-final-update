import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Phone, MapPin, Calendar, ShieldCheck } from 'lucide-react';

function ResidentPage() {
  const { user } = useAuth();

  const InfoBlock = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
      <div className="p-2.5 bg-white rounded-xl shadow-sm text-blue-600">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm font-bold text-gray-900">{value || 'Not provided'}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Profile</h1>
        <p className="text-gray-500 font-medium">Verify your official personal information.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Cover / Profile Header */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-8">
            <div className="w-24 h-24 rounded-3xl bg-white p-1.5 shadow-lg">
              <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-2xl">
                {user?.name.charAt(0)}
              </div>
            </div>
            <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl text-xs font-black border border-emerald-100 shadow-sm">
              <ShieldCheck size={16} /> VERIFIED CITIZEN
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoBlock icon={User} label="Full Name" value={user?.name} />
            <InfoBlock icon={Mail} label="Email Address" value={user?.email} />
            <InfoBlock icon={Phone} label="Contact Number" value="+63 912 345 6789" />
            <InfoBlock icon={Calendar} label="Date of Birth" value="May 15, 1990" />
            <InfoBlock icon={MapPin} label="Home Address" value="123 Main Street, Barangay, City" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResidentPage;




















