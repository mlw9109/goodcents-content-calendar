export const initialCampaigns = [
  {
    id: 'c-1',
    name: 'Protein Slider Packs',
    type: 'Product Launch',
    startDate: '2026-07-14',
    endDate: '2026-07-14',
    notes: 'Launch support for protein slider packs.',
    assets: ['photography', 'social', 'email', 'website'],
    fields: { launchItem: 'Protein Slider Packs', trainingNeeded: 'Yes', popNeeded: 'Yes' }
  },
  {
    id: 'c-2',
    name: 'July Social Post',
    type: 'Social Media',
    startDate: '2026-07-14',
    endDate: '2026-07-14',
    notes: 'Social support post for July.',
    assets: ['social'],
    fields: { platform: 'Instagram and Facebook', cta: 'Order online' }
  },
  {
    id: 'c-3',
    name: 'Q3 POP Kit',
    type: 'POP Kit',
    startDate: '2026-07-22',
    endDate: '2026-07-22',
    notes: 'Quarterly required store POP kit.',
    assets: ['pop', 'franchise'],
    fields: { quarter: 'Q3', shipDate: '2026-07-15', requiredMaterials: 'Window clings, counter cards, instructions' }
  }
];

export const initialLinks = [
  { id: 'l-1', name: 'Google Drive', url: 'https://drive.google.com', description: 'Marketing files and shared folders' },
  { id: 'l-2', name: 'Monday.com', url: 'https://monday.com', description: 'Project management workspace' }
];
