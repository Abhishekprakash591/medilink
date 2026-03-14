import React, { useState, useEffect } from 'react';
import { Users, Calendar, Clock, Activity, RefreshCw, TrendingUp, AlertCircle, Send, ChevronRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import StatCard from '../../components/ui/StatCard';
import PageHeader from '../../components/ui/PageHeader';
import Table from '../../components/ui/Table';
import EmptyState from '../../components/ui/EmptyState';
import { getDashboardStats, getUpcomingAppointments } from '../../api/dashboard';
import { formatCurrency } from '../../utils/formatters';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WEEK_PATIENTS = [18, 26, 22, 30, 24, 15, 8];
const MAX_PATIENTS = Math.max(...WEEK_PATIENTS);

const REVENUE_BREAKDOWN = [
  { label: 'Consultations', value: 7400, color: 'var(--primary-color)', pct: 60 },
  { label: 'Follow-ups', value: 3200, color: '#8b5cf6', pct: 26 },
  { label: 'Vaccinations', value: 1800, color: '#10b981', pct: 14 },
];

const TOP_CONDITIONS = [
  { condition: 'Viral Fever', cases: 34, pct: 42 },
  { condition: 'Hypertension', cases: 18, pct: 22 },
  { condition: 'Diabetes', cases: 12, pct: 15 },
  { condition: 'URTI / Cold', cases: 10, pct: 12 },
  { condition: 'Gastroenteritis', cases: 7, pct: 9 },
];

const FOLLOWUP_ALERTS = [
  { patient: 'Rahul Verma', condition: 'Hypertension', dueDate: '2026-03-13', daysOverdue: 2 },
  { patient: 'Priya Sharma', condition: 'Viral Fever', dueDate: '2026-03-14', daysOverdue: 0 },
  { patient: 'Anil Kumar', condition: 'Diabetes', dueDate: '2026-03-11', daysOverdue: 4 },
];

export const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reminderSent, setReminderSent] = useState({});

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [sRes, aRes] = await Promise.all([getDashboardStats(), getUpcomingAppointments()]);
      setStats(sRes.data);
      setAppointments(aRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  const sendReminder = (patient) => {
    setReminderSent(p => ({ ...p, [patient]: true }));
  };

  const appointmentColumns = [
    { header: 'Time', accessor: 'time', render: r => <strong style={{ fontWeight: 600 }}>{r.time}</strong> },
    { header: 'Patient', accessor: 'patientName' },
    { header: 'Type', accessor: 'type' },
    { header: 'Status', accessor: 'status', render: r => <Badge variant={r.status === 'confirmed' ? 'success' : 'warning'}>{r.status.charAt(0).toUpperCase() + r.status.slice(1)}</Badge> },
    { header: '', accessor: 'id', render: r => <Button variant="outline" size="sm" onClick={() => window.location.href = '/doctor/appointments'}>View</Button> },
  ];

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <RefreshCw size={40} color="var(--primary-color)" style={{ animation: 'spin 1s linear infinite' }} />
      <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading clinic data...</p>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div className="module-page">
      <PageHeader
        title="Good Morning, Dr. Sharma 👋"
        description="Here's your clinic overview for today — Friday, 13 March 2026."
        actions={<Button variant="primary" onClick={() => window.location.href = '/doctor/appointments'}>+ New Appointment</Button>}
      />

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <StatCard title="Today's Patients" value={stats?.todaysPatients?.value} icon={Users} trend={stats?.todaysPatients?.trend} />
        <StatCard title="Pending Appointments" value={stats?.pendingAppointments?.value} icon={Clock} />
        <StatCard title="Follow-ups Due" value={stats?.followUps?.value} icon={Calendar} trend={stats?.followUps?.trend} />
        <StatCard title="Today's Revenue" value={stats ? formatCurrency(stats.revenue.value) : '–'} icon={Activity} />
        <StatCard title="Avg. Consult Time" value="7 min" icon={TrendingUp} trend={{ positive: true, value: '1 min' }} />
      </div>

      {/* Row 2: Weekly Chart + Revenue */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
        {/* Weekly bar chart */}
        <Card>
          <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700 }}>Patient Volume — This Week</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: '140px' }}>
            {WEEK_PATIENTS.map((val, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{val}</span>
                <div style={{ width: '100%', backgroundColor: i === 4 ? 'var(--primary-color)' : '#e0e7ff', borderRadius: '4px 4px 0 0', height: `${(val / MAX_PATIENTS) * 110}px`, transition: 'height 0.3s ease' }} title={`${DAYS[i]}: ${val} patients`} />
                <span style={{ fontSize: '0.7rem', color: i === 4 ? 'var(--primary-color)' : 'var(--text-secondary)', fontWeight: i === 4 ? 700 : 400 }}>{DAYS[i]}</span>
              </div>
            ))}
          </div>
          <p style={{ margin: '0.75rem 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>• Today (Fri) highlighted in blue</p>
        </Card>

        {/* Revenue breakdown */}
        <Card>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700 }}>Revenue Breakdown</h3>
          <p style={{ margin: '0 0 1rem', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{formatCurrency(12400)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {REVENUE_BREAKDOWN.map((item, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{item.label}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: item.color }}>{formatCurrency(item.value)}</span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${item.pct}%`, backgroundColor: item.color, borderRadius: '999px', transition: 'width 0.6s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 3: Upcoming Table + Follow-up Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
        <Card padding="0">
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Today's Upcoming Appointments</h3>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/doctor/appointments'}>View All <ChevronRight size={14} /></Button>
          </div>
          <div style={{ padding: '1rem' }}>
            {appointments.length > 0
              ? <Table columns={appointmentColumns} data={appointments} keyExtractor={r => r.id} />
              : <EmptyState title="No upcoming appointments" description="Schedule today's patients from the Appointments tab." />
            }
          </div>
        </Card>

        {/* Follow-up Alerts */}
        <Card padding="0">
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} color="var(--warning-color)" />
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Follow-up Alerts</h3>
            <Badge variant="warning" style={{ marginLeft: 'auto' }}>{FOLLOWUP_ALERTS.length}</Badge>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {FOLLOWUP_ALERTS.map((f, i) => (
              <div key={i} style={{ padding: '0.875rem 1.25rem', borderBottom: i < FOLLOWUP_ALERTS.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem' }}>{f.patient}</p>
                  {f.daysOverdue > 0
                    ? <Badge variant="danger">Overdue {f.daysOverdue}d</Badge>
                    : <Badge variant="warning">Due Today</Badge>
                  }
                </div>
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{f.condition}</p>
                {reminderSent[f.patient]
                  ? <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--success-color)', fontWeight: 600 }}>✅ Reminder Sent</p>
                  : <button onClick={() => sendReminder(f.patient)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--background-color)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                      <Send size={12} /> Send Reminder
                    </button>
                }
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 4: Top Conditions + Clinic Performance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Top Conditions */}
        <Card>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700 }}>🦠 Top Cases This Month</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {TOP_CONDITIONS.map((c, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{c.condition}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{c.cases} cases</span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${c.pct}%`, backgroundColor: ['#2563eb', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'][i], borderRadius: '999px' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Clinic Performance */}
        <Card>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700 }}>📊 Clinic Performance</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[
              { label: 'Avg. Consult Time', value: '7 min', sub: '↓ 1 min from last week', pos: true },
              { label: 'Patient Satisfaction', value: '4.6 / 5', sub: '↑ 0.2 from last month', pos: true },
              { label: 'No-show Rate', value: '8%', sub: '↓ 3% improvement', pos: true },
              { label: 'Monthly Revenue', value: '₹1.24L', sub: '↑ 12% growth', pos: true },
            ].map((m, i) => (
              <div key={i} style={{ padding: '0.75rem', backgroundColor: 'var(--background-color)', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)' }}>
                <p style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{m.label}</p>
                <p style={{ margin: '0 0 0.2rem', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{m.value}</p>
                <p style={{ margin: 0, fontSize: '0.65rem', color: m.pos ? 'var(--success-color)' : 'var(--danger-color)', fontWeight: 600 }}>{m.sub}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default DashboardPage;
