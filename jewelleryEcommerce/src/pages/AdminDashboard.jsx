import React, { useEffect, useState } from 'react';
import AdminNavbar from '../components/Navbar/AdminNavbar';
import { User } from 'lucide-react';

const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const admin = JSON.parse(localStorage.getItem('adminData')) || { name: 'Admin', role: 'Administrator' };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  };

  const formatTime = (date) => {
    return date.toLocaleTimeString();
  };

  return (
    <>
      {/* Navbar with background color */}
      <div className="bg-gradient-to-br from-slate-100 to-slate-200 px-4 py-8   shadow-lg">
        <AdminNavbar />
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4 py-8">
        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-white/80 rounded-3xl shadow-2xl p-8 mb-8 flex flex-col items-center relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full blur-2xl opacity-30"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-100 rounded-full blur-2xl opacity-30"></div>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-400 rounded-full p-3 shadow-lg">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold text-slate-800 mb-1">
                  Welcome, {admin.name || 'Admin'}!
                </h1>
                
                <p className="text-lg text-slate-600">
                  Role: <span className="font-semibold capitalize">{admin.role || 'Administrator'}</span>
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full mt-4">
              <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl px-6 py-3 text-slate-700 font-semibold text-lg shadow">
                {formatDate(currentTime)}
              </div>
              <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl px-6 py-3 text-slate-700 font-semibold text-2xl shadow">
                {formatTime(currentTime)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
