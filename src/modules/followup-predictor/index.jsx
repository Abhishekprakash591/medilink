import React, { useState } from 'react';
import {
  Brain, Calendar, Clock, User, AlertTriangle, CheckCircle,
  ChevronRight, RefreshCw, Zap, ArrowUpRight
} from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const PATIENTS_DATA = [
  {
    id: 1, name: 'John Doe', age: 42, condition: 'Hypertension + Diabetes',
    lastVisit: '2026-03-07', bpReading: '148/95', sugarLevel: '220 mg/dL',
    medications: ['Amlodipine 5mg', 'Metformin 500mg'],
    aiRisk: 'high', aiPrediction: 3, aiReason: 'BP and sugar both out of control. High non-compliance risk.',
    complianceScore: 42,
  },
  {
    id: 2, name: 'Priya Sharma', age: 34, condition: 'Viral Fever',
    lastVisit: '2026-03-12', bpReading: '118/76', sugarLevel: 'N/A',
    medications: ['Paracetamol 500mg', 'ORS'],
    aiRisk: 'low', aiPrediction: 7, aiReason: 'Fever likely resolved. Standard viral curve. No chronic flags.',
    complianceScore: 88,
  },
  {
    id: 3, name: 'Rohan Mehta', age: 58, condition: 'Post-Cardiac Event Recovery',
    lastVisit: '2026-03-10', bpReading: '162/102', sugarLevel: '198 mg/dL',
    medications: ['Aspirin 75mg', 'Atorvastatin 40mg', 'Ramipril 5mg'],
    aiRisk: 'critical', aiPrediction: 1, aiReason: 'Elevated BP post-cardiac event. Immediate follow-up required.',
    complianceScore: 31,
  },
  {
    id: 4, name: 'Anaya Iyer', age: 27, condition: 'GERD / Acidity',
    lastVisit: '2026-03-11', bpReading: '112/72', sugarLevel: 'N/A',
    medications: ['Pantoprazole 40mg'],
    aiRisk: 'moderate', aiPrediction: 5, aiReason: 'Symptoms likely require med adjustment. Diet compliance unknown.',
    complianceScore: 65,
  },
  {
    id: 5, name: 'Vikram Nair', age: 65, condition: 'Diabetes Type 2',
    lastVisit: '2026-03-08', bpReading: '132/84', sugarLevel: '310 mg/dL',
    medications: ['Glimepiride 2mg', 'Metformin 1000mg'],
    aiRisk: 'high', aiPrediction: 2, aiReason: 'Sugar dangerously high. Possible need for insulin initiation.',
    complianceScore: 38,
  },
];

const RISK_CONFIG = {
  critical: { color: '#ef4444', bg: '#fee2e2', label: 'Critical', icon: AlertTriangle },
  high: { color: '#f97316', bg: '#ffedd5', label: 'High Risk', icon: AlertTriangle },
  moderate: { color: '#f59e0b', bg: '#fef3c7', label: 'Moderate', icon: Clock },
  low: { color: '#10b981', bg: '#d1fae5', label: 'On Track', icon: CheckCircle },
};

export const FollowUpPredictorPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(true); // show by default
  const [selected, setSelected] = useState(null);

  const sortedPatients = [...PATIENTS_DATA].sort((a, b) => a.aiPrediction - b.aiPrediction);

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 1500);
  };

  return (
    <div className="module-page">
      <PageHeader
        title="AI Follow-up Predictor"
        description="AI analyzes patient vitals, compliance, and condition severity to recommend the ideal next visit date."
      />

      {/* Top Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Patients', value: PATIENTS_DATA.length, color: '#3b82f6', bg: '#eff6ff' },
          { label: 'Critical (Overdue)', value: PATIENTS_DATA.filter(p => p.aiRisk === 'critical').length, color: '#ef4444', bg: '#fee2e2' },
          { label: 'High Risk', value: PATIENTS_DATA.filter(p => p.aiRisk === 'high').length, color: '#f97316', bg: '#ffedd5' },
          { label: 'On Track', value: PATIENTS_DATA.filter(p => p.aiRisk === 'low').length, color: '#10b981', bg: '#d1fae5' },
        ].map((stat, i) => (
          <div key={i} style={{ backgroundColor: stat.bg, borderRadius: '12px', padding: '1rem 1.25rem', border: `1px solid ${stat.color}22` }}>
            <p style={{ margin: '0 0 0.25rem', fontSize: '0.75rem', color: stat.color, fontWeight: 700, textTransform: 'uppercase' }}>{stat.label}</p>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: 900, color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '1.5rem', alignItems: 'start', transition: 'all 0.3s' }}>
        
        {/* Patient Follow-up List */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Brain size={20} color="var(--primary-color)" /> Prioritized Follow-up Schedule
            </h3>
            <Button variant="outline" onClick={handleRegenerate} disabled={isGenerating} style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
              {isGenerating
                ? <><RefreshCw size={14} style={{ marginRight: '6px', animation: 'spin 1s linear infinite' }} /> Updating...</>
                : <><Zap size={14} style={{ marginRight: '6px' }} fill="var(--primary-color)" /> Re-run AI</>
              }
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {sortedPatients.map(patient => {
              const risk = RISK_CONFIG[patient.aiRisk];
              const RiskIcon = risk.icon;
              const isSelected = selected?.id === patient.id;

              return (
                <div
                  key={patient.id}
                  onClick={() => setSelected(isSelected ? null : patient)}
                  style={{
                    backgroundColor: 'var(--surface-color)',
                    border: `2px solid ${isSelected ? risk.color : 'var(--border-color)'}`,
                    borderRadius: '12px', padding: '1rem 1.25rem', cursor: 'pointer',
                    transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '1rem',
                    boxShadow: isSelected ? `0 4px 20px ${risk.color}25` : 'none',
                  }}
                >
                  {/* Urgency Indicator */}
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: risk.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <RiskIcon size={22} color={risk.color} />
                  </div>

                  {/* Patient Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>{patient.name}</p>
                      <span style={{ padding: '2px 8px', borderRadius: '999px', backgroundColor: risk.bg, color: risk.color, fontSize: '0.7rem', fontWeight: 700 }}>{risk.label}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{patient.condition}</p>
                  </div>

                  {/* Follow-up Days */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ margin: '0 0 0.15rem', fontSize: '1.4rem', fontWeight: 900, color: risk.color, lineHeight: 1 }}>
                      {patient.aiPrediction}d
                    </p>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Follow-up in</p>
                  </div>

                  <ChevronRight size={18} color="var(--text-secondary)" style={{ transform: isSelected ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Patient Detail Panel */}
        {selected && (() => {
          const risk = RISK_CONFIG[selected.aiRisk];
          const today = new Date();
          const followDate = new Date(today);
          followDate.setDate(today.getDate() + selected.aiPrediction);

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'slideIn 0.3s ease' }}>
              <Card padding="1.5rem" style={{ borderTop: `4px solid ${risk.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.2rem', fontWeight: 800 }}>{selected.name}</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{selected.age} yr · {selected.condition}</p>
                  </div>
                  <span style={{ padding: '4px 12px', borderRadius: '999px', backgroundColor: risk.bg, color: risk.color, fontWeight: 700, fontSize: '0.85rem' }}>{risk.label}</span>
                </div>

                {/* Vitals */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{ backgroundColor: 'var(--background-color)', borderRadius: '8px', padding: '0.75rem', border: '1px solid var(--border-color)' }}>
                    <p style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Last BP Reading</p>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: '1.2rem', color: selected.bpReading !== 'N/A' && parseInt(selected.bpReading) > 130 ? '#ef4444' : '#10b981' }}>{selected.bpReading}</p>
                  </div>
                  <div style={{ backgroundColor: 'var(--background-color)', borderRadius: '8px', padding: '0.75rem', border: '1px solid var(--border-color)' }}>
                    <p style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Blood Sugar</p>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: '1.2rem', color: selected.sugarLevel !== 'N/A' && parseInt(selected.sugarLevel) > 200 ? '#ef4444' : '#10b981' }}>{selected.sugarLevel}</p>
                  </div>
                </div>

                {/* Med Compliance Score */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700 }}>Medication Compliance Score</p>
                    <p style={{ margin: 0, fontWeight: 800, color: selected.complianceScore < 50 ? '#ef4444' : selected.complianceScore < 70 ? '#f59e0b' : '#10b981' }}>{selected.complianceScore}%</p>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${selected.complianceScore}%`, height: '100%', backgroundColor: selected.complianceScore < 50 ? '#ef4444' : selected.complianceScore < 70 ? '#f59e0b' : '#10b981', borderRadius: '999px', transition: 'width 0.6s ease' }} />
                  </div>
                </div>

                {/* AI Reasoning */}
                <div style={{ backgroundColor: '#0f172a', borderRadius: '10px', padding: '1rem', marginBottom: '1.25rem' }}>
                  <p style={{ margin: '0 0 0.4rem', fontSize: '0.7rem', color: '#60a5fa', textTransform: 'uppercase', fontWeight: 700 }}>🤖 AI Reasoning</p>
                  <p style={{ margin: 0, color: '#e2e8f0', fontSize: '0.875rem', lineHeight: 1.6 }}>{selected.aiReason}</p>
                </div>

                {/* Follow-up Date */}
                <div style={{ backgroundColor: risk.bg, border: `1px solid ${risk.color}44`, borderRadius: '10px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <Calendar size={28} color={risk.color} />
                  <div>
                    <p style={{ margin: '0 0 0.15rem', fontSize: '0.75rem', fontWeight: 700, color: risk.color, textTransform: 'uppercase' }}>Recommended Follow-up Date</p>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem', color: risk.color }}>
                      {followDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long' })} ({selected.aiPrediction} days)
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Button variant="primary" style={{ flex: 1, justifyContent: 'center' }}>
                    <Calendar size={16} style={{ marginRight: '6px' }} /> Book Follow-up
                  </Button>
                  <Button variant="outline" style={{ flex: 1, justifyContent: 'center' }}>
                    <ArrowUpRight size={16} style={{ marginRight: '6px' }} /> View History
                  </Button>
                </div>
              </Card>

              {/* Current Medications */}
              <Card padding="1.25rem">
                <h4 style={{ margin: '0 0 0.75rem', fontWeight: 700, fontSize: '0.9rem' }}>Current Medications</h4>
                {selected.medications.map((med, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', borderBottom: i < selected.medications.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', flexShrink: 0 }} />
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500 }}>{med}</p>
                  </div>
                ))}
              </Card>
            </div>
          );
        })()}
      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
      `}</style>
    </div>
  );
};

export default FollowUpPredictorPage;
