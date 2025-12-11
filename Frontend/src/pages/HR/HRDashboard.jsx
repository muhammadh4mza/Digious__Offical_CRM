import React, { useState } from 'react';
import HrSidebar from '../../components/HrSidebar';
import { DashboardHeader, RoleBasedNav } from '../../components/DashboardComponents';
import { useAuth } from '../../context/AuthContext';
import { Users, Calendar, FileText, TrendingUp } from 'lucide-react';

const HRDashboard = () => {
  const { role } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');

  const stats = [
    { label: 'Total Team Members', value: '48', icon: Users, color: 'from-blue-500 to-cyan-600' },
    { label: 'Present Today', value: '45', icon: Calendar, color: 'from-green-500 to-emerald-600' },
    { label: 'Pending Applications', value: '8', icon: FileText, color: 'from-orange-500 to-red-600' },
    { label: 'Avg Attendance', value: '94%', icon: TrendingUp, color: 'from-purple-500 to-pink-600' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <HrSidebar 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          title="HR Dashboard" 
          subtitle="Manage your team and monitor attendance"
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to HR Portal</h2>
            <p className="text-gray-600 mb-6">
              Manage your team efficiently with comprehensive tools for attendance tracking, employee management, and application processing.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">👥 Team Management</h3>
                <p className="text-sm text-blue-700">View and manage team members</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">📋 Attendance</h3>
                <p className="text-sm text-green-700">Monitor attendance records</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                Mark Attendance
              </button>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium">
                View Team
              </button>
              <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium">
                Process Applications
              </button>
              <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm font-medium">
                Generate Reports
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
