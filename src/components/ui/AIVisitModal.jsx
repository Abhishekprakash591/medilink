import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Brain, FileText, Check, X, Download } from 'lucide-react';
import Button from './Button';
import Badge from './Badge';

// Simulated AI diagnosis engine based on keywords
const generateAIDiagnosis = (symptoms) => {
  const lower = symptoms.toLowerCase();

  if (lower.includes('chest') || lower.includes('heart')) {
    return {
      condition: 'Possible Cardiac Event',
      confidence: 81,
      urgency: 'emergency',
      prescription: [
        { medicine: 'Aspirin 75mg', dose: '1 tablet', frequency: 'Immediately', duration: 'Single dose' },
        { medicine: 'Sorbitrate 5mg', dose: '1 tablet', frequency: 'Sublingual', duration: 'As needed' },
      ],
      followUp: '24 hours — Cardiology referral',
      advice: 'Rush to emergency. ECG required immediately. Avoid exertion.',
      referral: 'Cardiologist'
    };
  } else if (lower.includes('fever') || lower.includes('headache') || lower.includes('body ache')) {
    return {
      condition: 'Viral Fever',
      confidence: 78,
      urgency: 'moderate',
      prescription: [
        { medicine: 'Paracetamol 500mg', dose: '1 tablet', frequency: 'Every 6 hours', duration: '3 days' },
        { medicine: 'ORS Sachet', dose: '1 sachet in 1L water', frequency: '3–4 times/day', duration: '3 days' },
        { medicine: 'Cetirizine 10mg', dose: '1 tablet', frequency: 'Bedtime', duration: '3 days' },
      ],
      followUp: '3 days',
      advice: 'Rest, plenty of fluids, avoid cold foods. Tepid sponging if temp > 102°F.',
      referral: null
    };
  } else if (lower.includes('cough') || lower.includes('cold') || lower.includes('throat')) {
    return {
      condition: 'Upper Respiratory Tract Infection',
      confidence: 74,
      urgency: 'mild',
      prescription: [
        { medicine: 'Amoxicillin 500mg', dose: '1 capsule', frequency: 'Twice daily', duration: '5 days' },
        { medicine: 'Benadryl Cough Syrup', dose: '10ml', frequency: 'Thrice daily', duration: '5 days' },
        { medicine: 'Vitamin C 500mg', dose: '1 tablet', frequency: 'Once daily', duration: '7 days' },
      ],
      followUp: '5 days if no improvement',
      advice: 'Steam inhalation twice daily. Warm fluids. Avoid cold drinks.',
      referral: null
    };
  } else if (lower.includes('bp') || lower.includes('blood pressure') || lower.includes('hypertension')) {
    return {
      condition: 'Hypertension',
      confidence: 83,
      urgency: 'moderate',
      prescription: [
        { medicine: 'Amlodipine 5mg', dose: '1 tablet', frequency: 'Once daily morning', duration: '30 days' },
        { medicine: 'Telmisartan 40mg', dose: '1 tablet', frequency: 'Once daily', duration: '30 days' },
      ],
      followUp: '7 days — BP monitoring',
      advice: 'Low sodium diet. No stress. Monitor BP twice daily. Reduce caffeine.',
      referral: null
    };
  } else if (lower.includes('sugar') || lower.includes('diabetes') || lower.includes('glucose')) {
    return {
      condition: 'Diabetes Mellitus Type 2',
      confidence: 76,
      urgency: 'moderate',
      prescription: [
        { medicine: 'Metformin 500mg', dose: '1 tablet', frequency: 'Twice daily with meals', duration: '30 days' },
        { medicine: 'Glimepiride 1mg', dose: '1 tablet', frequency: 'Before breakfast', duration: '30 days' },
      ],
      followUp: '7 days — HbA1c test recommended',
      advice: 'Strict diet control. Avoid sugar. 30-min walk daily. Monitor fasting sugar.',
      referral: null
    };
  } else {
    return {
      condition: 'General Health Consultation',
      confidence: 65,
      urgency: 'mild',
      prescription: [
        { medicine: 'Multivitamin Tablet', dose: '1 tablet', frequency: 'Once daily after food', duration: '15 days' },
        { medicine: 'Pantoprazole 40mg', dose: '1 tablet', frequency: 'Before breakfast', duration: '7 days' },
      ],
      followUp: '7 days if symptoms persist',
      advice: 'Rest well, eat nutritious food, drink plenty of water. Return if symptoms worsen.',
      referral: null
    };
  }
};

// Typewriter hook
const useTypewriter = (text, speed = 18) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    if (!text) return;
    let i = 0;
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text]);

  return { displayed, done };
};

const URGENCY_CONFIG = {
  emergency: { label: 'Emergency', color: '#ef4444', bg: '#fee2e2' },
  moderate: { label: 'Moderate', color: '#f59e0b', bg: '#fef3c7' },
  mild: { label: 'Mild', color: '#10b981', bg: '#d1fae5' },
};

// Mock voice transcripts
const MOCK_TRANSCRIPTS = [
  "Patient has fever for 3 days, bad headache, and body ache. No cough or cold.",
  "Complaints of persistent cough and sore throat for 5 days. Low grade fever.",
  "BP was 160/100 at home. Mild dizziness. No chest pain.",
  "Fasting sugar is 210. Patient feels fatigued after lunch daily.",
];

export const AIVisitModal = ({ isOpen, onClose, onComplete, appointment }) => {
  const [phase, setPhase] = useState('input'); // input | generating | result | summary
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceTimer, setVoiceTimer] = useState(0);
  const voiceIntervalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setPhase('input');
      setSymptoms('');
      setDiagnosis(null);
      setIsListening(false);
    }
  }, [isOpen]);

  const handleVoice = () => {
    if (isListening) {
      clearInterval(voiceIntervalRef.current);
      setIsListening(false);
      setVoiceTimer(0);
      return;
    }
    setIsListening(true);
    setVoiceTimer(0);
    let count = 0;
    voiceIntervalRef.current = setInterval(() => {
      count++;
      setVoiceTimer(count);
      if (count >= 3) {
        clearInterval(voiceIntervalRef.current);
        setIsListening(false);
        setVoiceTimer(0);
        const mock = MOCK_TRANSCRIPTS[Math.floor(Math.random() * MOCK_TRANSCRIPTS.length)];
        setSymptoms(mock);
      }
    }, 1000);
  };

  const handleGenerate = () => {
    if (!symptoms.trim()) return;
    setPhase('generating');
    setTimeout(() => {
      const result = generateAIDiagnosis(symptoms);
      setDiagnosis(result);
      setPhase('result');
    }, 2200);
  };

  const handleEndVisit = () => {
    setPhase('summary');
  };

  const handleComplete = () => {
    onComplete && onComplete(diagnosis);
    onClose();
  };

  if (!isOpen) return null;

  const urgency = diagnosis ? URGENCY_CONFIG[diagnosis.urgency] : null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'var(--surface-color)',
        borderRadius: 'var(--border-radius-xl)',
        width: '100%', maxWidth: '900px',
        maxHeight: '92vh', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1rem 1.5rem',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Brain size={22} />
            <div>
              <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700 }}>
                AI Doctor Assistant
              </h2>
              {appointment && (
                <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.8 }}>
                  Patient: {appointment.patientName} · {appointment.time} · {appointment.type}
                </p>
              )}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'white', opacity: 0.8 }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* INPUT PHASE */}
          {(phase === 'input' || phase === 'generating') && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
              {/* Left: Doctor Input */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>🩺 Doctor's Notes</h3>
                  <button
                    onClick={handleVoice}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '6px 12px', borderRadius: '999px', border: 'none', cursor: 'pointer',
                      backgroundColor: isListening ? '#ef4444' : '#e0e7ff',
                      color: isListening ? 'white' : '#3730a3',
                      fontSize: '0.75rem', fontWeight: 600,
                      animation: isListening ? 'pulse 1s infinite' : 'none'
                    }}
                  >
                    {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                    {isListening ? `Listening... ${voiceTimer}s` : 'Voice Input'}
                  </button>
                </div>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Type or dictate symptoms, observations, vitals...&#10;&#10;e.g. Fever 3 days, headache, body ache. BP 130/90. No cough."
                  style={{
                    width: '100%', minHeight: '200px', padding: '0.75rem',
                    border: '2px solid var(--border-color)', borderRadius: 'var(--border-radius-md)',
                    fontFamily: 'var(--font-family)', fontSize: '0.875rem',
                    resize: 'vertical', outline: 'none', lineHeight: 1.6,
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                  disabled={phase === 'generating'}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  💡 Try: "fever headache", "chest pain", "BP high", "diabetes", "cough"
                </p>
                <Button
                  variant="primary"
                  onClick={handleGenerate}
                  disabled={!symptoms.trim() || phase === 'generating'}
                  isLoading={phase === 'generating'}
                  style={{ marginTop: '0.75rem', width: '100%', justifyContent: 'center' }}
                >
                  <Brain size={16} style={{ marginRight: '8px' }} />
                  {phase === 'generating' ? 'AI Analyzing...' : 'Generate AI Diagnosis'}
                </Button>
              </div>

              {/* Right: AI Thinking */}
              <div style={{
                backgroundColor: '#f8fafc', borderRadius: 'var(--border-radius-lg)',
                border: '2px dashed var(--border-color)',
                minHeight: '280px', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center'
              }}>
                {phase === 'generating' ? (
                  <AIThinking />
                ) : (
                  <>
                    <Brain size={48} color="var(--primary-color)" style={{ opacity: 0.3 }} />
                    <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', fontSize: '0.875rem' }}>
                      AI diagnosis will appear here after you submit symptoms.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* RESULT PHASE */}
          {phase === 'result' && diagnosis && (
            <AIResultView
              symptoms={symptoms}
              diagnosis={diagnosis}
              urgency={urgency}
              appointment={appointment}
              onEndVisit={handleEndVisit}
            />
          )}

          {/* SUMMARY PHASE */}
          {phase === 'summary' && diagnosis && (
            <VisitSummaryCard
              symptoms={symptoms}
              diagnosis={diagnosis}
              urgency={urgency}
              appointment={appointment}
              onComplete={handleComplete}
            />
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
};

const AIThinking = () => {
  const steps = [
    'Parsing clinical symptoms...',
    'Cross-referencing medical database...',
    'Applying diagnostic model...',
    'Generating prescription...',
    'Finalizing report...',
  ];
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep(s => Math.min(s + 1, steps.length - 1)), 400);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <div style={{ width: '48px', height: '48px', border: '4px solid #e0e7ff', borderTop: '4px solid var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <div>
        <p style={{ fontWeight: 700, color: 'var(--primary-color)', margin: '0 0 0.75rem 0', fontSize: '1rem' }}>
          🤖 AI Analyzing...
        </p>
        {steps.slice(0, step + 1).map((s, i) => (
          <p key={i} style={{ margin: '0.25rem 0', fontSize: '0.8rem', color: i === step ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: i === step ? 600 : 400, animation: 'fadeIn 0.3s ease' }}>
            {i < step ? '✅' : '⏳'} {s}
          </p>
        ))}
      </div>
    </div>
  );
};

const AIResultView = ({ symptoms, diagnosis, urgency, appointment, onEndVisit }) => {
  const summaryText = `Patient: ${appointment?.patientName || 'Patient'}. Condition: ${diagnosis.condition}. ${diagnosis.advice}`;
  const { displayed, done } = useTypewriter(summaryText, 20);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', animation: 'fadeIn 0.4s ease' }}>
      {/* Left: Diagnosis */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{
          backgroundColor: urgency.bg, border: `2px solid ${urgency.color}`,
          borderRadius: 'var(--border-radius-lg)', padding: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', fontWeight: 600, color: urgency.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Diagnosis</p>
              <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem', fontWeight: 700 }}>{diagnosis.condition}</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Confidence: {diagnosis.confidence}%</p>
            </div>
            <span style={{ padding: '4px 10px', borderRadius: '999px', backgroundColor: urgency.color, color: 'white', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
              {urgency.label}
            </span>
          </div>
        </div>

        {/* Prescription */}
        <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-lg)', overflow: 'hidden' }}>
          <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--background-color)', borderBottom: '1px solid var(--border-color)' }}>
            <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>💊 Prescription</h4>
          </div>
          {diagnosis.prescription.map((rx, i) => (
            <div key={i} style={{ padding: '0.75rem 1rem', borderBottom: i < diagnosis.prescription.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
              <p style={{ margin: '0 0 0.25rem 0', fontWeight: 600, fontSize: '0.875rem' }}>{rx.medicine}</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {rx.dose} · {rx.frequency} · {rx.duration}
              </p>
            </div>
          ))}
        </div>

        {/* Follow-up + Referral */}
        <div style={{ display: 'grid', gridTemplateColumns: diagnosis.referral ? '1fr 1fr' : '1fr', gap: '0.75rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#eff6ff', borderRadius: 'var(--border-radius-md)', border: '1px solid #bfdbfe' }}>
            <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.7rem', fontWeight: 600, color: '#1d4ed8', textTransform: 'uppercase' }}>Follow-up</p>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem' }}>{diagnosis.followUp}</p>
          </div>
          {diagnosis.referral && (
            <div style={{ padding: '0.75rem', backgroundColor: '#fef3c7', borderRadius: 'var(--border-radius-md)', border: '1px solid #fcd34d' }}>
              <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.7rem', fontWeight: 600, color: '#92400e', textTransform: 'uppercase' }}>Referral</p>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem' }}>{diagnosis.referral}</p>
            </div>
          )}
        </div>
      </div>

      {/* Right: AI Summary + Advice */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ backgroundColor: '#0f172a', color: '#e2e8f0', borderRadius: 'var(--border-radius-lg)', padding: '1.25rem', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.7 }}>
          <p style={{ margin: '0 0 0.5rem 0', color: '#60a5fa', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            🤖 AI Visit Summary
          </p>
          <p style={{ margin: 0 }}>
            {displayed}
            {!done && <span style={{ animation: 'blink 0.8s infinite', color: '#60a5fa' }}>|</span>}
          </p>
        </div>

        <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: 'var(--border-radius-lg)', border: '1px solid #bbf7d0' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', fontWeight: 700, color: '#065f46', textTransform: 'uppercase' }}>Doctor's Advice</p>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#065f46', lineHeight: 1.6 }}>{diagnosis.advice}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
          <Button variant="primary" onClick={onEndVisit} style={{ justifyContent: 'center' }}>
            <FileText size={16} style={{ marginRight: '8px' }} />
            End Visit & Generate Summary
          </Button>
          <p style={{ margin: 0, textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            This will complete the visit and create a printable summary
          </p>
        </div>
      </div>
    </div>
  );
};

const VisitSummaryCard = ({ symptoms, diagnosis, urgency, appointment, onComplete }) => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ border: '2px solid var(--border-color)', borderRadius: 'var(--border-radius-xl)', overflow: 'hidden' }} id="visit-summary-card">
        {/* Summary Header */}
        <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', color: 'white', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem', fontWeight: 700 }}>MEDISIGHT</h2>
            <p style={{ margin: 0, opacity: 0.8, fontSize: '0.8rem' }}>AI-Powered Clinical Visit Summary</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.8rem', opacity: 0.9 }}>
            <p style={{ margin: 0 }}>{dateStr}</p>
            <p style={{ margin: 0 }}>{timeStr}</p>
          </div>
        </div>

        <div style={{ padding: '1.5rem', display: 'grid', gap: '1.25rem' }}>
          {/* Patient + Doctor row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--background-color)', borderRadius: 'var(--border-radius-md)' }}>
              <p style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Patient</p>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem' }}>{appointment?.patientName || 'Patient'}</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{appointment?.type}</p>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--background-color)', borderRadius: 'var(--border-radius-md)' }}>
              <p style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Doctor</p>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem' }}>Dr. R. Sharma</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>General Physician</p>
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Chief Complaints / Symptoms</p>
            <p style={{ margin: 0, padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)', fontSize: '0.875rem', lineHeight: 1.6 }}>{symptoms}</p>
          </div>

          {/* Diagnosis */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', alignItems: 'start' }}>
            <div>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Diagnosis</p>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '1.125rem' }}>{diagnosis.condition}</p>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>AI Confidence: {diagnosis.confidence}%</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ padding: '6px 14px', borderRadius: '999px', backgroundColor: urgency.bg, color: urgency.color, fontSize: '0.8rem', fontWeight: 700 }}>
                {urgency.label}
              </span>
            </div>
          </div>

          {/* Prescription table */}
          <div>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Prescription (Rx)</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--background-color)' }}>
                  {['Medicine', 'Dose', 'Frequency', 'Duration'].map(h => (
                    <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', border: '1px solid var(--border-color)', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {diagnosis.prescription.map((rx, i) => (
                  <tr key={i}>
                    <td style={{ padding: '0.5rem 0.75rem', border: '1px solid var(--border-color)', fontWeight: 600 }}>{rx.medicine}</td>
                    <td style={{ padding: '0.5rem 0.75rem', border: '1px solid var(--border-color)' }}>{rx.dose}</td>
                    <td style={{ padding: '0.5rem 0.75rem', border: '1px solid var(--border-color)' }}>{rx.frequency}</td>
                    <td style={{ padding: '0.5rem 0.75rem', border: '1px solid var(--border-color)' }}>{rx.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Advice + Follow-up */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Doctor's Advice</p>
              <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.6 }}>{diagnosis.advice}</p>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: '#eff6ff', borderRadius: 'var(--border-radius-md)', border: '1px solid #bfdbfe', textAlign: 'center' }}>
              <p style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase' }}>Follow-up</p>
              <p style={{ margin: 0, fontWeight: 700, color: '#1d4ed8' }}>{diagnosis.followUp}</p>
            </div>
          </div>

          {/* Signature */}
          <div style={{ borderTop: '2px dashed var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              🤖 AI-assisted summary. Please verify with clinical judgment.
            </p>
            <div style={{ textAlign: 'right' }}>
              <div style={{ borderTop: '1px solid var(--text-secondary)', paddingTop: '0.25rem', fontSize: '0.8rem', fontWeight: 600 }}>Dr. R. Sharma</div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
        <Button variant="outline" onClick={() => window.print()}>
          <Download size={16} style={{ marginRight: '8px' }} /> Print / Download
        </Button>
        <Button variant="primary" onClick={onComplete}>
          <Check size={16} style={{ marginRight: '8px' }} /> Complete Visit
        </Button>
      </div>
    </div>
  );
};

export default AIVisitModal;
