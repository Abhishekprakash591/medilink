import React, { useState } from 'react';
import { Pill, Printer, Search, Plus, Trash2, FileSignature, CheckCircle, Zap } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

// Mock Patients
const PATIENTS = [
  { id: 1, name: 'John Doe', age: 42, gender: 'M', lastVisit: '10/03/2026' },
  { id: 2, name: 'Aarav Patel', age: 31, gender: 'M', lastVisit: '12/03/2026' },
  { id: 3, name: 'Priya Sharma', age: 28, gender: 'F', lastVisit: '14/03/2026' },
];

// Mock templates for quick generation
const AI_TEMPLATES = {
  ViralFever: [
    { name: 'Paracetamol 500mg', dose: '1 Tab', freq: 'Every 6 hrs', duration: '3 Days', instruction: 'After food' },
    { name: 'Cetirizine 10mg', dose: '1 Tab', freq: 'Night', duration: '3 Days', instruction: 'Before sleep' }
  ],
  Acidity: [
    { name: 'Pantoprazole 40mg', dose: '1 Tab', freq: 'Morning', duration: '5 Days', instruction: 'Empty stomach' },
    { name: 'Digene Gel', dose: '2 tsp', freq: 'SOS', duration: 'As needed', instruction: 'For heartburn' }
  ],
  BodyAche: [
    { name: 'Ibuprofen 400mg', dose: '1 Tab', freq: 'Twice daily', duration: '3 Days', instruction: 'After food' },
    { name: 'Volini Gel', dose: 'Apply', freq: 'SOS', duration: 'As needed', instruction: 'Local application' }
  ]
};

export const SmartRxPage = () => {
  const [selectedPatient, setSelectedPatient] = useState(PATIENTS[0]);
  const [patientSearch, setPatientSearch] = useState('');
  
  const [chiefComplaints, setChiefComplaints] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  
  const [meds, setMeds] = useState([
    { name: '', dose: '', freq: '', duration: '', instruction: '' }
  ]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const addMed = () => setMeds([...meds, { name: '', dose: '', freq: '', duration: '', instruction: '' }]);
  const removeMed = (index) => setMeds(meds.filter((_, i) => i !== index));
  const updateMed = (index, field, value) => {
    const newMeds = [...meds];
    newMeds[index][field] = value;
    setMeds(newMeds);
  };

  const applyTemplate = (templateKey) => {
    setMeds(AI_TEMPLATES[templateKey]);
  };

  const handleSmartSuggest = () => {
    if (!chiefComplaints && !diagnosis) return;
    setIsGenerating(true);
    
    // Simulate AI delay
    setTimeout(() => {
      const lower = (chiefComplaints + ' ' + diagnosis).toLowerCase();
      if (lower.includes('fever')) applyTemplate('ViralFever');
      else if (lower.includes('acid') || lower.includes('stomach')) applyTemplate('Acidity');
      else if (lower.includes('pain') || lower.includes('ache')) applyTemplate('BodyAche');
      else applyTemplate('ViralFever'); // default fallback
      
      setIsGenerating(false);
    }, 1200);
  };

  const filteredPatients = PATIENTS.filter(p => p.name.toLowerCase().includes(patientSearch.toLowerCase()));

  return (
    <div className="module-page" style={{ paddingBottom: '3rem' }}>
      <PageHeader
        title="1-Tap Smart Prescription (Rx)"
        description="Write prescriptions 10x faster using smart templates, AI auto-fill, and 1-click printing."
      />

      {/* Main Layout Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Column: Form Builder */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Patient Selection */}
          <Card padding="1.5rem">
            <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Search size={18} /> Select Patient
            </h3>
            <input 
              type="text" 
              placeholder="Search by name or ID..." 
              value={patientSearch}
              onChange={e => setPatientSearch(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '1rem', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = 'var(--primary-color)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '150px', overflowY: 'auto' }}>
              {filteredPatients.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => setSelectedPatient(p)}
                  style={{ 
                    padding: '0.75rem', borderRadius: '8px', border: p.id === selectedPatient?.id ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                    backgroundColor: p.id === selectedPatient?.id ? '#eff6ff' : 'transparent', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: p.id === selectedPatient?.id ? 'var(--primary-color)' : 'var(--text-primary)' }}>{p.name}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{p.age} Y · {p.gender}</p>
                  </div>
                  {p.id === selectedPatient?.id && <CheckCircle size={18} color="var(--primary-color)" />}
                </div>
              ))}
            </div>
          </Card>

          {/* Clinical Notes */}
          <Card padding="1.5rem">
            <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileSignature size={18} /> Clinical Notes
            </h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Chief Complaints</label>
              <textarea 
                value={chiefComplaints} onChange={e => setChiefComplaints(e.target.value)}
                placeholder="e.g. Fever for 3 days, body ache..."
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', minHeight: '60px', outline: 'none', resize: 'vertical' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Diagnosis</label>
              <input 
                type="text" value={diagnosis} onChange={e => setDiagnosis(e.target.value)}
                placeholder="e.g. Viral Pyrexia"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
              />
            </div>
          </Card>

        </div>

        {/* Right Column: Medications Builder & Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <Card padding="0" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Pill size={20} color="var(--primary-color)" /> Prescribe Medications
              </h3>
              <Button 
                variant="outline" 
                onClick={handleSmartSuggest}
                disabled={isGenerating || (!chiefComplaints && !diagnosis)}
                style={{ backgroundColor: isGenerating ? 'transparent' : '#f0fdf4', borderColor: '#bbf7d0', color: '#166534', fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
              >
                {isGenerating ? 'Analyzing...' : <><Zap size={14} style={{ marginRight: '6px' }} fill="#166534" /> AI Auto-Fill Rx</>}
              </Button>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
              {/* Quick Templates */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', alignSelf: 'center', marginRight: '0.5rem' }}>1-Click Templates:</span>
                {Object.keys(AI_TEMPLATES).map(k => (
                  <button 
                    key={k} onClick={() => applyTemplate(k)}
                    style={{ padding: '4px 12px', borderRadius: '999px', border: '1px solid var(--border-color)', backgroundColor: 'white', fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 500 }}
                    onMouseOver={e=>e.currentTarget.style.borderColor='var(--primary-color)'}
                    onMouseOut={e=>e.currentTarget.style.borderColor='var(--border-color)'}
                  >
                    {k.replace(/([A-Z])/g, ' $1').trim()}
                  </button>
                ))}
              </div>

              {/* Meds List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {meds.map((med, index) => (
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 2fr) 1fr 1fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'center', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <input placeholder="Medicine Name" value={med.name} onChange={e=>updateMed(index, 'name', e.target.value)} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', outline: 'none' }} />
                    <input placeholder="Dose" value={med.dose} onChange={e=>updateMed(index, 'dose', e.target.value)} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', outline: 'none' }} />
                    <input placeholder="Freq" value={med.freq} onChange={e=>updateMed(index, 'freq', e.target.value)} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', outline: 'none' }} />
                    <input placeholder="Days" value={med.duration} onChange={e=>updateMed(index, 'duration', e.target.value)} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', outline: 'none' }} />
                    <input placeholder="Instructions" value={med.instruction} onChange={e=>updateMed(index, 'instruction', e.target.value)} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', outline: 'none' }} />
                    <button onClick={() => removeMed(index)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }} disabled={meds.length === 1}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="outline" onClick={addMed} style={{ fontSize: '0.85rem', padding: '0.4rem 0.75rem' }}>
                  <Plus size={16} style={{ marginRight: '6px' }} /> Add Medicine
                </Button>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                   <Button variant="primary" onClick={() => setShowPreview(true)} disabled={!selectedPatient || !meds[0].name}>
                    Generate Digital Rx
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Rx Preview Final Render */}
          {showPreview && (
            <div style={{ animation: 'slideUp 0.4s ease', marginTop: '1rem' }} id="rx-print-area">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Digital Rx Preview</h3>
                <Button variant="outline" onClick={() => window.print()} style={{ backgroundColor: 'white' }}>
                  <Printer size={16} style={{ marginRight: '8px' }} /> Print Rx
                </Button>
              </div>

              <Card padding="2rem" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.08)', border: 'none' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #1e3a8a', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: '#1e3a8a', letterSpacing: '2px' }}>MEDISIGHT CLINIC</h2>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>123 Health Ave, Pune · +91 98765 43210</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Dr. R. Sharma</h4>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>MBBS, MD (General Medicine)</p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Reg. No: 45892</p>
                  </div>
                </div>

                {/* Patient Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Patient Name</p>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '1.1rem', fontWeight: 700 }}>{selectedPatient?.name}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Age / Gender</p>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '1.1rem', fontWeight: 700 }}>{selectedPatient?.age} Y / {selectedPatient?.gender}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Date</p>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '1.1rem', fontWeight: 700 }}>{new Date().toLocaleDateString('en-GB')}</p>
                  </div>
                </div>

                {/* Clinical Notes */}
                {(chiefComplaints || diagnosis) && (
                  <div style={{ marginBottom: '2rem' }}>
                    {chiefComplaints && <p style={{ margin: '0 0 0.5rem', fontSize: '0.95rem' }}><strong style={{ color: 'var(--text-secondary)' }}>Symptoms:</strong> {chiefComplaints}</p>}
                    {diagnosis && <p style={{ margin: 0, fontSize: '0.95rem' }}><strong style={{ color: 'var(--text-secondary)' }}>Diagnosis:</strong> {diagnosis}</p>}
                  </div>
                )}

                {/* Rx symbol */}
                <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--border-color)', fontFamily: 'serif', lineHeight: 1, marginBottom: '1rem' }}>Rx</div>

                {/* Medications */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '3rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                      <th style={{ padding: '0.75rem 0', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Medicine</th>
                      <th style={{ padding: '0.75rem 0', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Dosage</th>
                      <th style={{ padding: '0.75rem 0', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Frequency</th>
                      <th style={{ padding: '0.75rem 0', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Duration</th>
                      <th style={{ padding: '0.75rem 0', textAlign: 'right', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Instructions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meds.filter(m => m.name).map((med, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '1rem 0', fontWeight: 700, fontSize: '1.05rem', color: '#1e293b' }}>{idx + 1}. {med.name}</td>
                        <td style={{ padding: '1rem 0', fontSize: '0.95rem' }}>{med.dose}</td>
                        <td style={{ padding: '1rem 0', fontSize: '0.95rem' }}>{med.freq}</td>
                        <td style={{ padding: '1rem 0', fontSize: '0.95rem' }}>{med.duration}</td>
                        <td style={{ padding: '1rem 0', fontSize: '0.95rem', textAlign: 'right', color: 'var(--text-secondary)' }}>{med.instruction}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Footer Signature */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px dashed var(--border-color)', paddingTop: '2rem' }}>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Get well soon.<br/>Valid for 15 days from date of issue.</p>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '150px', borderBottom: '1px solid black', marginBottom: '0.5rem' }}></div>
                    <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700 }}>Signature</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

        </div>
      </div>
      
      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @media print {
          body * { visibility: hidden; }
          #rx-print-area, #rx-print-area * { visibility: visible; }
          #rx-print-area { position: absolute; left: 0; top: 0; width: 100%; margin: 0 !important; padding: 0 !important; }
          .sidebar, .header { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default SmartRxPage;
