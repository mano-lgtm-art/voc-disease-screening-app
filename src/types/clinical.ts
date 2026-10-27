export type AcuityLevel = 'critical' | 'warning' | 'nominal';

export interface VitalsTelemetry {
  heartRate: number; // bpm
  heartRateBaseline: number;
  rhythm: string; // e.g. "Normal Sinus Rhythm", "Sinus Tachycardia"
  bloodPressureSys: number; // mmHg
  bloodPressureDia: number;
  meanArterialPressure: number; // MAP mmHg
  spo2: number; // %
  perfusionIndex: number; // %
  respRate: number; // breaths/min
  etco2: number; // mmHg
  temperature: number; // °C
  cardiacIndex: number; // L/min/m²
  strokeVolumeVariation: number; // SVV %
  centralVenousPressure: number; // CVP mmHg
}

export interface LabBiomarker {
  id: string;
  name: string;
  category: 'Cardiac' | 'Sepsis & Inflammatory' | 'Arterial Blood Gas' | 'Renal & Metabolic' | 'Hematology';
  value: number;
  unit: string;
  referenceLow: number;
  referenceHigh: number;
  status: 'nominal' | 'caution' | 'critical';
  trend: 'rising' | 'falling' | 'stable';
  timestamp: string;
  notes?: string;
}

export interface AiDifferential {
  id: string;
  condition: string;
  confidence: number; // percentage 0-100
  icdCode: string;
  rationale: string;
  keyDrivers: string[];
  urgency: 'Immediate' | 'Urgent' | 'Monitor';
  recommendedActions: {
    id: string;
    action: string;
    type: 'Medication' | 'Diagnostics' | 'Fluid Management' | 'Consult' | 'Nursing Procedure';
    detail: string;
    dosage?: string;
  }[];
}

export interface ClinicalOrder {
  id: string;
  patientId: string;
  patientName: string;
  bed: string;
  title: string;
  type: 'Medication' | 'Stat Lab' | 'Diagnostic Imaging' | 'Nursing Procedure';
  priority: 'STAT' | 'Urgent' | 'Routine';
  status: 'Authorized' | 'In Progress' | 'Completed' | 'Pending';
  orderedBy: string;
  orderedAt: string;
  instructions: string;
}

export interface Patient {
  id: string;
  mrn: string;
  name: string;
  age: number;
  gender: 'Female' | 'Male';
  bed: string;
  ward: 'Surgical ICU' | 'Cardiothoracic ICU' | 'Medical ICU' | 'Neuro ICU';
  admissionTime: string;
  primaryDiagnosis: string;
  secondaryDiagnosis?: string;
  allergies: string[];
  codeStatus: 'Full Code' | 'DNR / DNI';
  attendingPhysician: string;
  acuityScore: number; // SOFA / APACHE index (e.g. 1-15)
  acuityLevel: AcuityLevel;
  vitals: VitalsTelemetry;
  labs: LabBiomarker[];
  aiDifferentials: AiDifferential[];
  avatarUrl?: string;
  notesCount: number;
  unacknowledgedAlerts: number;
}
