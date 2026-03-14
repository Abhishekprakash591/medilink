import React, { useState } from 'react';
import { BedDouble, Search, CheckCircle, AlertTriangle, XCircle, Filter } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';

const HOSPITALS = [
  {
    id: 1, name: 'CityCare Hospital', zone: 'North', address: 'Baner Rd, Pune',
    phone: '+91 20 6600 1100',
    wards: [
      { name: 'ICU', total: 20, available: 12, type: 'icu' },
      { name: 'General', total: 80, available: 45, type: 'general' },
      { name: 'Emergency', total: 10, available: 4, type: 'emergency' },
      { name: 'Maternity', total: 15, available: 9, type: 'maternity' },
      { name: 'Pediatric', total: 12, available: 7, type: 'pediatric' },
    ],
  },
  {
    id: 2, name: 'Apollo Hospital', zone: 'West', address: 'Wakad, Pune',
    phone: '+91 20 6652 7777',
    wards: [
      { name: 'ICU', total: 15, available: 2, type: 'icu' },
      { name: 'General', total: 60, available: 10, type: 'general' },
      { name: 'Emergency', total: 8, available: 1, type: 'emergency' },
      { name: 'Cardiac ICU', total: 10, available: 1, type: 'icu' },
      { name: 'Maternity', total: 10, available: 6, type: 'maternity' },
    ],
  },
  {
    id: 3, name: 'Ruby Hall Clinic', zone: 'South', address: 'Sassoon Rd, Pune',
    phone: '+91 20 6645 5100',
    wards: [
      { name: 'ICU', total: 25, available: 18, type: 'icu' },
      { name: 'General', total: 90, available: 55, type: 'general' },
      { name: 'Emergency', total: 12, available: 6, type: 'emergency' },
      { name: 'Neuro ICU', total: 8, available: 4, type: 'icu' },
      { name: 'Pediatric', total: 18, available: 11, type: 'pediatric' },
    ],
  },
  {
    id: 4, name: 'Jehangir Hospital', zone: 'Central', address: 'Sassoon Rd, Pune',
    phone: '+91 20 6681 5000',
    wards: [
      { name: 'ICU', total: 12, available: 0, type: 'icu' },
      { name: 'General', total: 50, available: 0, type: 'general' },
      { name: 'Emergency', total: 6, available: 0, type: 'emergency' },
      { name: 'Cardiac', total: 8, available: 0, type: 'icu' },
    ],
  },
  {
    id: 5, name: 'KEM Hospital', zone: 'East', address: 'Rasta Peth, Pune',
    phone: '+91 20 2612 6300',
    wards: [
      { name: 'ICU', total: 18, available: 8, type: 'icu' },
      { name: 'General', total: 70, available: 30, type: 'general' },
      { name: 'Emergency', total: 10, available: 3, type: 'emergency' },
      { name: 'Pediatric', total: 14, available: 6, type: 'pediatric' },
    ],
  },
];

const getStatus = (available, total) => {
  const pct = available / total;
  if (available === 0) return { label: 'Full', color: '#6b7280', bg: '#f3f4f6', icon: XCircle };
  if (pct < 0.2)       return { label: 'Critical', color: '#ef4444', bg: '#fee2e2', icon: AlertTriangle };
  if (pct < 0.5)       return { label: 'Moderate', color: '#f59e0b', bg: '#fef9c3', icon: AlertTriangle };
  return               { label: 'Available', color: '#10b981', bg: '#d1fae5', icon: CheckCircle };
};

export const HospitalBedsPage = () => {
  const [search, setSearch]       = useState('');
  const [filterZone, setZone]     = useState('All');
  const [expanded, setExpanded]   = useState(null);

  const zones = ['All', ...new Set(HOSPITALS.map(h => h.zone))];
  const filtered = HOSPITALS.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) &&
    (filterZone === 'All' || h.zone === filterZone)
  );

  return (
    <div className="module-page">
      <PageHeader
        title="Hospital Bed Registry"
        description="Real-time bed availability across all empanelled hospitals in Pune city."
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input placeholder="Search hospital..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.625rem 0.75rem 0.625rem 2.25rem', border: '1px solid var(--border-color)', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {zones.map(z => (
            <button key={z} onClick={() => setZone(z)} style={{ padding: '0.5rem 1rem', borderRadius: '999px', border: `2px solid ${filterZone === z ? '#1e3a8a' : 'var(--border-color)'}`, backgroundColor: filterZone === z ? '#1e3a8a' : 'white', color: filterZone === z ? 'white' : 'var(--text-secondary)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
              {z}
            </button>
          ))}
        </div>
      </div>

      {/* Hospital Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map(h => {
          const totalBeds = h.wards.reduce((s, w) => s + w.total, 0);
          const availBeds = h.wards.reduce((s, w) => s + w.available, 0);
          const overallStatus = getStatus(availBeds, totalBeds);
          const StatusIcon = overallStatus.icon;
          const isExpanded = expanded === h.id;

          return (
            <div key={h.id} style={{ backgroundColor: 'white', borderRadius: '14px', border: `2px solid ${isExpanded ? '#1e3a8a' : 'var(--border-color)'}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'border-color 0.2s' }}>
              
              {/* Header Row */}
              <div onClick={() => setExpanded(isExpanded ? null : h.id)} style={{ padding: '1.25rem 1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <BedDouble size={24} color="#1e3a8a" />
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 0.2rem', fontWeight: 800, fontSize: '1rem' }}>{h.name}</h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{h.zone} · {h.address} · {h.phone}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, color: overallStatus.color, lineHeight: 1 }}>{availBeds}</p>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-secondary)' }}>of {totalBeds} free</p>
                  </div>
                  <span style={{ padding: '4px 12px', borderRadius: '999px', backgroundColor: overallStatus.bg, color: overallStatus.color, fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <StatusIcon size={14} /> {overallStatus.label}
                  </span>
                  <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none' }}>▾</span>
                </div>
              </div>

              {/* Expandable Ward Detail */}
              {isExpanded && (
                <div style={{ padding: '0 1.5rem 1.5rem', borderTop: '1px solid var(--border-color)', animation: 'fadeIn 0.2s ease' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem', marginTop: '1.25rem' }}>
                    {h.wards.map((ward, i) => {
                      const ws = getStatus(ward.available, ward.total);
                      const pct = Math.round((ward.available / ward.total) * 100);
                      return (
                        <div key={i} style={{ backgroundColor: '#f8fafc', borderRadius: '10px', padding: '1rem', border: `1px solid ${ws.bg}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem' }}>{ward.name}</p>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: ws.color, padding: '2px 6px', backgroundColor: ws.bg, borderRadius: '999px' }}>{ws.label}</span>
                          </div>
                          <p style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: 900, color: ws.color, lineHeight: 1 }}>{ward.available}<span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>/{ward.total}</span></p>
                          <div style={{ height: '5px', backgroundColor: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', backgroundColor: ws.color, borderRadius: '999px', transition: 'width 0.5s' }} />
                          </div>
                          <p style={{ margin: '0.3rem 0 0', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{pct}% available</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
    </div>
  );
};

export default HospitalBedsPage;
