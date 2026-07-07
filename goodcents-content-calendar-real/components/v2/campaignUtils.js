export const campaignTypes = [
  'Promotion',
  'Product Launch',
  'Social Media',
  'POP Kit',
  'Franchise Communication',
  'Training & Education',
  'Community Event',
];

export const assetOptions = [
  'Photography',
  'Social Graphics',
  'Email',
  'Website',
  'POP Kit',
  'Franchise Communication',
];

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function dateLabel(dateString) {
  if (!dateString) return '';
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function daysUntil(dateString) {
  if (!dateString) return '';
  const today = new Date(`${todayIso()}T00:00:00`);
  const date = new Date(`${dateString}T00:00:00`);
  const diff = Math.round((date - today) / 86400000);

  if (diff === 0) return 'Today';
  if (diff === 1) return '1 day';
  if (diff < 0) return `${Math.abs(diff)} overdue`;
  return `${diff} days`;
}

export function dbCampaignToApp(row) {
  return {
    id: row.id,
    name: row.title || '',
    type: row.campaign_type || 'Promotion',
    startDate: row.start_date || todayIso(),
    endDate: row.end_date || row.start_date || todayIso(),
    notes: row.notes || row.description || '',
    description: row.description || '',
    owner: row.owner || 'Megan',
    status: row.status || 'Planned',
    color: row.color || '',
  };
}

export function appCampaignToDb(campaign) {
  return {
    title: campaign.name || '',
    campaign_type: campaign.type || 'Promotion',
    start_date: campaign.startDate || todayIso(),
    end_date: campaign.endDate || campaign.startDate || todayIso(),
    notes: campaign.notes || '',
    description: campaign.description || campaign.notes || '',
    owner: campaign.owner || 'Megan',
    status: campaign.status || 'Planned',
    color: campaign.color || '',
    updated_at: new Date().toISOString(),
  };
}
