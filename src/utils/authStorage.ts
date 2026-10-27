import { PatientUser, PredictionResult } from '../types/screening';
import { VOC_PRESETS } from './vocPredictor';

const PATIENTS_KEY = 'patient_accounts_home_v1';
const ACTIVE_PATIENT_KEY = 'patient_active_session_v1';
const PATIENT_TESTS_PREFIX = 'patient_home_tests_';

export const DEMO_PATIENTS: (PatientUser & { password: string })[] = [
  {
    id: 'pt-eleanor-01',
    username: 'eleanor_vance',
    password: 'password123',
    name: 'Eleanor Vance',
    age: 68,
    gender: 'Female',
    deviceModel: 'AeroSense Home Breath Bio-Kit #882',
    memberSince: 'Oct 2026',
  },
  {
    id: 'pt-marcus-02',
    username: 'marcus_s',
    password: 'password123',
    name: 'Marcus Sterling',
    age: 54,
    gender: 'Male',
    deviceModel: 'AeroSense Home Breath Bio-Kit #904',
    memberSince: 'Oct 2026',
  },
];

export const ELEANOR_INITIAL_HISTORY: PredictionResult[] = [
  {
    id: 'TEST-HOME-001',
    patientId: 'pt-eleanor-01',
    name: 'Eleanor Vance',
    age: 68,
    gender: 'Female',
    disease: 'Diabetes Risk',
    confidence: 96,
    risk: 'Moderate',
    recommendation: 'Consult physician. Please schedule a visit with your primary doctor for blood glucose and HbA1c testing.',
    date: 'Oct 06, 2026',
    vocValues: VOC_PRESETS.diabetes.values,
    detectedBiomarkers: ['VOC 1 (Acetone: 84.2 ppm)', 'VOC 8 (Pentane: 62.0 ppb)'],
  },
  {
    id: 'TEST-HOME-002',
    patientId: 'pt-eleanor-01',
    name: 'Eleanor Vance',
    age: 68,
    gender: 'Female',
    disease: 'Healthy / No Elevated Risk Detected',
    confidence: 98,
    risk: 'Low',
    recommendation: 'Breath profile normal. Keep maintaining your daily hydration and balanced diet.',
    date: 'Oct 02, 2026',
    vocValues: VOC_PRESETS.healthy.values,
    detectedBiomarkers: ['All 20 sensors in physiological green baseline'],
  },
];

export const MARCUS_INITIAL_HISTORY: PredictionResult[] = [
  {
    id: 'TEST-HOME-101',
    patientId: 'pt-marcus-02',
    name: 'Marcus Sterling',
    age: 54,
    gender: 'Male',
    disease: 'Respiratory Inflammation Risk',
    confidence: 94,
    risk: 'High',
    recommendation: 'Consult physician. FeNO breath levels elevated. Please check in with your healthcare clinic.',
    date: 'Oct 05, 2026',
    vocValues: VOC_PRESETS.respiratory.values,
    detectedBiomarkers: ['VOC 5 (Nitric Oxide: 78.5 ppb)', 'VOC 4 (HCN: 45.2 ppb)'],
  },
];

export function getAllPatients(): (PatientUser & { password: string })[] {
  try {
    const raw = localStorage.getItem(PATIENTS_KEY);
    if (!raw) {
      localStorage.setItem(PATIENTS_KEY, JSON.stringify(DEMO_PATIENTS));
      return DEMO_PATIENTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEMO_PATIENTS;
  }
}

export function getActivePatient(): PatientUser | null {
  try {
    const raw = localStorage.getItem(ACTIVE_PATIENT_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    return null; // By default, show clean Patient Login Page!
  } catch {
    return null;
  }
}

export function setActivePatient(patient: PatientUser | null): void {
  try {
    if (patient) {
      localStorage.setItem(ACTIVE_PATIENT_KEY, JSON.stringify(patient));
    } else {
      localStorage.removeItem(ACTIVE_PATIENT_KEY);
    }
  } catch {}
}

export function registerPatient(
  username: string,
  name: string,
  age: number,
  gender: 'Male' | 'Female' | 'Other',
  password?: string
): PatientUser {
  const all = getAllPatients();
  const id = `pt-${Date.now().toString(36)}`;
  const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '_');

  const newPatient: PatientUser & { password: string } = {
    id,
    username: cleanUsername,
    password: password || 'password123',
    name: name.trim() || 'Home Testing Patient',
    age: age || 40,
    gender,
    deviceModel: 'AeroSense Home Breath Bio-Kit (Connected)',
    memberSince: 'Oct 2026',
  };

  all.push(newPatient);
  try {
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(all));
  } catch {}

  // Initialize empty isolated history for new patient
  try {
    localStorage.setItem(`${PATIENT_TESTS_PREFIX}${id}`, JSON.stringify([]));
  } catch {}

  setActivePatient(newPatient);
  return newPatient;
}

export function loginPatient(username: string, password?: string): PatientUser | null {
  const all = getAllPatients();
  const cleanUsername = username.trim().toLowerCase();
  const found = all.find((p) => p.username.toLowerCase() === cleanUsername);

  if (found) {
    setActivePatient(found);
    return found;
  }
  return null;
}

// Get tests belonging exclusively to this patient
export function getPatientTests(patientId: string): PredictionResult[] {
  try {
    const raw = localStorage.getItem(`${PATIENT_TESTS_PREFIX}${patientId}`);
    if (raw) {
      return JSON.parse(raw);
    }
    // Seed initial tests for demo users
    if (patientId === 'pt-eleanor-01') {
      localStorage.setItem(`${PATIENT_TESTS_PREFIX}${patientId}`, JSON.stringify(ELEANOR_INITIAL_HISTORY));
      return ELEANOR_INITIAL_HISTORY;
    }
    if (patientId === 'pt-marcus-02') {
      localStorage.setItem(`${PATIENT_TESTS_PREFIX}${patientId}`, JSON.stringify(MARCUS_INITIAL_HISTORY));
      return MARCUS_INITIAL_HISTORY;
    }
    return [];
  } catch {
    return patientId === 'pt-eleanor-01' ? ELEANOR_INITIAL_HISTORY : [];
  }
}

export function savePatientTest(patientId: string, test: PredictionResult): PredictionResult[] {
  const current = getPatientTests(patientId);
  const updated = [test, ...current.filter((t) => t.id !== test.id)];
  try {
    localStorage.setItem(`${PATIENT_TESTS_PREFIX}${patientId}`, JSON.stringify(updated));
  } catch {}
  return updated;
}

export function deletePatientTest(patientId: string, testId: string): PredictionResult[] {
  const current = getPatientTests(patientId);
  const updated = current.filter((t) => t.id !== testId);
  try {
    localStorage.setItem(`${PATIENT_TESTS_PREFIX}${patientId}`, JSON.stringify(updated));
  } catch {}
  return updated;
}
