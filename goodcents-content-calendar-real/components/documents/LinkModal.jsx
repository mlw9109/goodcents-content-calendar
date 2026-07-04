'use client';

import { useState } from 'react';

export default function LinkModal({ modal, onClose, onSave }) {
  const [form, setForm] = useState(modal.mode === 'edit' ? modal.link : { id:'', name:'', url:'', description:'' });
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const save = () => {
    if (!form.name.trim()) return alert('Link name is required.');
    if (!form.url.trim()) return alert('URL is required.');
    onSave(form);
  };
  return (
    <div className="modalOverlay">
      <div className="modal" style={{ width:'min(560px, 96vw)' }}>
        <div className="headerRow">
          <div>
            <h2>{modal.mode === 'edit' ? 'Edit Link' : 'Add Link'}</h2>
            <p className="subtle">No category needed. Keep it simple.</p>
          </div>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
        </div>
        <div className="field"><label>Link Name</label><input value={form.name} onChange={(e) => update('name', e.target.value)} /></div>
        <div className="field"><label>URL</label><input value={form.url} onChange={(e) => update('url', e.target.value)} placeholder="https://" /></div>
        <div className="field"><label>Description</label><textarea value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="What is this used for? (Optional)" /></div>
        <div className="cardActions" style={{ justifyContent:'flex-end' }}>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={save}>Save Link</button>
        </div>
      </div>
    </div>
  );
}
