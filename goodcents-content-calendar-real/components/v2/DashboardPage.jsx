import PageHeader from './PageHeader';
import Badge from './Badge';
import MiniCalendar from './MiniCalendar';
import { dateLabel, daysUntil, todayIso } from './campaignUtils';

export default function DashboardPage({
  campaigns,
  upcomingCampaigns,
  loading,
  loadError,
  onRefresh,
  onCreateCampaign,
  onViewCampaign,
  setPage,
}) {
  const dueToday = campaigns.filter((campaign) => campaign.startDate === todayIso()).length;
  const overdue = campaigns.filter((campaign) => campaign.startDate < todayIso()).length;

  return (
    <>
      <PageHeader title="Dashboard" onCreateCampaign={onCreateCampaign} onRefresh={onRefresh} />

      {loadError && (
        <section className="errorNotice">
          <strong>Supabase error:</strong> {loadError}
        </section>
      )}

      <section className="welcomeCard">
        <p className="eyebrow">TODAY IS {dateLabel(todayIso()).toUpperCase()}</p>
        <h2>Welcome back, Megan</h2>
        <p>See what needs attention, what is launching soon, and where the important links live.</p>
      </section>

      <section className="statusBar">
        <span>🟠 Due Today</span>
        <strong>{overdue} overdue · {dueToday} due today</strong>
      </section>

      <div className="dashboardGrid">
        <div>
          <section className="card">
            <h2>Quick Actions</h2>
            <div className="quickActions">
              <button className="btn primary" onClick={() => onCreateCampaign()}>+ Create Item</button>
              <button className="btn" onClick={() => setPage('calendar')}>Open Calendar</button>
              <button className="btn" onClick={() => setPage('documents')}>+ Add Link</button>
            </div>
          </section>

          <section className="card">
            <h2>Upcoming Timeline</h2>
            {loading && <p>Loading campaigns from Supabase...</p>}
            {!loading && !loadError && upcomingCampaigns.length === 0 && (
              <div className="emptyState">
                <h3>No campaigns yet</h3>
                <p>Create your first campaign and it will save directly to Supabase.</p>
                <button className="btn primary" onClick={() => onCreateCampaign()}>Create First Item</button>
              </div>
            )}
            {!loading && upcomingCampaigns.map((campaign) => (
              <button key={campaign.id} className="timelineItem" onClick={() => onViewCampaign(campaign)}>
                <div>
                  <Badge type={campaign.type}>{campaign.type}</Badge>
                  <h3>{campaign.name}</h3>
                  <p>{dateLabel(campaign.startDate)}</p>
                </div>
                <strong>{daysUntil(campaign.startDate)}</strong>
              </button>
            ))}
          </section>

          <section className="card">
            <h2>Planning Opportunities</h2>
            <p>This card looks for planning gaps instead of repeating overdue alerts.</p>
            <ul>
              <li>Review next month for open campaign space.</li>
              <li>Check if upcoming launches have owners assigned.</li>
              <li>Confirm status before production deadlines.</li>
            </ul>
          </section>
        </div>

        <MiniCalendar campaigns={campaigns} onViewCampaign={onViewCampaign} />
      </div>
    </>
  );
}
