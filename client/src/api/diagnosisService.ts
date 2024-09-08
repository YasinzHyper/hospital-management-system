import { useApi } from '../hooks/useApi';
import qs from 'qs';

export interface Diagnosis {
  id: number;
  patient_id: number;
  summary: string;
  medications: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiagnosisResponse {
  diagnoses: Diagnosis[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface DiagnosisInput {
  patient_id: number;
  summary: string;
  medications: string;
}

export const useDiagnosisService = () => {
  const { request, loading, error } = useApi<DiagnosisResponse | Diagnosis>();

  const getDiagnoses = (patientId: number, params: {
    page?: number;
    pageSize?: number;
    keyword?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const queryString = qs.stringify({
      ...params
    }, { addQueryPrefix: true, skipNulls: true });

    return request('get', `/diagnosis/patient/${patientId}${queryString}`) as Promise<DiagnosisResponse>;
  };

  const addDiagnosis = (diagnosis: DiagnosisInput) => 
    request('post', '/diagnosis', diagnosis) as Promise<Diagnosis>;

  return { getDiagnoses, addDiagnosis, loading, error };
};