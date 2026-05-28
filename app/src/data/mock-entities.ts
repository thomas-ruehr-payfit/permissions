export interface Entity {
  id: string;
  name: string;
  country: string;
  code: string;
}

export const ENTITIES: Entity[] = [
  { id: 'fr', name: 'PayFit France', country: 'France', code: 'FR' },
  { id: 'es', name: 'PayFit Spain', country: 'Spain', code: 'ES' },
  { id: 'uk', name: 'PayFit UK', country: 'United Kingdom', code: 'UK' },
];

export const GROUPS = [
  { id: 'eng', name: 'Engineering' },
  { id: 'people', name: 'People Ops' },
  { id: 'finance', name: 'Finance' },
  { id: 'remote', name: 'Remote' },
];
