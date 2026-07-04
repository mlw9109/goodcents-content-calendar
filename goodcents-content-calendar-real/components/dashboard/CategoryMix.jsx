import { typeMeta } from '@/lib/constants';

export default function CategoryMix({ campaigns }) {
  const counts = campaigns.reduce((acc, campaign) => {
    acc[campaign.type] = (acc[campaign.type] || 0) + 1;
    return acc;
  }, {});
  const entries = Object.entries(counts);
  if (!entries.length) return <div className="card"><h2>Category Mix</h2><div className="emptyState">No active categories yet.</div></div>;
  let start = 0;
  const total = campaigns.length;
  const gradient = entries.map(([type, count]) => {
    const meta = typeMeta[type] || typeMeta.Other;
    const end = start + (count / total) * 100;
    const segment = `${meta.color} ${start}% ${end}%`;
    start = end;
    return segment;
  }).join(', ');
  return (
    <div className="card">
      <h2>Category Mix</h2>
      <div className="donut" style={{ background: `conic-gradient(${gradient})` }} />
      {entries.map(([type, count]) => {
        const meta = typeMeta[type] || typeMeta.Other;
        return <div key={type} className="barRow"><span>{type}</span><div className="barTrack"><div className="barFill" style={{ width: `${(count/total)*100}%`, background: meta.color }} /></div><strong>{count}</strong></div>;
      })}
    </div>
  );
}
