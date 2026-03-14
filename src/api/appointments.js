import apiClient from './client';

const RESOURCE = 'appointments';

export const getAppointments = async (date) => {
  // In a real app, we'd pass ?date=... to the backend
  // For mock, we fetch all and filter client-side, or just return all for the MVP if we don't have date filtering yet
  // Let's implement basic filtering
  const res = await apiClient.get(RESOURCE);
  if (date) {
    // Basic date filtering based on the date string
    const filtered = res.data.filter(appt => appt.date === date);
    return { data: filtered };
  }
  return res;
};

export const createAppointment = async (appointmentData) => {
  return apiClient.post(RESOURCE, appointmentData);
};

export const updateAppointmentStatus = async (id, status) => {
  return apiClient.put(RESOURCE, id, { status });
};

export const deleteAppointment = async (id) => {
  return apiClient.delete(RESOURCE, id);
};
