import apiClient from './client';

const RESOURCE = 'patients';

export const getPatients = async () => {
  return apiClient.get(RESOURCE);
};

export const getPatientById = async (id) => {
  return apiClient.getById(RESOURCE, id);
};

export const addPatient = async (patientData) => {
  return apiClient.post(RESOURCE, patientData);
};

export const updatePatient = async (id, patientData) => {
  return apiClient.put(RESOURCE, id, patientData);
};

export const deletePatient = async (id) => {
  return apiClient.delete(RESOURCE, id);
};
