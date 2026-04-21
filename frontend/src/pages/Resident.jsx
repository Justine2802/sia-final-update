import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

function ResidentPage() {
  const { user } = useAuth();
  const [residentData, setResidentData] = useState(null);

  useEffect(() => {
    // In production, fetch resident data from API
    setResidentData({
      id: user?.id,
      name: user?.name,
      email: user?.email,
      phone: '+63 912 345 6789',
      address: '123 Main Street, Barangay, City',
      birthDate: '1990-05-15',
      verified: true,
      enrollments: [
        {
          id: 1,
          program: 'Senior Citizen Pension',
          status: 'Approved',
          dateApplied: '2026-01-15',
        },
        {
          id: 2,
          program: 'Rice Distribution',
          status: 'Approved',
          dateApplied: '2026-02-20',
        },
      ],
      certificates: [
        {
          id: 1,
          type: 'Barangay Clearance',
          issuedAt: '2026-03-10',
          status: 'Issued',
        },
      ],
    });
  }, [user]);

  if (!residentData) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <p className="text-lg font-medium text-gray-800">{residentData.name}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Email Address</label>
            <p className="text-lg font-medium text-gray-800">{residentData.email}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Phone Number</label>
            <p className="text-lg font-medium text-gray-800">{residentData.phone}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Date of Birth</label>
            <p className="text-lg font-medium text-gray-800">{new Date(residentData.birthDate).toLocaleDateString()}</p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Address</label>
            <p className="text-lg font-medium text-gray-800">{residentData.address}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Account Status</label>
            <p className="text-lg font-medium">
              <span className={`badge ${residentData.verified ? 'badge-success' : 'badge-warning'}`}>
                {residentData.verified ? 'Verified' : 'Pending Verification'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Active Programs */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Active Programs</h2>
        {residentData.enrollments.length > 0 ? (
          <div className="space-y-3">
            {residentData.enrollments.map((enrollment) => (
              <div key={enrollment.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{enrollment.program}</h3>
                    <p className="text-sm text-gray-600">
                      Applied: {new Date(enrollment.dateApplied).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="badge badge-success">{enrollment.status}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">You are not enrolled in any programs yet.</p>
        )}
      </div>

      {/* Certificates */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">My Certificates</h2>
        {residentData.certificates.length > 0 ? (
          <div className="space-y-3">
            {residentData.certificates.map((cert) => (
              <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{cert.type}</h3>
                    <p className="text-sm text-gray-600">
                      Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="badge badge-success">{cert.status}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">You don't have any certificates yet.</p>
        )}
      </div>
    </div>
  );
}

export default ResidentPage;
