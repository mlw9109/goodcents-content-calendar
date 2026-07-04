'use client';

import { useState } from 'react';
import { assets, campaignTypes } from '@/lib/constants';

const emptyCampaign = (date) => ({
  id: '',
  name: '',
  type: 'Promotion',
  startDate: date || new Date().toISOString().slice(0, 10),
  endDate: date || new Date().toISOString().slice(0, 10),
  notes: '',
  assets: [],
  fields: {}
});

export default function CampaignModal({ modal, onClose, onSave }) {
  const [form, setForm] = useState(modal.mode === 'edit' ? modal.campaign : emptyCampaign(modal.date));
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const updateField = (key, value) => setForm((f) => ({ ...f, fields: { ...f.fields, [key]: value } }));
  const toggleAsset = (key) => setForm((f) => ({ ...f, assets: f.assets.includes(key) ? f.assets.filter((x) => x !== key) : [...f.assets, key] }));

  const save = () => {
    if (!form.name.trim()) return alert('Item name is required.');
    onSave(form);
  };

  return (
    <div className="modalOverlay">
      <div className="modal">
        <div className="headerRow">
          <div>
            <h2>{modal.mode === 'edit' ? 'Edit Item' : 'Create Item'}</h2>
            <p className="subtle">The form changes based on Campaign Type.</p>
          </div>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
        </div>
        <div className="fieldGrid">
          <div className="field"><label>Item Name</label><input value={form.name} onChange={(e) => update('name', e.target.value)} /></div>
          <div className="field"><label>Campaign Type</label><select value={form.type} onChange={(e) => update('type', e.target.value)}>{campaignTypes.map((type) => <option key={type}>{type}</option>)}</select></div>
          <div className="field"><label>Start Date</label><input type="date" value={form.startDate} onChange={(e) => update('startDate', e.target.value)} /></div>
          <div className="field"><label>End Date</label><input type="date" value={form.endDate} onChange={(e) => update('endDate', e.target.value)} /></div>
          <DynamicFields type={form.type} fields={form.fields || {}} updateField={updateField} />
          <div className="field full"><label>Notes</label><textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Add context, instructions, or details." /></div>
          <div className="field full">
            <label>Asset Checklist</label>
            <div className="assetGrid">
              {assets.map((asset) => <button type="button" key={asset.key} className={`assetCard ${form.assets.includes(asset.key) ? 'selected' : ''}`} onClick={() => toggleAsset(asset.key)}><span>{form.assets.includes(asset.key) ? '✅' : '⬜'}</span><span><strong>{asset.label}</strong><br/><small>{asset.description}</small></span></button>)}
            </div>
          </div>
        </div>
        <div className="cardActions" style={{ justifyContent:'flex-end' }}>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={save}>Save Item</button>
        </div>
      </div>
    </div>
  );
}

function DynamicFields({ type, fields, updateField }) {
  if (type === 'POP Kit') return <>
    <div className="field"><label>Quarter</label><input value={fields.quarter || ''} onChange={(e) => updateField('quarter', e.target.value)} placeholder="Q3" /></div>
    <div className="field"><label>Ship Date</label><input type="date" value={fields.shipDate || ''} onChange={(e) => updateField('shipDate', e.target.value)} /></div>
    <div className="field full"><label>Required Materials</label><textarea value={fields.requiredMaterials || ''} onChange={(e) => updateField('requiredMaterials', e.target.value)} /></div>
  </>;
  if (type === 'Promotion') return <>
    <div className="field"><label>Offer</label><input value={fields.offer || ''} onChange={(e) => updateField('offer', e.target.value)} /></div>
    <div className="field"><label>Promo Code</label><input value={fields.promoCode || ''} onChange={(e) => updateField('promoCode', e.target.value)} /></div>
    <div className="field"><label>Redemption Channel</label><input value={fields.channel || ''} onChange={(e) => updateField('channel', e.target.value)} placeholder="App, online, in-store" /></div>
    <div className="field"><label>Audience</label><input value={fields.audience || ''} onChange={(e) => updateField('audience', e.target.value)} /></div>
  </>;
  if (type === 'Product Launch') return <>
    <div className="field"><label>Launch Item</label><input value={fields.launchItem || ''} onChange={(e) => updateField('launchItem', e.target.value)} /></div>
    <div className="field"><label>Training Needed</label><input value={fields.trainingNeeded || ''} onChange={(e) => updateField('trainingNeeded', e.target.value)} /></div>
    <div className="field"><label>POP Needed</label><input value={fields.popNeeded || ''} onChange={(e) => updateField('popNeeded', e.target.value)} /></div>
    <div className="field"><label>Website Update</label><input value={fields.websiteUpdate || ''} onChange={(e) => updateField('websiteUpdate', e.target.value)} /></div>
  </>;
  if (type === 'Social Media') return <>
    <div className="field"><label>Platform</label><input value={fields.platform || ''} onChange={(e) => updateField('platform', e.target.value)} /></div>
    <div className="field"><label>CTA</label><input value={fields.cta || ''} onChange={(e) => updateField('cta', e.target.value)} /></div>
    <div className="field full"><label>Caption</label><textarea value={fields.caption || ''} onChange={(e) => updateField('caption', e.target.value)} /></div>
  </>;
  if (type === 'Franchise Communication') return <>
    <div className="field"><label>Audience</label><input value={fields.audience || ''} onChange={(e) => updateField('audience', e.target.value)} /></div>
    <div className="field"><label>Send Date</label><input type="date" value={fields.sendDate || ''} onChange={(e) => updateField('sendDate', e.target.value)} /></div>
    <div className="field full"><label>Required Action</label><textarea value={fields.requiredAction || ''} onChange={(e) => updateField('requiredAction', e.target.value)} /></div>
  </>;
  return <div className="field full"><label>Details</label><textarea value={fields.details || ''} onChange={(e) => updateField('details', e.target.value)} placeholder="Add any fields specific to this item." /></div>;
}
