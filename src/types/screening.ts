export interface PatientUser {
  id: string;
  username: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  deviceModel: string;
  memberSince: string;
}

export interface PatientInfo {
  patientId: string;
  name: string;
  age: number | '';
  gender: 'Male' | 'Female' | 'Other';
}

export interface PredictionResult {
  id: string;
  patientId: string; // Patient User ID
  userId?: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  disease: string;
  confidence: number; // e.g. 96
  risk: 'Low' | 'Moderate' | 'High' | 'Severe';
  recommendation: string;
  date: string;
  vocValues: number[];
  detectedBiomarkers: string[];
}

export interface VocDescriptor {
  id: number;
  name: string;
  biomarker: string;
  unit: string;
  normalMin: number;
  normalMax: number;
}
