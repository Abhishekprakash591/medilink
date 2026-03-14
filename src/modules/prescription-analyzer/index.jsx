import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, Loader, RefreshCw, Layers } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const MOCK_RESULTS = {
  summary: "This prescription contains standard medications for treating viral fever and associated symptoms.",
  medicines: [
    { name: 'Paracetamol 500mg', purpose: 'Pain relief and fever reduction', dosage: '1 tablet every 6 hours', sideEffects: 'Nausea, liver strain on high doses', instructions: 'Take after meals' },
    { name: 'Cetirizine 10mg', purpose: 'Antihistamine / Allergy relief', dosage: '1 tablet at bedtime', sideEffects: 'Drowsiness, dry mouth', instructions: 'May cause sleepiness, do not drive' },
    { name: 'Azithromycin 500mg', purpose: 'Antibiotic for bacterial infection', dosage: '1 tablet daily for 3 days', sideEffects: 'Stomach upset, diarrhea', instructions: 'Complete the entire course, take on empty stomach' },
  ],
  interactions: [
    { severity: 'warning', message: 'No major drug interactions detected among the prescribed medicines.' }
  ]
};

export const PrescriptionAnalyzerPage = () => {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);
    setResults(null);
  };

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate AI processing time
    await new Promise(r => setTimeout(r, 2500));
    setResults(MOCK_RESULTS);
    setIsAnalyzing(false);
  };

  const reset = () => {
    setFile(null);
    setResults(null);
  };

  return (
    <div className="module-page">
      <PageHeader
        title="AI Prescription Analyzer"
        description="Upload a photo or PDF of your prescription. Our AI will decode handwriting and explain your medicines instantly."
      />

      <div style={{ display: 'grid', gridTemplateColumns: results ? '1fr 2fr' : '1fr', gap: '1.5rem', maxWidth: results ? '100%' : '700px', margin: results ? '0' : '0 auto' }}>
        
        {/* Upload Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Card padding="2rem" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', backgroundColor: 'var(--surface-color)', minHeight: '300px', transition: 'all 0.3s' }}>
            {!file ? (
              <>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Upload size={32} color="var(--primary-color)" />
                </div>
                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: 700 }}>Upload Prescription</h3>
                <p style={{ margin: '0 0 1.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center' }}>Supported formats: JPG, PNG, PDF (Max 5MB)</p>
                <label style={{ display: 'inline-block', cursor: 'pointer' }}>
                  <span style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '0.625rem 1.25rem', borderRadius: 'var(--border-radius-md)', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={18} /> Select File
                  </span>
                  <input type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={handleFileUpload} />
                </label>
              </>
            ) : (
              <>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <CheckCircle size={32} color="#10b981" />
                </div>
                <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', fontWeight: 700 }}>File Selected</h3>
                <p style={{ margin: '0 0 1.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</p>
                
                {!isAnalyzing && !results && (
                  <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                    <Button variant="outline" onClick={reset} style={{ flex: 1, justifyContent: 'center' }}>Cancel</Button>
                    <Button variant="primary" onClick={startAnalysis} style={{ flex: 2, justifyContent: 'center' }}>Analyze with AI</Button>
                  </div>
                )}

                {isAnalyzing && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <Loader size={28} color="var(--primary-color)" style={{ animation: 'spin 1.5s linear infinite', marginBottom: '0.75rem' }} />
                    <p style={{ margin: 0, fontWeight: 600, color: 'var(--primary-color)', fontSize: '0.9rem' }}>Decoding handwriting...</p>
                    <div style={{ width: '100%', height: '4px', backgroundColor: '#e0e7ff', borderRadius: '999px', marginTop: '1rem', overflow: 'hidden' }}>
                      <div style={{ width: '50%', height: '100%', backgroundColor: 'var(--primary-color)', borderRadius: '999px', animation: 'progress 2.5s ease-in-out infinite' }} />
                    </div>
                  </div>
                )}
                
                {results && (
                  <Button variant="outline" onClick={reset} style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                    <RefreshCw size={16} style={{ marginRight: '8px' }} /> Upload New File
                  </Button>
                )}
              </>
            )}
          </Card>
        </div>

        {/* Results Section */}
        {results && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 0.5s ease' }}>
            <Card style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 700, color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} /> AI Analysis Summary
              </h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#1e40af', lineHeight: 1.5 }}>
                {results.summary}
              </p>
            </Card>

            <h3 style={{ margin: '0.5rem 0 0', fontSize: '1.1rem', fontWeight: 800 }}>Medicines Found ({results.medicines.length})</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              {results.medicines.map((med, i) => (
                <Card key={i} padding="1.25rem" style={{ borderLeft: '4px solid var(--primary-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.05rem', fontWeight: 700 }}>{med.name}</h4>
                      <Badge variant="info">{med.purpose}</Badge>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>Dosage</span>
                      <p style={{ margin: '0.1rem 0 0', fontSize: '0.9rem', fontWeight: 500 }}>{med.dosage}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>Instructions</span>
                      <p style={{ margin: '0.1rem 0 0', fontSize: '0.85rem' }}>{med.instructions}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--danger-color)', fontWeight: 600 }}>Side Effects</span>
                      <p style={{ margin: '0.1rem 0 0', fontSize: '0.85rem', color: '#b91c1c' }}>{med.sideEffects}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card style={{ backgroundColor: '#fef3c7', border: '1px solid #fcd34d', marginTop: '0.5rem' }}>
              <h4 style={{ margin: '0 0 0.5rem', color: '#92400e', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} /> Medicine Interactions
              </h4>
              {results.interactions.map((int, i) => (
                <p key={i} style={{ margin: 0, fontSize: '0.85rem', color: '#78350f' }}>{int.message}</p>
              ))}
            </Card>

            <p style={{ margin: '1rem 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
              ⚠️ AI findings are for informational purposes. Please consult your pharmacist or doctor before taking any medication.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes progress { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
      `}</style>
    </div>
  );
};

export default PrescriptionAnalyzerPage;
