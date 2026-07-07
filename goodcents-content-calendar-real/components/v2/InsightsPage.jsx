import PageHeader from './PageHeader';

export default function InsightsPage({ campaigns }) {
  const byType = campaigns.reduce((accumulator, campaign) => {
    accumulator[campaign.type] = (accumulator[campaign.type] || 0) + 1;
    return accumulator;
  }, {});

  const total = campaigns.length;

  return (
    <>
      <PageHeader title="Marketing Insights" />
      <section className="card">
        <h2>Campaign Mix</h2>
        <div className="metricBox">
          <span>Total Campaigns</span>
          <strong>{total}</strong>
        </div>
        {Object.keys(byType).length === 0 && <p>No data yet.</p>}
        {Object.entries(byType).map(([type, count]) => (
          <div key={type} className="insightRow">
            <span>{type}</span>
            <strong>{count}</strong>
          </div>
        ))}
      </section>
    </>
  );
}
