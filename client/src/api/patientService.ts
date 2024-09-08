import { useApi } from '../hooks/useApi';
import qs from 'qs';

export interface Patient {
  id: number;
  uuid: string;
  name: string;
  gender: string;
  age: number;
  weight: number;
  height: number;
  bmi: number;
  address: string;
  contact1: string;
  contact2: string;
  panNo: string;
  surgeryDetails: {
    surgeonName: string;
    surgeryName: string;
    operationDate: string;
    operationTime: string;
    anestheticType: string;
    surgeryType: string;
    implant: string;
  };
  billingInfo: {
    dateOfAdmission: string;
    timeOfAdmission: string;
    numberOfDays: number;
    emergencyOrPlanned: string;
    roomType: string;
    roomNumber: string;
    acceptedPackage: string;
    paymentMode: string;
    insuranceName: string;
    sumAssured: number;
    advancePayment: number;
    contactWithTPA: boolean;
    totalAmount: number;
  };
  admissionDate: string;
  admissionTime: string;
  surgeryDate: string;
  createdAt: string;
  updatedAt: string;
}

export const usePatientService = () => {
  const { request, loading, error } = useApi<Patient | Patient[]>();

  const getPatients = (params: {
    page?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: 'ASC' | 'DESC';
    filters?: {
      name?: string;
      contact1?: string;
      panNo?: string;
      gender?: string;
      admissionDateStart?: string;
      admissionDateEnd?: string;
      surgeryDateStart?: string;
      surgeryDateEnd?: string;
    };
  }) => {
    const queryString = qs.stringify({
      page: params.page,
      pageSize: params.pageSize,
      sortField: params.sortField,
      sortOrder: params.sortOrder,
      ...params.filters
    }, { addQueryPrefix: true, skipNulls: true });

    return request('get', `/patients${queryString}`);
  };

  const getPatient = (id: string) => request('get', `/patients/${id}`);
  const createPatient = (patient: Omit<Patient, 'id' | 'uuid' | 'createdAt' | 'updatedAt'>) => 
    request('post', '/patients', patient);
  const updatePatient = (id: string, patient: Partial<Patient>) => 
    request('put', `/patients/${id}`, patient);
  const deletePatient = (id: string) => request('delete', `/patients/${id}`);

  return { getPatients, getPatient, createPatient, updatePatient, deletePatient, loading, error };
};