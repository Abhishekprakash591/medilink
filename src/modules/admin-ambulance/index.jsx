import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Phone, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';

const INITIAL_FLEET = [
  { id: 'AMB-001', driver: 'Suresh Patil', phone: '+91 98712 30011', zone: 'North', status: 'available', location: 'CityCare Hospital, Baner', fuel: 88 },
  { id: 'AMB-002', driver: 'Manoj Kumar', phone: '+91 98712 30022', zone: 'West', status: 'dispatched', location: 'En route → Apollo Hospital', fuel: 62, patient: 'John Doe', eta: 4 },
  { id: 'AMB-003', driver: 'Ravi Sharma', phone: '+91 98712 30033', zone: 'South', status: 'dispatched', location: 'En route → Ruby Hall', fuel: 45, patient: 'Meera Joshi', eta: 7 },
  { id: 'AMB-004', driver: 'Pradeep Yadav', phone: '+91 98712 30044', zone: 'Central', status: 'maintenance', location: 'Depot — Shivajinagar', fuel: 20 },
  { id: 'AMB-005', driver: 'Arjun Naik', phone: '+91 98712 30055', zone: 'East', status: 'available', location: 'KEM Hospital, Rasta Peth', fuel: 95 },
  { id: 'AMB-006', driver: 'Vijay Gaikwad', phone: '+91 98712 30066', zone: 'North', status: 'dispatched', location: 'En route → FC Road', fuel: 71, patient: 'Ramesh K.', eta: 3 },
  { id: 'AMB-007', driver: 'Santosh More', phone: '+91 98712 30077', zone: 'South', status: 'available', location: 'Ruby Hall, Sassoon Rd', fuel: 84 },
  { id: 'AMB-008', driver: 'Devraj Singh', phone: '+91 98712 30088', zone: 'West', status: 'maintenance', location: 'Depot — Wakad', fuel: 15 },
];

const STATUS_CFG = {
  available:   { label: 'Available', color: '#10b981', bg: '#d1fae5', icon: CheckCircle },
  dispatched:  { label: 'Dispatched', color: '#ef4444', bg: '#fee2e2', icon: Truck },
  maintenance: { label: 'Maintenance', color: '#f59e0b', bg: '#fef3c7', icon: AlertTriangle },
};

export const AmbulancePage = () => {
  const [fleet, setFleet] = useState(INITIAL_FLEET);
  const [filter, setFilter] = useState('all');

  // Simulate ETA countdown
  useEffect(() => {
    const t = setInterval(() => {
      setFleet(prev => prev.map(a => a.eta ? { ...a, eta: Math.max(1, a.eta - 0.05) } : a));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const displayed = filter === 'all' ? fleet : fleet.filter(a => a.status === filter);
  const counts = { available: fleet.filter(a => a.status === 'available').length, dispatched: fleet.filter(a => a.status === 'dispatched').length, maintenance: fleet.filter(a => a.status === 'maintenance').length };

  return (
    <div className="module-page">
      <PageHeader title="Ambulance Fleet" description="Real-time tracking and status of all city ambulances." />

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { key: 'available', label: 'Available', color: '#10b981', bg: '#d1fae5' },
          { key: 'dispatched', label: 'Dispatched', color: '#ef4444', bg: '#fee2e2' },
          { key: 'maintenance', label: 'In Maintenance', color: '#f59e0b', bg: '#fef3c7' },
        ].map(s => (
          <div key={s.key} onClick={() => setFilter(filter === s.key ? 'all' : s.key)} style={{ backgroundColor: filter === s.key ? s.bg : 'white', borderRadius: '12px', padding: '1.25rem', border: `2px solid ${filter === s.key ? s.color : 'var(--border-color)'}`, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
            <p style={{ margin: '0 0 0.25rem', fontSize: '2.5rem', fontWeight: 900, color: s.color }}>{counts[s.key]}</p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Fleet Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
        {displayed.map(amb => {
          const cfg = STATUS_CFG[amb.status];
          const StatusIcon = cfg.icon;
          const fuelColor = amb.fuel > 50 ? '#10b981' : amb.fuel > 25 ? '#f59e0b' : '#ef4444';

          return (
            <div key={amb.id} style={{ backgroundColor: 'white', borderRadius: '14px', border: `2px solid ${cfg.bg}`, padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Truck size={22} color={cfg.color} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: '1rem', fontFamily: 'monospace', letterSpacing: '0.05em' }}>{amb.id}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{amb.zone} Zone</p>
                  </div>
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '999px', backgroundColor: cfg.bg, color: cfg.color, fontWeight: 700, fontSize: '0.75rem' }}>
                  <StatusIcon size={13} /> {cfg.label}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem', fontSize: '0.825rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>👤</span> {amb.driver}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <Phone size={13} /> {amb.phone}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <MapPin size={13} /> {amb.location}
                </div>
                {amb.patient && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: 600 }}>
                    <Clock size={13} /> Patient: {amb.patient} · ETA {Math.round(amb.eta)} min
                  </div>
                )}
              </div>

              {/* Fuel Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>⛽ FUEL</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: fuelColor }}>{amb.fuel}%</span>
                </div>
                <div style={{ height: '5px', backgroundColor: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${amb.fuel}%`, height: '100%', backgroundColor: fuelColor, borderRadius: '999px', transition: 'width 0.5s' }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AmbulancePage;
