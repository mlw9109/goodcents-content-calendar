'use client';

import { useMemo, useState } from 'react';
import { campaignTypes, typeMeta } from '@/lib/constants';
import { prettyDate } from '@/lib/dateUtils';

export default function CampaignsPage({ campaigns, onCreateCampaign, onOpenCampaign, onEditCampaign, onDeleteCampaign, onDeleteCampaigns }) {
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState([]);
  const filtered = useMemo(() => campaigns.filter((campaign) => {
    const matchesType = filter === 'All' || campaign.type === filter;
    const search = `${campaign.name} ${campaign.type} ${campaign.notes}`.toLowerCase();
    return matchesType && search.includes(query.toLowerCase());
  }), [campaigns, filter, query]);

  const toggle = (id) => setSelected((items) => items.includes(id) ? items.filter((x) => x !== id) : [...items, id]);
  const bulkDelete = () => {
    if (!selected.length) return;
    if (confirm(`Delete ${selected.length} selected campaign(s)?`)) {
      onDeleteCampaigns(selected);
      setSelected([]);
    }
  };

  return (
    <div className="grid">
      <div className="headerRow">
        <div>
          <h1>Campaign Library</h1>
          <p className="subtle">Manage and organize all marketing initiatives.</p>
        </div>
        <button className="btn primary" onClick={() => onCreateCampaign()}>+ Create Item</button>
      </div>

      <div className="card">
        <div className="field"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search campaigns" /></div>
        <div className="filterBar">
          {['All', ...campaignTypes].map((type) => <button key={type} className={`filterChip ${filter === type ? 'active' : ''}`} onClick={() => setFilter(type)}>{type}</button>)}
        </div>
        {selected.length ? <button className="btn danger" onClick={bulkDelete}>Delete Selected ({selected.length})</button> : null}
      </div>

      <div className="campaignGrid">
        {filtered.map((campaign) => {
          const meta = typeMeta[campaign.type] || typeMeta.Other;
          return (
            <div className="campaignCard" key={campaign.id}>
              <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                <input type="checkbox" checked={selected.includes(campaign.id)} onChange={() => toggle(campaign.id)} />
                <div style={{ flex:1 }}>
                  <span className="pill" style={{ background: meta.soft, color: meta.color }}>{meta.icon} {campaign.type}</span>
                  <h3>{campaign.name}</h3>
                  <p className="subtle">{prettyDate(campaign.startDate)}</p>
                  <p>{campaign.notes || 'No notes added.'}</p>
                  <div className="cardActions">
                    <button className="btn" onClick={() => onOpenCampaign(campaign)}>Open</button>
                    <button className="btn ghost" onClick={() => onEditCampaign(campaign)}>Edit</button>
                    <button className="btn danger" onClick={() => onDeleteCampaign(campaign.id)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
