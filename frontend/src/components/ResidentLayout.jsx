import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from './Header';
import Loading from './Loading';

function ResidentLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => {}} user={user} />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default ResidentLayout;
