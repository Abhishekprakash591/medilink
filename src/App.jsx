import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

/* Layouts & Landing */
import LandingPage from './modules/landing';
import LoginPage from './modules/login';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import PatientLayout from './layout/PatientLayout';
import DoctorLayout from './layout/DoctorLayout';
import AdminLayout from './layout/AdminLayout';
import AdminDashboard from './modules/admin-dashboard';
import HospitalBedsPage from './modules/admin-hospitals';
import AmbulancePage from './modules/admin-ambulance';
import LiveEmergenciesPage from './modules/admin-emergencies';

/* Common / Doctor Modules */
import DashboardPage from './modules/dashboard';
import PatientsPage from './modules/patients';
import AppointmentsPage from './modules/appointments';
import QueuePage from './modules/queue';

/* Patient Modules */
import PatientDashboard from './modules/patient-dashboard';
import SymptomCheckerPage from './modules/symptom-checker';
import HealthCardPage from './modules/health-card';
import PrescriptionAnalyzerPage from './modules/prescription-analyzer';
import ReportAnalyzerPage from './modules/report-analyzer';
import FindDoctorPage from './modules/find-doctor';
import SmartRxPage from './modules/smart-rx';
import FollowUpPredictorPage from './modules/followup-predictor';
import MentalHealthPage from './modules/mental-health';
import GovSchemesPage from './modules/gov-schemes';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Doctor Routes (Clinical Hub) */}
          <Route path="/doctor" element={<ProtectedRoute allowedRole="doctor"><DoctorLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/doctor/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="patients/:id" element={<PatientsPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="queue" element={<QueuePage />} />
            <Route path="smart-rx" element={<SmartRxPage />} />
            <Route path="followup" element={<FollowUpPredictorPage />} />
          </Route>

          {/* Patient Routes (AI SuperApp) */}
          <Route path="/patient" element={<ProtectedRoute allowedRole="patient"><PatientLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/patient/dashboard" replace />} />
            <Route path="dashboard" element={<PatientDashboard />} />
            <Route path="health-card" element={<HealthCardPage />} />
            <Route path="symptom-checker" element={<SymptomCheckerPage />} />
            <Route path="prescription-analyzer" element={<PrescriptionAnalyzerPage />} />
            <Route path="report-analyzer" element={<ReportAnalyzerPage />} />
            <Route path="find-doctor" element={<FindDoctorPage />} />
            <Route path="mental-health" element={<MentalHealthPage />} />
            <Route path="gov-schemes" element={<GovSchemesPage />} />
          </Route>

          {/* Admin Routes (City Health Grid) */}
          <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="hospitals" element={<HospitalBedsPage />} />
            <Route path="ambulances" element={<AmbulancePage />} />
            <Route path="emergencies" element={<LiveEmergenciesPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
