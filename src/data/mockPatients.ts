import { Patient, ClinicalOrder } from '../types/clinical';

export const DOCTOR_PROFILE = {
  name: 'Dr. Sarah Chen, MD, FCCM',
  role: 'Chief Intensivist & Medical Director',
  department: 'Division of Critical Care & Telemetry',
  institution: 'Metropolitan Academic Medical Center',
  avatarUrl: '/src/assets/images/doctor_lead_physician_1791304693081.jpg',
  badgeId: 'ICU-8824-ATT',
};

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pt-001',
    mrn: 'MRN-9402188',
    name: 'Eleanor Vance',
    age: 68,
    gender: 'Female',
    bed: 'ICU-04',
    ward: 'Cardiothoracic ICU',
    admissionTime: 'Oct 05, 2026 · 14:22',
    primaryDiagnosis: 'Post-CABG × 3, Acute Vasoplegic Syndrome',
    secondaryDiagnosis: 'Type 2 Diabetes, Mild Acute Kidney Injury Stage 1',
    allergies: ['Penicillin (Anaphylaxis)', 'Sulfa Drugs'],
    codeStatus: 'Full Code',
    attendingPhysician: 'Dr. Sarah Chen, MD',
    acuityScore: 11.4, // SOFA Score
    acuityLevel: 'critical',
    avatarUrl: '/src/assets/images/patient_portrait_eleanor_1791304725301.jpg',
    notesCount: 6,
    unacknowledgedAlerts: 2,
    vitals: {
      heartRate: 104,
      heartRateBaseline: 76,
      rhythm: 'Sinus Tachycardia with occasional PVCs',
      bloodPressureSys: 88,
      bloodPressureDia: 54,
      meanArterialPressure: 65,
      spo2: 95,
      perfusionIndex: 2.1,
      respRate: 22,
      etco2: 32,
      temperature: 38.4,
      cardiacIndex: 2.9,
      strokeVolumeVariation: 15,
      centralVenousPressure: 8,
    },
    labs: [
      {
        id: 'lab-1',
        name: 'Serum Lactate',
        category: 'Sepsis & Inflammatory',
        value: 3.4,
        unit: 'mmol/L',
        referenceLow: 0.5,
        referenceHigh: 2.0,
        status: 'critical',
        trend: 'rising',
        timestamp: '10:15 Today',
        notes: 'Stat repeat ordered post-fluid challenge'
      },
      {
        id: 'lab-2',
        name: 'High-Sensitivity Troponin-I',
        category: 'Cardiac',
        value: 142.8,
        unit: 'ng/L',
        referenceLow: 0.0,
        referenceHigh: 14.0,
        status: 'critical',
        trend: 'falling',
        timestamp: '08:00 Today',
        notes: 'Down from post-op baseline 320 ng/L'
      },
      {
        id: 'lab-3',
        name: 'Procalcitonin',
        category: 'Sepsis & Inflammatory',
        value: 2.8,
        unit: 'ng/mL',
        referenceLow: 0.0,
        referenceHigh: 0.5,
        status: 'caution',
        trend: 'rising',
        timestamp: '06:30 Today'
      },
      {
        id: 'lab-4',
        name: 'Arterial pH',
        category: 'Arterial Blood Gas',
        value: 7.31,
        unit: 'pH',
        referenceLow: 7.35,
        referenceHigh: 7.45,
        status: 'caution',
        trend: 'stable',
        timestamp: '09:45 Today'
      },
      {
        id: 'lab-5',
        name: 'PaO2 / FiO2 Ratio',
        category: 'Arterial Blood Gas',
        value: 285,
        unit: 'mmHg',
        referenceLow: 300,
        referenceHigh: 500,
        status: 'caution',
        trend: 'stable',
        timestamp: '09:45 Today'
      },
      {
        id: 'lab-6',
        name: 'Serum Creatinine',
        category: 'Renal & Metabolic',
        value: 1.62,
        unit: 'mg/dL',
        referenceLow: 0.6,
        referenceHigh: 1.1,
        status: 'caution',
        trend: 'rising',
        timestamp: '06:00 Today'
      },
      {
        id: 'lab-7',
        name: 'White Blood Cell Count',
        category: 'Hematology',
        value: 15.8,
        unit: '×10³/µL',
        referenceLow: 4.5,
        referenceHigh: 11.0,
        status: 'caution',
        trend: 'rising',
        timestamp: '06:00 Today'
      }
    ],
    aiDifferentials: [
      {
        id: 'diff-1',
        condition: 'Postoperative Vasoplegic Syndrome secondary to Cardiopulmonary Bypass',
        confidence: 94.2,
        icdCode: 'I97.89 / R57.8',
        rationale: 'Persistent systemic hypotension (MAP 65) with high cardiac index (2.9 L/min/m²), elevated stroke volume variation (15%), warm extremities, and acute elevation of serum lactate post-CPB.',
        keyDrivers: [
          'Systemic vascular resistance index (SVRI) < 1200 dyn·s/cm⁵/m²',
          'Hyperdynamic left ventricular ejection on bedside echo',
          'Absence of primary cardiac contractility deficit',
          'Lactate kinetic trend (+0.8 mmol/L over 3 hrs)'
        ],
        urgency: 'Immediate',
        recommendedActions: [
          {
            id: 'rec-1',
            action: 'Titrate Norepinephrine infusion',
            type: 'Medication',
            detail: 'Titrate up from 0.08 mcg/kg/min to target MAP 65-75 mmHg; initiate Vasopressin add-on if >0.15 mcg/kg/min.',
            dosage: '0.08 - 0.20 mcg/kg/min IV'
          },
          {
            id: 'rec-2',
            action: 'Evaluate Fluid Responsiveness (Passive Leg Raise / SVV)',
            type: 'Fluid Management',
            detail: 'SVV is 15%. Administer 250 mL Plasmalyte over 15 min only if delta SVV > 12% confirms preload dependency.'
          },
          {
            id: 'rec-3',
            action: 'Order Bedside Transesophageal / TTE Re-Assessment',
            type: 'Diagnostics',
            detail: 'Verify right ventricular systolic pressure and rule out pericardial effusion or tamponade physiology.'
          },
          {
            id: 'rec-4',
            action: 'Stat Repeat Arterial Blood Gas & Lactate clearance',
            type: 'Diagnostics',
            detail: 'Recheck lactate in 90 minutes to ensure adequate clearance kinetics under vasopressor titration.'
          }
        ]
      },
      {
        id: 'diff-2',
        condition: 'Early Sepsis / Catheter-Associated Bloodstream Infection',
        confidence: 61.5,
        icdCode: 'A41.9 / T81.44',
        rationale: 'Fever (38.4°C), leukocytosis (15.8), and elevated Procalcitonin (2.8 ng/mL) with active central venous and arterial catheters.',
        keyDrivers: ['Procalcitonin > 2.0 ng/mL', 'Temperature spike to 38.4°C', 'Elevated WBC count'],
        urgency: 'Urgent',
        recommendedActions: [
          {
            id: 'rec-5',
            action: 'Draw 2 sets peripheral & central blood cultures',
            type: 'Diagnostics',
            detail: 'Prior to broadening antimicrobial coverage'
          },
          {
            id: 'rec-6',
            action: 'Maintain Empiric Cefepime + Vancomycin protocol',
            type: 'Medication',
            detail: 'Adjust Vancomycin trough for renal clearance (Cr 1.62)'
          }
        ]
      },
      {
        id: 'diff-3',
        condition: 'Cardiogenic Hypoperfusion / Delayed Graft Ischemia',
        confidence: 18.3,
        icdCode: 'I21.A1',
        rationale: 'Troponin-I is decreasing from peak post-op; cardiac index preserved; ST-segment morphology currently baseline.',
        keyDrivers: ['Troponin declining', 'No acute ST elevation on Lead II'],
        urgency: 'Monitor',
        recommendedActions: [
          {
            id: 'rec-7',
            action: 'Serial 12-lead ECG every 6 hours',
            type: 'Diagnostics',
            detail: 'Screen for silent graft spasm'
          }
        ]
      }
    ]
  },
  {
    id: 'pt-002',
    mrn: 'MRN-8319042',
    name: 'Marcus Sterling',
    age: 54,
    gender: 'Male',
    bed: 'ICU-02',
    ward: 'Medical ICU',
    admissionTime: 'Oct 04, 2026 · 22:10',
    primaryDiagnosis: 'Severe Acute Respiratory Distress Syndrome (ARDS)',
    secondaryDiagnosis: 'Aspiration Pneumonia, Hypertension',
    allergies: ['No Known Drug Allergies'],
    codeStatus: 'Full Code',
    attendingPhysician: 'Dr. Sarah Chen, MD',
    acuityScore: 9.8,
    acuityLevel: 'critical',
    notesCount: 4,
    unacknowledgedAlerts: 1,
    vitals: {
      heartRate: 92,
      heartRateBaseline: 80,
      rhythm: 'Normal Sinus Rhythm',
      bloodPressureSys: 124,
      bloodPressureDia: 78,
      meanArterialPressure: 93,
      spo2: 91,
      perfusionIndex: 3.4,
      respRate: 26,
      etco2: 44,
      temperature: 37.9,
      cardiacIndex: 3.1,
      strokeVolumeVariation: 8,
      centralVenousPressure: 12,
    },
    labs: [
      {
        id: 'lab-m1',
        name: 'PaO2 / FiO2 Ratio',
        category: 'Arterial Blood Gas',
        value: 142,
        unit: 'mmHg',
        referenceLow: 300,
        referenceHigh: 500,
        status: 'critical',
        trend: 'falling',
        timestamp: '10:00 Today'
      },
      {
        id: 'lab-m2',
        name: 'Arterial PaCO2',
        category: 'Arterial Blood Gas',
        value: 52,
        unit: 'mmHg',
        referenceLow: 35,
        referenceHigh: 45,
        status: 'caution',
        trend: 'rising',
        timestamp: '10:00 Today'
      },
      {
        id: 'lab-m3',
        name: 'Serum Lactate',
        category: 'Sepsis & Inflammatory',
        value: 1.8,
        unit: 'mmol/L',
        referenceLow: 0.5,
        referenceHigh: 2.0,
        status: 'nominal',
        trend: 'stable',
        timestamp: '09:00 Today'
      }
    ],
    aiDifferentials: [
      {
        id: 'diff-m1',
        condition: 'Moderate-to-Severe ARDS with Refractory Hypoxemia',
        confidence: 96.0,
        icdCode: 'J80',
        rationale: 'P/F ratio < 150 on PEEP 14 cmH2O and FiO2 0.70 with bilateral infiltrates.',
        keyDrivers: ['P/F 142 mmHg', 'High driving pressure (16 cmH2O)', 'EtCO2 44 mmHg'],
        urgency: 'Immediate',
        recommendedActions: [
          {
            id: 'rec-m1',
            action: 'Evaluate Prone Positioning Protocol (16 hrs/day)',
            type: 'Nursing Procedure',
            detail: 'Prone therapy indicated for P/F < 150 refractory to lung-protective ventilation.'
          },
          {
            id: 'rec-m2',
            action: 'Initiate Neuromuscular Blockade Infusion (Cisatracurium)',
            type: 'Medication',
            detail: 'Continuous 48-hour infusion to eliminate patient-ventilator dyssynchrony.'
          }
        ]
      }
    ]
  },
  {
    id: 'pt-003',
    mrn: 'MRN-4421901',
    name: 'Clara Alvarez',
    age: 72,
    gender: 'Female',
    bed: 'ICU-07',
    ward: 'Cardiothoracic ICU',
    admissionTime: 'Oct 06, 2026 · 04:15',
    primaryDiagnosis: 'Acute Decompensated Heart Failure, Flash Pulmonary Edema',
    secondaryDiagnosis: 'Ischemic Cardiomyopathy, Chronic Kidney Disease Stage 3b',
    allergies: ['ACE Inhibitors (Angioedema)', 'Contrast Dye (Moderate)'],
    codeStatus: 'Full Code',
    attendingPhysician: 'Dr. Sarah Chen, MD',
    acuityScore: 8.2,
    acuityLevel: 'warning',
    notesCount: 3,
    unacknowledgedAlerts: 1,
    vitals: {
      heartRate: 88,
      heartRateBaseline: 72,
      rhythm: 'Atrial Fibrillation with controlled ventricular response',
      bloodPressureSys: 148,
      bloodPressureDia: 92,
      meanArterialPressure: 110,
      spo2: 96,
      perfusionIndex: 3.8,
      respRate: 18,
      etco2: 35,
      temperature: 36.8,
      cardiacIndex: 2.1,
      strokeVolumeVariation: 6,
      centralVenousPressure: 16,
    },
    labs: [
      {
        id: 'lab-c1',
        name: 'NT-proBNP',
        category: 'Cardiac',
        value: 6840,
        unit: 'pg/mL',
        referenceLow: 0,
        referenceHigh: 450,
        status: 'critical',
        trend: 'falling',
        timestamp: '07:30 Today'
      },
      {
        id: 'lab-c2',
        name: 'Serum Potassium',
        category: 'Renal & Metabolic',
        value: 4.8,
        unit: 'mmol/L',
        referenceLow: 3.5,
        referenceHigh: 5.0,
        status: 'nominal',
        trend: 'stable',
        timestamp: '07:30 Today'
      }
    ],
    aiDifferentials: [
      {
        id: 'diff-c1',
        condition: 'Hypertensive Cardiogenic Pulmonary Edema',
        confidence: 88.5,
        icdCode: 'I50.21',
        rationale: 'Elevated afterload (BP 148/92, MAP 110) with elevated filling pressure (CVP 16) and marked proBNP elevation.',
        keyDrivers: ['NT-proBNP 6840 pg/mL', 'CVP 16 mmHg', 'Controlled Afib'],
        urgency: 'Urgent',
        recommendedActions: [
          {
            id: 'rec-c1',
            action: 'Furosemide continuous infusion titration',
            type: 'Medication',
            detail: '10 mg/hr IV infusion targeting negative fluid balance -1500 mL/24h.'
          }
        ]
      }
    ]
  },
  {
    id: 'pt-004',
    mrn: 'MRN-7810234',
    name: 'David Okafor',
    age: 49,
    gender: 'Male',
    bed: 'ICU-09',
    ward: 'Neuro ICU',
    admissionTime: 'Oct 05, 2026 · 18:45',
    primaryDiagnosis: 'Subarachnoid Hemorrhage (Hunt & Hess Grade II)',
    secondaryDiagnosis: 'Status post coil embolization of ACom aneurysm',
    allergies: ['No Known Drug Allergies'],
    codeStatus: 'Full Code',
    attendingPhysician: 'Dr. Sarah Chen, MD',
    acuityScore: 6.5,
    acuityLevel: 'nominal',
    notesCount: 5,
    unacknowledgedAlerts: 0,
    vitals: {
      heartRate: 72,
      heartRateBaseline: 68,
      rhythm: 'Normal Sinus Rhythm',
      bloodPressureSys: 132,
      bloodPressureDia: 76,
      meanArterialPressure: 94,
      spo2: 99,
      perfusionIndex: 4.5,
      respRate: 14,
      etco2: 37,
      temperature: 37.1,
      cardiacIndex: 3.2,
      strokeVolumeVariation: 9,
      centralVenousPressure: 7,
    },
    labs: [
      {
        id: 'lab-d1',
        name: 'Serum Sodium',
        category: 'Renal & Metabolic',
        value: 139,
        unit: 'mmol/L',
        referenceLow: 135,
        referenceHigh: 145,
        status: 'nominal',
        trend: 'stable',
        timestamp: '08:00 Today'
      }
    ],
    aiDifferentials: [
      {
        id: 'diff-d1',
        condition: 'Post-Aneurysm Coiling Surveillance (Vasospasm Screen)',
        confidence: 82.0,
        icdCode: 'I60.1',
        rationale: 'Day 2 post-intervention; Lindegaard ratio normal; neurological examination intact GCS 15.',
        keyDrivers: ['GCS 15', 'Transcranial Doppler velocities < 120 cm/s'],
        urgency: 'Monitor',
        recommendedActions: [
          {
            id: 'rec-d1',
            action: 'Maintain Nimodipine 60 mg PO every 4 hours',
            type: 'Medication',
            detail: 'Maintain cerebral perfusion without allowing MAP drops < 80 mmHg.'
          }
        ]
      }
    ]
  },
  {
    id: 'pt-005',
    mrn: 'MRN-6091123',
    name: 'Evelyn Zhang',
    age: 61,
    gender: 'Female',
    bed: 'ICU-11',
    ward: 'Surgical ICU',
    admissionTime: 'Oct 06, 2026 · 02:00',
    primaryDiagnosis: 'Perforated Diverticulitis s/p Hartmann Procedure',
    secondaryDiagnosis: 'Septic Shock (Resolving)',
    allergies: ['Codeine'],
    codeStatus: 'Full Code',
    attendingPhysician: 'Dr. Sarah Chen, MD',
    acuityScore: 7.8,
    acuityLevel: 'warning',
    notesCount: 2,
    unacknowledgedAlerts: 0,
    vitals: {
      heartRate: 86,
      heartRateBaseline: 82,
      rhythm: 'Normal Sinus Rhythm',
      bloodPressureSys: 112,
      bloodPressureDia: 68,
      meanArterialPressure: 82,
      spo2: 97,
      perfusionIndex: 3.2,
      respRate: 18,
      etco2: 36,
      temperature: 37.6,
      cardiacIndex: 2.8,
      strokeVolumeVariation: 11,
      centralVenousPressure: 9,
    },
    labs: [
      {
        id: 'lab-e1',
        name: 'Serum Lactate',
        category: 'Sepsis & Inflammatory',
        value: 2.1,
        unit: 'mmol/L',
        referenceLow: 0.5,
        referenceHigh: 2.0,
        status: 'caution',
        trend: 'falling',
        timestamp: '09:00 Today'
      }
    ],
    aiDifferentials: [
      {
        id: 'diff-e1',
        condition: 'Resolving Septic Shock Post-Surgical Source Control',
        confidence: 91.0,
        icdCode: 'A41.51',
        rationale: 'Vasopressor requirements weaning; lactate decreasing from 4.6 to 2.1 mmol/L; urine output > 0.7 mL/kg/h.',
        keyDrivers: ['Weaning norepinephrine', 'Lactate trending downward'],
        urgency: 'Urgent',
        recommendedActions: [
          {
            id: 'rec-e1',
            action: 'Wean Norepinephrine as tolerated',
            type: 'Medication',
            detail: 'Maintain MAP >= 65 mmHg while titrating down by 0.02 mcg/kg/min every 30m.'
          }
        ]
      }
    ]
  },
  {
    id: 'pt-006',
    mrn: 'MRN-5519820',
    name: 'James Kowalski',
    age: 77,
    gender: 'Male',
    bed: 'ICU-12',
    ward: 'Cardiothoracic ICU',
    admissionTime: 'Oct 04, 2026 · 11:30',
    primaryDiagnosis: 'Transcatheter Aortic Valve Replacement (TAVR) Surveillance',
    secondaryDiagnosis: 'Complete Heart Block s/p Temporary Transvenous Pacer',
    allergies: ['Aspirin (GI Bleed)'],
    codeStatus: 'Full Code',
    attendingPhysician: 'Dr. Sarah Chen, MD',
    acuityScore: 5.2,
    acuityLevel: 'nominal',
    notesCount: 3,
    unacknowledgedAlerts: 0,
    vitals: {
      heartRate: 70,
      heartRateBaseline: 70,
      rhythm: 'Ventricular Paced Rhythm (VVI 70 bpm)',
      bloodPressureSys: 128,
      bloodPressureDia: 74,
      meanArterialPressure: 92,
      spo2: 98,
      perfusionIndex: 4.1,
      respRate: 16,
      etco2: 38,
      temperature: 36.9,
      cardiacIndex: 2.7,
      strokeVolumeVariation: 7,
      centralVenousPressure: 8,
    },
    labs: [
      {
        id: 'lab-j1',
        name: 'Hemoglobin',
        category: 'Hematology',
        value: 10.4,
        unit: 'g/dL',
        referenceLow: 13.0,
        referenceHigh: 17.0,
        status: 'caution',
        trend: 'stable',
        timestamp: '06:00 Today'
      }
    ],
    aiDifferentials: [
      {
        id: 'diff-j1',
        condition: 'Persistent High-Grade AV Block post-TAVR',
        confidence: 89.0,
        icdCode: 'I44.2',
        rationale: 'Dependent on temporary ventricular pacer at 70 bpm; no escape rhythm noted during threshold testing.',
        keyDrivers: ['100% ventricular paced dependency', 'No native conduction'],
        urgency: 'Urgent',
        recommendedActions: [
          {
            id: 'rec-j1',
            action: 'Consult Electrophysiology for Permanent Dual-Chamber Pacemaker',
            type: 'Consult',
            detail: 'Schedule implantation for tomorrow morning; maintain backup pacing.'
          }
        ]
      }
    ]
  }
];

export const INITIAL_ORDERS: ClinicalOrder[] = [
  {
    id: 'ord-101',
    patientId: 'pt-001',
    patientName: 'Eleanor Vance',
    bed: 'ICU-04',
    title: 'Norepinephrine Bitartrate Titration',
    type: 'Medication',
    priority: 'STAT',
    status: 'Authorized',
    orderedBy: 'Dr. Sarah Chen, MD',
    orderedAt: '10:20 AM',
    instructions: 'Titrate IV infusion 0.08 - 0.20 mcg/kg/min to maintain MAP >= 65 mmHg.'
  },
  {
    id: 'ord-102',
    patientId: 'pt-001',
    patientName: 'Eleanor Vance',
    bed: 'ICU-04',
    title: 'Stat Repeat Arterial Blood Gas & Lactate Panel',
    type: 'Stat Lab',
    priority: 'STAT',
    status: 'In Progress',
    orderedBy: 'Dr. Sarah Chen, MD',
    orderedAt: '10:25 AM',
    instructions: 'Draw via left radial arterial line. Stat turnaround within 15 minutes.'
  },
  {
    id: 'ord-103',
    patientId: 'pt-001',
    patientName: 'Eleanor Vance',
    bed: 'ICU-04',
    title: 'Point-of-Care Echocardiogram (TTE Focused)',
    type: 'Diagnostic Imaging',
    priority: 'Urgent',
    status: 'Pending',
    orderedBy: 'Dr. Sarah Chen, MD',
    orderedAt: '10:30 AM',
    instructions: 'Evaluate biventricular systolic function, RV volume overload, and rule out pericardial effusion.'
  },
  {
    id: 'ord-104',
    patientId: 'pt-002',
    patientName: 'Marcus Sterling',
    bed: 'ICU-02',
    title: 'Proning Team Activation (16-Hour Cycle)',
    type: 'Nursing Procedure',
    priority: 'STAT',
    status: 'Authorized',
    orderedBy: 'Dr. Sarah Chen, MD',
    orderedAt: '09:45 AM',
    instructions: 'Implement ARDS proning protocol with pressure injury prevention bundle.'
  },
  {
    id: 'ord-105',
    patientId: 'pt-003',
    patientName: 'Clara Alvarez',
    bed: 'ICU-07',
    title: 'Furosemide Continuous IV Infusion (10 mg/hr)',
    type: 'Medication',
    priority: 'Urgent',
    status: 'Authorized',
    orderedBy: 'Dr. Sarah Chen, MD',
    orderedAt: '08:15 AM',
    instructions: 'Strict intake/output documentation hourly. Foley catheter in place.'
  }
];
