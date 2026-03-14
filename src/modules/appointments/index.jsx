import React, { useState, useEffect } from 'react';
import { Plus, Check, XCircle, Play, RefreshCw, Calendar as CalendarIcon } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import DatePicker from '../../components/ui/DatePicker';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Toast from '../../components/ui/Toast';
import AIVisitModal from '../../components/ui/AIVisitModal';
import { getAppointments, createAppointment, updateAppointmentStatus } from '../../api/appointments';
import { APPOINTMENT_STATUS_CONFIRMED, APPOINTMENT_STATUS_CANCELLED, APPOINTMENT_STATUS_PENDING } from '../../utils/constants';

const getTodayString = () => new Date().toISOString().split('T')[0];

export const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', variant: 'info' });

  // AI Visit Modal state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [activeAppointment, setActiveAppointment] = useState(null);

  const [formData, setFormData] = useState({
    patientName: '',
    time: '10:00',
    type: 'Consultation',
    date: getTodayString(),
    status: APPOINTMENT_STATUS_PENDING
  });

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await getAppointments(selectedDate);
      setAppointments(res.data.sort((a, b) => a.time.localeCompare(b.time)));
    } catch {
      showToast('Failed to load schedule', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, [selectedDate]);

  const showToast = (message, variant = 'info') => setToast({ visible: true, message, variant });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    if (!formData.patientName || !formData.time) {
      showToast('Patient name and time are required', 'error'); return;
    }
    setIsSubmitting(true);
    try {
      await createAppointment({ ...formData, date: selectedDate });
      showToast('Appointment scheduled!', 'success');
      setIsModalOpen(false);
      setFormData(prev => ({ ...prev, patientName: '', time: '10:00' }));
      fetchAppointments();
    } catch { showToast('Failed to schedule', 'error'); }
    finally { setIsSubmitting(false); }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateAppointmentStatus(id, newStatus);
      showToast(`Status updated to ${newStatus}`, 'success');
      fetchAppointments();
    } catch { showToast('Error updating status', 'error'); }
  };

  // When doctor clicks "Start Visit" — open AI modal instead of just updating status
  const handleStartVisit = (appointment) => {
    setActiveAppointment(appointment);
    setAiModalOpen(true);
    // Immediately mark as in_progress in the backend
    handleStatusChange(appointment.id, 'in_progress');
  };

  const handleAIComplete = async (diagnosis) => {
    if (activeAppointment) {
      await updateAppointmentStatus(activeAppointment.id, 'done');
      showToast(`✅ Visit completed for ${activeAppointment.patientName}`, 'success');
      setActiveAppointment(null);
      fetchAppointments();
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'done': return <Badge variant="success">Completed</Badge>;
      case APPOINTMENT_STATUS_CONFIRMED: return <Badge variant="info">Confirmed</Badge>;
      case 'in_progress': return <Badge variant="warning">In Progress</Badge>;
      case APPOINTMENT_STATUS_CANCELLED: return <Badge variant="danger">Cancelled</Badge>;
      default: return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const columns = [
    { header: 'Time', accessor: 'time', render: (row) => <strong>{row.time}</strong> },
    { header: 'Patient', accessor: 'patientName' },
    { header: 'Reason', accessor: 'type', render: (row) => <span style={{ color: 'var(--text-secondary)' }}>{row.type}</span> },
    { header: 'Status', accessor: 'status', render: (row) => getStatusBadge(row.status) },
    {
      header: 'Actions', accessor: 'actions', render: (row) => (
        <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
          {row.status === APPOINTMENT_STATUS_PENDING && (
            <Button variant="outline" size="sm" onClick={() => handleStatusChange(row.id, APPOINTMENT_STATUS_CONFIRMED)}>
              <Check size={14} style={{ marginRight: '4px' }} /> Confirm
            </Button>
          )}
          {(row.status === APPOINTMENT_STATUS_CONFIRMED || row.status === APPOINTMENT_STATUS_PENDING) && (
            <Button variant="primary" size="sm" onClick={() => handleStartVisit(row)}>
              <Play size={14} style={{ marginRight: '4px' }} /> Start Visit
            </Button>
          )}
          {row.status === 'in_progress' && (
            <Button size="sm" style={{ backgroundColor: 'var(--success-color)', color: 'white', border: 'none', padding: 'var(--spacing-2) var(--spacing-3)', borderRadius: 'var(--border-radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: 500 }} onClick={() => handleStartVisit(row)}>
              <Play size={14} style={{ marginRight: '4px' }} /> Continue AI Visit
            </Button>
          )}
          {row.status !== 'done' && row.status !== APPOINTMENT_STATUS_CANCELLED && (
            <Button variant="outline" size="sm" onClick={() => handleStatusChange(row.id, APPOINTMENT_STATUS_CANCELLED)}>
              <XCircle size={14} color="var(--danger-color)" />
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="module-page">
      <PageHeader
        title="Schedule & Queue"
        description="Manage today's appointments and AI-assisted consultations."
        actions={
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} style={{ marginRight: '8px' }} /> Schedule Slot
          </Button>
        }
      />

      <Card padding="0">
        <div style={{ padding: 'var(--spacing-4)', display: 'flex', gap: 'var(--spacing-4)', borderBottom: '1px solid var(--border-color)', alignItems: 'flex-end', backgroundColor: 'var(--background-color)' }}>
          <div style={{ width: '250px' }}>
            <DatePicker label="Select Date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          </div>
          <Button variant="outline" onClick={fetchAppointments} style={{ marginBottom: 'var(--spacing-4)' }}>
            <RefreshCw size={18} />
          </Button>
        </div>
        <div style={{ padding: 'var(--spacing-4)' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', margin: 'var(--spacing-8) 0' }}>
              <RefreshCw size={32} color="var(--primary-color)" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : appointments.length > 0 ? (
            <Table columns={columns} data={appointments} />
          ) : (
            <EmptyState title="No appointments scheduled" description={`The queue for ${selectedDate} is empty.`} icon={CalendarIcon} />
          )}
        </div>
      </Card>

      {/* Schedule Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title={`Book Appointment — ${selectedDate}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button variant="primary" onClick={handleCreate} isLoading={isSubmitting}>Confirm Slot</Button>
          </>
        }
      >
        <Input label="Patient Name" name="patientName" value={formData.patientName} onChange={handleInputChange} placeholder="Type patient name..." required />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
          <Input label="Time" name="time" type="time" value={formData.time} onChange={handleInputChange} required />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)', marginBottom: 'var(--spacing-4)' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Visit Type</label>
            <select name="type" value={formData.type} onChange={handleInputChange} style={{ padding: 'var(--spacing-2) var(--spacing-3)', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', fontSize: '1rem', height: '42px', outline: 'none' }}>
              <option>Consultation</option>
              <option>Follow-up</option>
              <option>Vaccination</option>
              <option>Emergency</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* AI Visit Modal */}
      <AIVisitModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onComplete={handleAIComplete}
        appointment={activeAppointment}
      />

      <Toast isVisible={toast.visible} message={toast.message} variant={toast.variant} onClose={() => setToast({ ...toast, visible: false })} />
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
};

export default AppointmentsPage;
