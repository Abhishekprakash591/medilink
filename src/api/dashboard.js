import apiClient from './client';

// We can store mock dashboard data here or rely on the client store.
// For the hackathon, we'll return a static mock payload for the dashboard overview.

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const getDashboardStats = async () => {
  await delay(600);
  return {
    data: {
      todaysPatients: { value: 24, trend: { positive: true, value: '12%' } },
      pendingAppointments: { value: 8 },
      followUps: { value: 5, trend: { positive: false, value: '2' } },
      revenue: { value: 12400 } // Stored as integer, formatter will handle it
    }
  };
};

export const getUpcomingAppointments = async () => {
  await delay(800);
  return {
    data: [
      { id: '1', patientName: 'Rahul Verma', time: '10:00 AM', type: 'Consultation', status: 'confirmed' },
      { id: '2', patientName: 'Priya Sharma', time: '10:30 AM', type: 'Follow-up', status: 'pending' },
      { id: '3', patientName: 'Anil Kumar', time: '11:15 AM', type: 'Consultation', status: 'confirmed' },
      { id: '4', patientName: 'Nisha Gupta', time: '12:00 PM', type: 'Vaccination', status: 'confirmed' },
      { id: '5', patientName: 'Sanjay Singh', time: '12:45 PM', type: 'Consultation', status: 'pending' },
    ]
  };
};
