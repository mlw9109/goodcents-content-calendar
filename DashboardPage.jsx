import { daysBetween, prettyDate } from '@/lib/dateUtils';
import { typeMeta } from '@/lib/constants';
import CategoryMix from './CategoryMix';
import MiniCalendar from './MiniCalendar';

export default function DashboardPage({ campaigns, links, onCreateCampaign, onCreateLink, onOpenCampaign, goTo }) {
  const today = new Date();
  const sorted = [...campaigns].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const action = sorted.filter((c) => daysBetween(c.startDate, today) <= 7 && daysBetween(c.startDate, today) >= -30);
  const upcoming = sorted.filter((c) => daysBetween(c.startDate, today) >= 0).slice(0, 6);
  const overdue = campaigns.filter((c) => daysBetween(c.startDate, today) < 0).length;
  const dueToday = campaigns.filter((c) => daysBetween(c.startDate, today) === 0).length;
  const dueWeek = campaigns.filter((c) => daysBetween(c.startDate, today) > 0 && daysBetween(c.startDate, today) <= 7).length;

  return (
    <div className="grid">
      <div className="headerRow">
        <div>
          <h1>Dashboard</h1>
        </div>
        <button className="btn primary" onClick={() => onCreateCampaign()}>+ Create Item</button>
      </div>

      <div className="card welcome">
        <div className="date">Today is {today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
        <h2>Welcome back, Megan</h2>
        <p className="subtle">See what needs attention, what is launching soon, and where the important links live.</p>
      </div>

      {(overdue || dueToday || dueWeek) ? (
        <div className={`alert ${overdue ? 'red' : dueToday ? 'orange' : 'yellow'}`}>
          <span>{overdue ? '🚨 Action Required' : dueToday ? '🟠 Due Today' : '⚠ Upcoming Deadlines'}</span>
          <span>{overdue} overdue • {dueToday} due today • {dueWeek} due this week</span>
        </div>
      ) : null}

      <div className="dashboardGrid">
        <div className="grid">
          <div className="card">
            <h2>Quick Actions</h2>
            <div className="quickGrid">
              <button className="btn primary" onClick={() => onCreateCampaign()}>+ Create Item</button>
              <button className="btn" onClick={() => goTo('calendar')}>Open Calendar</button>
              <button className="btn" onClick={() => onCreateLink()}>+ Add Link</button>
            </div>
          </div>

          <div className="card">
            <h2>Upcoming Timeline</h2>
            {upcoming.length ? upcoming.map((campaign) => {
              const diff = daysBetween(campaign.startDate, today);
              const meta = typeMeta[campaign.type] || typeMeta.Other;
              return (
                <button key={campaign.id} className="timelineItem" onClick={() => onOpenCampaign(campaign)} style={{ width:'100%', background:'transparent', border:0, textAlign:'left' }}>
                  <div>
                    <div className="pill" style={{ background: meta.soft, color: meta.color }}>{meta.icon} {campaign.type}</div>
                    <h3>{campaign.name}</h3>
                    <div className="subtle">{prettyDate(campaign.startDate)}</div>
                  </div>
                  <strong>{diff === 0 ? 'Today' : `${diff} days`}</strong>
                </button>
              );
            }) : <div className="emptyState">No upcoming items yet.</div>}
          </div>

          <div className="card">
            <h2>Planning Opportunities</h2>
            <p className="subtle">This card looks for planning gaps instead of repeating overdue alerts.</p>
            <ul>
              <li>Review next month for open campaign space.</li>
              <li>Confirm each upcoming launch has required assets assigned.</li>
              <li>Begin future holiday planning at least 30+ days ahead.</li>
            </ul>
          </div>
        </div>

        <div className="grid">
          <MiniCalendar campaigns={campaigns} onOpenCampaign={onOpenCampaign} />
          <CategoryMix campaigns={campaigns} />
          <div className="card">
            <h2>Important Links</h2>
            {links.slice(0, 4).map((link) => <p key={link.id}><a href={link.url} target="_blank">{link.name}</a></p>)}
          </div>
        </div>
      </div>
    </div>
  );
}
