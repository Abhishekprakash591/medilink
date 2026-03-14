import React, { useState } from 'react';
import { Brain, AlertTriangle, CheckCircle, AlertCircle, Send, Loader } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const SYMPTOM_DB = [
  { keywords: ['chest pain', 'heart', 'breathless', 'palpitation'], condition: 'Possible Cardiac Event', confidence: 88, urgency: 'emergency', firstAid: ['Stop all activity immediately', 'Chew aspirin if available (75mg)', 'Loosen tight clothing', 'Call 108 immediately'], recommendation: '🚨 Go to Emergency NOW. Do not wait.' },
  { keywords: ['fever', 'headache', 'body ache', 'temperature'], condition: 'Viral Fever', confidence: 78, urgency: 'moderate', firstAid: ['Take Paracetamol 500mg every 6 hours', 'Drink plenty of water and ORS', 'Tepid sponging if temp > 102°F', 'Rest completely'], recommendation: 'Visit clinic within 24 hours if fever persists.' },
  { keywords: ['cough', 'cold', 'sore throat', 'runny nose'], condition: 'Upper Respiratory Infection', confidence: 74, urgency: 'mild', firstAid: ['Steam inhalation twice daily', 'Warm water gargles with salt', 'Honey + ginger tea', 'Avoid cold foods and drinks'], recommendation: 'Rest at home. Visit doctor if symptoms persist beyond 5 days.' },
  { keywords: ['vomiting', 'diarrhea', 'stomach', 'nausea', 'food poison'], condition: 'Gastroenteritis', confidence: 80, urgency: 'moderate', firstAid: ['Drink ORS frequently in small sips', 'Avoid solid food for 4–6 hours', 'Eat bland food (rice, banana, toast)', 'Monitor for signs of dehydration'], recommendation: 'Visit clinic if vomiting persists beyond 24 hours or blood in stool.' },
  { keywords: ['rash', 'skin', 'itch', 'allergy', 'hive'], condition: 'Allergic Reaction / Skin Rash', confidence: 71, urgency: 'mild', firstAid: ['Apply calamine lotion', 'Take antihistamine (Cetirizine)', 'Avoid scratching', 'Identify and avoid allergen'], recommendation: 'Consult dermatologist if rash spreads or worsens.' },
  { keywords: ['back pain', 'spine', 'lower back'], condition: 'Musculoskeletal Back Pain', confidence: 73, urgency: 'mild', firstAid: ['Rest in comfortable position', 'Apply hot water bag', 'Light stretching', 'Ibuprofen gel for local pain'], recommendation: 'Consult orthopedic if pain persists beyond 3 days.' },
];

const URGENCY_CONFIG = {
  emergency: { label: 'EMERGENCY', color: '#ef4444', bg: '#fee2e2', icon: AlertTriangle, pulse: true },
  moderate: { label: 'MODERATE', color: '#f59e0b', bg: '#fef3c7', icon: AlertCircle, pulse: false },
  mild: { label: 'MILD', color: '#10b981', bg: '#d1fae5', icon: CheckCircle, pulse: false },
};

const analyzeSymptoms = (text) => {
  const lower = text.toLowerCase();
  for (const entry of SYMPTOM_DB) {
    if (entry.keywords.some(k => lower.includes(k))) return entry;
  }
  return {
    condition: 'General Health Inquiry',
    confidence: 60,
    urgency: 'mild',
    firstAid: ['Rest and stay hydrated', 'Monitor symptoms', 'Keep a symptom diary', 'Eat nutritious meals'],
    recommendation: 'If symptoms persist or worsen, consult a doctor.'
  };
};

export const SymptomCheckerPage = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 1800));
    setResult(analyzeSymptoms(input));
    setLoading(false);
  };

  const urgencyConf = result ? URGENCY_CONFIG[result.urgency] : null;

  const QUICK_PROMPTS = ['Fever and headache', 'Chest pain', 'Cough and cold', 'Stomach pain and vomiting', 'Skin rash and itching', 'Back pain'];

  return (
    <div className="module-page">
      <PageHeader
        title="AI Symptom Checker"
        description="Describe your symptoms and get instant AI-powered health guidance."
      />

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '1.5rem', maxWidth: result ? '100%' : '700px' }}>
        {/* Input Card */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#e0e7ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={20} color="var(--primary-color)" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Describe Your Symptoms</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Be as specific as possible for better results</p>
            </div>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. I have fever for 2 days, bad headache, and body ache. No cough but feeling very weak..."
            style={{ width: '100%', minHeight: '140px', padding: '0.75rem', border: '2px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', fontFamily: 'var(--font-family)', fontSize: '0.9rem', resize: 'vertical', outline: 'none', lineHeight: 1.6, boxSizing: 'border-box', transition: 'border-color 0.2s' }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
          />

          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {QUICK_PROMPTS.map(p => (
              <button key={p} onClick={() => setInput(p)} style={{ padding: '4px 12px', borderRadius: '999px', border: '1px solid var(--border-color)', backgroundColor: 'var(--background-color)', fontSize: '0.75rem', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.15s' }}
                onMouseOver={(e) => { e.target.style.backgroundColor = '#e0e7ff'; e.target.style.color = 'var(--primary-color)'; e.target.style.borderColor = 'var(--primary-color)'; }}
                onMouseOut={(e) => { e.target.style.backgroundColor = 'var(--background-color)'; e.target.style.color = 'var(--text-secondary)'; e.target.style.borderColor = 'var(--border-color)'; }}>
                {p}
              </button>
            ))}
          </div>

          <Button variant="primary" onClick={handleCheck} disabled={!input.trim() || loading} isLoading={loading} style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
            {loading ? 'AI Analyzing Symptoms...' : <><Send size={16} style={{ marginRight: '8px' }} /> Check Symptoms</>}
          </Button>

          <p style={{ margin: '0.75rem 0 0', fontSize: '0.7rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            ⚠️ This is AI guidance only. Always consult a qualified doctor for diagnosis.
          </p>
        </Card>

        {/* Result Card */}
        {loading && (
          <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
            <div style={{ width: '50px', height: '50px', border: '4px solid #e0e7ff', borderTop: '4px solid var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
            <p style={{ fontWeight: 600, color: 'var(--primary-color)' }}>AI Analyzing...</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>Cross-referencing medical database</p>
          </Card>
        )}

        {result && urgencyConf && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 0.4s ease' }}>
            {/* Urgency Banner */}
            <div style={{ backgroundColor: urgencyConf.bg, border: `2px solid ${urgencyConf.color}`, borderRadius: 'var(--border-radius-lg)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', ...(urgencyConf.pulse ? { animation: 'urgencyPulse 1.5s infinite' } : {}) }}>
              <urgencyConf.icon size={32} color={urgencyConf.color} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{result.condition}</h3>
                  <span style={{ padding: '2px 10px', borderRadius: '999px', backgroundColor: urgencyConf.color, color: 'white', fontSize: '0.7rem', fontWeight: 700 }}>{urgencyConf.label}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: urgencyConf.color, fontWeight: 600 }}>Confidence: {result.confidence}%</p>
              </div>
            </div>

            {/* First Aid */}
            <Card padding="1rem">
              <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>🩹 First Aid Steps</h4>
              {result.firstAid.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span style={{ width: '22px', height: '22px', minWidth: '22px', borderRadius: '50%', backgroundColor: '#e0e7ff', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>{i + 1}</span>
                  <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.5 }}>{step}</p>
                </div>
              ))}
            </Card>

            {/* Recommendation */}
            <div style={{ padding: '1rem', backgroundColor: result.urgency === 'emergency' ? '#fee2e2' : '#eff6ff', borderRadius: 'var(--border-radius-lg)', border: `1px solid ${urgencyConf.color}` }}>
              <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', fontWeight: 700, color: urgencyConf.color, textTransform: 'uppercase' }}>Recommendation</h4>
              <p style={{ margin: 0, fontWeight: 600, color: urgencyConf.color }}>{result.recommendation}</p>
            </div>

            {result.urgency === 'emergency' && (
              <Button variant="danger" onClick={() => {
                window.dispatchEvent(new Event('open-emergency'));
                setTimeout(() => window.dispatchEvent(new Event('activate-sos')), 100);
              }} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', justifyContent: 'center', padding: '0.875rem', fontSize: '1rem', fontWeight: 700, animation: 'urgencyPulse 1.5s infinite' }}>
                🚨 ACTIVATE EMERGENCY MODE
              </Button>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes urgencyPulse { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.4)} 50%{box-shadow:0 0 0 8px rgba(239,68,68,0)} }
      `}</style>
    </div>
  );
};

export default SymptomCheckerPage;
