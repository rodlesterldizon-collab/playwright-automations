import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Users, Calendar, Clock, Sliders, Plus, Trash2, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface AdminPortalPageProps {
  currentUser: User;
  onNavigate: (path: string) => void;
}

export const AdminPortalPage: React.FC<AdminPortalPageProps> = () => {
  const [activeTab, setActiveTab] = useState<'registry' | 'scheduler' | 'leave'>('registry');

  // Employee Registry State
  const [employees, setEmployees] = useState<any[]>([]);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');

  // Scheduler State
  const [schedules, setSchedules] = useState<any[]>([]);
  const [selectedEmpId, setSelectedEmpId] = useState('elena_rod_932a');
  const [clientName, setClientName] = useState('');
  const [shiftDate, setShiftDate] = useState('2026-07-27');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [assignSuccess, setAssignSuccess] = useState(false);
  const [deletingShiftId, setDeletingShiftId] = useState<string | null>(null);

  // Leave Requests State
  const [leaves, setLeaves] = useState<any[]>([]);

  // Feature Flags Overlay State
  const [showFeatureFlags, setShowFeatureFlags] = useState(false);
  const [featureToggles, setFeatureToggles] = useState<Record<string, boolean>>({
    "ENABLE_SMS_NOTIFICATIONS": true,
    "ENABLE_EXPRESS_LOGS": true,
    "STRICT_GEO_FENCING": false,
    "AUTO_DISPATCH_BACKUP": true
  });

  // Fetch data
  const loadEmployees = async () => {
    try {
      const res = await fetch('/api/admin/employees');
      const data = await res.json();
      if (data.success) setEmployees(data.employees);
    } catch {}
  };

  const loadSchedules = async () => {
    try {
      const res = await fetch('/api/admin/schedules');
      const data = await res.json();
      if (data.success) setSchedules(data.schedules);
    } catch {}
  };

  const loadLeaves = async () => {
    try {
      const res = await fetch('/api/admin/leave-requests');
      const data = await res.json();
      if (data.success) setLeaves(data.leaves);
    } catch {}
  };

  useEffect(() => {
    loadEmployees();
    loadSchedules();
    loadLeaves();
  }, []);

  // Add Employee
  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName || !newEmpEmail) return;
    const newEmp = {
      id: `emp-${Date.now()}`,
      name: newEmpName,
      username: newEmpEmail,
      password: 'admin',
      role: 'employee',
      status: 'active'
    };
    try {
      const res = await fetch('/api/admin/add-employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employee: newEmp })
      });
      if (res.ok) {
        setNewEmpName('');
        setNewEmpEmail('');
        loadEmployees();
      }
    } catch {}
  };

  // Assign Shift
  const handleAssignShift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !location) return;

    const newShift = {
      id: `shift-${Date.now()}`,
      employeeId: selectedEmpId,
      clientName,
      time: '08:00 - 16:00',
      location,
      status: 'upcoming',
      dateKey: 'MON',
      shiftType: 'Day',
      notes,
      month: 'July',
      year: 2026,
      date: shiftDate,
      dateLabel: `MON ${shiftDate.slice(-2)}`
    };

    try {
      const res = await fetch('/api/admin/add-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedule: newShift })
      });
      if (res.ok) {
        setAssignSuccess(true);
        setClientName('');
        setLocation('');
        setNotes('');
        loadSchedules();
        setTimeout(() => setAssignSuccess(false), 4000);
      }
    } catch {}
  };

  // Delete Shift
  const handleDeleteShift = async (shiftId: string) => {
    try {
      const res = await fetch('/api/admin/delete-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduleId: shiftId, permanent: true })
      });
      if (res.ok) {
        setDeletingShiftId(null);
        loadSchedules();
      }
    } catch {}
  };

  // Update Leave Request
  const handleUpdateLeave = async (id: string, status: 'Approved' | 'Rejected') => {
    try {
      const res = await fetch('/api/admin/update-leave-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, adminComment: 'Coverage verified by admin.' })
      });
      if (res.ok) {
        loadLeaves();
      }
    } catch {}
  };

  return (
    <div class="min-h-screen bg-slate-100/70 pb-20">
      
      {/* Top Admin Header Bar */}
      <div class="bg-slate-900 text-white border-b border-slate-800 py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="text-2xl font-bold font-serif">CompassionCare Administrative Portal</h1>
            <p class="text-xs text-slate-400">Clinical Scheduling, Personnel Registry, & Shift Dispatch</p>
          </div>
          
          <div class="flex items-center space-x-3">
            <button
              onClick={() => setShowFeatureFlags(true)}
              class="px-4 py-2 rounded-xl bg-slate-800 text-teal-300 font-semibold text-xs border border-slate-700 hover:bg-slate-700 flex items-center space-x-2 transition-colors"
            >
              <Sliders class="w-4 h-4 text-teal-400" />
              <span>Feature Flags</span>
            </button>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Navigation Tabs */}
        <div class="flex space-x-2 border-b border-slate-200 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('registry')}
            class={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center space-x-2 transition-all ${
              activeTab === 'registry'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Users class="w-4 h-4" />
            <span>Employee Registry</span>
          </button>

          <button
            onClick={() => setActiveTab('scheduler')}
            class={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center space-x-2 transition-all ${
              activeTab === 'scheduler'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Calendar class="w-4 h-4" />
            <span>Shift Scheduler</span>
          </button>

          <button
            onClick={() => setActiveTab('leave')}
            class={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center space-x-2 transition-all ${
              activeTab === 'leave'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Clock class="w-4 h-4" />
            <span>Leave Approvals</span>
          </button>
        </div>

        {/* ─── TAB 1: EMPLOYEE REGISTRY ─────────────────────────────────────────────── */}
        {activeTab === 'registry' && (
          <div class="space-y-8">
            
            {/* Add Employee Form */}
            <div class="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
              <h3 class="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Plus class="w-4 h-4 text-teal-600" />
                <span>Register New Healthcare Employee</span>
              </h3>
              <form onSubmit={handleAddEmployee} class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Employee Full Name"
                  value={newEmpName}
                  onChange={(e) => setNewEmpName(e.target.value)}
                  class="px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-hidden"
                />
                <input
                  type="email"
                  placeholder="Organization Email"
                  value={newEmpEmail}
                  onChange={(e) => setNewEmpEmail(e.target.value)}
                  class="px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-hidden"
                />
                <button
                  type="submit"
                  class="px-4 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 transition-colors"
                >
                  Add Employee
                </button>
              </form>
            </div>

            {/* Employee Table */}
            <div class="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th class="p-4">Employee Name</th>
                    <th class="p-4">Email / ID</th>
                    <th class="p-4">Role</th>
                    <th class="p-4">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 text-sm">
                  {employees.map((emp) => (
                    <tr key={emp.id} class="hover:bg-slate-50">
                      <td class="p-4 font-bold text-slate-900">{emp.name}</td>
                      <td class="p-4 text-slate-600">{emp.username}</td>
                      <td class="p-4 text-slate-600 uppercase text-xs font-semibold">{emp.role}</td>
                      <td class="p-4">
                        <span class={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          emp.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {emp.status === 'active' ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ─── TAB 2: SHIFT SCHEDULER ───────────────────────────────────────────────── */}
        {activeTab === 'scheduler' && (
          <div class="space-y-8">
            
            {/* Assign Shift Form */}
            <div class="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
              <h2 class="text-lg font-bold text-slate-900 font-serif">Assign New Shift</h2>
              
              {assignSuccess && (
                <div class="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-sm font-semibold border border-emerald-200 flex items-center space-x-2">
                  <CheckCircle2 class="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Shifts assigned successfully!</span>
                </div>
              )}

              <form onSubmit={handleAssignShift} class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  <div class="space-y-1">
                    <label class="block text-xs font-semibold text-slate-700 uppercase">Select Caregiver</label>
                    <select
                      value={selectedEmpId}
                      onChange={(e) => setSelectedEmpId(e.target.value)}
                      class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white outline-hidden"
                    >
                      {employees.map((e) => (
                        <option key={e.id} value={e.id}>{e.name} ({e.username})</option>
                      ))}
                    </select>
                  </div>

                  <div class="space-y-1">
                    <label class="block text-xs font-semibold text-slate-700 uppercase">Client Name</label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-hidden"
                    />
                  </div>

                  <div class="space-y-1">
                    <label class="block text-xs font-semibold text-slate-700 uppercase">Shift Date</label>
                    <input
                      type="date"
                      value={shiftDate}
                      onChange={(e) => setShiftDate(e.target.value)}
                      class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-hidden"
                    />
                  </div>

                  <div class="space-y-1">
                    <label class="block text-xs font-semibold text-slate-700 uppercase">Facility / Address</label>
                    <input
                      type="text"
                      placeholder="e.g. 123 Care St, City"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-hidden"
                    />
                  </div>

                </div>

                <div class="space-y-1">
                  <label class="block text-xs font-semibold text-slate-700 uppercase">Shift Clinical Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Enter care requirements..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  class="px-6 py-3 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 transition-colors"
                >
                  Assign Shift
                </button>
              </form>
            </div>

            {/* Assigned Shift Cards Grid */}
            <div class="space-y-4">
              <h3 class="text-base font-bold text-slate-900">Current Assigned Facility Shifts</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {schedules.map((s) => (
                  <div key={s.id} class="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 relative">
                    <div class="flex justify-between items-start">
                      <div>
                        <span class="text-xs font-bold text-teal-600 uppercase tracking-wider">{s.dateLabel || 'MON'}</span>
                        <h4 class="text-lg font-bold text-slate-900 font-serif">{s.clientName}</h4>
                      </div>
                      <span class={`px-2 py-0.5 rounded-md text-[11px] font-bold uppercase ${
                        s.status === 'completed'
                          ? 'bg-slate-100 text-slate-600'
                          : s.status === 'clocked_in'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {s.status}
                      </span>
                    </div>

                    <p class="text-xs text-slate-600 font-medium">{s.location}</p>
                    <p class="text-xs text-slate-500">{s.time} • {s.notes}</p>

                    <div class="pt-2 flex justify-end">
                      {deletingShiftId === s.id ? (
                        <div class="flex items-center space-x-2">
                          <button
                            onClick={() => handleDeleteShift(s.id)}
                            class="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                          >
                            Confirm Deletion
                          </button>
                          <button
                            onClick={() => setDeletingShiftId(null)}
                            class="px-2 py-1 rounded-lg bg-slate-200 text-slate-700 text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeletingShiftId(s.id)}
                          class="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Shift"
                        >
                          <Trash2 class="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ─── TAB 3: LEAVE APPROVALS ───────────────────────────────────────────────── */}
        {activeTab === 'leave' && (
          <div class="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-6">
            <h2 class="text-xl font-bold text-slate-900 font-serif">Leave Approvals</h2>
            
            {leaves.length === 0 ? (
              <p class="text-sm text-slate-500">No caregiver leave requests submitted.</p>
            ) : (
              <div class="space-y-4">
                {leaves.map((leave) => (
                  <div key={leave.id} class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div class="space-y-1">
                      <div class="flex items-center space-x-2">
                        <span class="text-sm font-bold text-slate-900">Reason: {leave.reason}</span>
                        <span class={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          leave.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : leave.status === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {leave.status}
                        </span>
                      </div>
                      <p class="text-xs text-slate-600">Dates: {leave.startDate} to {leave.endDate}</p>
                    </div>

                    {leave.status === 'Pending Approval' && (
                      <div class="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateLeave(leave.id, 'Approved')}
                          class="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
                        >
                          Approve Leave
                        </button>
                        <button
                          onClick={() => handleUpdateLeave(leave.id, 'Rejected')}
                          class="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ─── FEATURE FLAGS OVERLAY (#feature-flag-overlay) ───────────────────────── */}
      {showFeatureFlags && (
        <div id="feature-flag-overlay" class="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div class="bg-white max-w-lg w-full rounded-3xl p-8 shadow-2xl border border-slate-200 space-y-6">
            <div class="flex justify-between items-center">
              <h3 class="text-xl font-bold font-serif text-slate-900">System Feature Flags</h3>
              <button onClick={() => setShowFeatureFlags(false)} class="p-2 text-slate-400 hover:text-slate-600">
                <X class="w-5 h-5" />
              </button>
            </div>

            <div class="space-y-3">
              {Object.keys(featureToggles).map((key) => (
                <div key={key} class="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span class="text-xs font-mono font-semibold text-slate-800">{key}</span>
                  <button
                    onClick={() => setFeatureToggles({ ...featureToggles, [key]: !featureToggles[key] })}
                    class={`px-3 py-1 rounded-lg text-xs font-bold ${
                      featureToggles[key] ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {key}: {featureToggles[key] ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
              ))}
            </div>

            <div class="flex space-x-3 pt-2">
              <button
                onClick={() => setShowFeatureFlags(false)}
                class="flex-1 py-3 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700"
              >
                Apply Config
              </button>
              <button
                onClick={() => setFeatureToggles({ "ENABLE_SMS_NOTIFICATIONS": true, "ENABLE_EXPRESS_LOGS": true, "STRICT_GEO_FENCING": false, "AUTO_DISPATCH_BACKUP": true })}
                class="px-4 py-3 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-300"
              >
                Reset Defaults
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
