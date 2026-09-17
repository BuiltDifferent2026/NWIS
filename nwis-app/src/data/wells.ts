// ─── Synthetic Well Data for Assam Basin ───

export type WellStatus = 'drilling' | 'completed' | 'suspended' | 'planned';
export type TrajectoryType = 'vertical' | 'deviated' | 'horizontal' | 'directional';
export type ConfidenceLevel = 'STRUCTURED-HIGH' | 'OCR-HIGH' | 'OCR-MEDIUM' | 'OCR-LOW' | 'MANUAL-REVIEW';

export interface WellCoordinates {
  surfaceLat: number;
  surfaceLng: number;
  bottomHoleLat?: number;
  bottomHoleLng?: number;
}

export interface FormationTop {
  formationId: string;
  formationName: string;
  depthMD: number;
  depthTVD: number;
  confidence: ConfidenceLevel;
}

export interface CasingRecord {
  type: 'conductor' | 'surface' | 'intermediate' | 'production' | 'liner';
  sizeInches: number;
  depthMD: number;
  cementTop: number;
}

export interface MudProgram {
  section: string;
  depthFrom: number;
  depthTo: number;
  mudType: 'WBM' | 'OBM' | 'SBM';
  mudWeight: number; // ppg
  additives: string[];
}

export interface Well {
  id: string;
  name: string;
  field: string;
  block: string;
  status: WellStatus;
  coordinates: WellCoordinates;
  spudDate: string;
  completionDate?: string;
  totalDepthMD: number;
  totalDepthTVD: number;
  currentDepthMD?: number;
  trajectoryType: TrajectoryType;
  formationTops: FormationTop[];
  casingProgram: CasingRecord[];
  mudProgram: MudProgram[];
  operator: string;
  rig: string;
  confidenceLevel: ConfidenceLevel;
  sourceDocuments: string[];
  notes?: string;
}

// ─── Fields (real Assam basin field locations, approximate) ───
export const FIELDS = [
  { id: 'geleki', name: 'Geleki', lat: 26.82, lng: 94.78, district: 'Sivasagar' },
  { id: 'digboi', name: 'Digboi', lat: 27.39, lng: 95.62, district: 'Tinsukia' },
  { id: 'kharsang', name: 'Kharsang', lat: 27.27, lng: 95.72, district: 'Changlang (Arunachal Pradesh)' },
  { id: 'lakwa', name: 'Lakwa', lat: 26.85, lng: 94.89, district: 'Sivasagar' },
  { id: 'rudrasagar', name: 'Rudrasagar', lat: 26.84, lng: 94.83, district: 'Sivasagar' },
  { id: 'pengri', name: 'Pengri-Bardumsha', lat: 27.15, lng: 95.30, district: 'Tinsukia' },
  { id: 'nahorkatiya', name: 'Nahorkatiya', lat: 27.28, lng: 95.35, district: 'Dibrugarh' },
  { id: 'moran', name: 'Moran', lat: 27.15, lng: 94.91, district: 'Dibrugarh' },
  { id: 'jorajan', name: 'Jorajan', lat: 27.22, lng: 95.15, district: 'Dibrugarh' },
  { id: 'tengakhat', name: 'Tengakhat', lat: 27.23, lng: 95.08, district: 'Dibrugarh' },
];

// ─── 25 Synthetic Wells ───
export const WELLS: Well[] = [
  {
    id: 'GK-401',
    name: 'Geleki-401',
    field: 'Geleki',
    block: 'GK-Block-IV',
    status: 'drilling',
    coordinates: { surfaceLat: 26.823, surfaceLng: 94.781, bottomHoleLat: 26.821, bottomHoleLng: 94.784 },
    spudDate: '2026-07-15',
    totalDepthMD: 3200,
    totalDepthTVD: 3050,
    currentDepthMD: 2450,
    trajectoryType: 'deviated',
    formationTops: [
      { formationId: 'alluvium', formationName: 'Alluvium', depthMD: 0, depthTVD: 0, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'dihing', formationName: 'Dihing Formation', depthMD: 180, depthTVD: 180, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'namsang', formationName: 'Namsang Formation', depthMD: 580, depthTVD: 575, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'girujan', formationName: 'Girujan Clay', depthMD: 1150, depthTVD: 1120, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'tipam', formationName: 'Tipam Sandstone', depthMD: 1780, depthTVD: 1700, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'barail', formationName: 'Barail Group', depthMD: 2580, depthTVD: 2450, confidence: 'STRUCTURED-HIGH' },
    ],
    casingProgram: [
      { type: 'conductor', sizeInches: 20, depthMD: 50, cementTop: 0 },
      { type: 'surface', sizeInches: 13.375, depthMD: 600, cementTop: 0 },
      { type: 'intermediate', sizeInches: 9.625, depthMD: 1800, cementTop: 400 },
    ],
    mudProgram: [
      { section: 'Surface', depthFrom: 0, depthTo: 600, mudType: 'WBM', mudWeight: 9.2, additives: ['Bentonite', 'CMC'] },
      { section: 'Intermediate', depthFrom: 600, depthTo: 1800, mudType: 'WBM', mudWeight: 10.8, additives: ['KCl', 'Polymer', 'Barite'] },
      { section: 'Production', depthFrom: 1800, depthTo: 3200, mudType: 'OBM', mudWeight: 12.5, additives: ['CaCl2', 'Organophilic clay', 'Barite', 'LCM'] },
    ],
    operator: 'Oil India Limited',
    rig: 'RIG-17',
    confidenceLevel: 'STRUCTURED-HIGH',
    sourceDocuments: ['GK401_DDR_2026.pdf', 'GK401_MudLog.las'],
    notes: 'Active drilling — approaching Barail Group. Watch for Tipam fluid loss zone.',
  },
  {
    id: 'GK-387',
    name: 'Geleki-387',
    field: 'Geleki',
    block: 'GK-Block-III',
    status: 'completed',
    coordinates: { surfaceLat: 26.819, surfaceLng: 94.776 },
    spudDate: '2025-03-10',
    completionDate: '2025-08-22',
    totalDepthMD: 3150,
    totalDepthTVD: 3150,
    trajectoryType: 'vertical',
    formationTops: [
      { formationId: 'alluvium', formationName: 'Alluvium', depthMD: 0, depthTVD: 0, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'dihing', formationName: 'Dihing Formation', depthMD: 190, depthTVD: 190, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'namsang', formationName: 'Namsang Formation', depthMD: 610, depthTVD: 610, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'girujan', formationName: 'Girujan Clay', depthMD: 1180, depthTVD: 1180, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'tipam', formationName: 'Tipam Sandstone', depthMD: 1820, depthTVD: 1820, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'barail', formationName: 'Barail Group', depthMD: 2640, depthTVD: 2640, confidence: 'STRUCTURED-HIGH' },
    ],
    casingProgram: [
      { type: 'conductor', sizeInches: 20, depthMD: 45, cementTop: 0 },
      { type: 'surface', sizeInches: 13.375, depthMD: 620, cementTop: 0 },
      { type: 'intermediate', sizeInches: 9.625, depthMD: 1830, cementTop: 380 },
      { type: 'production', sizeInches: 7, depthMD: 3150, cementTop: 1700 },
    ],
    mudProgram: [
      { section: 'Surface', depthFrom: 0, depthTo: 620, mudType: 'WBM', mudWeight: 9.0, additives: ['Bentonite', 'CMC'] },
      { section: 'Intermediate', depthFrom: 620, depthTo: 1830, mudType: 'WBM', mudWeight: 11.0, additives: ['KCl', 'Polymer', 'Barite'] },
      { section: 'Production', depthFrom: 1830, depthTo: 3150, mudType: 'OBM', mudWeight: 13.0, additives: ['CaCl2', 'Organophilic clay', 'Barite'] },
    ],
    operator: 'Oil India Limited',
    rig: 'RIG-12',
    confidenceLevel: 'STRUCTURED-HIGH',
    sourceDocuments: ['GK387_WCR_2025.pdf', 'GK387_DDR_2025.pdf'],
  },
  {
    id: 'GK-362',
    name: 'Geleki-362',
    field: 'Geleki',
    block: 'GK-Block-III',
    status: 'completed',
    coordinates: { surfaceLat: 26.826, surfaceLng: 94.773 },
    spudDate: '2023-11-05',
    completionDate: '2024-04-18',
    totalDepthMD: 3080,
    totalDepthTVD: 2920,
    trajectoryType: 'deviated',
    formationTops: [
      { formationId: 'alluvium', formationName: 'Alluvium', depthMD: 0, depthTVD: 0, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'dihing', formationName: 'Dihing Fm', depthMD: 170, depthTVD: 170, confidence: 'OCR-HIGH' },
      { formationId: 'namsang', formationName: 'Namsang Formation', depthMD: 560, depthTVD: 555, confidence: 'OCR-HIGH' },
      { formationId: 'girujan', formationName: 'Girujan Clay', depthMD: 1120, depthTVD: 1080, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'tipam', formationName: 'Tipam Sand', depthMD: 1750, depthTVD: 1680, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'barail', formationName: 'Barail Group', depthMD: 2550, depthTVD: 2420, confidence: 'STRUCTURED-HIGH' },
    ],
    casingProgram: [
      { type: 'conductor', sizeInches: 20, depthMD: 48, cementTop: 0 },
      { type: 'surface', sizeInches: 13.375, depthMD: 580, cementTop: 0 },
      { type: 'intermediate', sizeInches: 9.625, depthMD: 1770, cementTop: 420 },
      { type: 'production', sizeInches: 7, depthMD: 3080, cementTop: 1650 },
    ],
    mudProgram: [
      { section: 'Surface', depthFrom: 0, depthTo: 580, mudType: 'WBM', mudWeight: 9.1, additives: ['Bentonite'] },
      { section: 'Intermediate', depthFrom: 580, depthTo: 1770, mudType: 'WBM', mudWeight: 10.5, additives: ['KCl', 'Polymer'] },
      { section: 'Production', depthFrom: 1770, depthTo: 3080, mudType: 'OBM', mudWeight: 12.8, additives: ['Barite', 'LCM'] },
    ],
    operator: 'Oil India Limited',
    rig: 'RIG-09',
    confidenceLevel: 'OCR-HIGH',
    sourceDocuments: ['GK362_WCR_2024.pdf'],
  },
  {
    id: 'DG-215',
    name: 'Digboi-215',
    field: 'Digboi',
    block: 'DG-Block-I',
    status: 'completed',
    coordinates: { surfaceLat: 27.393, surfaceLng: 95.618 },
    spudDate: '2024-01-20',
    completionDate: '2024-07-15',
    totalDepthMD: 2800,
    totalDepthTVD: 2800,
    trajectoryType: 'vertical',
    formationTops: [
      { formationId: 'alluvium', formationName: 'Alluvium', depthMD: 0, depthTVD: 0, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'dihing', formationName: 'Dihing Formation', depthMD: 160, depthTVD: 160, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'namsang', formationName: 'Namsang Formation', depthMD: 520, depthTVD: 520, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'girujan', formationName: 'Girujan Clay', depthMD: 1050, depthTVD: 1050, confidence: 'OCR-MEDIUM' },
      { formationId: 'tipam', formationName: 'Tipam Sandstone', depthMD: 1680, depthTVD: 1680, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'barail', formationName: 'Barail', depthMD: 2400, depthTVD: 2400, confidence: 'OCR-HIGH' },
    ],
    casingProgram: [
      { type: 'conductor', sizeInches: 20, depthMD: 40, cementTop: 0 },
      { type: 'surface', sizeInches: 13.375, depthMD: 540, cementTop: 0 },
      { type: 'intermediate', sizeInches: 9.625, depthMD: 1700, cementTop: 350 },
      { type: 'production', sizeInches: 7, depthMD: 2800, cementTop: 1550 },
    ],
    mudProgram: [
      { section: 'Surface', depthFrom: 0, depthTo: 540, mudType: 'WBM', mudWeight: 9.0, additives: ['Bentonite'] },
      { section: 'Intermediate', depthFrom: 540, depthTo: 1700, mudType: 'WBM', mudWeight: 10.2, additives: ['KCl', 'Barite'] },
      { section: 'Production', depthFrom: 1700, depthTo: 2800, mudType: 'OBM', mudWeight: 11.8, additives: ['CaCl2', 'Barite'] },
    ],
    operator: 'Oil India Limited',
    rig: 'RIG-05',
    confidenceLevel: 'STRUCTURED-HIGH',
    sourceDocuments: ['DG215_WCR_2024.pdf'],
  },
  {
    id: 'DG-198',
    name: 'Digboi-198',
    field: 'Digboi',
    block: 'DG-Block-I',
    status: 'completed',
    coordinates: { surfaceLat: 27.387, surfaceLng: 95.624 },
    spudDate: '2018-06-12',
    completionDate: '2018-12-20',
    totalDepthMD: 2650,
    totalDepthTVD: 2650,
    trajectoryType: 'vertical',
    formationTops: [
      { formationId: 'alluvium', formationName: 'Alluvium', depthMD: 0, depthTVD: 0, confidence: 'OCR-MEDIUM' },
      { formationId: 'dihing', formationName: 'Dihing Fm', depthMD: 155, depthTVD: 155, confidence: 'OCR-MEDIUM' },
      { formationId: 'namsang', formationName: 'Namsang Fm', depthMD: 510, depthTVD: 510, confidence: 'OCR-MEDIUM' },
      { formationId: 'girujan', formationName: 'Girujan', depthMD: 1080, depthTVD: 1080, confidence: 'OCR-LOW' },
      { formationId: 'tipam', formationName: 'Tipam Ss', depthMD: 1710, depthTVD: 1710, confidence: 'OCR-MEDIUM' },
      { formationId: 'barail', formationName: 'Barail Fm', depthMD: 2350, depthTVD: 2350, confidence: 'OCR-LOW' },
    ],
    casingProgram: [
      { type: 'conductor', sizeInches: 20, depthMD: 42, cementTop: 0 },
      { type: 'surface', sizeInches: 13.375, depthMD: 530, cementTop: 0 },
      { type: 'production', sizeInches: 7, depthMD: 2650, cementTop: 1600 },
    ],
    mudProgram: [
      { section: 'Surface', depthFrom: 0, depthTo: 530, mudType: 'WBM', mudWeight: 8.8, additives: ['Bentonite'] },
      { section: 'Production', depthFrom: 530, depthTo: 2650, mudType: 'WBM', mudWeight: 10.5, additives: ['KCl', 'Barite'] },
    ],
    operator: 'Oil India Limited',
    rig: 'RIG-03',
    confidenceLevel: 'OCR-MEDIUM',
    sourceDocuments: ['DG198_WCR_2018_scan.pdf'],
    notes: 'Legacy well — OCR-extracted from scanned WCR. Some depth values may have ±5m uncertainty.',
  },
  {
    id: 'KH-112',
    name: 'Kharsang-112',
    field: 'Kharsang',
    block: 'KH-Block-II',
    status: 'drilling',
    coordinates: { surfaceLat: 27.274, surfaceLng: 95.718, bottomHoleLat: 27.271, bottomHoleLng: 95.722 },
    spudDate: '2026-08-01',
    totalDepthMD: 3800,
    totalDepthTVD: 3400,
    currentDepthMD: 2920,
    trajectoryType: 'directional',
    formationTops: [
      { formationId: 'alluvium', formationName: 'Alluvium', depthMD: 0, depthTVD: 0, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'dihing', formationName: 'Dihing Formation', depthMD: 210, depthTVD: 210, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'namsang', formationName: 'Namsang Formation', depthMD: 650, depthTVD: 640, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'girujan', formationName: 'Girujan Clay', depthMD: 1300, depthTVD: 1230, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'tipam', formationName: 'Tipam Sandstone', depthMD: 1950, depthTVD: 1800, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'barail', formationName: 'Barail Group', depthMD: 2750, depthTVD: 2500, confidence: 'STRUCTURED-HIGH' },
    ],
    casingProgram: [
      { type: 'conductor', sizeInches: 20, depthMD: 55, cementTop: 0 },
      { type: 'surface', sizeInches: 13.375, depthMD: 670, cementTop: 0 },
      { type: 'intermediate', sizeInches: 9.625, depthMD: 1970, cementTop: 450 },
    ],
    mudProgram: [
      { section: 'Surface', depthFrom: 0, depthTo: 670, mudType: 'WBM', mudWeight: 9.5, additives: ['Bentonite', 'CMC'] },
      { section: 'Intermediate', depthFrom: 670, depthTo: 1970, mudType: 'WBM', mudWeight: 11.5, additives: ['KCl', 'Polymer', 'Barite'] },
      { section: 'Production', depthFrom: 1970, depthTo: 3800, mudType: 'OBM', mudWeight: 14.0, additives: ['CaCl2', 'Barite', 'LCM', 'Gilsonite'] },
    ],
    operator: 'Oil India Limited',
    rig: 'RIG-22',
    confidenceLevel: 'STRUCTURED-HIGH',
    sourceDocuments: ['KH112_DDR_2026.pdf'],
    notes: 'Active drilling — known overpressure zone below 3000m. Elevated mud weight in use.',
  },
  {
    id: 'KH-098',
    name: 'Kharsang-098',
    field: 'Kharsang',
    block: 'KH-Block-I',
    status: 'completed',
    coordinates: { surfaceLat: 27.268, surfaceLng: 95.712 },
    spudDate: '2022-09-15',
    completionDate: '2023-03-28',
    totalDepthMD: 3600,
    totalDepthTVD: 3250,
    trajectoryType: 'deviated',
    formationTops: [
      { formationId: 'alluvium', formationName: 'Alluvium', depthMD: 0, depthTVD: 0, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'dihing', formationName: 'Dihing Formation', depthMD: 200, depthTVD: 200, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'namsang', formationName: 'Namsang Formation', depthMD: 630, depthTVD: 620, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'girujan', formationName: 'Girujan Clay', depthMD: 1260, depthTVD: 1200, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'tipam', formationName: 'Tipam Sandstone', depthMD: 1900, depthTVD: 1770, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'barail', formationName: 'Barail Group', depthMD: 2700, depthTVD: 2460, confidence: 'STRUCTURED-HIGH' },
    ],
    casingProgram: [
      { type: 'conductor', sizeInches: 20, depthMD: 50, cementTop: 0 },
      { type: 'surface', sizeInches: 13.375, depthMD: 650, cementTop: 0 },
      { type: 'intermediate', sizeInches: 9.625, depthMD: 1920, cementTop: 400 },
      { type: 'production', sizeInches: 7, depthMD: 3600, cementTop: 1800 },
    ],
    mudProgram: [
      { section: 'Surface', depthFrom: 0, depthTo: 650, mudType: 'WBM', mudWeight: 9.3, additives: ['Bentonite'] },
      { section: 'Intermediate', depthFrom: 650, depthTo: 1920, mudType: 'WBM', mudWeight: 11.2, additives: ['KCl', 'Polymer', 'Barite'] },
      { section: 'Production', depthFrom: 1920, depthTo: 3600, mudType: 'OBM', mudWeight: 13.5, additives: ['CaCl2', 'Barite', 'Gilsonite'] },
    ],
    operator: 'Oil India Limited',
    rig: 'RIG-14',
    confidenceLevel: 'STRUCTURED-HIGH',
    sourceDocuments: ['KH098_WCR_2023.pdf'],
  },
  {
    id: 'LK-245',
    name: 'Lakwa-245',
    field: 'Lakwa',
    block: 'LK-Block-II',
    status: 'completed',
    coordinates: { surfaceLat: 26.853, surfaceLng: 94.892 },
    spudDate: '2024-05-08',
    completionDate: '2024-10-30',
    totalDepthMD: 3300,
    totalDepthTVD: 3100,
    trajectoryType: 'deviated',
    formationTops: [
      { formationId: 'alluvium', formationName: 'Alluvium', depthMD: 0, depthTVD: 0, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'dihing', formationName: 'Dihing Formation', depthMD: 195, depthTVD: 195, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'namsang', formationName: 'Namsang Formation', depthMD: 590, depthTVD: 585, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'girujan', formationName: 'Girujan Clay', depthMD: 1170, depthTVD: 1130, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'tipam', formationName: 'Tipam Sandstone', depthMD: 1800, depthTVD: 1710, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'barail', formationName: 'Barail Group', depthMD: 2620, depthTVD: 2470, confidence: 'STRUCTURED-HIGH' },
    ],
    casingProgram: [
      { type: 'conductor', sizeInches: 20, depthMD: 50, cementTop: 0 },
      { type: 'surface', sizeInches: 13.375, depthMD: 610, cementTop: 0 },
      { type: 'intermediate', sizeInches: 9.625, depthMD: 1820, cementTop: 400 },
      { type: 'production', sizeInches: 7, depthMD: 3300, cementTop: 1700 },
    ],
    mudProgram: [
      { section: 'Surface', depthFrom: 0, depthTo: 610, mudType: 'WBM', mudWeight: 9.2, additives: ['Bentonite', 'CMC'] },
      { section: 'Intermediate', depthFrom: 610, depthTo: 1820, mudType: 'WBM', mudWeight: 10.8, additives: ['KCl', 'Polymer', 'Barite'] },
      { section: 'Production', depthFrom: 1820, depthTo: 3300, mudType: 'OBM', mudWeight: 12.5, additives: ['CaCl2', 'Barite'] },
    ],
    operator: 'Oil India Limited',
    rig: 'RIG-11',
    confidenceLevel: 'STRUCTURED-HIGH',
    sourceDocuments: ['LK245_WCR_2024.pdf'],
  },
  {
    id: 'RD-178',
    name: 'Rudrasagar-178',
    field: 'Rudrasagar',
    block: 'RD-Block-I',
    status: 'completed',
    coordinates: { surfaceLat: 26.842, surfaceLng: 94.832 },
    spudDate: '2023-08-20',
    completionDate: '2024-01-15',
    totalDepthMD: 2950,
    totalDepthTVD: 2950,
    trajectoryType: 'vertical',
    formationTops: [
      { formationId: 'alluvium', formationName: 'Alluvium', depthMD: 0, depthTVD: 0, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'dihing', formationName: 'Dihing Formation', depthMD: 185, depthTVD: 185, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'namsang', formationName: 'Namsang Formation', depthMD: 570, depthTVD: 570, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'girujan', formationName: 'Girujan Clay', depthMD: 1140, depthTVD: 1140, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'tipam', formationName: 'Tipam Sandstone', depthMD: 1760, depthTVD: 1760, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'barail', formationName: 'Barail Group', depthMD: 2560, depthTVD: 2560, confidence: 'STRUCTURED-HIGH' },
    ],
    casingProgram: [
      { type: 'conductor', sizeInches: 20, depthMD: 45, cementTop: 0 },
      { type: 'surface', sizeInches: 13.375, depthMD: 590, cementTop: 0 },
      { type: 'intermediate', sizeInches: 9.625, depthMD: 1780, cementTop: 380 },
      { type: 'production', sizeInches: 7, depthMD: 2950, cementTop: 1650 },
    ],
    mudProgram: [
      { section: 'Surface', depthFrom: 0, depthTo: 590, mudType: 'WBM', mudWeight: 9.0, additives: ['Bentonite'] },
      { section: 'Intermediate', depthFrom: 590, depthTo: 1780, mudType: 'WBM', mudWeight: 10.5, additives: ['KCl', 'Polymer'] },
      { section: 'Production', depthFrom: 1780, depthTo: 2950, mudType: 'OBM', mudWeight: 12.0, additives: ['CaCl2', 'Barite'] },
    ],
    operator: 'Oil India Limited',
    rig: 'RIG-07',
    confidenceLevel: 'STRUCTURED-HIGH',
    sourceDocuments: ['RD178_WCR_2024.pdf'],
  },
  {
    id: 'PB-067',
    name: 'Pengri-Bardumsha-067',
    field: 'Pengri-Bardumsha',
    block: 'PB-Block-I',
    status: 'drilling',
    coordinates: { surfaceLat: 27.153, surfaceLng: 95.302, bottomHoleLat: 27.149, bottomHoleLng: 95.308 },
    spudDate: '2026-06-20',
    totalDepthMD: 4200,
    totalDepthTVD: 3700,
    currentDepthMD: 3150,
    trajectoryType: 'directional',
    formationTops: [
      { formationId: 'alluvium', formationName: 'Alluvium', depthMD: 0, depthTVD: 0, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'dihing', formationName: 'Dihing Formation', depthMD: 230, depthTVD: 230, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'namsang', formationName: 'Namsang Formation', depthMD: 700, depthTVD: 685, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'girujan', formationName: 'Girujan Clay', depthMD: 1380, depthTVD: 1290, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'tipam', formationName: 'Tipam Sandstone', depthMD: 2050, depthTVD: 1880, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'barail', formationName: 'Barail Group', depthMD: 2850, depthTVD: 2580, confidence: 'STRUCTURED-HIGH' },
    ],
    casingProgram: [
      { type: 'conductor', sizeInches: 20, depthMD: 60, cementTop: 0 },
      { type: 'surface', sizeInches: 13.375, depthMD: 720, cementTop: 0 },
      { type: 'intermediate', sizeInches: 9.625, depthMD: 2070, cementTop: 500 },
    ],
    mudProgram: [
      { section: 'Surface', depthFrom: 0, depthTo: 720, mudType: 'WBM', mudWeight: 9.8, additives: ['Bentonite', 'CMC'] },
      { section: 'Intermediate', depthFrom: 720, depthTo: 2070, mudType: 'WBM', mudWeight: 12.0, additives: ['KCl', 'Polymer', 'Barite', 'LCM'] },
      { section: 'Production', depthFrom: 2070, depthTo: 4200, mudType: 'OBM', mudWeight: 15.0, additives: ['CaCl2', 'Barite', 'LCM', 'Gilsonite', 'Calcium Carbonate'] },
    ],
    operator: 'Oil India Limited',
    rig: 'RIG-25',
    confidenceLevel: 'STRUCTURED-HIGH',
    sourceDocuments: ['PB067_DDR_2026.pdf'],
    notes: 'Deep exploratory well — high overpressure risk in Barail and Kopili. Enhanced mud weight program.',
  },
  {
    id: 'PB-051',
    name: 'Pengri-Bardumsha-051',
    field: 'Pengri-Bardumsha',
    block: 'PB-Block-I',
    status: 'completed',
    coordinates: { surfaceLat: 27.148, surfaceLng: 95.295 },
    spudDate: '2021-04-10',
    completionDate: '2021-11-25',
    totalDepthMD: 4050,
    totalDepthTVD: 3600,
    trajectoryType: 'directional',
    formationTops: [
      { formationId: 'alluvium', formationName: 'Alluvium', depthMD: 0, depthTVD: 0, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'dihing', formationName: 'Dihing Formation', depthMD: 220, depthTVD: 220, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'namsang', formationName: 'Namsang Formation', depthMD: 680, depthTVD: 665, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'girujan', formationName: 'Girujan Clay', depthMD: 1350, depthTVD: 1260, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'tipam', formationName: 'Tipam Sandstone', depthMD: 2000, depthTVD: 1840, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'barail', formationName: 'Barail Group', depthMD: 2800, depthTVD: 2540, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'kopili', formationName: 'Kopili Formation', depthMD: 3650, depthTVD: 3280, confidence: 'STRUCTURED-HIGH' },
    ],
    casingProgram: [
      { type: 'conductor', sizeInches: 20, depthMD: 55, cementTop: 0 },
      { type: 'surface', sizeInches: 13.375, depthMD: 700, cementTop: 0 },
      { type: 'intermediate', sizeInches: 9.625, depthMD: 2020, cementTop: 480 },
      { type: 'production', sizeInches: 7, depthMD: 4050, cementTop: 1900 },
    ],
    mudProgram: [
      { section: 'Surface', depthFrom: 0, depthTo: 700, mudType: 'WBM', mudWeight: 9.5, additives: ['Bentonite'] },
      { section: 'Intermediate', depthFrom: 700, depthTo: 2020, mudType: 'WBM', mudWeight: 11.8, additives: ['KCl', 'Polymer', 'Barite'] },
      { section: 'Production', depthFrom: 2020, depthTo: 4050, mudType: 'OBM', mudWeight: 14.5, additives: ['CaCl2', 'Barite', 'LCM'] },
    ],
    operator: 'Oil India Limited',
    rig: 'RIG-20',
    confidenceLevel: 'STRUCTURED-HIGH',
    sourceDocuments: ['PB051_WCR_2021.pdf'],
  },
  {
    id: 'NK-310',
    name: 'Nahorkatiya-310',
    field: 'Nahorkatiya',
    block: 'NK-Block-III',
    status: 'completed',
    coordinates: { surfaceLat: 27.283, surfaceLng: 95.352 },
    spudDate: '2025-01-15',
    completionDate: '2025-06-20',
    totalDepthMD: 3100,
    totalDepthTVD: 2900,
    trajectoryType: 'deviated',
    formationTops: [
      { formationId: 'alluvium', formationName: 'Alluvium', depthMD: 0, depthTVD: 0, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'dihing', formationName: 'Dihing Formation', depthMD: 200, depthTVD: 200, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'namsang', formationName: 'Namsang Formation', depthMD: 620, depthTVD: 610, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'girujan', formationName: 'Girujan Clay', depthMD: 1200, depthTVD: 1150, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'tipam', formationName: 'Tipam Sandstone', depthMD: 1850, depthTVD: 1740, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'barail', formationName: 'Barail Group', depthMD: 2650, depthTVD: 2480, confidence: 'STRUCTURED-HIGH' },
    ],
    casingProgram: [
      { type: 'conductor', sizeInches: 20, depthMD: 50, cementTop: 0 },
      { type: 'surface', sizeInches: 13.375, depthMD: 640, cementTop: 0 },
      { type: 'intermediate', sizeInches: 9.625, depthMD: 1870, cementTop: 420 },
      { type: 'production', sizeInches: 7, depthMD: 3100, cementTop: 1750 },
    ],
    mudProgram: [
      { section: 'Surface', depthFrom: 0, depthTo: 640, mudType: 'WBM', mudWeight: 9.2, additives: ['Bentonite'] },
      { section: 'Intermediate', depthFrom: 640, depthTo: 1870, mudType: 'WBM', mudWeight: 10.8, additives: ['KCl', 'Polymer', 'Barite'] },
      { section: 'Production', depthFrom: 1870, depthTo: 3100, mudType: 'OBM', mudWeight: 12.8, additives: ['CaCl2', 'Barite'] },
    ],
    operator: 'Oil India Limited',
    rig: 'RIG-15',
    confidenceLevel: 'STRUCTURED-HIGH',
    sourceDocuments: ['NK310_WCR_2025.pdf'],
  },
  {
    id: 'MR-142',
    name: 'Moran-142',
    field: 'Moran',
    block: 'MR-Block-I',
    status: 'completed',
    coordinates: { surfaceLat: 27.152, surfaceLng: 94.913 },
    spudDate: '2024-09-05',
    completionDate: '2025-02-18',
    totalDepthMD: 2900,
    totalDepthTVD: 2900,
    trajectoryType: 'vertical',
    formationTops: [
      { formationId: 'alluvium', formationName: 'Alluvium', depthMD: 0, depthTVD: 0, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'dihing', formationName: 'Dihing Formation', depthMD: 175, depthTVD: 175, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'namsang', formationName: 'Namsang Formation', depthMD: 550, depthTVD: 550, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'girujan', formationName: 'Girujan Clay', depthMD: 1100, depthTVD: 1100, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'tipam', formationName: 'Tipam Sandstone', depthMD: 1720, depthTVD: 1720, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'barail', formationName: 'Barail Group', depthMD: 2500, depthTVD: 2500, confidence: 'STRUCTURED-HIGH' },
    ],
    casingProgram: [
      { type: 'conductor', sizeInches: 20, depthMD: 45, cementTop: 0 },
      { type: 'surface', sizeInches: 13.375, depthMD: 570, cementTop: 0 },
      { type: 'intermediate', sizeInches: 9.625, depthMD: 1740, cementTop: 370 },
      { type: 'production', sizeInches: 7, depthMD: 2900, cementTop: 1600 },
    ],
    mudProgram: [
      { section: 'Surface', depthFrom: 0, depthTo: 570, mudType: 'WBM', mudWeight: 9.0, additives: ['Bentonite'] },
      { section: 'Intermediate', depthFrom: 570, depthTo: 1740, mudType: 'WBM', mudWeight: 10.5, additives: ['KCl', 'Barite'] },
      { section: 'Production', depthFrom: 1740, depthTo: 2900, mudType: 'OBM', mudWeight: 12.2, additives: ['CaCl2', 'Barite'] },
    ],
    operator: 'Oil India Limited',
    rig: 'RIG-08',
    confidenceLevel: 'STRUCTURED-HIGH',
    sourceDocuments: ['MR142_WCR_2025.pdf'],
  },
  {
    id: 'JR-089',
    name: 'Jorajan-089',
    field: 'Jorajan',
    block: 'JR-Block-I',
    status: 'suspended',
    coordinates: { surfaceLat: 27.224, surfaceLng: 95.153 },
    spudDate: '2020-11-12',
    totalDepthMD: 2400,
    totalDepthTVD: 2400,
    trajectoryType: 'vertical',
    formationTops: [
      { formationId: 'alluvium', formationName: 'Alluvium', depthMD: 0, depthTVD: 0, confidence: 'OCR-HIGH' },
      { formationId: 'dihing', formationName: 'Dihing Formation', depthMD: 180, depthTVD: 180, confidence: 'OCR-HIGH' },
      { formationId: 'namsang', formationName: 'Namsang Formation', depthMD: 540, depthTVD: 540, confidence: 'OCR-HIGH' },
      { formationId: 'girujan', formationName: 'Girujan Clay', depthMD: 1090, depthTVD: 1090, confidence: 'OCR-MEDIUM' },
      { formationId: 'tipam', formationName: 'Tipam Sandstone', depthMD: 1700, depthTVD: 1700, confidence: 'OCR-HIGH' },
    ],
    casingProgram: [
      { type: 'conductor', sizeInches: 20, depthMD: 40, cementTop: 0 },
      { type: 'surface', sizeInches: 13.375, depthMD: 560, cementTop: 0 },
      { type: 'intermediate', sizeInches: 9.625, depthMD: 1720, cementTop: 350 },
    ],
    mudProgram: [
      { section: 'Surface', depthFrom: 0, depthTo: 560, mudType: 'WBM', mudWeight: 9.0, additives: ['Bentonite'] },
      { section: 'Intermediate', depthFrom: 560, depthTo: 2400, mudType: 'WBM', mudWeight: 11.0, additives: ['KCl', 'Polymer', 'Barite'] },
    ],
    operator: 'Oil India Limited',
    rig: 'RIG-06',
    confidenceLevel: 'OCR-HIGH',
    sourceDocuments: ['JR089_WCR_2020_scan.pdf'],
    notes: 'Suspended due to severe stuck pipe at 2380m in Tipam. Well control incident.',
  },
  {
    id: 'TK-056',
    name: 'Tengakhat-056',
    field: 'Tengakhat',
    block: 'TK-Block-I',
    status: 'completed',
    coordinates: { surfaceLat: 27.233, surfaceLng: 95.083 },
    spudDate: '2019-03-20',
    completionDate: '2019-09-10',
    totalDepthMD: 2750,
    totalDepthTVD: 2750,
    trajectoryType: 'vertical',
    formationTops: [
      { formationId: 'alluvium', formationName: 'Alluvium', depthMD: 0, depthTVD: 0, confidence: 'OCR-HIGH' },
      { formationId: 'dihing', formationName: 'Dihing Formation', depthMD: 165, depthTVD: 165, confidence: 'OCR-HIGH' },
      { formationId: 'namsang', formationName: 'Namsang Formation', depthMD: 530, depthTVD: 530, confidence: 'OCR-HIGH' },
      { formationId: 'girujan', formationName: 'Girujan Clay', depthMD: 1060, depthTVD: 1060, confidence: 'OCR-HIGH' },
      { formationId: 'tipam', formationName: 'Tipam Sandstone', depthMD: 1690, depthTVD: 1690, confidence: 'OCR-HIGH' },
      { formationId: 'barail', formationName: 'Barail Group', depthMD: 2380, depthTVD: 2380, confidence: 'OCR-MEDIUM' },
    ],
    casingProgram: [
      { type: 'conductor', sizeInches: 20, depthMD: 42, cementTop: 0 },
      { type: 'surface', sizeInches: 13.375, depthMD: 550, cementTop: 0 },
      { type: 'intermediate', sizeInches: 9.625, depthMD: 1710, cementTop: 360 },
      { type: 'production', sizeInches: 7, depthMD: 2750, cementTop: 1580 },
    ],
    mudProgram: [
      { section: 'Surface', depthFrom: 0, depthTo: 550, mudType: 'WBM', mudWeight: 8.9, additives: ['Bentonite'] },
      { section: 'Intermediate', depthFrom: 550, depthTo: 1710, mudType: 'WBM', mudWeight: 10.3, additives: ['KCl', 'Barite'] },
      { section: 'Production', depthFrom: 1710, depthTo: 2750, mudType: 'OBM', mudWeight: 12.0, additives: ['CaCl2', 'Barite'] },
    ],
    operator: 'Oil India Limited',
    rig: 'RIG-10',
    confidenceLevel: 'OCR-HIGH',
    sourceDocuments: ['TK056_WCR_2019.pdf'],
  },
  {
    id: 'GK-290',
    name: 'Geleki-290',
    field: 'Geleki',
    block: 'GK-Block-II',
    status: 'completed',
    coordinates: { surfaceLat: 26.815, surfaceLng: 94.790 },
    spudDate: '2015-02-10',
    completionDate: '2015-08-28',
    totalDepthMD: 3050,
    totalDepthTVD: 3050,
    trajectoryType: 'vertical',
    formationTops: [
      { formationId: 'alluvium', formationName: 'Alluvium', depthMD: 0, depthTVD: 0, confidence: 'OCR-MEDIUM' },
      { formationId: 'dihing', formationName: 'Dihing', depthMD: 185, depthTVD: 185, confidence: 'OCR-MEDIUM' },
      { formationId: 'namsang', formationName: 'Namsang', depthMD: 595, depthTVD: 595, confidence: 'OCR-MEDIUM' },
      { formationId: 'girujan', formationName: 'Girujan', depthMD: 1160, depthTVD: 1160, confidence: 'OCR-LOW' },
      { formationId: 'tipam', formationName: 'Tipam Ss', depthMD: 1790, depthTVD: 1790, confidence: 'OCR-MEDIUM' },
      { formationId: 'barail', formationName: 'Barail', depthMD: 2600, depthTVD: 2600, confidence: 'OCR-LOW' },
    ],
    casingProgram: [
      { type: 'conductor', sizeInches: 20, depthMD: 45, cementTop: 0 },
      { type: 'surface', sizeInches: 13.375, depthMD: 610, cementTop: 0 },
      { type: 'production', sizeInches: 7, depthMD: 3050, cementTop: 1650 },
    ],
    mudProgram: [
      { section: 'Surface', depthFrom: 0, depthTo: 610, mudType: 'WBM', mudWeight: 9.0, additives: ['Bentonite'] },
      { section: 'Production', depthFrom: 610, depthTo: 3050, mudType: 'WBM', mudWeight: 11.5, additives: ['KCl', 'Barite', 'LCM'] },
    ],
    operator: 'Oil India Limited',
    rig: 'RIG-04',
    confidenceLevel: 'OCR-MEDIUM',
    sourceDocuments: ['GK290_WCR_2015_scan.pdf'],
    notes: 'Legacy well — scanned WCR with mixed metric/imperial units in original document.',
  },
  {
    id: 'DG-145',
    name: 'Digboi-145',
    field: 'Digboi',
    block: 'DG-Block-I',
    status: 'completed',
    coordinates: { surfaceLat: 27.395, surfaceLng: 95.610 },
    spudDate: '2005-08-22',
    completionDate: '2006-01-30',
    totalDepthMD: 2200,
    totalDepthTVD: 2200,
    trajectoryType: 'vertical',
    formationTops: [
      { formationId: 'alluvium', formationName: 'Alluvium', depthMD: 0, depthTVD: 0, confidence: 'OCR-LOW' },
      { formationId: 'dihing', formationName: 'Dihing', depthMD: 150, depthTVD: 150, confidence: 'OCR-LOW' },
      { formationId: 'namsang', formationName: 'Namsang', depthMD: 490, depthTVD: 490, confidence: 'OCR-LOW' },
      { formationId: 'girujan', formationName: 'Girujan', depthMD: 980, depthTVD: 980, confidence: 'OCR-LOW' },
      { formationId: 'tipam', formationName: 'Tipam', depthMD: 1600, depthTVD: 1600, confidence: 'OCR-LOW' },
    ],
    casingProgram: [
      { type: 'conductor', sizeInches: 20, depthMD: 38, cementTop: 0 },
      { type: 'surface', sizeInches: 13.375, depthMD: 510, cementTop: 0 },
      { type: 'production', sizeInches: 7, depthMD: 2200, cementTop: 1450 },
    ],
    mudProgram: [
      { section: 'All', depthFrom: 0, depthTo: 2200, mudType: 'WBM', mudWeight: 10.0, additives: ['Bentonite', 'Barite'] },
    ],
    operator: 'Oil India Limited',
    rig: 'RIG-02',
    confidenceLevel: 'OCR-LOW',
    sourceDocuments: ['DG145_WCR_2006_typewritten.pdf'],
    notes: 'Very old record — typewritten WCR, OCR extraction has ±10m depth uncertainty.',
  },
  {
    id: 'LK-218',
    name: 'Lakwa-218',
    field: 'Lakwa',
    block: 'LK-Block-I',
    status: 'completed',
    coordinates: { surfaceLat: 26.848, surfaceLng: 94.885 },
    spudDate: '2022-04-12',
    completionDate: '2022-09-30',
    totalDepthMD: 3000,
    totalDepthTVD: 2850,
    trajectoryType: 'deviated',
    formationTops: [
      { formationId: 'alluvium', formationName: 'Alluvium', depthMD: 0, depthTVD: 0, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'dihing', formationName: 'Dihing Formation', depthMD: 188, depthTVD: 188, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'namsang', formationName: 'Namsang Formation', depthMD: 575, depthTVD: 568, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'girujan', formationName: 'Girujan Clay', depthMD: 1145, depthTVD: 1100, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'tipam', formationName: 'Tipam Sandstone', depthMD: 1775, depthTVD: 1690, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'barail', formationName: 'Barail Group', depthMD: 2580, depthTVD: 2440, confidence: 'STRUCTURED-HIGH' },
    ],
    casingProgram: [
      { type: 'conductor', sizeInches: 20, depthMD: 48, cementTop: 0 },
      { type: 'surface', sizeInches: 13.375, depthMD: 595, cementTop: 0 },
      { type: 'intermediate', sizeInches: 9.625, depthMD: 1795, cementTop: 390 },
      { type: 'production', sizeInches: 7, depthMD: 3000, cementTop: 1670 },
    ],
    mudProgram: [
      { section: 'Surface', depthFrom: 0, depthTo: 595, mudType: 'WBM', mudWeight: 9.1, additives: ['Bentonite', 'CMC'] },
      { section: 'Intermediate', depthFrom: 595, depthTo: 1795, mudType: 'WBM', mudWeight: 10.6, additives: ['KCl', 'Polymer'] },
      { section: 'Production', depthFrom: 1795, depthTo: 3000, mudType: 'OBM', mudWeight: 12.3, additives: ['CaCl2', 'Barite'] },
    ],
    operator: 'Oil India Limited',
    rig: 'RIG-13',
    confidenceLevel: 'STRUCTURED-HIGH',
    sourceDocuments: ['LK218_WCR_2022.pdf'],
  },
  {
    id: 'NK-275',
    name: 'Nahorkatiya-275',
    field: 'Nahorkatiya',
    block: 'NK-Block-II',
    status: 'completed',
    coordinates: { surfaceLat: 27.275, surfaceLng: 95.340 },
    spudDate: '2023-06-01',
    completionDate: '2023-11-15',
    totalDepthMD: 3200,
    totalDepthTVD: 3050,
    trajectoryType: 'deviated',
    formationTops: [
      { formationId: 'alluvium', formationName: 'Alluvium', depthMD: 0, depthTVD: 0, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'dihing', formationName: 'Dihing Formation', depthMD: 205, depthTVD: 205, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'namsang', formationName: 'Namsang Formation', depthMD: 640, depthTVD: 630, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'girujan', formationName: 'Girujan Clay', depthMD: 1230, depthTVD: 1180, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'tipam', formationName: 'Tipam Sandstone', depthMD: 1880, depthTVD: 1770, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'barail', formationName: 'Barail Group', depthMD: 2680, depthTVD: 2510, confidence: 'STRUCTURED-HIGH' },
    ],
    casingProgram: [
      { type: 'conductor', sizeInches: 20, depthMD: 52, cementTop: 0 },
      { type: 'surface', sizeInches: 13.375, depthMD: 660, cementTop: 0 },
      { type: 'intermediate', sizeInches: 9.625, depthMD: 1900, cementTop: 440 },
      { type: 'production', sizeInches: 7, depthMD: 3200, cementTop: 1780 },
    ],
    mudProgram: [
      { section: 'Surface', depthFrom: 0, depthTo: 660, mudType: 'WBM', mudWeight: 9.3, additives: ['Bentonite'] },
      { section: 'Intermediate', depthFrom: 660, depthTo: 1900, mudType: 'WBM', mudWeight: 11.0, additives: ['KCl', 'Polymer', 'Barite'] },
      { section: 'Production', depthFrom: 1900, depthTo: 3200, mudType: 'OBM', mudWeight: 13.0, additives: ['CaCl2', 'Barite', 'LCM'] },
    ],
    operator: 'Oil India Limited',
    rig: 'RIG-16',
    confidenceLevel: 'STRUCTURED-HIGH',
    sourceDocuments: ['NK275_WCR_2023.pdf'],
  },
  {
    id: 'MR-125',
    name: 'Moran-125',
    field: 'Moran',
    block: 'MR-Block-I',
    status: 'completed',
    coordinates: { surfaceLat: 27.158, surfaceLng: 94.920 },
    spudDate: '2017-10-15',
    completionDate: '2018-03-22',
    totalDepthMD: 2700,
    totalDepthTVD: 2700,
    trajectoryType: 'vertical',
    formationTops: [
      { formationId: 'alluvium', formationName: 'Alluvium', depthMD: 0, depthTVD: 0, confidence: 'OCR-HIGH' },
      { formationId: 'dihing', formationName: 'Dihing Fm', depthMD: 170, depthTVD: 170, confidence: 'OCR-HIGH' },
      { formationId: 'namsang', formationName: 'Namsang Fm', depthMD: 545, depthTVD: 545, confidence: 'OCR-HIGH' },
      { formationId: 'girujan', formationName: 'Girujan', depthMD: 1095, depthTVD: 1095, confidence: 'OCR-MEDIUM' },
      { formationId: 'tipam', formationName: 'Tipam Ss', depthMD: 1715, depthTVD: 1715, confidence: 'OCR-HIGH' },
      { formationId: 'barail', formationName: 'Barail', depthMD: 2420, depthTVD: 2420, confidence: 'OCR-MEDIUM' },
    ],
    casingProgram: [
      { type: 'conductor', sizeInches: 20, depthMD: 43, cementTop: 0 },
      { type: 'surface', sizeInches: 13.375, depthMD: 565, cementTop: 0 },
      { type: 'production', sizeInches: 7, depthMD: 2700, cementTop: 1580 },
    ],
    mudProgram: [
      { section: 'Surface', depthFrom: 0, depthTo: 565, mudType: 'WBM', mudWeight: 8.8, additives: ['Bentonite'] },
      { section: 'Production', depthFrom: 565, depthTo: 2700, mudType: 'WBM', mudWeight: 10.8, additives: ['KCl', 'Barite'] },
    ],
    operator: 'Oil India Limited',
    rig: 'RIG-06',
    confidenceLevel: 'OCR-HIGH',
    sourceDocuments: ['MR125_WCR_2018_scan.pdf'],
  },
  {
    id: 'RD-160',
    name: 'Rudrasagar-160',
    field: 'Rudrasagar',
    block: 'RD-Block-I',
    status: 'completed',
    coordinates: { surfaceLat: 26.838, surfaceLng: 94.828 },
    spudDate: '2021-07-10',
    completionDate: '2021-12-05',
    totalDepthMD: 2800,
    totalDepthTVD: 2700,
    trajectoryType: 'deviated',
    formationTops: [
      { formationId: 'alluvium', formationName: 'Alluvium', depthMD: 0, depthTVD: 0, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'dihing', formationName: 'Dihing Formation', depthMD: 180, depthTVD: 180, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'namsang', formationName: 'Namsang Formation', depthMD: 560, depthTVD: 555, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'girujan', formationName: 'Girujan Clay', depthMD: 1130, depthTVD: 1095, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'tipam', formationName: 'Tipam Sandstone', depthMD: 1750, depthTVD: 1680, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'barail', formationName: 'Barail Group', depthMD: 2540, depthTVD: 2430, confidence: 'STRUCTURED-HIGH' },
    ],
    casingProgram: [
      { type: 'conductor', sizeInches: 20, depthMD: 44, cementTop: 0 },
      { type: 'surface', sizeInches: 13.375, depthMD: 580, cementTop: 0 },
      { type: 'intermediate', sizeInches: 9.625, depthMD: 1770, cementTop: 375 },
      { type: 'production', sizeInches: 7, depthMD: 2800, cementTop: 1640 },
    ],
    mudProgram: [
      { section: 'Surface', depthFrom: 0, depthTo: 580, mudType: 'WBM', mudWeight: 9.0, additives: ['Bentonite'] },
      { section: 'Intermediate', depthFrom: 580, depthTo: 1770, mudType: 'WBM', mudWeight: 10.4, additives: ['KCl', 'Polymer'] },
      { section: 'Production', depthFrom: 1770, depthTo: 2800, mudType: 'OBM', mudWeight: 12.1, additives: ['CaCl2', 'Barite'] },
    ],
    operator: 'Oil India Limited',
    rig: 'RIG-09',
    confidenceLevel: 'STRUCTURED-HIGH',
    sourceDocuments: ['RD160_WCR_2021.pdf'],
  },
  {
    id: 'GK-335',
    name: 'Geleki-335',
    field: 'Geleki',
    block: 'GK-Block-III',
    status: 'completed',
    coordinates: { surfaceLat: 26.821, surfaceLng: 94.779 },
    spudDate: '2020-05-15',
    completionDate: '2020-11-20',
    totalDepthMD: 3100,
    totalDepthTVD: 2940,
    trajectoryType: 'deviated',
    formationTops: [
      { formationId: 'alluvium', formationName: 'Alluvium', depthMD: 0, depthTVD: 0, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'dihing', formationName: 'Dihing Formation', depthMD: 182, depthTVD: 182, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'namsang', formationName: 'Namsang Formation', depthMD: 572, depthTVD: 567, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'girujan', formationName: 'Girujan Clay', depthMD: 1155, depthTVD: 1115, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'tipam', formationName: 'Tipam Sandstone', depthMD: 1785, depthTVD: 1705, confidence: 'STRUCTURED-HIGH' },
      { formationId: 'barail', formationName: 'Barail Group', depthMD: 2590, depthTVD: 2450, confidence: 'STRUCTURED-HIGH' },
    ],
    casingProgram: [
      { type: 'conductor', sizeInches: 20, depthMD: 46, cementTop: 0 },
      { type: 'surface', sizeInches: 13.375, depthMD: 590, cementTop: 0 },
      { type: 'intermediate', sizeInches: 9.625, depthMD: 1805, cementTop: 395 },
      { type: 'production', sizeInches: 7, depthMD: 3100, cementTop: 1680 },
    ],
    mudProgram: [
      { section: 'Surface', depthFrom: 0, depthTo: 590, mudType: 'WBM', mudWeight: 9.1, additives: ['Bentonite'] },
      { section: 'Intermediate', depthFrom: 590, depthTo: 1805, mudType: 'WBM', mudWeight: 10.7, additives: ['KCl', 'Polymer', 'Barite'] },
      { section: 'Production', depthFrom: 1805, depthTo: 3100, mudType: 'OBM', mudWeight: 12.6, additives: ['CaCl2', 'Barite', 'LCM'] },
    ],
    operator: 'Oil India Limited',
    rig: 'RIG-11',
    confidenceLevel: 'STRUCTURED-HIGH',
    sourceDocuments: ['GK335_WCR_2020.pdf'],
  },
];

// ─── Utility Functions ───

export function getWellById(id: string): Well | undefined {
  return WELLS.find(w => w.id === id);
}

export function getWellsByField(field: string): Well[] {
  return WELLS.filter(w => w.field === field);
}

export function getWellsByStatus(status: WellStatus): Well[] {
  return WELLS.filter(w => w.status === status);
}

export function getActiveWells(): Well[] {
  return WELLS.filter(w => w.status === 'drilling');
}

/**
 * Haversine distance between two lat/lng coordinates in kilometers.
 */
export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Compute composite similarity score between two wells.
 * Returns a 0-1 score + per-component breakdown.
 */
export function computeSimilarity(
  well1: Well,
  well2: Well
): {
  total: number;
  formationMatch: number;
  depthAlignment: number;
  trajectorySimilarity: number;
  operationalSimilarity: number;
  geographicProximity: number;
} {
  // Weights
  const w = { formation: 0.30, depth: 0.25, trajectory: 0.15, operational: 0.15, geographic: 0.15 };

  // 1. Formation match — how many formations in common
  const f1 = new Set(well1.formationTops.map(f => f.formationId));
  const f2 = new Set(well2.formationTops.map(f => f.formationId));
  const intersection = [...f1].filter(x => f2.has(x)).length;
  const union = new Set([...f1, ...f2]).size;
  const formationMatch = union > 0 ? intersection / union : 0;

  // 2. Depth alignment — compare formation-top depths
  const commonFormations = [...f1].filter(x => f2.has(x));
  let depthAlignment = 0;
  if (commonFormations.length > 0) {
    const diffs = commonFormations.map(fId => {
      const d1 = well1.formationTops.find(f => f.formationId === fId)?.depthMD ?? 0;
      const d2 = well2.formationTops.find(f => f.formationId === fId)?.depthMD ?? 0;
      return Math.abs(d1 - d2);
    });
    const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    depthAlignment = Math.max(0, 1 - avgDiff / 500); // normalized: 500m diff = 0
  }

  // 3. Trajectory similarity
  const trajectoryMap: Record<string, number> = { vertical: 0, deviated: 1, directional: 2, horizontal: 3 };
  const trajDist = Math.abs((trajectoryMap[well1.trajectoryType] ?? 0) - (trajectoryMap[well2.trajectoryType] ?? 0));
  const trajectorySimilarity = Math.max(0, 1 - trajDist / 3);

  // 4. Operational similarity — mud weight comparison in deepest section
  const mw1 = well1.mudProgram[well1.mudProgram.length - 1]?.mudWeight ?? 10;
  const mw2 = well2.mudProgram[well2.mudProgram.length - 1]?.mudWeight ?? 10;
  const operationalSimilarity = Math.max(0, 1 - Math.abs(mw1 - mw2) / 5);

  // 5. Geographic proximity — distance-based
  const dist = haversineDistance(
    well1.coordinates.surfaceLat, well1.coordinates.surfaceLng,
    well2.coordinates.surfaceLat, well2.coordinates.surfaceLng
  );
  const geographicProximity = Math.max(0, 1 - dist / 100); // 100km = 0

  const total =
    w.formation * formationMatch +
    w.depth * depthAlignment +
    w.trajectory * trajectorySimilarity +
    w.operational * operationalSimilarity +
    w.geographic * geographicProximity;

  return {
    total: Math.round(total * 100) / 100,
    formationMatch: Math.round(formationMatch * 100) / 100,
    depthAlignment: Math.round(depthAlignment * 100) / 100,
    trajectorySimilarity: Math.round(trajectorySimilarity * 100) / 100,
    operationalSimilarity: Math.round(operationalSimilarity * 100) / 100,
    geographicProximity: Math.round(geographicProximity * 100) / 100,
  };
}
