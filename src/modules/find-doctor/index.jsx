import React, { useState } from 'react';
import { Search, MapPin, Star, CalendarPlus, ChevronDown, Filter } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const DOCTORS = [
  { id: 1, name: 'Dr. Ramesh Sharma', specialty: 'General Physician', experience: '15 Years', rating: 4.8, distance: '1.2 km', reviews: 142, available: 'Today', fee: 500, avatar: 'RS' },
  { id: 2, name: 'Dr. Anita Desai', specialty: 'Cardiologist', experience: '12 Years', rating: 4.9, distance: '2.4 km', reviews: 215, available: 'Tomorrow', fee: 1200, avatar: 'AD' },
  { id: 3, name: 'Dr. Vikram Patel', specialty: 'Pediatrician', experience: '8 Years', rating: 4.6, distance: '3.1 km', reviews: 89, available: 'Today', fee: 600, avatar: 'VP' },
  { id: 4, name: 'Dr. Sneha Rao', specialty: 'Dermatologist', experience: '10 Years', rating: 4.7, distance: '4.5 km', reviews: 112, available: 'Today', fee: 800, avatar: 'SR' },
  { id: 5, name: 'Dr. Kabir Singh', specialty: 'Orthopedist', experience: '20 Years', rating: 4.5, distance: '1.8 km', reviews: 340, available: 'In 2 Days', fee: 1000, avatar: 'KS' },
];

const SPECIALTIES = ['All', 'General Physician', 'Cardiologist', 'Pediatrician', 'Dermatologist', 'Orthopedist'];

export const FindDoctorPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const filteredDoctors = DOCTORS.filter(d => 
    (selectedSpecialty === 'All' || d.specialty === selectedSpecialty) &&
    (d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.specialty.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="module-page">
      <PageHeader
        title="Find a Doctor"
        description="Search for specialized doctors near you and book instantly."
      />

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        
        {/* Search Bar */}
        <div style={{ flex: 1, minWidth: '300px', display: 'flex', alignItems: 'center', backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', padding: '0 1rem', height: '48px', transition: 'border-color 0.2s', focusWithin: { borderColor: 'var(--primary-color)' } }}>
          <Search size={20} color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="Search doctors, specialties, symptoms..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', padding: '0 1rem', fontSize: '1rem', color: 'var(--text-primary)' }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', position: 'relative' }}>
          <select 
            value={selectedSpecialty}
            onChange={e => setSelectedSpecialty(e.target.value)}
            style={{ appearance: 'none', padding: '0 2.5rem 0 1rem', height: '48px', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', outline: 'none' }}
          >
            {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown size={16} color="var(--text-secondary)" style={{ position: 'absolute', right: '4.5rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          
          <Button variant="outline" style={{ height: '48px' }}>
            <Filter size={18} style={{ marginRight: '8px' }} /> More Filters
          </Button>
        </div>
      </div>

      {/* Results Grid */}
      <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
        Showing {filteredDoctors.length} doctors near you
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {filteredDoctors.map(doctor => (
          <Card key={doctor.id} padding="1.5rem">
            <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, flexShrink: 0, boxShadow: '0 8px 16px rgba(37,99,235,0.2)' }}>
                {doctor.avatar}
              </div>
              
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', fontWeight: 800 }}>{doctor.name}</h3>
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', color: 'var(--primary-color)', fontWeight: 600 }}>{doctor.specialty}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b' }}>
                    <Star size={14} fill="#f59e0b" color="#f59e0b" /> {doctor.rating}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>({doctor.reviews} reviews)</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem', padding: '1rem', backgroundColor: 'var(--background-color)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} /> Distance
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{doctor.distance}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  ⚕️ Experience
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{doctor.experience}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  ₹ Consult Fee
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>₹{doctor.fee}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Badge variant={doctor.available === 'Today' ? 'success' : 'warning'}>
                {doctor.available === 'Today' ? 'Available Today' : `Next: ${doctor.available}`}
              </Badge>
              <Button variant="primary" size="sm" onClick={() => alert('Appointment Booked Successfully! (Mock)')}>
                <CalendarPlus size={16} style={{ marginRight: '6px' }} /> Book Now
              </Button>
            </div>
          </Card>
        ))}

        {filteredDoctors.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>No doctors found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindDoctorPage;
