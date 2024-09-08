import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, message } from 'antd';
import { usePatientService, Patient } from '../api/patientService';
import AddPatient from './AddPatient';

const EditPatient: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPatient, updatePatient, loading, error } = usePatientService();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (id) {
      fetchPatient(id);
    }
  }, [id]);

  const fetchPatient = async (patientId: string) => {
    try {
      const data = await getPatient(patientId);
      if (data && !Array.isArray(data)) {
        setPatient(data);
      } else {
        message.error('Failed to fetch patient details');
      }
    } catch (err) {
      console.error('Error fetching patient:', err);
      message.error('Failed to fetch patient details');
    }
  };

  const handleUpdate = async (updatedPatient: Omit<Patient, 'id' | 'uuid' | 'createdAt' | 'updatedAt'>) => {
    if (id) {
      try {
        await updatePatient(id, updatedPatient);
        message.success('Patient updated successfully');
        navigate(`/patients/${id}`);
      } catch (err) {
        console.error('Error updating patient:', err);
        message.error('Failed to update patient');
      }
    }
  };

  if (loading) {
    return <Spin size="large" className="flex justify-center items-center h-screen" />;
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  if (!patient) {
    return <div className="text-center">Patient not found</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Patient: {patient.name}</h1>
      <AddPatient initialValues={patient} onSubmit={handleUpdate} isEditing={true} />
    </div>
  );
};

export default EditPatient;