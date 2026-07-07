export default function Sidebar({ page, setPage }) {
  const items = [
    ['dashboard', '🏠', 'Dashboard'],
    ['calendar', '📅', 'Calendar'],
    ['campaigns', '🚀', 'Campaigns'],
    ['documents', '🗂️', 'Documents & Links'],
    ['insights', '📊', 'Marketing Insights'],
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brandLogo">goodcents</div>
        <div className="brandSub">CONTENT PROMOTIONAL CALENDAR</div>
      </div>

      <nav className="navList">
        {items.map(([key, icon, label]) => (
          <button
            key={key}
            className={`navItem ${page === key ? 'active' : ''}`}
            onClick={() => setPage(key)}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
