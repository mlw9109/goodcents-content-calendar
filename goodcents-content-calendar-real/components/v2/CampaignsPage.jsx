import PageHeader from './PageHeader';
import Badge from './Badge';
import { dateLabel } from './campaignUtils';

export default function CampaignsPage({ campaigns, loading, onCreateCampaign, onViewCampaign, onRefresh }) {
  return (
    <>
      <PageHeader title="Campaigns" onCreateCampaign={onCreateCampaign} onRefresh={onRefresh} />
      <section className="card">
        <h2>Campaign Library</h2>
        {loading && <p>Loading campaigns from Supabase...</p>}
        {!loading && campaigns.length === 0 && (
          <div className="emptyState">
            <h3>No campaigns saved yet</h3>
            <p>Create your first item and it will appear in this table.</p>
            <button className="btn primary" onClick={() => onCreateCampaign()}>Create Item</button>
          </div>
        )}
        <div className="tableList">
          {campaigns.map((campaign) => (
            <button key={campaign.id} className="tableRow" onClick={() => onViewCampaign(campaign)}>
              <div>
                <h3>{campaign.name}</h3>
                <p>{dateLabel(campaign.startDate)} · {campaign.type}</p>
              </div>
              <Badge type={campaign.status}>{campaign.status || 'Planned'}</Badge>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
