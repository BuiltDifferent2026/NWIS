// ─── Assam Basin Formation Stratigraphy ───

export interface Formation {
  id: string;
  name: string;
  group: string;
  age: string;
  typicalDepthRange: [number, number]; // meters MD
  color: string;
  description: string;
  knownRisks: string[];
}

export const FORMATIONS: Formation[] = [
  {
    id: 'alluvium',
    name: 'Alluvium',
    group: 'Recent',
    age: 'Quaternary',
    typicalDepthRange: [0, 200],
    color: '#A78BFA',
    description: 'Unconsolidated surface deposits',
    knownRisks: ['Shallow gas pockets', 'Unconsolidated hole stability']
  },
  {
    id: 'dihing',
    name: 'Dihing Formation',
    group: 'Upper Tertiary',
    age: 'Pliocene',
    typicalDepthRange: [200, 600],
    color: '#818CF8',
    description: 'Sandstone-shale alternations, freshwater deposits',
    knownRisks: ['Water influx', 'Hole washout']
  },
  {
    id: 'namsang',
    name: 'Namsang Formation',
    group: 'Upper Tertiary',
    age: 'Late Miocene-Pliocene',
    typicalDepthRange: [600, 1200],
    color: '#6366F1',
    description: 'Thick sandstones with coal seams',
    knownRisks: ['Coal bed gas', 'Borehole instability']
  },
  {
    id: 'girujan',
    name: 'Girujan Clay',
    group: 'Upper Tertiary',
    age: 'Middle-Late Miocene',
    typicalDepthRange: [1200, 1800],
    color: '#22D3EE',
    description: 'Thick clay formation, acts as regional seal',
    knownRisks: ['Shale swelling', 'Stuck pipe', 'Tight hole']
  },
  {
    id: 'tipam',
    name: 'Tipam Sandstone',
    group: 'Upper Tertiary',
    age: 'Middle Miocene',
    typicalDepthRange: [1800, 2600],
    color: '#F97316',
    description: 'Major reservoir formation, coarse-grained sandstone',
    knownRisks: ['Severe mud loss', 'Differential sticking', 'High permeability zones']
  },
  {
    id: 'barail',
    name: 'Barail Group',
    group: 'Lower Tertiary',
    age: 'Oligocene',
    typicalDepthRange: [2600, 3500],
    color: '#8B5CF6',
    description: 'Alternating sandstone-shale sequence, key exploration target',
    knownRisks: ['Overpressure', 'Kick', 'Torque spikes', 'Formation fracture']
  },
  {
    id: 'kopili',
    name: 'Kopili Formation',
    group: 'Lower Tertiary',
    age: 'Eocene',
    typicalDepthRange: [3500, 4000],
    color: '#EC4899',
    description: 'Marine shale with thin limestone beds',
    knownRisks: ['Severe overpressure', 'H2S gas', 'Borehole collapse']
  },
  {
    id: 'sylhet',
    name: 'Sylhet Limestone',
    group: 'Lower Tertiary',
    age: 'Early Eocene',
    typicalDepthRange: [4000, 4300],
    color: '#84CC16',
    description: 'Fractured limestone, deep exploration target',
    knownRisks: ['Lost circulation', 'Fractured zones', 'High pressure differentials']
  }
];

export const FORMATION_SYNONYMS: Record<string, string[]> = {
  'tipam': ['Tipam Sand', 'Tipam Ss', 'Tipam Sandstone', 'Upper Tipam', 'Lower Tipam'],
  'barail': ['Barail', 'Barail Group', 'Barail Fm', 'Upper Barail', 'Lower Barail'],
  'girujan': ['Girujan', 'Girujan Clay', 'Girujan Fm'],
  'kopili': ['Kopili', 'Kopili Fm', 'Kopili Shale'],
};

export function getFormationByDepth(depthMD: number): Formation | undefined {
  return FORMATIONS.find(f => depthMD >= f.typicalDepthRange[0] && depthMD < f.typicalDepthRange[1]);
}

export function getFormationById(id: string): Formation | undefined {
  return FORMATIONS.find(f => f.id === id);
}

export function getFormationColor(formationId: string): string {
  const f = getFormationById(formationId);
  return f?.color ?? '#6B7280';
}
