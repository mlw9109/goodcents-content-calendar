import { useState } from 'react';
import { campaignTypes, todayIso } from './campaignUtils';

export default function CampaignModal({ modal, onClose, onSave }) {
  const existing = modal?.campaign;
  const [form, setForm] = useState(
    existing || {
      name: '',
      type: 'Promotion',
      startDate: modal?.date || todayIso(),
      endDate: modal?.date || todayIso(),
      notes: '',
      description: '',
      owner: 'Megan',
      status: 'Planned',
      color: '',
    }
  );

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <div className="modalOverlay">
      <div className="modal">
        <div className="modalHeader">
          <div>
            <h2>{existing ? 'Edit Item' : 'Create Item'}</h2>
            <p>This saves directly to Supabase.</p>
          </div>
          <button className="btn" onClick={onClose}>Cancel</button>
        </div>

        <div className="formGrid">
          <label>Item Name<input value={form.name} onChange={(event) => update('name', event.target.value)} /></label>
          <label>Campaign Type
            <select value={form.type} onChange={(event) => update('type', event.target.value)}>
              {campaignTypes.map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>
          <label>Start Date<input type="date" value={form.startDate} onChange={(event) => update('startDate', event.target.value)} /></label>
          <label>End Date<input type="date" value={form.endDate} onChange={(event) => update('endDate', event.target.value)} /></label>
          <label>Owner<input value={form.owner} onChange={(event) => update('owner', event.target.value)} /></label>
          <label>Status
            <select value={form.status} onChange={(event) => update('status', event.target.value)}>
              <option>Planned</option>
              <option>In Progress</option>
              <option>Needs Review</option>
              <option>Approved</option>
              <option>Complete</option>
            </select>
          </label>
        </div>

        <label className="fullField">Notes<textarea value={form.notes} onChange={(event) => update('notes', event.target.value)} /></label>

        <div className="modalActions">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={() => onSave(form)}>Save Item</button>
        </div>
      </div>
    </div>
  );
}
