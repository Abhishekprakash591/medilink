import React, { useState, useEffect } from 'react';
import { Plus, Search, RefreshCw, UserPlus } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import SearchInput from '../../components/ui/SearchInput';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Toast from '../../components/ui/Toast';
import { getPatients, addPatient } from '../../api/patients';
import { formatPhone } from '../../utils/formatters';

export const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', variant: 'info' });

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    gender: 'M',
    bloodGroup: ''
  });

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await getPatients();
      setPatients(res.data);
    } catch (err) {
      showToast('Failed to fetch patients', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const showToast = (message, variant = 'info') => {
    setToast({ visible: true, message, variant });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone) {
      showToast('Name and Phone are required', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await addPatient(formData);
      showToast('Patient added successfully!', 'success');
      setIsModalOpen(false);
      setFormData({ name: '', phone: '', age: '', gender: 'M', bloodGroup: '' });
      fetchPatients(); // Refresh list
    } catch (err) {
      showToast('Failed to add patient', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.phone && p.phone.includes(searchQuery))
  );

  const columns = [
    { header: 'ID', accessor: 'id', render: (row) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>#{row.id.toUpperCase()}</span> },
    { header: 'Patient Name', accessor: 'name', render: (row) => <strong style={{ fontWeight: 500 }}>{row.name}</strong> },
    { header: 'Phone', accessor: 'phone', render: (row) => formatPhone(row.phone) || 'N/A' },
    { header: 'Age/Gender', accessor: 'age', render: (row) => `${row.age || '-'} / ${row.gender}` },
    { header: 'Action', accessor: 'action', render: (row) => (
       <Button variant="outline" size="sm" onClick={() => alert(`View ${row.name}`)}>Profile</Button>
    )}
  ];

  return (
    <div className="module-page">
      <PageHeader 
        title="Patients Directory" 
        description="Manage clinic patient records and demographic details."
        actions={
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} style={{ marginRight: '8px' }} /> Add Patient
          </Button>
        }
      />

      <Card padding="0">
        <div style={{ padding: 'var(--spacing-4)', display: 'flex', gap: 'var(--spacing-4)', borderBottom: '1px solid var(--border-color)', alignItems: 'center' }}>
          <div style={{ flex: 1, maxWidth: '400px' }}>
            <SearchInput 
              placeholder="Search by name or phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="md" onClick={fetchPatients}>
            <RefreshCw size={18} />
          </Button>
        </div>

        <div style={{ padding: 'var(--spacing-4)' }}>
          {loading ? (
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'var(--spacing-8) 0' }}>
               <RefreshCw className="spinner" size={32} color="var(--primary-color)" style={{ animation: 'spin 1s linear infinite' }} />
               <p style={{ marginTop: 'var(--spacing-3)', color: 'var(--text-secondary)' }}>Loading patients...</p>
             </div>
          ) : filteredPatients.length > 0 ? (
            <Table 
              columns={columns} 
              data={filteredPatients} 
            />
          ) : (
            <EmptyState 
              title={searchQuery ? "No matching patients" : "No patients recorded yet"}
              description={searchQuery ? `We couldn't find anyone matching "${searchQuery}"` : "Add your first patient to the registry to begin."}
              icon={UserPlus}
              action={
                !searchQuery && <Button variant="primary" onClick={() => setIsModalOpen(true)}>Add First Patient</Button>
              }
            />
          )}
        </div>
      </Card>

      {/* Add Patient Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSubmitting && setIsModalOpen(false)} 
        title="Add New Patient"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting}>Save Patient</Button>
          </>
        }
      >
        <div style={{ display: 'grid', gap: 'var(--spacing-4)' }}>
          <Input 
            label="Full Name" 
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. Rahul Verma" 
            required 
          />
          <Input 
            label="Phone Number (10 digits)" 
            name="phone"
            type="tel"
            maxLength="10"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="9876543210" 
            required 
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
            <Input 
              label="Age" 
              name="age"
              type="number"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="e.g. 34" 
            />
            
            {/* Native select styled similarly to inputs for hackathon speed */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)', marginBottom: 'var(--spacing-4)' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>Gender</label>
              <select 
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                style={{
                  padding: 'var(--spacing-2) var(--spacing-3)',
                  borderRadius: 'var(--border-radius-md)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--surface-color)',
                  fontSize: '1rem',
                  outline: 'none',
                  height: '42px'
                }}
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>

      <Toast 
        isVisible={toast.visible} 
        message={toast.message} 
        variant={toast.variant} 
        onClose={() => setToast({ ...toast, visible: false })} 
      />

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default PatientsPage;
