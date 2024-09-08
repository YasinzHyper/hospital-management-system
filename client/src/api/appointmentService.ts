import { useApi } from '../hooks/useApi';
import qs from 'qs';

export interface Appointment {
  id: number;
  patientId: number;
  appointmentDate: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  patient?: {
    id: number;
    name: string;
  };
}

export interface AppointmentFilters {
  date?: string;
  status?: 'scheduled' | 'completed' | 'cancelled';
  patientId?: number;
}

export const useAppointmentService = () => {
  const { request, loading, error } = useApi<Appointment | Appointment[]>();

  const getAllAppointments = (filters: AppointmentFilters = {}) => {
    const queryString = qs.stringify(filters, { addQueryPrefix: true, skipNulls: true });
    return request('get', `/appointments${queryString}`) as Promise<Appointment[]>;
  };

  const getAppointmentById = (id: number) => 
    request('get', `/appointments/${id}`) as Promise<Appointment>;

  const createAppointment = (appointment: Omit<Appointment, 'id'>) => 
    request('post', '/appointments', appointment) as Promise<Appointment>;

  const updateAppointment = (id: number, appointment: Partial<Appointment>) => 
    request('put', `/appointments/${id}`, appointment) as Promise<Appointment>;

  const deleteAppointment = (id: number) => 
    request('delete', `/appointments/${id}`);

  return {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    loading,
    error
  };
};