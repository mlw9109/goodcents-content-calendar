import { typeMeta, assets } from '@/lib/constants';
import { prettyDate } from '@/lib/dateUtils';

export default function CampaignDrawer({ campaign, onClose, onEdit, onDelete }) {
  const meta = typeMeta[campaign.type] || typeMeta.Other;
  const selectedAssets = assets.filter((asset) => campaign.assets?.includes(asset.key));
  return (
    <div className="drawerOverlay" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawerHeader" style={{ background: meta.color }}>
          <div style={{ fontWeight:900, fontSize:12, letterSpacing:'.08em', textTransform:'uppercase' }}>{meta.icon} {campaign.type}</div>
          <h2 style={{ margin:'8px 0 4px' }}>{campaign.name}</h2>
          <div>{prettyDate(campaign.startDate)}</div>
        </div>

        <div className="grid">
          <div className="card">
            <h3>Overview</h3>
            <p>{campaign.notes || 'No notes added.'}</p>
          </div>

          {Object.keys(campaign.fields || {}).length ? (
            <div className="card">
              <h3>{campaign.type} Details</h3>
              {Object.entries(campaign.fields).map(([key, value]) => value ? <p key={key}><strong>{labelize(key)}:</strong> {value}</p> : null)}
            </div>
          ) : null}

          <div className="card">
            <h3>Asset Checklist</h3>
            {selectedAssets.length ? selectedAssets.map((asset) => <p key={asset.key}>✅ <strong>{asset.label}</strong><br/><span className="subtle">{asset.description}</span></p>) : <p className="subtle">No assets selected.</p>}
          </div>

          <div className="cardActions">
            <button className="btn primary" onClick={onEdit}>Edit {shortType(campaign.type)}</button>
            <button className="btn danger" onClick={() => confirm('Delete this item?') && onDelete()}>Delete</button>
            <button className="btn ghost" onClick={onClose}>Close</button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function labelize(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
}
function shortType(type) {
  if (type === 'POP Kit') return 'POP Kit';
  if (type === 'Social Media') return 'Post';
  return 'Item';
}
