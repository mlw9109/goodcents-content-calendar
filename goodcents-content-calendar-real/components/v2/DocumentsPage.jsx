import { useState } from 'react';
import PageHeader from './PageHeader';

export default function DocumentsPage({ links, setLinks }) {
  const [draft, setDraft] = useState({ title: '', url: '', category: '', notes: '' });

  const saveLink = () => {
    if (!draft.title.trim()) return;
    setLinks((items) => [...items, { ...draft, id: crypto.randomUUID() }]);
    setDraft({ title: '', url: '', category: '', notes: '' });
  };

  return (
    <>
      <PageHeader title="Documents & Links" />
      <section className="card">
        <h2>Add Link</h2>
        <div className="formGrid">
          <input placeholder="Link title" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
          <input placeholder="URL" value={draft.url} onChange={(event) => setDraft({ ...draft, url: event.target.value })} />
          <input placeholder="Category" value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} />
          <input placeholder="Notes" value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} />
        </div>
        <button className="btn primary" onClick={saveLink}>Save Link</button>
      </section>

      <section className="card">
        <h2>Saved Links</h2>
        {links.length === 0 && <p>No links saved yet. Links are local for now.</p>}
        {links.map((link) => (
          <div key={link.id} className="linkCard">
            <h3>{link.title}</h3>
            <p>{link.category}</p>
            {link.url && <a href={link.url} target="_blank">Open link</a>}
          </div>
        ))}
      </section>
    </>
  );
}
