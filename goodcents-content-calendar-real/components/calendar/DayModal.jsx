'use client';

import { useState } from 'react';
import { prettyDate } from '@/lib/dateUtils';
import { typeMeta } from '@/lib/constants';

export default function DayModal({ day, onClose, onCreate, onOpen, onEdit, onDeleteCampaigns }) {
  const [selected, setSelected] = useState([]);
  const toggle = (id) => setSelected((items) => items.includes(id) ? items.filter((x) => x !== id) : [...items, id]);
  const removeSelected = () => {
    if (!selected.length) return;
    if (confirm(`Delete ${selected.length} selected item(s)?`)) {
      onDeleteCampaigns(selected);
      onClose();
    }
  };
  return (
    <div className="modalOverlay">
      <div className="modal" style={{ width:'min(620px, 96vw)' }}>
        <div className="headerRow">
          <div>
            <h2>{prettyDate(day.date)}</h2>
            <p className="subtle">View, edit, or mass delete items on this day.</p>
          </div>
          <button className="btn ghost" onClick={onClose}>Done</button>
        </div>
        <div className="grid">
          {day.campaigns.length ? day.campaigns.map((campaign) => {
            const meta = typeMeta[campaign.type] || typeMeta.Other;
            return (
              <div className="campaignCard" key={campaign.id}>
                <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  <input type="checkbox" checked={selected.includes(campaign.id)} onChange={() => toggle(campaign.id)} />
                  <div style={{ flex:1 }}>
                    <span className="pill" style={{ background: meta.soft, color: meta.color }}>{meta.icon} {campaign.type}</span>
                    <h3>{campaign.name}</h3>
                    <p className="subtle">{campaign.notes || 'No notes added.'}</p>
                    <div className="cardActions">
                      <button className="btn" onClick={() => onOpen(campaign)}>Open</button>
                      <button className="btn ghost" onClick={() => onEdit(campaign)}>Edit</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }) : <div className="emptyState">No items scheduled for this day.</div>}
        </div>
        <div className="cardActions" style={{ justifyContent:'space-between', marginTop:18 }}>
          <button className="btn danger" onClick={removeSelected} disabled={!selected.length}>Delete Selected</button>
          <button className="btn primary" onClick={onCreate}>+ Create Item</button>
        </div>
      </div>
    </div>
  );
}
