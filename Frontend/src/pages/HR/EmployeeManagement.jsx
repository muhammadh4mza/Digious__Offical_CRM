import React, { useState } from 'react';
import HrSidebar from '../../components/HrSidebar';
import { 
  Users, Search, Plus, Edit, Trash2, Eye, Download, Filter,
  Mail, Phone, MapPin, Calendar, Briefcase, X, Save
} from 'lucide-react';

const EmployeeManagement = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('employees');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@company.com',
      phone: '+1 (555) 123-4567',
      department: 'Sales',
      position: 'Sales Manager',
      joinDate: '2023-01-15',
      salary: 75000,
      status: 'Active',
      address: '123 Main St, New York, NY',
      emergencyContact: '+1 (555) 987-6543',
      avatar: null
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      phone: '+1 (555) 234-5678',
      department: 'Marketing',
      position: 'Marketing Director',
      joinDate: '2022-08-20',
      salary: 85000,
      status: 'Active',
      address: '456 Oak Ave, Los Angeles, CA',
      emergencyContact: '+1 (555) 876-5432',
      avatar: null
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      phone: '+1 (555) 345-6789',
      department: 'Production',
      position: 'Senior Developer',
      joinDate: '2023-03-10',
      salary: 95000,
      status: 'Active',
      address: '789 Pine Rd, San Francisco, CA',
      emergencyContact: '+1 (555) 765-4321',
      avatar: null
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    joinDate: '',
    salary: '',
    address: '',
    emergencyContact: ''
  });

  const departments = ['All', 'Sales', 'Marketing', 'Production', 'HR', 'Operations'];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === 'All' || emp.department === filterDept;
    return matchesSearch && matchesDept;
  });

  const handleAddEmployee = () => {
    const newEmployee = {
      id: employees.length + 1,
      ...formData,
      status: 'Active',
      avatar: null
    };
    setEmployees([...employees, newEmployee]);
    setShowAddModal(false);
    resetForm();
  };

  const handleDeleteEmployee = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      joinDate: '',
      salary: '',
      address: '',
      emergencyContact: ''
    });
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <HrSidebar 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Employee Management</h1>
              <p className="text-slate-600 mt-1">Manage your team members</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Add Employee
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-white to-blue-25 rounded-2xl p-6 border border-blue-100 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Total Employees</p>
                  <p className="text-3xl font-bold text-slate-800 mt-2">{employees.length}</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-blue-25 rounded-2xl p-6 border border-blue-100 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Active</p>
                  <p className="text-3xl font-bold text-slate-800 mt-2">
                    {employees.filter(e => e.status === 'Active').length}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-blue-25 rounded-2xl p-6 border border-blue-100 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Departments</p>
                  <p className="text-3xl font-bold text-slate-800 mt-2">
                    {new Set(employees.map(e => e.department)).size}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-blue-25 rounded-2xl p-6 border border-blue-100 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">New This Month</p>
                  <p className="text-3xl font-bold text-slate-800 mt-2">3</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-gradient-to-br from-white to-blue-25 rounded-2xl p-6 border border-blue-100 shadow-lg mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search employees by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all">
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>
          </div>

          {/* Employee Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-bold text-slate-700">Employee</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-slate-700">Contact</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-slate-700">Department</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-slate-700">Position</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-slate-700">Join Date</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-slate-700">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="border-t border-blue-100 hover:bg-blue-50 transition-all">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {employee.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{employee.name}</p>
                          <p className="text-sm text-slate-600">{employee.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{employee.phone}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {employee.department}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-700">{employee.position}</td>
                    <td className="py-4 px-6 text-slate-600 text-sm">{employee.joinDate}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        {employee.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setShowDetailsModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(employee.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-slate-800">Add New Employee</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Department</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Production">Production</option>
                    <option value="HR">HR</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Position</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Manager"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Join Date</label>
                  <input
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Salary</label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="75000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Emergency Contact</label>
                  <input
                    type="tel"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (555) 987-6543"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                    placeholder="123 Main St, City, State"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEmployee}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all"
              >
                <Save className="w-5 h-5" />
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employee Details Modal */}
      {showDetailsModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-3xl">
              <h2 className="text-2xl font-bold">Employee Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-white/20 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {selectedEmployee.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-slate-800">{selectedEmployee.name}</h3>
                  <p className="text-slate-600 text-lg">{selectedEmployee.position}</p>
                  <span className="inline-block mt-2 px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    {selectedEmployee.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-slate-600 font-medium">Email</p>
                    <p className="text-slate-800 font-semibold">{selectedEmployee.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-slate-600 font-medium">Phone</p>
                    <p className="text-slate-800 font-semibold">{selectedEmployee.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-slate-600 font-medium">Department</p>
                    <p className="text-slate-800 font-semibold">{selectedEmployee.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-slate-600 font-medium">Join Date</p>
                    <p className="text-slate-800 font-semibold">{selectedEmployee.joinDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl col-span-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-slate-600 font-medium">Address</p>
                    <p className="text-slate-800 font-semibold">{selectedEmployee.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
