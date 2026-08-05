import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Clock, ShieldCheck, CheckCircle2, AlertTriangle, Calendar, Send } from 'lucide-react';

interface EmployeePortalPageProps {
  currentUser: User;
  onNavigate: (path: string) => void;
}

export const EmployeePortalPage: React.FC<EmployeePortalPageProps> = ({ currentUser, onNavigate }) => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [selectedShiftIndex, setSelectedShiftIndex] = useState(0);
  const [shiftStatus, setShiftStatus] = useState<'upcoming' | 'clocked_in' | 'completed'>('upcoming');

  // Leave Request Form State
  const [leaveReason, setLeaveReason] = useState('');
  const [startDate, setStartDate] = useState('2026-08-10');
  const [endDate, setEndDate] = useState('2026-08-14');
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  // Inactivity Security Alert State
  const [showInactivityAlert, setShowInactivityAlert] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  // Fetch Schedules
  const fetchMySchedules = async () => {
    try {
      const res = await fetch(`/api/admin/schedules?employee_id=${currentUser.id}`);
      const data = await res.json();
      if (data.success && data.schedules.length > 0) {
        setSchedules(data.schedules);
        setShiftStatus(data.schedules[0].status || 'upcoming');
      }
    } catch {}
  };

  useEffect(() => {
    fetchMySchedules();
  }, [currentUser.id]);

  // Handle Clock Action
  const handleClockAction = async (action: 'clock_in' | 'clock_out' | 'complete') => {
    const shift = schedules[selectedShiftIndex];
    if (!shift) return;

    try {
      const res = await fetch('/api/admin/clock-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheduleId: shift.id,
          action: action === 'clock_out' ? 'complete' : action,
          employeeId: currentUser.id,
          employeeName: currentUser.name
        })
      });

      if (res.ok) {
        if (action === 'clock_in') setShiftStatus('clocked_in');
        if (action === 'complete' || action === 'clock_out') setShiftStatus('completed');
        fetchMySchedules();
      }
    } catch {}
  };

  // Handle Leave Submission
  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason) return;

    const newLeave = {
      id: `leave-${Date.now()}`,
      employeeId: currentUser.id,
      startDate,
      endDate,
      reason: leaveReason,
      status: 'Pending Approval',
      timestamp: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/admin/add-leave-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request: newLeave })
      });

      if (res.ok) {
        setLeaveSubmitted(true);
        setLeaveReason('');
        setTimeout(() => setLeaveSubmitted(false), 5000);
      }
    } catch {}
  };

  const activeShift = schedules[selectedShiftIndex] || {
    id: 'shift-001',
    clientName: 'Arthur Miller',
    location: 'Oakwood Estates, Suite 204',
    time: '08:00 - 16:00',
    notes: 'Ensure morning meds and memory therapy routine.',
    dateLabel: 'MON 27'
  };

  return (
    <div class="min-h-screen bg-slate-100/70 pb-20">
      
      {/* Top Banner */}
      <div class="bg-teal-900 text-white border-b border-teal-800 py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span class="text-xs font-bold uppercase tracking-widest text-teal-300">Caregiver Clinical Portal</span>
            <h1 class="text-2xl font-bold font-serif">Welcome back, {currentUser.name}!</h1>
          </div>
          
          <button
            onClick={() => setShowInactivityAlert(true)}
            class="px-3.5 py-2 rounded-xl bg-teal-800 text-teal-200 text-xs font-semibold hover:bg-teal-700 flex items-center space-x-1.5"
          >
            <ShieldCheck class="w-4 h-4 text-teal-300" />
            <span>Simulate Security Timeout</span>
          </button>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {sessionExpired && (
          <div class="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 font-semibold text-sm flex items-center justify-between">
            <span>Session expired due to inactivity. Please sign in again.</span>
            <button
              onClick={() => onNavigate('/login')}
              class="px-3 py-1 rounded-lg bg-amber-800 text-white text-xs font-bold"
            >
              Go to Login
            </button>
          </div>
        )}

        {/* Shift Selection & Active Operational Panel */}
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Shift Radio Selector */}
          <div class="lg:col-span-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
            <h3 class="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Calendar class="w-4 h-4 text-teal-600" />
              <span>Assigned Caregiver Shifts</span>
            </h3>

            <div class="space-y-3">
              {schedules.map((shift, idx) => (
                <label
                  key={shift.id}
                  class={`block p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedShiftIndex === idx
                      ? 'border-teal-600 bg-teal-50/50 shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/50'
                  }`}
                >
                  <div class="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="selected-shift"
                      checked={selectedShiftIndex === idx}
                      onChange={() => {
                        setSelectedShiftIndex(idx);
                        setShiftStatus(shift.status || 'upcoming');
                      }}
                      class="text-teal-600 focus:ring-teal-500 h-4 w-4"
                    />
                    <div>
                      <span class="text-xs font-bold text-teal-700 block">{shift.dateLabel || 'MON'}</span>
                      <span class="text-sm font-bold text-slate-900">{shift.clientName}</span>
                      <span class="text-xs text-slate-500 block">{shift.time}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Clock In / Out & Clinical Actions */}
          <div class="lg:col-span-8 bg-white p-8 rounded-2xl shadow-xs border border-slate-200 space-y-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-2">
              <div>
                <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Selected Active Shift</span>
                <h2 class="text-xl font-bold font-serif text-slate-900">{activeShift.clientName}</h2>
                <p class="text-xs text-slate-600">{activeShift.location}</p>
              </div>

              <span class={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                shiftStatus === 'clocked_in'
                  ? 'bg-emerald-100 text-emerald-800'
                  : shiftStatus === 'completed'
                  ? 'bg-slate-100 text-slate-600'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                Status: {shiftStatus.replace('_', ' ')}
              </span>
            </div>

            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-1">
              <span class="font-bold text-slate-900 block">Caregiver Instructions:</span>
              <p>{activeShift.notes}</p>
            </div>

            {/* Shift Action Buttons */}
            <div class="flex flex-wrap gap-4 pt-2">
              <button
                id="clock-in-btn"
                onClick={() => handleClockAction('clock_in')}
                disabled={shiftStatus === 'clocked_in' || shiftStatus === 'completed'}
                class="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-xs"
              >
                Clock In
              </button>

              <button
                id="clock-out-btn"
                onClick={() => handleClockAction('clock_out')}
                disabled={shiftStatus !== 'clocked_in'}
                class="px-6 py-3 rounded-xl bg-slate-800 text-white font-bold text-sm hover:bg-slate-900 disabled:opacity-50 transition-colors shadow-xs"
              >
                Clock Out
              </button>

              <button
                id="complete-shift-btn"
                onClick={() => handleClockAction('complete')}
                disabled={shiftStatus === 'completed'}
                class="px-6 py-3 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 disabled:opacity-50 transition-colors shadow-xs"
              >
                Complete Shift
              </button>
            </div>
          </div>

        </div>

        {/* Leave Request Form */}
        <div class="bg-white p-8 rounded-2xl shadow-xs border border-slate-200 space-y-6">
          <div class="flex items-center space-x-2 text-slate-900">
            <Send class="w-5 h-5 text-teal-600" />
            <h3 class="text-lg font-bold font-serif">Submit Time-Off & Leave Request</h3>
          </div>

          {leaveSubmitted && (
            <div class="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 flex items-center space-x-2">
              <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Leave request submitted for administrative approval!</span>
            </div>
          )}

          <form onSubmit={handleLeaveSubmit} class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="space-y-1">
                <label class="block text-xs font-semibold text-slate-700 uppercase">Reason for Leave</label>
                <input
                  type="text"
                  name="leave-reason"
                  required
                  placeholder="e.g. Medical Appointment"
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-hidden"
                />
              </div>

              <div class="space-y-1">
                <label class="block text-xs font-semibold text-slate-700 uppercase">Start Date</label>
                <input
                  type="date"
                  name="start-date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-hidden"
                />
              </div>

              <div class="space-y-1">
                <label class="block text-xs font-semibold text-slate-700 uppercase">End Date</label>
                <input
                  type="date"
                  name="end-date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              class="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
            >
              Submit Leave Request
            </button>
          </form>
        </div>

      </div>

      {/* ─── INACTIVITY SECURITY ALERT OVERLAY ───────────────────────────────────── */}
      {showInactivityAlert && (
        <div class="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div class="bg-white max-w-md w-full rounded-3xl p-8 shadow-2xl border border-slate-200 text-center space-y-6">
            <div class="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle class="w-8 h-8" />
            </div>

            <div class="space-y-2">
              <h3 class="text-xl font-bold font-serif text-slate-900">Inactivity Security Alert</h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                Your session has been idle for clinical security compliance. Would you like to stay logged in?
              </p>
            </div>

            <div class="space-y-2 pt-2">
              <button
                onClick={() => setShowInactivityAlert(false)}
                class="w-full py-3.5 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700"
              >
                Stay Logged In
              </button>

              <button
                onClick={() => {
                  setShowInactivityAlert(false);
                  setSessionExpired(true);
                  onNavigate('/login');
                }}
                class="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200"
              >
                Logout Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
