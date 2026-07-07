export default function PageHeader({ title, onCreateCampaign, onRefresh }) {
  return (
    <div className="pageHeader">
      <h1>{title}</h1>
      <div className="headerActions">
        {onRefresh && <button className="btn" onClick={onRefresh}>Refresh</button>}
        {onCreateCampaign && (
          <button className="btn primary" onClick={() => onCreateCampaign()}>
            + Create Item
          </button>
        )}
      </div>
    </div>
  );
}
