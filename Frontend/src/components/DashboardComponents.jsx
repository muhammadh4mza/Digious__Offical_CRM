import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home } from 'lucide-react';

export const DashboardHeader = ({ title, subtitle }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const roleInfo = {
    admin: { color: 'from-red-500 to-pink-600', label: 'Administrator' },
    hr: { color: 'from-blue-500 to-cyan-600', label: 'HR Manager' },
    employee: { color: 'from-green-500 to-emerald-600', label: 'Employee' }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user?.name || user?.email || 'User'}</p>
            <p className={`text-xs font-semibold bg-gradient-to-r ${roleInfo[role]?.color} bg-clip-text text-transparent`}>
              {roleInfo[role]?.label}
            </p>
          </div>

          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-semibold">
            {String(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
          </div>

          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title="Logout"
          >
            <LogOut className="w-5 h-5 text-gray-600 hover:text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const RoleBasedNav = ({ role }) => {
  const navigate = useNavigate();

  const navItems = {
    admin: [
      { id: 'dashboard', label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
      { id: 'sales', label: 'Sales Management', path: '/admin/sales', icon: '💼' },
      { id: 'attendance', label: 'Attendance', path: '/admin/attendance', icon: '📋' },
      { id: 'employees', label: 'Employees', path: '/admin/employees', icon: '👥' },
      { id: 'applications', label: 'Applications', path: '/admin/applications', icon: '📄' },
      { id: 'activity', label: 'Activity Tracker', path: '/admin/activity', icon: '⚡' }
    ],
    hr: [
      { id: 'dashboard', label: 'Dashboard', path: '/hr/dashboard', icon: '📊' },
      { id: 'attendance', label: 'Attendance', path: '/hr/attendance', icon: '📋' },
      { id: 'employees', label: 'Team', path: '/hr/employees', icon: '👥' },
      { id: 'applications', label: 'Applications', path: '/hr/applications', icon: '📄' }
    ],
    employee: [
      { id: 'dashboard', label: 'My Dashboard', path: '/employee/dashboard', icon: '📊' },
      { id: 'attendance', label: 'Attendance', path: '/employee/attendance', icon: '📋' },
      { id: 'profile', label: 'My Profile', path: '/employee/profile', icon: '👤' },
      { id: 'applications', label: 'My Applications', path: '/employee/applications', icon: '📄' }
    ]
  };

  const items = navItems[role] || [];

  return (
    <nav className="flex space-x-1 border-b border-gray-200 px-6">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => navigate(item.path)}
          className="px-4 py-4 text-sm font-medium text-gray-700 hover:text-blue-600 hover:border-b-2 hover:border-blue-600 transition border-b-2 border-transparent"
        >
          <span className="mr-2">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
};
