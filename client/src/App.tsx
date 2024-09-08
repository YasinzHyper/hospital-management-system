import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
// import Appointments from './pages/Appointments';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import PrivateRoute from './routes/PrivateRoute';
import AddPatientPage from './pages/AddPatient';
import PatientDetails from './pages/PatientDetails';
import EditPatient from './pages/EditPatient';
import Appointments from './pages/Appointments';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/patients/add" element={<AddPatientPage />} />
            <Route path="/patients/:id" element={<PatientDetails />} />
            <Route path="/patients/edit/:id" element={<EditPatient />} />

            <Route path="/appointments" element={<Appointments />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;