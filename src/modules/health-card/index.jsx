import React, { useState } from 'react';
import { Heart, Phone, AlertTriangle, Download, Droplets, Shield } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const HEALTH_HISTORY = [
  { year: 'Mar 2026', condition: 'Viral Fever', doctor: 'Dr. R. Sharma', status: 'resolved' },
  { year: 'Nov 2025', condition: 'Vaccination (COVID Booster)', doctor: 'Dr. R. Sharma', status: 'done' },
  { year: 'Jul 2025', condition: 'URTI / Cold', doctor: 'Dr. R. Sharma', status: 'resolved' },
  { year: 'Jan 2025', condition: 'Hypertension Check', doctor: 'Dr. R. Sharma', status: 'managed' },
  { year: 'Aug 2024', condition: 'Dengue Fever', doctor: 'Dr. S. Patel', status: 'resolved' },
];

const VACCINATIONS = [
  { name: 'COVID-19 (Covishield)', date: 'Nov 2025', status: 'done' },
  { name: 'Influenza', date: 'Jan 2026', status: 'done' },
  { name: 'Tetanus (Booster)', date: 'Due Oct 2026', status: 'upcoming' },
  { name: 'Hepatitis B', date: 'Complete (3 doses)', status: 'done' },
];

const RISK_SCORES = [
  { label: 'Diabetes', risk: 'Medium', pct: 45, color: '#f59e0b' },
  { label: 'Hypertension', risk: 'Low', pct: 22, color: '#10b981' },
  { label: 'Heart Disease', risk: 'Low', pct: 18, color: '#10b981' },
  { label: 'Kidney Issues', risk: 'Low', pct: 12, color: '#10b981' },
];

export const HealthCardPage = () => {
  const [activeTab, setActiveTab] = useState('card');
  const TABS = ['card', 'history', 'vaccinations', 'ai-risk'];
  const TAB_LABELS = { card: '🪪 Digital ID', history: '📋 History', vaccinations: '💉 Vaccinations', 'ai-risk': '🧠 AI Risk' };

  return (
    <div className="module-page">
      <PageHeader
        title="Digital Health Card"
        description="Your permanent health identity — accessible anytime, anywhere."
        actions={<Button variant="primary"><Download size={16} style={{ marginRight: '8px' }} />Download PDF</Button>}
      />

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ padding: '0.75rem 1.25rem', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: activeTab === t ? 700 : 400, color: activeTab === t ? 'var(--primary-color)' : 'var(--text-secondary)', borderBottom: activeTab === t ? '2px solid var(--primary-color)' : '2px solid transparent', fontSize: '0.9rem', transition: 'all 0.2s' }}>
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Tab: Digital Health Card */}
      {activeTab === 'card' && (
        <div style={{ maxWidth: '700px' }}>
          <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)' }}>
            {/* Card Top */}
            <div style={{ padding: '1.75rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: '0 0 0.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>MEDISIGHT Digital Health Card</p>
                <h2 style={{ margin: '0 0 0.25rem', color: 'white', fontSize: '1.75rem', fontWeight: 800 }}>John Doe</h2>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Male · 34 years · DOB: 15 Jan 1992</p>
              </div>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontWeight: 900, fontSize: '1.5rem' }}>JD</span>
              </div>
            </div>

            {/* Card Middle - critical info */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 1.5rem', borderRadius: '12px', padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <Droplets size={20} color="#f87171" style={{ marginBottom: '0.25rem' }} />
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.65rem', textTransform: 'uppercase' }}>Blood Group</p>
                <p style={{ margin: 0, color: 'white', fontWeight: 800, fontSize: '1.25rem' }}>B+</p>
              </div>
              <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.2)', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
                <AlertTriangle size={20} color="#fbbf24" style={{ marginBottom: '0.25rem' }} />
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.65rem', textTransform: 'uppercase' }}>Allergies</p>
                <p style={{ margin: 0, color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>Penicillin</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Shield size={20} color="#4ade80" style={{ marginBottom: '0.25rem' }} />
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.65rem', textTransform: 'uppercase' }}>Insurance</p>
                <p style={{ margin: 0, color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>Ayushman</p>
              </div>
            </div>

            {/* Card Bottom */}
            <div style={{ padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <p style={{ margin: '0 0 0.25rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }}>Emergency Contact</p>
                <p style={{ margin: '0 0 0.1rem', color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>Sunita Doe (Spouse)</p>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={12} /> +91 98765 43210
                </p>
              </div>
              {/* QR Code Placeholder */}
              <div style={{ width: '70px', height: '70px', backgroundColor: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '2px', width: '100%', height: '100%' }}>
                  {Array.from({ length: 25 }, (_, i) => (
                    <div key={i} style={{ backgroundColor: [0,1,5,6,2,12,13,18,19,24,23,7,11,17,14,10,8,16,22,20].includes(i) ? '#1e3a8a' : 'transparent', borderRadius: '1px' }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Current Medicines */}
          <Card style={{ marginTop: '1rem' }}>
            <h3 style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', fontWeight: 700 }}>Current Medications</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['Paracetamol 500mg', 'ORS Sachet', 'Cetirizine 10mg'].map(m => (
                <Badge key={m} variant="info" style={{ fontSize: '0.8rem', padding: '4px 12px' }}>{m}</Badge>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Tab: Medical History */}
      {activeTab === 'history' && (
        <Card padding="0" style={{ maxWidth: '700px' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ margin: 0, fontWeight: 700 }}>Medical Visit Timeline</h3>
          </div>
          <div style={{ position: 'relative', padding: '0 1.25rem' }}>
            <div style={{ position: 'absolute', left: '2.5rem', top: 0, bottom: 0, width: '2px', backgroundColor: 'var(--border-color)' }} />
            {HEALTH_HISTORY.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', padding: '1rem 0', position: 'relative' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, flexShrink: 0 }}>
                  <Heart size={16} color="white" />
                </div>
                <div style={{ flex: 1, paddingTop: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ margin: '0 0 0.2rem', fontWeight: 700, fontSize: '0.9rem' }}>{item.condition}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.doctor}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.year}</span>
                      <Badge variant={item.status === 'resolved' || item.status === 'done' ? 'success' : 'warning'}>{item.status}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab: Vaccinations */}
      {activeTab === 'vaccinations' && (
        <Card padding="0" style={{ maxWidth: '700px' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ margin: 0, fontWeight: 700 }}>Vaccination Record</h3>
          </div>
          {VACCINATIONS.map((v, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 1.25rem', borderBottom: i < VACCINATIONS.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
              <div>
                <p style={{ margin: '0 0 0.2rem', fontWeight: 600, fontSize: '0.9rem' }}>{v.name}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{v.date}</p>
              </div>
              <Badge variant={v.status === 'done' ? 'success' : 'warning'}>
                {v.status === 'done' ? '✅ Completed' : '⏰ Due Soon'}
              </Badge>
            </div>
          ))}
        </Card>
      )}

      {/* Tab: AI Risk */}
      {activeTab === 'ai-risk' && (
        <div style={{ maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Card>
            <h3 style={{ margin: '0 0 0.25rem', fontWeight: 700 }}>🧠 AI Health Risk Assessment</h3>
            <p style={{ margin: '0 0 1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Based on age, history, and lifestyle — AI confidence: 72%</p>
            {RISK_SCORES.map((r, i) => (
              <div key={i} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.label}</span>
                  <Badge variant={r.risk === 'High' ? 'danger' : r.risk === 'Medium' ? 'warning' : 'success'}>{r.risk} Risk</Badge>
                </div>
                <div style={{ height: '10px', backgroundColor: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${r.pct}%`, backgroundColor: r.color, borderRadius: '999px', transition: 'width 0.8s ease' }} />
                </div>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{r.pct}% risk probability</p>
              </div>
            ))}
          </Card>

          <Card style={{ backgroundColor: '#fef3c7', border: '1px solid #fcd34d' }}>
            <h4 style={{ margin: '0 0 0.75rem', color: '#92400e', fontWeight: 700 }}>⚠ AI Recommendations</h4>
            <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
              {['Get HbA1c blood test (diabetes screening)', 'Reduce sugar and processed food intake', 'Walk 30 minutes daily', 'Annual lipid panel check recommended', 'Monitor BP weekly'].map((r, i) => (
                <li key={i} style={{ fontSize: '0.875rem', color: '#78350f', marginBottom: '0.4rem' }}>{r}</li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
};

export default HealthCardPage;
