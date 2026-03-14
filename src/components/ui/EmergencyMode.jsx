import React, { useState, useEffect } from 'react';
import { X, Phone, MapPin, Navigation, AlertTriangle, Droplets, Wind, Zap } from 'lucide-react';

const HOSPITALS = [
  { id: 1, name: 'CityCare Hospital', distance: '1.2 km', icuBeds: 2, generalBeds: 5, eta: 7, status: 'available', address: 'Pune Nagar Road, Pune' },
  { id: 2, name: 'Apollo Hospital', distance: '2.4 km', icuBeds: 0, generalBeds: 8, eta: 12, status: 'limited', address: 'Baner, Pune' },
  { id: 3, name: 'Ruby Hall Clinic', distance: '3.1 km', icuBeds: 4, generalBeds: 12, eta: 15, status: 'available', address: 'Sassoon Road, Pune' },
  { id: 4, name: 'Jehangir Hospital', distance: '4.0 km', icuBeds: 0, generalBeds: 0, eta: 20, status: 'full', address: 'Nagar Road, Pune' },
];

const BLOOD_BANKS = [
  { name: 'City Blood Bank', distance: '1.5 km', available: ['O+', 'A+', 'B+', 'AB+'] },
  { name: 'Red Cross Blood Center', distance: '2.8 km', available: ['O+', 'A+', 'O-'] },
  { name: 'Life Line Blood Bank', distance: '3.2 km', available: ['B+', 'AB+', 'A-'] },
];

const OXYGEN_STORES = [
  { name: 'City Medical Store', distance: '800m', cylinders: 3 },
  { name: 'Apollo Pharmacy', distance: '1.1 km', cylinders: 1 },
  { name: 'MedLine Supplies', distance: '2.3 km', cylinders: 7 },
];

const STATUS_CONFIG = {
  available: { color: '#10b981', bg: '#d1fae5', label: 'Available' },
  limited: { color: '#f59e0b', bg: '#fef3c7', label: 'Limited' },
  full: { color: '#ef4444', bg: '#fee2e2', label: 'Full' },
};

export const EmergencyMode = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('hospitals');
  const [eta, setEta] = useState(7);
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [bedFilter, setBedFilter] = useState('all');
  const [sosActivated, setSosActivated] = useState(false);

  // ETA countdown
  useEffect(() => {
    if (!sosActivated) return;
    const t = setInterval(() => setEta(e => Math.max(1, e - 1)), 60000);
    return () => clearInterval(t);
  }, [sosActivated]);

  // Auto-activate SOS
  useEffect(() => {
    const handleActivate = () => setSosActivated(true);
    window.addEventListener('activate-sos', handleActivate);
    return () => window.removeEventListener('activate-sos', handleActivate);
  }, []);

  const tabs = ['hospitals', 'blood', 'oxygen'];
  const tabLabels = { hospitals: '🏥 Hospitals', blood: '🩸 Blood Bank', oxygen: '💨 Oxygen' };

  const filteredHospitals = HOSPITALS.filter(h => {
    if (bedFilter === 'icu') return h.icuBeds > 0;
    if (bedFilter === 'general') return h.generalBeds > 0;
    return true;
  });

  const filteredBanks = BLOOD_BANKS.filter(b => b.available.includes(bloodGroup));

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 0, 0, 0.92)',
      zIndex: 200, display: 'flex', flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ backgroundColor: '#7f1d1d', borderBottom: '2px solid #ef4444', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ animation: 'dangerPulse 1s infinite' }}>
            <AlertTriangle size={28} color="#fecaca" />
          </div>
          <div>
            <h1 style={{ margin: 0, color: '#fecaca', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.1em' }}>⚠ EMERGENCY MODE</h1>
            <p style={{ margin: 0, color: '#fca5a5', fontSize: '0.75rem' }}>Emergency services have been alerted · Pune, India</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a href="tel:108" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#ef4444', color: 'white', padding: '0.5rem 1rem', borderRadius: '999px', textDecoration: 'none', fontWeight: 700, fontSize: '1rem', animation: 'dangerPulse 1.5s infinite' }}>
            <Phone size={18} /> 108
          </a>
          <button onClick={onClose} style={{ background: 'transparent', border: '1px solid #fca5a5', color: '#fca5a5', borderRadius: '8px', padding: '0.5rem', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>
      </div>

      {/* SOS Banner */}
      {!sosActivated ? (
        <div style={{ backgroundColor: '#1a0000', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ margin: 0, color: '#fca5a5', fontSize: '0.9rem' }}>🚨 Click SOS to immediately alert nearby ambulances and hospitals</p>
          <button onClick={() => setSosActivated(true)} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', padding: '0.5rem 1.5rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', animation: 'dangerPulse 1.5s infinite' }}>
            ACTIVATE SOS
          </button>
        </div>
      ) : (
        <div style={{ backgroundColor: '#1c1917', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444', animation: 'dangerPulse 0.8s infinite' }} />
            <span style={{ color: '#fca5a5', fontWeight: 700, fontSize: '0.9rem' }}>SOS ACTIVATED</span>
          </div>
          <span style={{ color: '#fca5a5' }}>🚑 Ambulance ETA: <strong style={{ color: 'white' }}>{eta} min</strong></span>
          <span style={{ color: '#fca5a5' }}>📍 Location shared with: <strong style={{ color: 'white' }}>CityCare Hospital</strong></span>
        </div>
      )}

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>
        {/* Left Panel */}
        <div style={{ borderRight: '1px solid #3f0000', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #3f0000' }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, padding: '0.75rem', border: 'none', backgroundColor: activeTab === t ? '#450a0a' : 'transparent', color: activeTab === t ? '#fca5a5' : '#9ca3af', fontWeight: activeTab === t ? 700 : 400, cursor: 'pointer', fontSize: '0.85rem', borderBottom: activeTab === t ? '2px solid #ef4444' : '2px solid transparent' }}>
                {tabLabels[t]}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
            {activeTab === 'hospitals' && (
              <>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  {['all', 'icu', 'general'].map(f => (
                    <button key={f} onClick={() => setBedFilter(f)} style={{ padding: '4px 12px', borderRadius: '999px', border: `1px solid ${bedFilter === f ? '#ef4444' : '#3f0000'}`, backgroundColor: bedFilter === f ? '#7f1d1d' : 'transparent', color: bedFilter === f ? '#fecaca' : '#9ca3af', fontSize: '0.75rem', cursor: 'pointer', textTransform: 'capitalize', fontWeight: bedFilter === f ? 700 : 400 }}>
                      {f === 'all' ? 'All Beds' : f === 'icu' ? 'ICU Only' : 'General'}
                    </button>
                  ))}
                </div>
                {filteredHospitals.map(h => {
                  const sc = STATUS_CONFIG[h.status];
                  return (
                    <div key={h.id} style={{ backgroundColor: '#1a0000', border: '1px solid #3f0000', borderRadius: '8px', padding: '0.875rem', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div>
                          <h4 style={{ margin: '0 0 0.2rem', color: 'white', fontSize: '0.95rem', fontWeight: 700 }}>{h.name}</h4>
                          <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={12} /> {h.address}
                          </p>
                        </div>
                        <span style={{ padding: '2px 10px', borderRadius: '999px', backgroundColor: sc.bg, color: sc.color, fontSize: '0.7rem', fontWeight: 700 }}>{sc.label}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.75rem' }}>
                        <div><p style={{ margin: 0, color: '#9ca3af', fontSize: '0.7rem' }}>ICU Beds</p><p style={{ margin: 0, color: h.icuBeds > 0 ? '#4ade80' : '#ef4444', fontWeight: 700, fontSize: '1.1rem' }}>{h.icuBeds}</p></div>
                        <div><p style={{ margin: 0, color: '#9ca3af', fontSize: '0.7rem' }}>General Beds</p><p style={{ margin: 0, color: h.generalBeds > 0 ? '#4ade80' : '#ef4444', fontWeight: 700, fontSize: '1.1rem' }}>{h.generalBeds}</p></div>
                        <div><p style={{ margin: 0, color: '#9ca3af', fontSize: '0.7rem' }}>Distance</p><p style={{ margin: 0, color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>{h.distance}</p></div>
                        <div><p style={{ margin: 0, color: '#9ca3af', fontSize: '0.7rem' }}>ETA</p><p style={{ margin: 0, color: '#fbbf24', fontWeight: 700, fontSize: '1.1rem' }}>{h.eta} min</p></div>
                      </div>
                      <button style={{ width: '100%', padding: '0.5rem', backgroundColor: '#7f1d1d', color: '#fecaca', border: '1px solid #ef4444', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <Navigation size={14} /> Get Directions
                      </button>
                    </div>
                  );
                })}
              </>
            )}

            {activeTab === 'blood' && (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ color: '#fca5a5', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Blood Group Needed</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                      <button key={bg} onClick={() => setBloodGroup(bg)} style={{ padding: '4px 12px', borderRadius: '6px', border: `1px solid ${bloodGroup === bg ? '#ef4444' : '#3f0000'}`, backgroundColor: bloodGroup === bg ? '#7f1d1d' : 'transparent', color: bloodGroup === bg ? 'white' : '#9ca3af', fontSize: '0.8rem', cursor: 'pointer', fontWeight: bloodGroup === bg ? 700 : 400 }}>
                        {bg}
                      </button>
                    ))}
                  </div>
                </div>
                {filteredBanks.length === 0 ? (
                  <p style={{ color: '#ef4444', padding: '1rem', textAlign: 'center' }}>No blood banks found with {bloodGroup} available nearby.</p>
                ) : filteredBanks.map((b, i) => (
                  <div key={i} style={{ backgroundColor: '#1a0000', border: '1px solid #3f0000', borderRadius: '8px', padding: '0.875rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <Droplets size={20} color="#ef4444" />
                      <div><h4 style={{ margin: 0, color: 'white', fontSize: '0.9rem' }}>{b.name}</h4><p style={{ margin: 0, color: '#9ca3af', fontSize: '0.75rem' }}>{b.distance}</p></div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {b.available.map(bg => <span key={bg} style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: bg === bloodGroup ? '#7f1d1d' : '#1f2937', color: bg === bloodGroup ? '#fecaca' : '#9ca3af', fontSize: '0.75rem', fontWeight: bg === bloodGroup ? 700 : 400, border: bg === bloodGroup ? '1px solid #ef4444' : '1px solid transparent' }}>{bg}</span>)}
                    </div>
                  </div>
                ))}
              </>
            )}

            {activeTab === 'oxygen' && OXYGEN_STORES.map((o, i) => (
              <div key={i} style={{ backgroundColor: '#1a0000', border: '1px solid #3f0000', borderRadius: '8px', padding: '0.875rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Wind size={24} color="#60a5fa" />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.25rem', color: 'white', fontSize: '0.9rem' }}>{o.name}</h4>
                  <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.75rem' }}>{o.distance}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0 0 0.25rem', color: '#4ade80', fontWeight: 700, fontSize: '1.1rem' }}>{o.cylinders}</p>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#9ca3af' }}>Cylinders</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel — Map Placeholder & Live Tracking */}
        <div style={{ position: 'relative', backgroundColor: '#0c0a0a', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(239,68,68,0.15) 0%, transparent 60%), radial-gradient(circle at 70% 60%, rgba(239,68,68,0.1) 0%, transparent 60%)', pointerEvents: 'none' }} />
          
          {!sosActivated ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
              <MapPin size={60} color="#ef4444" style={{ opacity: 0.4 }} />
              <p style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.9rem' }}>Interactive Map</p>
              <p style={{ color: '#6b7280', fontSize: '0.75rem', maxWidth: '200px', textAlign: 'center' }}>Hospital pins, ambulance tracking and live routing available in production.</p>
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {HOSPITALS.map(h => {
                  const sc = STATUS_CONFIG[h.status];
                  return (
                    <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#1a0000', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #3f0000' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: sc.color, flexShrink: 0 }} />
                      <span style={{ color: 'white', fontSize: '0.8rem', fontWeight: 500 }}>{h.name}</span>
                      <span style={{ color: '#9ca3af', fontSize: '0.75rem', marginLeft: 'auto' }}>{h.distance}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', zIndex: 1, padding: '2rem' }}>
              <div style={{ backgroundColor: '#1a0000', border: '2px solid #ef4444', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 0 30px rgba(239,68,68,0.2)' }}>
                
                <h3 style={{ margin: '0 0 1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.2rem', fontWeight: 800 }}>
                  <div style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '50%', animation: 'dangerPulse 1s infinite' }} />
                  Live Dispatch Tracking
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{ backgroundColor: '#3f0000', border: '1px solid #7f1d1d', padding: '1rem', borderRadius: '12px' }}>
                    <p style={{ margin: '0 0 0.4rem', color: '#fca5a5', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Destination Assigned</p>
                    <p style={{ margin: '0 0 0.25rem', color: 'white', fontWeight: 800, fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>CityCare Hospital</p>
                    <p style={{ margin: 0, color: '#fecaca', fontSize: '0.8rem' }}>Doctor On Standby: Dr. Rahul S.</p>
                  </div>
                  <div style={{ backgroundColor: '#3f0000', border: '1px solid #7f1d1d', padding: '1rem', borderRadius: '12px' }}>
                    <p style={{ margin: '0 0 0.4rem', color: '#fca5a5', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Ambulance Dispatched</p>
                    <p style={{ margin: '0 0 0.25rem', color: 'white', fontWeight: 800, fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>MH 12 AB 4598</p>
                    <p style={{ margin: 0, color: '#fecaca', fontSize: '0.8rem' }}>Driver: Ramesh (📞 Call)</p>
                  </div>
                </div>

                {/* Animated tracking line */}
                <div style={{ backgroundColor: '#0c0a0a', borderRadius: '12px', padding: '2rem 1.5rem', border: '1px solid #3f0000', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <span style={{ color: '#fca5a5', fontSize: '0.85rem', fontWeight: 600 }}>Your Location</span>
                    <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>Hospital</span>
                  </div>
                  
                  <div style={{ position: 'relative', height: '6px', backgroundColor: '#3f0000', borderRadius: '3px' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', backgroundColor: '#ef4444', borderRadius: '3px', width: `${((7-eta)/7)*100 + 10}%`, transition: 'width 1s linear' }} />
                    <div style={{ 
                      position: 'absolute', top: '50%', left: `${((7-eta)/7)*100 + 10}%`, 
                      transform: 'translate(-50%, -50%)', width: '40px', height: '40px', 
                      backgroundColor: 'white', border: '3px solid #ef4444', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
                      boxShadow: '0 0 15px rgba(239,68,68,0.5)', transition: 'left 1s linear', zIndex: 2
                    }}>
                      🚑
                    </div>
                    {/* Destination marker */}
                    <div style={{ position: 'absolute', top: '50%', right: 0, transform: 'translate(50%, -50%)', width: '24px', height: '24px', backgroundColor: '#10b981', border: '3px solid #0c0a0a', borderRadius: '50%', zIndex: 1 }} />
                  </div>
                  
                  <p style={{ textAlign: 'center', margin: '2rem 0 0', color: '#fca5a5', fontSize: '1rem', fontWeight: 700 }}>
                    Arriving in {eta} min
                  </p>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes dangerPulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </div>
  );
};

export default EmergencyMode;
