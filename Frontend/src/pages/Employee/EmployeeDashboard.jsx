import React, { useState } from 'react';
import EmployeeSidebar from '../../components/EmployeeSidebar';
import { DashboardHeader, RoleBasedNav } from '../../components/DashboardComponents';
import { useAuth } from '../../context/AuthContext';
import { Clock, Calendar, FileText, User } from 'lucide-react';

const EmployeeDashboard = () => {
  const { role, user } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');

  const stats = [
    { label: 'Hours This Week', value: '40h', icon: Clock, color: 'from-blue-500 to-cyan-600' },
    { label: 'Attendance Rate', value: '96%', icon: Calendar, color: 'from-green-500 to-emerald-600' },
    { label: 'Pending Requests', value: '2', icon: FileText, color: 'from-orange-500 to-red-600' },
    { label: 'Profile Status', value: 'Active', icon: User, color: 'from-purple-500 to-pink-600' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <EmployeeSidebar 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          title="My Dashboard" 
          subtitle="View your profile and attendance information"
        />
        <RoleBasedNav role={role} />

        <div className="flex-1 overflow-y-auto p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-4 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Welcome Message */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome, {user?.name || user?.email || 'Employee'}!</h2>
            <p className="text-gray-600 mb-6">
              This is your personal dashboard where you can view your attendance records, manage your profile, and track your applications.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">👤 My Profile</h3>
                <p className="text-sm text-blue-700">View and update your information</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">📋 Attendance</h3>
                <p className="text-sm text-green-700">Check your attendance history</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                Check In
              </button>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium">
                View Profile
              </button>
              <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium">
                My Applications
              </button>
              <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm font-medium">
                View Details
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
