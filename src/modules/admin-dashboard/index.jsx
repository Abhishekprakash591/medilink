import React, { useState, useEffect } from 'react';
import { BedDouble, Truck, AlertTriangle, Users, TrendingUp, Activity, Heart, Zap } from 'lucide-react';

const CITY_STATS = [
  { label: 'Total ICU Beds', value: 342, available: 87, icon: BedDouble, color: '#3b82f6' },
  { label: 'Ambulances Active', value: 48, available: 12, icon: Truck, color: '#10b981' },
  { label: 'Live Emergencies', value: 7, available: null, icon: AlertTriangle, color: '#ef4444' },
  { label: 'Patients Served Today', value: 1284, available: null, icon: Users, color: '#8b5cf6' },
];

const HOSPITAL_GRID = [
  { name: 'CityCare Hospital', zone: 'North', icuBeds: 12, icuTotal: 20, genBeds: 45, genTotal: 80, ambulances: 3, totalAmb: 5, status: 'normal' },
  { name: 'Apollo Hospital', zone: 'West', icuBeds: 2, icuTotal: 15, genBeds: 10, genTotal: 60, ambulances: 1, totalAmb: 4, status: 'critical' },
  { name: 'Ruby Hall Clinic', zone: 'South', icuBeds: 18, icuTotal: 25, genBeds: 55, genTotal: 90, ambulances: 4, totalAmb: 6, status: 'normal' },
  { name: 'Jehangir Hospital', zone: 'Central', icuBeds: 0, icuTotal: 12, genBeds: 0, genTotal: 50, ambulances: 0, totalAmb: 3, status: 'full' },
  { name: 'KEM Hospital', zone: 'East', icuBeds: 8, icuTotal: 18, genBeds: 30, genTotal: 70, ambulances: 2, totalAmb: 4, status: 'moderate' },
];

const LIVE_EMERGENCIES = [
  { id: 'EM-001', patient: 'John Doe', type: 'Cardiac Emergency', location: 'Koregaon Park', assignedHospital: 'CityCare', eta: 4, status: 'in-transit' },
  { id: 'EM-002', patient: 'Meera Joshi', type: 'Road Accident', location: 'Hadapsar', assignedHospital: 'Ruby Hall', eta: 7, status: 'dispatched' },
  { id: 'EM-003', patient: 'Ramesh K.', type: 'Stroke (Suspected)', location: 'FC Road', assignedHospital: 'Apollo', eta: 3, status: 'in-transit' },
];

const HOURLY_DATA = [6, 12, 18, 28, 35, 42, 38, 30, 22, 18, 14, 8];
const HOURS = ['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm'];

const STATUS_CONFIG = {
  normal: { color: '#10b981', label: 'Normal' },
  moderate: { color: '#f59e0b', label: 'Moderate' },
  critical: { color: '#ef4444', label: 'Critical' },
  full: { color: '#6b7280', label: 'Full' },
};

export const AdminDashboard = () => {
  const [liveEtas, setLiveEtas] = useState(LIVE_EMERGENCIES);
  const [activeEmergencies, setActiveEmergencies] = useState(7);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 8000);
    return () => clearInterval(t);
  }, []);

  const maxEmergency = Math.max(...HOURLY_DATA);

  return (
    <div className="module-page" style={{ padding: '1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ margin: '0 0 0.25rem', fontSize: '1.5rem', fontWeight: 900 }}>Pune City Health Grid</h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Real-time city-wide hospital capacity and emergency dispatch management
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fee2e2', padding: '0.5rem 1rem', borderRadius: '999px', border: '1px solid #fecaca' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444', animation: 'livePulse 1.5s infinite' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#991b1b' }}>{activeEmergencies} ACTIVE EMERGENCIES</span>
          </div>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {CITY_STATS.map((stat, i) => {
          const Icon = stat.icon;
          const pct = stat.available !== null ? Math.round((stat.available / stat.value) * 100) : null;
          return (
            <div key={i} style={{ backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: stat.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={22} color={stat.color} />
                </div>
                {pct !== null && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: pct > 40 ? '#10b981' : pct > 20 ? '#f59e0b' : '#ef4444', backgroundColor: pct > 40 ? '#d1fae5' : pct > 20 ? '#fef9c3' : '#fee2e2', padding: '2px 8px', borderRadius: '999px' }}>
                    {pct}% free
                  </span>
                )}
              </div>
              <p style={{ margin: '0 0 0.1rem', fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>{stat.value.toLocaleString()}</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{stat.label}</p>
              {stat.available !== null && <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', fontWeight: 700, color: stat.color }}>{stat.available} available</p>}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Hospital Grid Table */}
        <div style={{ backgroundColor: 'white', borderRadius: '14px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1rem' }}>🏥 Hospital Capacity Overview</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Updated live</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                {['Hospital', 'Zone', 'ICU Beds', 'Gen Beds', 'Ambulances', 'Status'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '1px solid var(--border-color)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOSPITAL_GRID.map((h, i) => {
                const st = STATUS_CONFIG[h.status];
                return (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 700 }}>{h.name}</td>
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)' }}>{h.zone}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: h.icuBeds === 0 ? '#ef4444' : '#10b981' }}>{h.icuBeds}</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>/ {h.icuTotal}</span>
                        <div style={{ flex: 1, height: '4px', backgroundColor: '#f1f5f9', borderRadius: '2px', minWidth: '40px' }}>
                          <div style={{ width: `${(h.icuBeds / h.icuTotal) * 100}%`, height: '100%', backgroundColor: h.icuBeds === 0 ? '#ef4444' : h.icuBeds / h.icuTotal < 0.3 ? '#f59e0b' : '#10b981', borderRadius: '2px', transition: 'width 0.5s' }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span style={{ fontWeight: 700, color: h.genBeds === 0 ? '#ef4444' : 'var(--text-primary)' }}>{h.genBeds}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}> / {h.genTotal}</span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span style={{ fontWeight: 700, color: h.ambulances === 0 ? '#ef4444' : 'var(--text-primary)' }}>{h.ambulances}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}> / {h.totalAmb}</span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '999px', backgroundColor: st.color + '18', color: st.color, fontWeight: 700, fontSize: '0.75rem' }}>{st.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Emergency Chart */}
        <div style={{ backgroundColor: 'white', borderRadius: '14px', border: '1px solid var(--border-color)', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ margin: '0 0 0.25rem', fontWeight: 700, fontSize: '1rem' }}>📈 Emergency Volume Today</h3>
          <p style={{ margin: '0 0 1.25rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Hourly incoming emergency calls</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '160px' }}>
            {HOURLY_DATA.map((val, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '100%', height: `${(val / maxEmergency) * 100}%`, backgroundColor: i === 5 ? '#ef4444' : '#3b82f6', borderRadius: '4px 4px 0 0', position: 'relative', transition: 'all 0.5s' }}>
                  {i === 5 && <div style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#ef4444', color: 'white', fontSize: '0.6rem', fontWeight: 700, padding: '1px 4px', borderRadius: '3px', whiteSpace: 'nowrap' }}>PEAK</div>}
                </div>
                <span style={{ fontSize: '0.55rem', color: 'var(--text-secondary)', fontWeight: i === new Date().getHours() - 8 ? 700 : 400 }}>{HOURS[i]}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fff7ed', borderRadius: '8px', border: '1px solid #fed7aa' }}>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#9a3412', fontWeight: 600 }}>⚠️ Apollo Hospital near capacity. Rerouting suggested to CityCare.</p>
          </div>
        </div>
      </div>

      {/* Live Emergency Feed */}
      <div style={{ backgroundColor: '#0f172a', borderRadius: '14px', border: '1px solid #1e293b', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444', animation: 'livePulse 1s infinite' }} />
            Live Emergency Dispatch Feed
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Auto-refreshes every 30s</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0' }}>
          {LIVE_EMERGENCIES.map((em, i) => (
            <div key={em.id} style={{ padding: '1.25rem', borderRight: i < 2 ? '1px solid #1e293b' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>{em.id}</span>
                <span style={{ padding: '2px 8px', borderRadius: '999px', backgroundColor: em.status === 'in-transit' ? '#7f1d1d' : '#1e293b', color: em.status === 'in-transit' ? '#fca5a5' : '#94a3b8', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  {em.status === 'in-transit' ? '🚑 In Transit' : '📡 Dispatched'}
                </span>
              </div>
              <p style={{ margin: '0 0 0.25rem', color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>{em.patient}</p>
              <p style={{ margin: '0 0 0.5rem', color: '#ef4444', fontSize: '0.8rem', fontWeight: 600 }}>{em.type}</p>
              <p style={{ margin: '0 0 0.25rem', color: '#94a3b8', fontSize: '0.75rem' }}>📍 {em.location}</p>
              <p style={{ margin: '0 0 0.75rem', color: '#94a3b8', fontSize: '0.75rem' }}>🏥 → {em.assignedHospital}</p>
              <div style={{ padding: '0.5rem 0.75rem', backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }}>
                <p style={{ margin: 0, color: '#fbbf24', fontWeight: 800, fontSize: '1.1rem' }}>ETA: {em.eta} min</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes livePulse { 0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(239,68,68,0.4)} 50%{opacity:0.7;box-shadow:0 0 0 6px rgba(239,68,68,0)} }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
