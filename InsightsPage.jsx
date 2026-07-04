import { typeMeta } from '@/lib/constants';
import { daysBetween } from '@/lib/dateUtils';

export default function InsightsPage({ campaigns }) {
  const today = new Date();
  const overdue = campaigns.filter((c) => daysBetween(c.startDate, today) < 0).length;
  const leadTimes = campaigns.map((c) => Math.max(daysBetween(c.startDate, today), 0));
  const avgLead = leadTimes.length ? Math.round(leadTimes.reduce((a,b) => a+b, 0) / leadTimes.length) : 0;
  const health = overdue ? 'Needs Attention' : 'On Track';
  const healthColor = overdue ? '#f47b20' : '#18a558';
  const counts = campaigns.reduce((acc, c) => { acc[c.type] = (acc[c.type] || 0) + 1; return acc; }, {});
  const quarters = campaigns.reduce((acc, c) => {
    const month = Number(c.startDate.slice(5,7));
    const q = month <= 3 ? 'Q1' : month <= 6 ? 'Q2' : month <= 9 ? 'Q3' : 'Q4';
    acc[q] = (acc[q] || 0) + 1;
    return acc;
  }, { Q1:0, Q2:0, Q3:0, Q4:0 });
  const assetCounts = campaigns.reduce((acc, c) => {
    (c.assets || []).forEach((asset) => acc[asset] = (acc[asset] || 0) + 1);
    return acc;
  }, {});
  const maxType = Math.max(1, ...Object.values(counts));
  const maxQuarter = Math.max(1, ...Object.values(quarters));

  return (
    <div className="grid">
      <div className="headerRow">
        <div>
          <h1>Marketing Insights</h1>
          <p className="subtle">Strategic view of marketing health, workload, planning, and execution.</p>
        </div>
      </div>

      <div className="insightGrid">
        <div className="card">
          <h2>Marketing Health</h2>
          <div style={{ fontSize:44, fontWeight:900, color:healthColor }}>{health}</div>
          <p className="subtle">Based on active calendar risk and overdue initiatives.</p>
        </div>
        <div className="card">
          <h2>Average Planning Lead Time</h2>
          <div style={{ fontSize:44, fontWeight:900 }}>{avgLead} days</div>
          <p className="subtle">Goal: 30+ days before launch.</p>
        </div>
      </div>

      <div className="insightGrid">
        <div className="card">
          <h2>Campaign Mix</h2>
          {Object.entries(counts).length ? Object.entries(counts).map(([type, count]) => {
            const meta = typeMeta[type] || typeMeta.Other;
            return <div className="barRow" key={type}><span>{type}</span><div className="barTrack"><div className="barFill" style={{ width:`${(count/maxType)*100}%`, background:meta.color }} /></div><strong>{count}</strong></div>;
          }) : <div className="emptyState">No campaign data yet.</div>}
        </div>

        <div className="card">
          <h2>Quarterly Breakdown</h2>
          {Object.entries(quarters).map(([quarter, count]) => <div className="barRow" key={quarter}><span>{quarter}</span><div className="barTrack"><div className="barFill" style={{ width:`${(count/maxQuarter)*100}%`, background:'#1974d2' }} /></div><strong>{count}</strong></div>)}
        </div>
      </div>

      <div className="insightGrid">
        <div className="card">
          <h2>Asset Progress</h2>
          {Object.keys(assetCounts).length ? Object.entries(assetCounts).map(([asset, count]) => <p key={asset}>✅ <strong>{asset}</strong> assigned to {count} item(s)</p>) : <div className="emptyState">No assets assigned yet.</div>}
        </div>
        <div className="card">
          <h2>At Risk</h2>
          {overdue ? <p>⚠ {overdue} item(s) are behind schedule.</p> : <p>🟢 No major risk signals detected.</p>}
          <p className="subtle">This section is designed for strategic risk, not day-to-day upcoming deadlines.</p>
        </div>
      </div>
    </div>
  );
}
