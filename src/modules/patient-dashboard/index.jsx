import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, FileText, Search, Activity, CalendarClock, Phone } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';

export const PatientDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="module-page">
      <PageHeader 
        title="Good Morning, John" 
        description="Here is a summary of your health profile and upcoming activities."
      />

      {/* Emergency Quick Action */}
      <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', padding: '1rem 1.5rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', animation: 'fadeIn 0.5s ease' }}>
        <div>
          <h3 style={{ margin: '0 0 0.25rem', color: '#b91c1c', fontSize: '1.1rem', fontWeight: 800 }}>Need immediate help?</h3>
          <p style={{ margin: 0, color: '#7f1d1d', fontSize: '0.9rem' }}>Trigger the Emergency SOS to find ambulances and hospitals instantly.</p>
        </div>
        <button style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 6px rgba(239,68,68,0.2)' }} onClick={() => document.querySelector('.sidebar button')?.click()}>
           Activate SOS
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Next Appointment */}
        <Card style={{ borderLeft: '4px solid var(--primary-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarClock size={20} color="var(--primary-color)" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Upcoming Appointment</p>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Dr. Ramesh Sharma</h3>
            </div>
          </div>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem' }}><strong>Tomorrow, 10:00 AM</strong></p>
          <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Activity size={14}/> Reason: Follow-up Check
          </p>
          <button style={{ width: '100%', padding: '0.625rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/patient/find-doctor')}>
            Reschedule
          </button>
        </Card>

        {/* AI Health Overview */}
        <Card style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={20} color="#16a34a" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#166534', fontWeight: 600, textTransform: 'uppercase' }}>AI Health Status</p>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#15803d' }}>Stable</h3>
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ margin: '0 0 0.25rem', fontSize: '0.85rem', color: '#166534', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
              Diabetes Risk <span>Medium</span>
            </p>
            <div style={{ height: '6px', backgroundColor: '#dcfce7', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: '45%', height: '100%', backgroundColor: '#f59e0b' }} />
            </div>
          </div>
          <button style={{ width: '100%', padding: '0.625rem', backgroundColor: 'transparent', color: '#15803d', border: '1px solid #22c55e', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/patient/health-card')}>
            View Full Digital Card
          </button>
        </Card>

      </div>

      <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 800 }}>Quick Tools</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Check Symptoms', icon: Activity, to: '/patient/symptom-checker', color: '#8b5cf6' },
          { label: 'Analyze Prescription', icon: FileText, to: '/patient/prescription-analyzer', color: '#f59e0b' },
          { label: 'Find a Doctor', icon: Search, to: '/patient/find-doctor', color: '#3b82f6' },
        ].map((t, i) => (
          <div key={i} onClick={() => navigate(t.to)} style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }} onMouseOver={(e) => {e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = t.color}} onMouseOut={(e) => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-color)'}}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: `${t.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <t.icon size={20} color={t.color} />
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.label}</span>
          </div>
        ))}
      </div>
      
      <style>{`@keyframes fadeIn { from{opacity:0;} to{opacity:1;} }`}</style>
    </div>
  );
};

export default PatientDashboard;
