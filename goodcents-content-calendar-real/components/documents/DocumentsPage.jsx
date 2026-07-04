'use client';

import { useMemo, useState } from 'react';

export default function DocumentsPage({ links, onCreateLink, onEditLink, onDeleteLink }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => links.filter((link) => `${link.name} ${link.url} ${link.description}`.toLowerCase().includes(query.toLowerCase())), [links, query]);
  return (
    <div className="grid">
      <div className="headerRow">
        <div>
          <h1>Documents & Links</h1>
          <p className="subtle">Quick access to the resources that support your calendar.</p>
        </div>
        <button className="btn primary" onClick={onCreateLink}>+ Add Link</button>
      </div>
      <div className="card">
        <div className="field"><input placeholder="Search links" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
      </div>
      <div className="linkGrid">
        {filtered.map((link) => (
          <div className="linkCard" key={link.id}>
            <h3>{link.name}</h3>
            <p className="subtle">{link.description || 'No description added.'}</p>
            <p><a href={link.url} target="_blank">Open Link</a></p>
            <div className="cardActions">
              <button className="btn ghost" onClick={() => onEditLink(link)}>Edit</button>
              <button className="btn danger" onClick={() => confirm('Delete this link?') && onDeleteLink(link.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {!filtered.length ? <div className="emptyState">No links found.</div> : null}
    </div>
  );
}
