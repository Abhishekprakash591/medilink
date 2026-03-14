import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, MapPin, CheckCircle, Truck, Phone, RefreshCw } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';

const INITIAL_EMERGENCIES = [
  { id: 'EM-001', patient: 'John Doe', age: 42, type: 'Cardiac Emergency', severity: 'critical', location: 'Koregaon Park, Pune', assignedHospital: 'CityCare Hospital', ambulance: 'AMB-002', driver: 'Manoj Kumar', eta: 4, time: Date.now() - 8 * 60000, status: 'in-transit' },
  { id: 'EM-002', patient: 'Meera Joshi', age: 29, type: 'Road Accident (Multiple Injuries)', severity: 'critical', location: 'Hadapsar Bypass, Pune', assignedHospital: 'Ruby Hall Clinic', ambulance: 'AMB-003', driver: 'Ravi Sharma', eta: 7, time: Date.now() - 15 * 60000, status: 'in-transit' },
  { id: 'EM-003', patient: 'Ramesh K.', age: 58, type: 'Suspected Stroke', severity: 'critical', location: 'FC Road, Pune', assignedHospital: 'Apollo Hospital', ambulance: 'AMB-006', driver: 'Vijay Gaikwad', eta: 3, time: Date.now() - 5 * 60000, status: 'in-transit' },
  { id: 'EM-004', patient: 'Anita Desai', age: 34, type: 'Severe Asthma Attack', severity: 'high', location: 'Kothrud, Pune', assignedHospital: 'KEM Hospital', ambulance: 'AMB-005', driver: 'Arjun Naik', eta: 10, time: Date.now() - 3 * 60000, status: 'dispatched' },
  { id: 'EM-005', patient: 'Rajesh Iyer', age: 65, type: 'Diabetic Emergency / Hypoglycaemia', severity: 'moderate', location: 'Aundh, Pune', assignedHospital: 'CityCare Hospital', ambulance: 'AMB-001', driver: 'Suresh Patil', eta: 8, time: Date.now() - 2 * 60000, status: 'dispatched' },
  { id: 'EM-006', patient: 'Priya Shah', age: 27, type: 'Pregnancy Complications', severity: 'high', location: 'Hinjewadi Phase 2', assignedHospital: 'Ruby Hall Clinic', ambulance: 'AMB-007', driver: 'Santosh More', eta: 12, time: Date.now() - 1 * 60000, status: 'dispatched' },
  { id: 'EM-007', patient: 'Kunal Pawar', age: 8, type: 'Pediatric Seizure', severity: 'critical', location: 'Viman Nagar, Pune', assignedHospital: 'KEM Hospital', ambulance: 'AMB-001', driver: 'Suresh Patil', eta: 6, time: Date.now() - 4 * 60000, status: 'in-transit' },
];

const SEV_CFG = {
  critical: { color: '#ef4444', bg: '#fee2e2', label: 'Critical' },
  high:     { color: '#f97316', bg: '#ffedd5', label: 'High' },
  moderate: { color: '#f59e0b', bg: '#fef9c3', label: 'Moderate' },
};

export const LiveEmergenciesPage = () => {
  const [emergencies, setEmergencies] = useState(INITIAL_EMERGENCIES);
  const [filter, setFilter] = useState('all');
  const [tick, setTick] = useState(0);

  // Simulate ETA countdown
  useEffect(() => {
    const t = setInterval(() => {
      setTick(n => n + 1);
      setEmergencies(prev =>
        prev.map(e => e.eta > 0 ? { ...e, eta: +(e.eta - 0.05).toFixed(2) } : e)
      );
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const elapsedMins = (time) => Math.round((Date.now() - time) / 60000);
  const displayed = filter === 'all' ? emergencies : emergencies.filter(e => e.severity === filter);

  return (
    <div className="module-page">
      <PageHeader title="Live Emergency Feed" description="Real-time tracking of all active ambulance dispatches and emergency cases across the city." />

      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', backgroundColor: '#0f172a', borderRadius: '12px', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444', animation: 'livePulse 1.5s infinite' }} />
          <span style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>{emergencies.length} ACTIVE EMERGENCIES</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {[
            { key: 'all', label: 'All' },
            { key: 'critical', label: '🔴 Critical' },
            { key: 'high', label: '🟠 High' },
            { key: 'moderate', label: '🟡 Moderate' },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{ padding: '0.4rem 0.875rem', borderRadius: '999px', border: `1px solid ${filter === f.key ? 'white' : '#334155'}`, backgroundColor: filter === f.key ? 'white' : 'transparent', color: filter === f.key ? '#0f172a' : '#94a3b8', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {displayed.map(em => {
          const sev = SEV_CFG[em.severity];
          const elapsed = elapsedMins(em.time);
          const isTransit = em.status === 'in-transit';

          return (
            <div key={em.id} style={{ backgroundColor: 'white', borderRadius: '14px', border: `2px solid ${sev.bg}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              {/* Top severity bar */}
              <div style={{ height: '4px', backgroundColor: sev.color, width: '100%' }} />
              
              <div style={{ padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                
                {/* Patient Info */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>{em.id}</span>
                    <span style={{ padding: '2px 8px', borderRadius: '999px', backgroundColor: sev.bg, color: sev.color, fontSize: '0.7rem', fontWeight: 700 }}>{sev.label}</span>
                    <span style={{ padding: '2px 8px', borderRadius: '999px', backgroundColor: isTransit ? '#fee2e2' : '#f1f5f9', color: isTransit ? '#ef4444' : '#64748b', fontSize: '0.65rem', fontWeight: 700 }}>
                      {isTransit ? '🚑 IN TRANSIT' : '📡 DISPATCHED'}
                    </span>
                  </div>
                  <h3 style={{ margin: '0 0 0.2rem', fontWeight: 800, fontSize: '1rem' }}>{em.patient} · {em.age}yr</h3>
                  <p style={{ margin: '0 0 0.5rem', color: sev.color, fontWeight: 700, fontSize: '0.875rem' }}>{em.type}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                    <MapPin size={13} /> {em.location}
                  </div>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>⏱ Active for {elapsed} min</p>
                </div>

                {/* Hospital + Ambulance */}
                <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Assigned Hospital</p>
                  <p style={{ margin: '0 0 1rem', fontWeight: 700, fontSize: '0.9rem', color: '#1e3a8a' }}>🏥 {em.assignedHospital}</p>
                  
                  <p style={{ margin: '0 0 0.3rem', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Ambulance</p>
                  <p style={{ margin: '0 0 0.2rem', fontWeight: 700, fontSize: '0.875rem', fontFamily: 'monospace' }}>{em.ambulance}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                    <Phone size={12} /> {em.driver}
                  </div>
                </div>

                {/* ETA */}
                <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Estimated Arrival</p>
                  <p style={{ margin: '0 0 0.25rem', fontSize: '3rem', fontWeight: 900, color: Math.round(em.eta) <= 3 ? '#ef4444' : '#f59e0b', lineHeight: 1, animation: Math.round(em.eta) <= 3 ? 'urgencyPulse 1s infinite' : 'none' }}>
                    {Math.max(0, Math.round(em.eta))}
                  </p>
                  <p style={{ margin: '0 0 1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>minutes</p>
                  {Math.round(em.eta) <= 3 && <span style={{ padding: '3px 10px', borderRadius: '999px', backgroundColor: '#fee2e2', color: '#ef4444', fontSize: '0.7rem', fontWeight: 700 }}>⚠️ ARRIVING SOON</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes livePulse { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.4)} 50%{box-shadow:0 0 0 6px rgba(239,68,68,0)} }
        @keyframes urgencyPulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
      `}</style>
    </div>
  );
};

export default LiveEmergenciesPage;
