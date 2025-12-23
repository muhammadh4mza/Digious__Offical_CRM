import { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle,
  Clock,
  LogIn,
  LogOut,
  Calculator,
  Scale,
  Check,
  X,
  Clock4,
  Cigarette,
  ToiletIcon,
  Calendar1,
  Utensils,
  Users,
  AlertCircle,
  BarChart3,
  PieChart,
  Download,
  Filter,
  Plus,
  Search,
  MoreVertical,
  Eye,
  Edit3,
  Trash2,
  ChevronDown,
  Settings,
  UserCheck,
  UserX,
  Send,
  Mail,
  Bell,
  Shield,
  Zap,
  Crown,
  Sun,
  Moon,
  ArrowLeft,
  ArrowRight,
  User,
  Target,
  Grid,
  List,
  MessageCircle,
  FileText,
  Activity,
  Wifi,
  Sparkle,
  RotateCcw,
  Building,
  ChevronUp,
  ArcElement,
  ShieldUser,
  Table,
  TrendingUp,
  LineChart,
  PauseCircle,
  Coffee
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart as ReLineChart, 
  Line, 
  PieChart as RePieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

// Custom hook for attendance management
export const useAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [systemAttendance, setSystemAttendance] = useState({
    checkedIn: false,
    checkInTime: null,
    checkOutTime: null,
    totalWorkingTime: 0,
    isOnBreak: false,
    lastUpdate: new Date(),
    status: 'pending'
  });

  const handleSystemCheckIn = () => {
    const now = new Date();
    const expectedStart = new Date();
    expectedStart.setHours(9, 15, 0, 0);
    
    const isLate = now > expectedStart;
    
    setSystemAttendance({
      checkedIn: true,
      checkInTime: now,
      checkOutTime: null,
      totalWorkingTime: 0,
      isOnBreak: false,
      lastUpdate: now,
      status: isLate ? 'late' : 'present'
    });

    // Add to attendance data
    const today = now.toISOString().split('T')[0];
    setAttendanceData(prev => {
      const existingIndex = prev.findIndex(day => day.date === today);
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          status: isLate ? 'late' : 'present',
          checkIn: now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          }),
          remarks: isLate ? 'Late arrival' : 'On time'
        };
        return updated;
      } else {
        return [...prev, {
          date: today,
          day: now.getDate(),
          status: isLate ? 'late' : 'present',
          checkIn: now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          }),
          checkOut: '-',
          hours: '0.0',
          remarks: isLate ? 'Late arrival' : 'On time'
        }];
      }
    });

    return {
      timeString: now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      isLate: isLate
    };
  };

  const handleSystemCheckOut = () => {
    const now = new Date();
    const hours = systemAttendance.totalWorkingTime / 60;
    
    setSystemAttendance(prev => ({
      ...prev,
      checkedIn: false,
      checkOutTime: now,
      lastUpdate: now
    }));

    // Update attendance data
    const today = now.toISOString().split('T')[0];
    setAttendanceData(prev => {
      const existingIndex = prev.findIndex(day => day.date === today);
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          checkOut: now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          }),
          hours: hours.toFixed(1),
          remarks: hours >= 9 ? 'Full day' : 'Short day'
        };
        return updated;
      }
      return prev;
    });

    return {
      timeString: now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      hours: hours.toFixed(1)
    };
  };

  const updateWorkingTime = () => {
    if (systemAttendance.checkedIn && !systemAttendance.isOnBreak) {
      const now = new Date();
      const diff = (now - systemAttendance.lastUpdate) / (1000 * 60);
      
      setSystemAttendance(prev => ({
        ...prev,
        totalWorkingTime: prev.totalWorkingTime + diff,
        lastUpdate: now
      }));

      // Update hours in attendance data
      const today = now.toISOString().split('T')[0];
      const hours = (systemAttendance.totalWorkingTime + diff) / 60;
      
      setAttendanceData(prev => {
        const existingIndex = prev.findIndex(day => day.date === today);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            hours: hours.toFixed(1)
          };
          return updated;
        }
        return prev;
      });
    }
  };

  const setBreakStatus = (isOnBreak) => {
    setSystemAttendance(prev => ({
      ...prev,
      isOnBreak: isOnBreak,
      lastUpdate: new Date()
    }));
  };

  const getTodayStatus = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayData = attendanceData.find(day => day.date === today);
    
    if (todayData) {
      return todayData;
    }

    return {
      date: today,
      day: new Date().getDate(),
      status: 'Not Checked In',
      checkIn: systemAttendance.checkInTime ? 
        systemAttendance.checkInTime.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }) : '-',
      checkOut: systemAttendance.checkOutTime ? 
        systemAttendance.checkOutTime.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }) : '-',
      hours: (systemAttendance.totalWorkingTime / 60).toFixed(1),
      remarks: systemAttendance.checkedIn ? 'Currently working' : 'Not checked in yet'
    };
  };

  const getAttendanceStats = () => {
    const present = attendanceData.filter(day => 
      day.status === 'present' || day.status === 'late'
    ).length;
    const absent = attendanceData.filter(day => day.status === 'absent').length;
    const late = attendanceData.filter(day => day.status === 'late').length;
    const workingDays = attendanceData.filter(day => 
      day.status !== 'off' && day.status !== 'Pending'
    ).length;
    
    const attendancePercentage = workingDays > 0 ? 
      Math.round((present / workingDays) * 100) : 0;

    return {
      present,
      absent,
      late,
      workingDays,
      attendancePercentage
    };
  };

  return {
    attendanceData,
    systemAttendance,
    handleSystemCheckIn,
    handleSystemCheckOut,
    updateWorkingTime,
    setBreakStatus,
    setAttendanceData,
    getTodayStatus,
    getAttendanceStats
  };
};

// Attendance Sheet Component with Month and Year Filters
const AttendanceSheet = ({ attendanceData, onExport, onFilter }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Get available years from attendance data
  const availableYears = [...new Set(attendanceData.map(record => 
    new Date(record.date).getFullYear()
  ))].sort((a, b) => b - a);

  // Get available months for selected year
  const availableMonths = [...new Set(attendanceData
    .filter(record => new Date(record.date).getFullYear() === selectedYear)
    .map(record => new Date(record.date).getMonth())
  )].sort((a, b) => a - b);

  // Month names for display
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Filter and sort attendance data with month and year filters
  const filteredData = attendanceData
    .filter(record => {
      const recordDate = new Date(record.date);
      const recordMonth = recordDate.getMonth();
      const recordYear = recordDate.getFullYear();
      
      const matchesMonthYear = recordMonth === selectedMonth && recordYear === selectedYear;
      const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
      const matchesSearch = record.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.remarks.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesMonthYear && matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'hours':
          aValue = parseFloat(a.hours);
          bValue = parseFloat(b.hours);
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'present':
        return { color: 'bg-green-100 text-green-800', text: 'Present' };
      case 'late':
        return { color: 'bg-yellow-100 text-yellow-800', text: 'Late' };
      case 'absent':
        return { color: 'bg-red-100 text-red-800', text: 'Absent' };
      case 'off':
        return { color: 'bg-gray-100 text-gray-800', text: 'Day Off' };
      default:
        return { color: 'bg-blue-100 text-blue-800', text: 'Pending' };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate monthly statistics
  const monthlyStats = {
    present: filteredData.filter(r => r.status === 'present').length,
    late: filteredData.filter(r => r.status === 'late').length,
    absent: filteredData.filter(r => r.status === 'absent').length,
    totalWorkingDays: filteredData.filter(r => r.status !== 'off' && r.status !== 'pending').length,
    totalHours: filteredData.reduce((total, record) => total + parseFloat(record.hours), 0),
    averageHours: filteredData.length > 0 ? 
      (filteredData.reduce((total, record) => total + parseFloat(record.hours), 0) / filteredData.length).toFixed(1) : 0
  };

  const exportToCSV = () => {
    const timestamp = new Date().toLocaleString();
    const employeeName = "MH"; // Replace with actual employee name from auth
    
    // CSV with metadata and summary
    const csvLines = [
      `"Digious CRM - Attendance Report"`,
      `"Generated:","${timestamp}"`,
      `"Employee:","${employeeName}"`,
      `"Period:","${monthNames[selectedMonth]} ${selectedYear}"`,
      `"Total Records:","${filteredData.length}"`,
      ``,
      `"Summary Statistics"`,
      `"Present Days:","${monthlyStats.present}"`,
      `"Late Arrivals:","${monthlyStats.late}"`,
      `"Absent Days:","${monthlyStats.absent}"`,
      `"Total Hours:","${monthlyStats.totalHours.toFixed(1)}"`,
      `"Average Hours/Day:","${monthlyStats.averageHours}"`,
      `"Attendance Rate:","${((monthlyStats.present / monthlyStats.totalWorkingDays) * 100).toFixed(1)}%"`,
      ``,
      `"Detailed Records"`,
      `"Date","Day","Status","Check In","Check Out","Hours","Remarks"`,
      ...filteredData.map(row => [
        `"${formatDate(row.date)}"`,
        `"${row.day}"`,
        `"${getStatusInfo(row.status).text}"`,
        `"${row.checkIn}"`,
        `"${row.checkOut}"`,
        `"${row.hours}"`,
        `"${row.remarks}"`
      ].join(','))
    ];

    const csvContent = csvLines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Digious-Attendance-${employeeName}-${monthNames[selectedMonth]}_${selectedYear}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    // Show success notification
    alert(`✅ Attendance report exported successfully!\n\nFile: Digious-Attendance-${employeeName}-${monthNames[selectedMonth]}_${selectedYear}.csv\nRecords: ${filteredData.length}`);
  };

  // Quick month navigation
  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Attendance Records</h3>
          <p className="text-sm text-gray-600">
            Showing {filteredData.length} records for {monthNames[selectedMonth]} {selectedYear}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Month Navigation */}
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Previous month"
            >
              <ArrowLeft className="h-4 w-4 text-gray-600" />
            </button>
            
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-2 py-1 border-0 focus:ring-0 text-sm font-medium"
            >
              {monthNames.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-2 py-1 border-0 focus:ring-0 text-sm font-medium"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <button
              onClick={() => navigateMonth('next')}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Next month"
            >
              <ArrowRight className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="all">All Status</option>
            <option value="present">Present</option>
            <option value="late">Late</option>
            <option value="absent">Absent</option>
            <option value="off">Day Off</option>
          </select>

          {/* Export Button with Dropdown */}
          <div className="relative group">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm font-medium"
            >
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <div className="py-1">
                <button
                  onClick={exportToCSV}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Export as CSV
                </button>
                <div className="w-full px-4 py-2 text-left text-sm text-gray-400 cursor-not-allowed flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Export as PDF (Soon)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Distribution Chart */}
        <div className="bg-white rounded-xl border border-blue-100 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <PieChart className="h-5 w-5 text-blue-600" />
              Attendance Distribution
            </h4>
            <span className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded">Monthly</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <RePieChart>
              <Pie
                data={[
                  { name: 'Present', value: monthlyStats.present, color: '#10b981' },
                  { name: 'Late', value: monthlyStats.late, color: '#f59e0b' },
                  { name: 'Absent', value: monthlyStats.absent, color: '#ef4444' },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {[
                  { name: 'Present', value: monthlyStats.present, color: '#10b981' },
                  { name: 'Late', value: monthlyStats.late, color: '#f59e0b' },
                  { name: 'Absent', value: monthlyStats.absent, color: '#ef4444' },
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Present ({monthlyStats.present})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Late ({monthlyStats.late})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Absent ({monthlyStats.absent})</span>
            </div>
          </div>
        </div>

        {/* Working Hours Trend */}
        <div className="bg-white rounded-xl border border-blue-100 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <LineChart className="h-5 w-5 text-blue-600" />
              Working Hours Trend
            </h4>
            <span className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded">Last 7 Days</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart
              data={filteredData.slice(-7).map(record => ({
                date: new Date(record.date).getDate(),
                hours: parseFloat(record.hours),
                status: record.status
              }))}
            >
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
                label={{ value: 'Date', position: 'insideBottom', offset: -5, style: { fontSize: 12, fill: '#6b7280' } }}
              />
              <YAxis 
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
                label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6b7280' } }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="hours" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorHours)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-5 border border-green-200 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-green-700 uppercase tracking-wide mb-1">Present Days</div>
              <div className="text-3xl font-bold text-green-900">{monthlyStats.present}</div>
              <div className="text-xs text-green-600 mt-1">
                {monthlyStats.totalWorkingDays > 0 
                  ? Math.round((monthlyStats.present / monthlyStats.totalWorkingDays) * 100)
                  : 0}% attendance
              </div>
            </div>
            <div className="bg-green-500 rounded-lg p-2 group-hover:scale-110 transition-transform">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-xl p-5 border border-yellow-200 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-yellow-700 uppercase tracking-wide mb-1">Late Arrivals</div>
              <div className="text-3xl font-bold text-yellow-900">{monthlyStats.late}</div>
              <div className="text-xs text-yellow-600 mt-1">Needs improvement</div>
            </div>
            <div className="bg-yellow-500 rounded-lg p-2 group-hover:scale-110 transition-transform">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-rose-100 rounded-xl p-5 border border-red-200 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-red-700 uppercase tracking-wide mb-1">Absent Days</div>
              <div className="text-3xl font-bold text-red-900">{monthlyStats.absent}</div>
              <div className="text-xs text-red-600 mt-1">Unplanned leaves</div>
            </div>
            <div className="bg-red-500 rounded-lg p-2 group-hover:scale-110 transition-transform">
              <X className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl p-5 border border-blue-200 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-blue-700 uppercase tracking-wide mb-1">Total Hours</div>
              <div className="text-3xl font-bold text-blue-900">{monthlyStats.totalHours.toFixed(0)}h</div>
              <div className="text-xs text-blue-600 mt-1">Avg: {monthlyStats.averageHours}h/day</div>
            </div>
            <div className="bg-blue-500 rounded-lg p-2 group-hover:scale-110 transition-transform">
              <Clock4 className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Performance Bar Chart */}
      <div className="bg-white rounded-xl border border-blue-100 p-6 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Daily Performance Overview
          </h4>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-xs text-gray-500">Last 14 Days</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={filteredData.slice(-14).map(record => ({
              date: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              hours: parseFloat(record.hours),
              target: 9,
              status: record.status
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              tick={{ fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              label={{ value: 'Hours Worked', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6b7280' } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Legend />
            <Bar dataKey="hours" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Hours Worked" />
            <Bar dataKey="target" fill="#10b981" radius={[8, 8, 0, 0]} name="Target (9h)" opacity={0.3} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl border border-blue-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-1">
                    📅 Date
                    {sortBy === 'date' && (
                      <ChevronDown className={`h-4 w-4 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">
                  📆 Day
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">
                  🎯 Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">
                  📍 Check In
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">
                  📤 Check Out
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => handleSort('hours')}
                >
                  <div className="flex items-center gap-1">
                    ⏱️ Hours
                    {sortBy === 'hours' && (
                      <ChevronDown className={`h-4 w-4 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">
                  📝 Remarks
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-blue-100">
              {filteredData.map((record, index) => {
                const statusInfo = getStatusInfo(record.status);
                const recordDate = new Date(record.date);
                const dayName = recordDate.toLocaleDateString('en-US', { weekday: 'long' });
                
                return (
                  <tr key={index} className="hover:bg-blue-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(record.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 capitalize">
                        {dayName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.checkIn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.checkOut}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        parseFloat(record.hours) >= 8 ? 'text-green-600' : 
                        parseFloat(record.hours) >= 6 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {record.hours}h
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate" title={record.remarks}>
                        {record.remarks}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <Table className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : `No attendance records for ${monthNames[selectedMonth]} ${selectedYear}`
              }
            </p>
          </div>
        )}
      </div>

      {/* Monthly Analysis */}
      
    </div>
  );
};

export function EmployeeAttendancePage() {
  const {
    attendanceData,
    systemAttendance,
    handleSystemCheckIn,
    handleSystemCheckOut,
    updateWorkingTime,
    setBreakStatus,
    setAttendanceData,
    getTodayStatus,
    getAttendanceStats
  } = useAttendance();

  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'attendance-sheet'
  
  // Enhanced Break Data with overtime tracking
  const [breakData, setBreakData] = useState({
    smoke: { 
      active: false, 
      startTime: null,
      totalDuration: 0, 
      exceededDuration: 0,
      breakLimit: 2,
      breakCount: 0
    },
    dinner: { 
      active: false, 
      startTime: null,
      totalDuration: 0, 
      exceededDuration: 0,
      breakLimit: 60,
      breakCount: 0
    },
    washroom: { 
      active: false, 
      startTime: null,
      totalDuration: 0, 
      exceededDuration: 0,
      breakLimit: 10,
      breakCount: 0
    },
    pray: { 
      active: false, 
      startTime: null,
      totalDuration: 0, 
      exceededDuration: 0,
      breakLimit: 10,
      breakCount: 0
    }
  });

  // Overtime debt tracking
  const [overtimeDebt, setOvertimeDebt] = useState({
    totalDebt: 0,
    breakOvertime: 0,
    lateOvertime: 0,
    workedOvertime: 0,
    netDebt: 0,
    history: []
  });

  // Break types
  const breakTypes = [
    { 
      id: 'smoke', 
      name: 'Smoke', 
      icon: Cigarette, 
      color: 'bg-orange-500',
      limit: 2
    },
    { 
      id: 'dinner', 
      name: 'Dinner', 
      icon: Utensils,
      color: 'bg-purple-500',
      limit: 40
    },
    { 
      id: 'washroom', 
      name: 'Washroom', 
      icon: ToiletIcon, 
      color: 'bg-blue-500',
      limit: 10
    },
    { 
      id: 'pray', 
      name: 'Prayer', 
      icon: Calendar1, 
      color: 'bg-green-500',
      limit: 10
    }
  ];

  // Initialize sample attendance data
  useEffect(() => {
    const generateSampleData = () => {
      const sampleData = [];
      const today = new Date();
      
      // Generate last 30 days of sample data
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        const dayOfWeek = date.getDay();
        
        // Skip weekends for sample data
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          sampleData.push({
            date: dateString,
            day: date.getDate(),
            status: 'off',
            checkIn: '-',
            checkOut: '-',
            hours: '0.0',
            remarks: 'Weekend'
          });
          continue;
        }
        
        // For today, use actual data
        if (i === 0) {
          const todayStatus = getTodayStatus();
          sampleData.push(todayStatus);
          continue;
        }
        
        // Generate random attendance for past days
        const statuses = ['present', 'present', 'present', 'present', 'late', 'absent'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        let checkIn, checkOut, hours, remarks;
        
        switch (randomStatus) {
          case 'present':
            checkIn = '09:00 AM';
            checkOut = '06:00 PM';
            hours = '9.0';
            remarks = 'On time';
            break;
          case 'late':
            checkIn = '09:30 AM';
            checkOut = '06:00 PM';
            hours = '8.5';
            remarks = 'Late arrival';
            break;
          case 'absent':
            checkIn = '-';
            checkOut = '-';
            hours = '0.0';
            remarks = 'Absent';
            break;
          default:
            checkIn = '-';
            checkOut = '-';
            hours = '0.0';
            remarks = 'Not recorded';
        }
        
        sampleData.push({
          date: dateString,
          day: date.getDate(),
          status: randomStatus,
          checkIn,
          checkOut,
          hours,
          remarks
        });
      }
      
      return sampleData;
    };

    const sampleData = generateSampleData();
    setAttendanceData(sampleData);
  }, []);

  // Calculate total break time and exceeded time
  const calculateTotalBreakTime = () => {
    const totalDuration = breakTypes.reduce((total, breakType) => 
      total + breakData[breakType.id].totalDuration, 0
    );
    
    const exceededDuration = breakTypes.reduce((total, breakType) => 
      total + breakData[breakType.id].exceededDuration, 0
    );

    return {
      totalDuration,
      exceededDuration,
      allowedDuration: totalDuration - exceededDuration
    };
  };

  // Calculate working hours summary with overtime consideration
  const calculateWorkingHoursSummary = () => {
    const breakSummary = calculateTotalBreakTime();
    const netWorkingTime = Math.max(0, systemAttendance.totalWorkingTime - breakSummary.allowedDuration);
    
    const requiredWorkingTime = 9 * 60;
    const overtimeRequired = Math.max(0, requiredWorkingTime - netWorkingTime + overtimeDebt.netDebt);
    
    return {
      totalBreakTime: breakSummary.totalDuration,
      exceededBreakTime: breakSummary.exceededDuration,
      netWorkingTime,
      grossWorkingTime: systemAttendance.totalWorkingTime,
      efficiency: systemAttendance.totalWorkingTime > 0 
        ? Math.max(0, ((netWorkingTime / systemAttendance.totalWorkingTime) * 100)).toFixed(1)
        : 0,
      overtimeRequired,
      requiredWorkingTime
    };
  };

  // Update current time and calculate break durations
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      updateWorkingTime();
      
      // Update active break durations
      breakTypes.forEach(breakType => {
        const breakInfo = breakData[breakType.id];
        if (breakInfo.active && breakInfo.startTime) {
          const currentDuration = (now - breakInfo.startTime) / (1000 * 60);
          
          // Check if break exceeded limit
          if (currentDuration > breakType.limit) {
            const exceededTime = currentDuration - breakType.limit;
            
            // Add overtime debt only once when it first exceeds
            if (exceededTime > 0 && breakInfo.exceededDuration === 0) {
              addOvertimeDebt('break', exceededTime, `${breakType.name} exceeded by ${Math.round(exceededTime)} minutes`);
            }
          }
        }
      });
    }, 60000);

    return () => clearInterval(timer);
  }, [systemAttendance.checkedIn, systemAttendance.lastUpdate, systemAttendance.isOnBreak, breakData]);

  // Enhanced Break Management with Overtime Tracking
  const handleBreakStart = (breakType) => {
    if (breakData[breakType].active) return;

    const now = new Date();
    const breakConfig = breakTypes.find(b => b.id === breakType);
    const breakLimit = breakConfig ? breakConfig.limit : 10;

    // Set auto-end timer
    const autoEndTimer = setTimeout(() => {
      handleBreakEnd(breakType);
    }, breakLimit * 60 * 1000);

    setBreakData(prev => ({
      ...prev,
      [breakType]: {
        ...prev[breakType],
        active: true,
        startTime: now,
        autoEndTimer: autoEndTimer,
      }
    }));

    // Pause working time tracking
    setBreakStatus(true);
  };

  const handleBreakEnd = (breakType) => {
    if (!breakData[breakType].active) return;

    const now = new Date();
    const breakConfig = breakTypes.find(b => b.id === breakType);
    const breakLimit = breakConfig ? breakConfig.limit : 10;

    // Clear auto-end timer
    if (breakData[breakType].autoEndTimer) {
      clearTimeout(breakData[breakType].autoEndTimer);
    }

    setBreakData(prev => {
      const breakInfo = prev[breakType];
      if (!breakInfo.startTime) return prev;
      
      const duration = (now - breakInfo.startTime) / (1000 * 60); // Calculate actual duration
      const exceeded = Math.max(0, duration - breakLimit);
      
      // Add to overtime debt if exceeded
      if (exceeded > 0) {
        addOvertimeDebt('break', exceeded, `${breakConfig.name} exceeded by ${Math.round(exceeded)} minutes`);
      }
      
      return {
        ...prev,
        [breakType]: {
          ...breakInfo,
          active: false,
          startTime: null,
          autoEndTimer: null,
          totalDuration: breakInfo.totalDuration + duration,
          exceededDuration: breakInfo.exceededDuration + exceeded,
          breakCount: breakInfo.breakCount + 1,
        }
      };
    });

    // Resume working time tracking
    setBreakStatus(false);
  };

  // Manual break end button
  const handleManualBreakEnd = (breakType) => {
    handleBreakEnd(breakType);
  };

  // Overtime debt management
  const addOvertimeDebt = (type, minutes, reason) => {
    setOvertimeDebt(prev => {
      const newDebt = {
        totalDebt: prev.totalDebt + minutes,
        breakOvertime: type === 'break' ? prev.breakOvertime + minutes : prev.breakOvertime,
        lateOvertime: type === 'late' ? prev.lateOvertime + minutes : prev.lateOvertime,
        workedOvertime: prev.workedOvertime,
        netDebt: prev.netDebt + minutes,
        history: [
          ...prev.history,
          {
            type,
            minutes,
            reason,
            date: new Date().toISOString(),
            timestamp: new Date()
          }
        ]
      };
      
      return newDebt;
    });
  };

  // Track late arrivals
  const handleSystemCheckInWrapper = async () => {
    if (!canCheckIn()) return;
    
    setIsLoading(true);
    
    try {
      const now = new Date();
      const expectedStart = new Date();
      expectedStart.setHours(9, 15, 0, 0);
      
      const lateBy = (now - expectedStart) / (1000 * 60);
      const gracePeriod = 15;
      
      if (lateBy > gracePeriod) {
        const lateMinutes = Math.round(lateBy - gracePeriod);
        addOvertimeDebt('late', lateMinutes, `Late arrival by ${lateMinutes} minutes`);
      }
      
      await handleSystemCheckIn();
    } catch (error) {
      alert('❌ Failed to check in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSystemCheckOutWrapper = async () => {
    if (!canCheckOut()) return;
    
    setIsLoading(true);
    
    try {
      await handleSystemCheckOut();
    } catch (error) {
      alert('❌ Failed to check out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle overtime work
  const handleOvertimeWork = (minutes) => {
    setOvertimeDebt(prev => {
      const newWorkedOvertime = prev.workedOvertime + minutes;
      return {
        ...prev,
        workedOvertime: newWorkedOvertime,
        netDebt: Math.max(0, prev.totalDebt - newWorkedOvertime)
      };
    });
  };

  // Format duration for display
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status icon and color
  const getStatusInfo = (status) => {
    switch (status) {
      case 'present':
        return { icon: Check, color: 'text-green-600 bg-green-100', text: 'Present' };
      case 'late':
        return { icon: Clock4, color: 'text-yellow-600 bg-yellow-100', text: 'Late' };
      case 'absent':
        return { icon: X, color: 'text-red-600 bg-red-100', text: 'Absent' };
      case 'off':
        return { icon: Calendar, color: 'text-gray-600 bg-gray-100', text: 'Day Off' };
      default:
        return { icon: Clock, color: 'text-blue-600 bg-blue-100', text: 'Pending' };
    }
  };

  // Check if employee can check in/out
  const canCheckIn = () => {
    const todayStatus = getTodayStatus();
    return todayStatus.checkIn === '-' && !isLoading;
  };

  const canCheckOut = () => {
    const todayStatus = getTodayStatus();
    return todayStatus.checkIn !== '-' && todayStatus.checkOut === '-' && !isLoading;
  };

  // Calculate current break duration for active breaks
  const getCurrentBreakDuration = (breakType) => {
    const breakInfo = breakData[breakType];
    if (breakInfo.active && breakInfo.startTime) {
      const now = new Date();
      return (now - breakInfo.startTime) / (1000 * 60);
    }
    return 0;
  };

  const workingHoursSummary = calculateWorkingHoursSummary();
  const breakSummary = calculateTotalBreakTime();
  const stats = getAttendanceStats();

  // Filter only days when employee came (present or late)
  const attendanceHistory = attendanceData.filter(day => 
    day.status === 'present' || day.status === 'late'
  );

  // Tab navigation
  const tabs = [
    { id: 'dashboard', name: 'Attendance Dashboard', icon: ShieldUser },
    { id: 'attendance-sheet', name: 'Attendance Sheet', icon: Table }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -right-1/3 w-[800px] h-[800px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 -left-1/3 w-[800px] h-[800px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15"></div>
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      <div className="relative z-10 p-6 lg:p-8  mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Attendance Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Manage your daily atten  dance and working hours</p>
            </div>
            <div className="bg-white rounded-xl border border-blue-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-lg font-semibold text-blue-600">
                <Clock className="h-5 w-5" />
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex gap-3 border-b border-gray-200 pb-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 mb-6">
              <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-xs font-medium text-blue-600 uppercase">Status</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{getTodayStatus().status.toUpperCase()}</p>
                <p className="text-xs text-gray-600 mt-1">{getTodayStatus().checkIn}</p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-green-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-xs font-medium text-green-600 uppercase">Present</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.present}</p>
                <p className="text-xs text-gray-600 mt-1">{stats.attendancePercentage}% rate</p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <PieChart className="h-5 w-5 text-purple-600" />
                  <span className="text-xs font-medium text-purple-600 uppercase">Rate</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.attendancePercentage}%</p>
                <p className="text-xs text-gray-600 mt-1">This month</p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <span className="text-xs font-medium text-orange-600 uppercase">Late</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.late}</p>
                <p className="text-xs text-gray-600 mt-1">Late arrivals</p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-red-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <PauseCircle className="h-5 w-5 text-red-600" />
                  <span className="text-xs font-medium text-red-600 uppercase">Inactive</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatDuration(breakSummary.totalDuration)}</p>
                <p className="text-xs text-gray-600 mt-1">Total Inactive time</p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <Clock4 className="h-5 w-5 text-amber-600" />
                  <span className="text-xs font-medium text-amber-600 uppercase">Overtime</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatDuration(overtimeDebt.netDebt)}</p>
                <p className="text-xs text-gray-600 mt-1">Debt balance</p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-cyan-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="h-5 w-5 text-cyan-600" />
                  <span className="text-xs font-medium text-cyan-600 uppercase">Hours</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatDuration(workingHoursSummary.netWorkingTime)}</p>
                <p className="text-xs text-gray-600 mt-1">Net working</p>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Check In/Out */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <LogIn className="h-5 w-5 text-blue-600" />
                  Attendance
                </h2>
                <div className="space-y-3">
                  <button 
                    onClick={handleSystemCheckInWrapper}
                    disabled={!canCheckIn()}
                    className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg font-medium transition-colors ${
                      canCheckIn() 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Check In</span>
                  </button>
                  
                  <button 
                    onClick={handleSystemCheckOutWrapper}
                    disabled={!canCheckOut()}
                    className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg font-medium transition-colors ${
                      canCheckOut() 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Check Out</span>
                  </button>
                </div>

                {systemAttendance.checkedIn && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Current Session:</span>
                      <span className="text-xl font-bold text-blue-600">
                        {formatDuration(systemAttendance.totalWorkingTime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                      {systemAttendance.isOnBreak ? (
                        <><Clock className="h-3 w-3" /> Break in progress</>
                      ) : (
                        <><Activity className="h-3 w-3" /> Working...</>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Break Management */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Coffee className="h-5 w-5 text-purple-600" />
                  Break Management
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {breakTypes.map((breakType) => {
                    const breakInfo = breakData[breakType.id];
                    const currentDuration = getCurrentBreakDuration(breakType.id);
                    const isExceeding = currentDuration > breakType.limit;
                    
                    return (
                      <div key={breakType.id} className="space-y-2">
                        <button 
                          onClick={() => handleBreakStart(breakType.id)}
                          disabled={breakInfo.active}
                          className={`w-full flex flex-col items-center justify-center p-3 rounded-lg border transition ${
                            breakInfo.active
                              ? `${breakType.color} text-white`
                              : `bg-gray-50 border-gray-200 hover:border-gray-300`
                          }`}
                        >
                          <breakType.icon className="h-4 w-4 mb-1" />
                          <span className="text-xs font-medium">
                            {breakInfo.active ? 'Active' : breakType.name}
                          </span>
                          <span className="text-xs mt-1">
                            {breakInfo.active ? 
                              `${Math.round(currentDuration)}m / ${breakType.limit}m` : 
                              `${breakType.limit}m`
                            }
                          </span>
                          {isExceeding && (
                            <span className="text-xs text-red-200 mt-1">EXCEEDED!</span>
                          )}
                        </button>
                        
                        {breakInfo.active && (
                          <button 
                            onClick={() => handleManualBreakEnd(breakType.id)}
                            className="w-full flex items-center justify-center p-2 rounded-lg border border-gray-200 hover:border-gray-300 bg-white text-xs"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            End Break
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Break Summary */}
                <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Today's Breaks</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Breaks:</span>
                      <span className="font-semibold text-purple-600">
                        {breakTypes.reduce((total, breakType) => total + breakData[breakType.id].breakCount, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Time:</span>
                      <span className="font-semibold text-purple-600">{formatDuration(breakSummary.totalDuration)}</span>
                    </div>
                    {breakSummary.exceededDuration > 0 && (
                      <div className="flex justify-between">
                        <span className="text-red-600">Exceeded:</span>
                        <span className="font-semibold text-red-600">+{formatDuration(breakSummary.exceededDuration)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active:</span>
                      <span className="font-semibold text-blue-600">
                        {breakTypes.filter(breakType => breakData[breakType.id].active).length}
                      </span>
                    </div>
                  </div>
                  
                  {/* Individual Break Counts */}
                  <div className="mt-3 pt-3 border-t border-purple-200">
                    <h5 className="text-xs font-semibold text-gray-700 mb-2">Break Details:</h5>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {breakTypes.map((breakType) => {
                        const breakInfo = breakData[breakType.id];
                        if (breakInfo.breakCount > 0) {
                          return (
                            <div key={breakType.id} className="flex justify-between items-center bg-white rounded px-2 py-1">
                              <span className="text-gray-600">{breakType.name}:</span>
                              <span className="font-semibold text-purple-700">{breakInfo.breakCount}x</span>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Graphs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Attendance Distribution Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-blue-600" />
                  Attendance Distribution
                </h4>
                <ResponsiveContainer width="100%" height={250}>
                  <RePieChart>
                    <Pie
                      data={[
                        { name: 'Present', value: stats.present, color: '#10b981' },
                        { name: 'Late', value: stats.late, color: '#f59e0b' },
                        { name: 'Absent', value: stats.absent, color: '#ef4444' },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Present', value: stats.present, color: '#10b981' },
                        { name: 'Late', value: stats.late, color: '#f59e0b' },
                        { name: 'Absent', value: stats.absent, color: '#ef4444' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fi
