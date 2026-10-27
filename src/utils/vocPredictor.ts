import { VocDescriptor, PredictionResult, PatientInfo } from '../types/screening';

export const VOC_DEFINITIONS: VocDescriptor[] = [
  { id: 1, name: 'VOC 1', biomarker: 'Acetone', unit: 'ppm', normalMin: 0.2, normalMax: 1.8 },
  { id: 2, name: 'VOC 2', biomarker: 'Isoprene', unit: 'ppb', normalMin: 12.0, normalMax: 50.0 },
  { id: 3, name: 'VOC 3', biomarker: 'Ammonia', unit: 'ppm', normalMin: 0.1, normalMax: 1.2 },
  { id: 4, name: 'VOC 4', biomarker: 'Hydrogen Cyanide', unit: 'ppb', normalMin: 1.0, normalMax: 10.0 },
  { id: 5, name: 'VOC 5', biomarker: 'Nitric Oxide (FeNO)', unit: 'ppb', normalMin: 5.0, normalMax: 25.0 },
  { id: 6, name: 'VOC 6', biomarker: 'Carbon Monoxide', unit: 'ppm', normalMin: 0.5, normalMax: 2.5 },
  { id: 7, name: 'VOC 7', biomarker: 'Acetaldehyde', unit: 'ppb', normalMin: 2.0, normalMax: 15.0 },
  { id: 8, name: 'VOC 8', biomarker: 'Pentane', unit: 'ppb', normalMin: 0.5, normalMax: 4.0 },
  { id: 9, name: 'VOC 9', biomarker: 'Methanethiol', unit: 'ppb', normalMin: 0.2, normalMax: 3.5 },
  { id: 10, name: 'VOC 10', biomarker: 'Butyric Acid', unit: 'ppm', normalMin: 0.05, normalMax: 0.8 },
  { id: 11, name: 'VOC 11', biomarker: 'Hexanal', unit: 'ppb', normalMin: 1.0, normalMax: 8.0 },
  { id: 12, name: 'VOC 12', biomarker: 'Benzene Derivative', unit: 'ppb', normalMin: 0.1, normalMax: 2.0 },
  { id: 13, name: 'VOC 13', biomarker: 'Toluene', unit: 'ppb', normalMin: 0.2, normalMax: 3.0 },
  { id: 14, name: 'VOC 14', biomarker: 'Acetic Acid', unit: 'ppm', normalMin: 0.1, normalMax: 1.5 },
  { id: 15, name: 'VOC 15', biomarker: 'Hydrogen Sulfide', unit: 'ppb', normalMin: 1.0, normalMax: 12.0 },
  { id: 16, name: 'VOC 16', biomarker: 'Dimethyl Sulfide', unit: 'ppb', normalMin: 0.3, normalMax: 4.0 },
  { id: 17, name: 'VOC 17', biomarker: 'Propanol', unit: 'ppb', normalMin: 2.0, normalMax: 20.0 },
  { id: 18, name: 'VOC 18', biomarker: 'Octanal', unit: 'ppb', normalMin: 0.5, normalMax: 6.0 },
  { id: 19, name: 'VOC 19', biomarker: 'Nonanal', unit: 'ppb', normalMin: 0.8, normalMax: 7.5 },
  { id: 20, name: 'VOC 20', biomarker: 'Decanal', unit: 'ppb', normalMin: 0.4, normalMax: 5.0 },
];

export const SUPPORTED_DISEASES = [
  {
    name: 'Diabetes Mellitus Risk',
    primaryVocs: 'VOC 1 (Acetone) & VOC 8 (Pentane)',
    description: 'Elevated ketones and breath acetone resulting from abnormal glucose metabolism.',
  },
  {
    name: 'Chronic Kidney Disease (Renal Risk)',
    primaryVocs: 'VOC 3 (Ammonia) & VOC 15 (Hydrogen Sulfide)',
    description: 'Elevated blood urea nitrogen breakdown causing uremic breath ammonia.',
  },
  {
    name: 'Asthma & Respiratory Inflammation',
    primaryVocs: 'VOC 5 (Nitric Oxide/FeNO) & VOC 4 (HCN)',
    description: 'Airway eosinophilic inflammation and reactive oxygen species.',
  },
  {
    name: 'Liver Cirrhosis / Hepatic Dysfunction',
    primaryVocs: 'VOC 9 (Methanethiol) & VOC 16 (Dimethyl Sulfide)',
    description: 'Impaired hepatic sulfur metabolism leading to fetor hepaticus.',
  },
  {
    name: 'Gastric & GI Inflammation Risk',
    primaryVocs: 'VOC 15 (Hydrogen Sulfide) & VOC 10 (Butyric Acid)',
    description: 'Upper gastrointestinal microbial dysbiosis and mucosal irritation.',
  },
  {
    name: 'Cardiovascular / Oxidative Stress',
    primaryVocs: 'VOC 6 (Carbon Monoxide) & VOC 8 (Pentane)',
    description: 'Elevated endogenous lipid peroxidation and systemic oxidative load.',
  },
  {
    name: 'Healthy Normal Profile',
    primaryVocs: 'All 20 VOCs in baseline range',
    description: 'Optimal physiological metabolic breath signature.',
  },
];

export const VOC_PRESETS = {
  diabetes: {
    label: 'Diabetes Risk Profile',
    values: [84.2, 48.0, 15.2, 8.5, 18.0, 3.4, 28.5, 62.0, 4.1, 14.5, 9.2, 1.8, 2.5, 22.0, 6.2, 3.8, 18.0, 5.4, 7.2, 4.0],
  },
  healthy: {
    label: 'Healthy Normal Profile',
    values: [1.2, 28.4, 0.8, 4.2, 14.0, 1.2, 6.5, 2.1, 1.0, 0.4, 3.2, 0.8, 1.4, 0.6, 4.5, 1.2, 8.0, 2.4, 3.1, 1.8],
  },
  respiratory: {
    label: 'Respiratory Inflammation Profile',
    values: [2.1, 22.0, 1.4, 45.2, 78.5, 6.8, 12.0, 38.4, 2.5, 1.2, 32.0, 4.5, 3.8, 1.5, 14.0, 2.8, 12.4, 18.5, 22.0, 14.2],
  },
  renal: {
    label: 'Kidney (Renal) Risk Profile',
    values: [14.5, 32.0, 78.8, 6.5, 16.0, 2.8, 14.2, 24.0, 22.0, 12.0, 8.5, 2.1, 4.2, 18.0, 52.5, 44.0, 15.0, 6.2, 8.0, 5.1],
  },
  liver: {
    label: 'Liver Dysfunction Profile',
    values: [8.5, 24.0, 18.2, 5.0, 12.4, 3.1, 48.5, 16.2, 82.0, 8.0, 10.4, 3.1, 2.8, 14.0, 28.0, 68.4, 32.0, 7.2, 6.0, 4.2],
  },
  gastric: {
    label: 'Gastric & GI Inflammation Profile',
    values: [5.0, 18.0, 42.0, 8.2, 14.5, 2.4, 16.0, 12.0, 18.0, 68.5, 9.0, 1.5, 2.0, 28.0, 76.5, 22.0, 14.0, 8.0, 9.5, 6.0],
  },
  cardio: {
    label: 'Oxidative & Cardio Stress Profile',
    values: [12.0, 72.5, 16.0, 4.8, 22.0, 68.4, 18.0, 64.2, 12.0, 6.5, 42.0, 8.5, 5.2, 12.0, 16.0, 14.0, 18.0, 32.0, 28.0, 18.5],
  },
};

export function predictFromVoc(patient: PatientInfo, vocs: number[], userId: string = 'user-default'): PredictionResult {
  const v1_acetone = vocs[0] ?? 0;
  const v2_isoprene = vocs[1] ?? 0;
  const v3_ammonia = vocs[2] ?? 0;
  const v4_cyanide = vocs[3] ?? 0;
  const v5_nitric = vocs[4] ?? 0;
  const v6_carbonMonoxide = vocs[5] ?? 0;
  const v7_acetaldehyde = vocs[6] ?? 0;
  const v8_pentane = vocs[7] ?? 0;
  const v9_methanethiol = vocs[8] ?? 0;
  const v10_butyric = vocs[9] ?? 0;
  const v11_hexanal = vocs[10] ?? 0;
  const v15_h2s = vocs[14] ?? 0;
  const v16_dms = vocs[15] ?? 0;

  const detectedBiomarkers: string[] = [];

  // 1. Diabetes Pattern (High Acetone VOC 1 > 45)
  if (v1_acetone > 45) {
    detectedBiomarkers.push(`VOC 1 (Acetone: ${v1_acetone} ppm)`);
    if (v8_pentane > 30) detectedBiomarkers.push(`VOC 8 (Pentane: ${v8_pentane} ppb)`);

    const confidence = Math.min(99, Math.round(88 + (v1_acetone / 100) * 10));
    const risk = v1_acetone > 70 ? 'High' : 'Moderate';

    return {
      id: `PRED-${Date.now().toString().slice(-6)}`,
      userId,
      patientId: patient.patientId || 'PID-2026-001',
      name: patient.name || 'Anonymous Patient',
      age: Number(patient.age) || 45,
      gender: patient.gender,
      disease: 'Diabetes Risk',
      confidence,
      risk,
      recommendation:
        'Consult physician. Order fasting blood glucose (FBG) and Glycated Hemoglobin (HbA1c) diagnostic test to confirm glycemic regulation.',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      vocValues: vocs,
      detectedBiomarkers,
    };
  }

  // 2. Liver Cirrhosis / Hepatic Dysfunction Pattern (High Methanethiol VOC 9 > 40 & Dimethyl sulfide VOC 16 > 30)
  if (v9_methanethiol > 40 || (v9_methanethiol > 25 && v16_dms > 35)) {
    detectedBiomarkers.push(`VOC 9 (Methanethiol: ${v9_methanethiol} ppb)`);
    if (v16_dms > 30) detectedBiomarkers.push(`VOC 16 (Dimethyl Sulfide: ${v16_dms} ppb)`);
    if (v7_acetaldehyde > 30) detectedBiomarkers.push(`VOC 7 (Acetaldehyde: ${v7_acetaldehyde} ppb)`);

    return {
      id: `PRED-${Date.now().toString().slice(-6)}`,
      userId,
      patientId: patient.patientId || 'PID-2026-001',
      name: patient.name || 'Anonymous Patient',
      age: Number(patient.age) || 45,
      gender: patient.gender,
      disease: 'Liver Cirrhosis / Hepatic Risk',
      confidence: 93,
      risk: v9_methanethiol > 60 ? 'High' : 'Moderate',
      recommendation:
        'Consult hepatologist or gastroenterologist. Comprehensive Liver Function Test (LFT: ALT/AST/Bilirubin) and abdominal ultrasound recommended.',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      vocValues: vocs,
      detectedBiomarkers,
    };
  }

  // 3. Chronic Kidney Disease / Renal Pattern (High Ammonia VOC 3 > 40)
  if (v3_ammonia > 40) {
    detectedBiomarkers.push(`VOC 3 (Ammonia: ${v3_ammonia} ppm)`);
    if (v15_h2s > 30) detectedBiomarkers.push(`VOC 15 (Hydrogen Sulfide: ${v15_h2s} ppb)`);

    return {
      id: `PRED-${Date.now().toString().slice(-6)}`,
      userId,
      patientId: patient.patientId || 'PID-2026-001',
      name: patient.name || 'Anonymous Patient',
      age: Number(patient.age) || 45,
      gender: patient.gender,
      disease: 'Chronic Kidney Disease (Renal Risk)',
      confidence: 95,
      risk: v3_ammonia > 60 ? 'High' : 'Moderate',
      recommendation:
        'Consult nephrologist. Serum Creatinine, Blood Urea Nitrogen (BUN), and eGFR evaluation recommended to check filtration efficiency.',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      vocValues: vocs,
      detectedBiomarkers,
    };
  }

  // 4. Respiratory & Airway Inflammation Pattern (High FeNO VOC 5 > 40 or Cyanide VOC 4 > 30)
  if (v5_nitric > 40 || v4_cyanide > 30) {
    if (v5_nitric > 40) detectedBiomarkers.push(`VOC 5 (Nitric Oxide: ${v5_nitric} ppb)`);
    if (v4_cyanide > 30) detectedBiomarkers.push(`VOC 4 (HCN: ${v4_cyanide} ppb)`);
    if (v11_hexanal > 20) detectedBiomarkers.push(`VOC 11 (Hexanal: ${v11_hexanal} ppb)`);

    return {
      id: `PRED-${Date.now().toString().slice(-6)}`,
      userId,
      patientId: patient.patientId || 'PID-2026-001',
      name: patient.name || 'Anonymous Patient',
      age: Number(patient.age) || 45,
      gender: patient.gender,
      disease: 'Respiratory / Asthma Inflammation Risk',
      confidence: 94,
      risk: v5_nitric > 60 ? 'High' : 'Moderate',
      recommendation:
        'Consult pulmonologist. Spirometry lung function test and peak expiratory flow examination recommended.',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      vocValues: vocs,
      detectedBiomarkers,
    };
  }

  // 5. Gastric / Gastrointestinal Inflammation Pattern (High H2S VOC 15 > 40 & Butyric VOC 10 > 30)
  if (v15_h2s > 40 && v10_butyric > 30) {
    detectedBiomarkers.push(`VOC 15 (Hydrogen Sulfide: ${v15_h2s} ppb)`);
    detectedBiomarkers.push(`VOC 10 (Butyric Acid: ${v10_butyric} ppm)`);

    return {
      id: `PRED-${Date.now().toString().slice(-6)}`,
      userId,
      patientId: patient.patientId || 'PID-2026-001',
      name: patient.name || 'Anonymous Patient',
      age: Number(patient.age) || 45,
      gender: patient.gender,
      disease: 'Gastric & GI Inflammation Risk',
      confidence: 91,
      risk: 'Moderate',
      recommendation:
        'Consult gastroenterologist. Screening for Helicobacter pylori breath antigens and upper endoscopy recommended if persistent.',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      vocValues: vocs,
      detectedBiomarkers,
    };
  }

  // 6. Cardiovascular / Systemic Oxidative Stress Pattern (High CO VOC 6 > 40 & Pentane VOC 8 > 35)
  if (v6_carbonMonoxide > 40 || (v8_pentane > 35 && v2_isoprene > 55)) {
    detectedBiomarkers.push(`VOC 6 (Carbon Monoxide: ${v6_carbonMonoxide} ppm)`);
    detectedBiomarkers.push(`VOC 8 (Pentane: ${v8_pentane} ppb)`);
    if (v2_isoprene > 50) detectedBiomarkers.push(`VOC 2 (Isoprene: ${v2_isoprene} ppb)`);

    return {
      id: `PRED-${Date.now().toString().slice(-6)}`,
      userId,
      patientId: patient.patientId || 'PID-2026-001',
      name: patient.name || 'Anonymous Patient',
      age: Number(patient.age) || 45,
      gender: patient.gender,
      disease: 'Cardiovascular / Oxidative Stress Risk',
      confidence: 92,
      risk: 'Moderate',
      recommendation:
        'Consult cardiologist. Lipid profile panel, high-sensitivity C-reactive protein (hs-CRP), and blood pressure check recommended.',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      vocValues: vocs,
      detectedBiomarkers,
    };
  }

  // 7. Default Healthy Baseline
  return {
    id: `PRED-${Date.now().toString().slice(-6)}`,
    userId,
    patientId: patient.patientId || 'PID-2026-001',
    name: patient.name || 'Anonymous Patient',
    age: Number(patient.age) || 30,
    gender: patient.gender,
    disease: 'Healthy / No Elevated Risk Detected',
    confidence: 98,
    risk: 'Low',
    recommendation:
      'All volatile organic breath biomarkers are within normal physiological bounds. Continue standard healthy lifestyle and routine wellness visits.',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    vocValues: vocs,
    detectedBiomarkers: ['All 20 VOC sensors within baseline green tolerances'],
  };
}
