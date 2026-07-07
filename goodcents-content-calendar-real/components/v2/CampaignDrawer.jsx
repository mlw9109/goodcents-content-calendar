import Badge from './Badge';
import { dateLabel } from './campaignUtils';

export default function CampaignDrawer({ campaign, onClose, onEdit, onDelete }) {
  return (
    <div className="drawer">
      <div className="drawerHeader">
        <div>
          <Badge type={campaign.type}>{campaign.type}</Badge>
          <h2>{campaign.name}</h2>
          <p>{dateLabel(campaign.startDate)} to {dateLabel(campaign.endDate)}</p>
        </div>
        <button className="btn" onClick={onClose}>Close</button>
      </div>

      <p>{campaign.notes || 'No notes added.'}</p>

      <h3>Details</h3>
      <div className="detailList">
        <div><strong>Owner</strong><span>{campaign.owner || 'Megan'}</span></div>
        <div><strong>Status</strong><span>{campaign.status || 'Planned'}</span></div>
        <div><strong>Database ID</strong><span>{campaign.id}</span></div>
      </div>

      <div className="modalActions">
        <button className="btn" onClick={onEdit}>Edit</button>
        <button className="btn danger" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}
