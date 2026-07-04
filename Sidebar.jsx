const nav = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'calendar', label: 'Calendar', icon: '📅' },
  { id: 'campaigns', label: 'Campaigns', icon: '🚀' },
  { id: 'documents', label: 'Documents & Links', icon: '📂' },
  { id: 'insights', label: 'Marketing Insights', icon: '📊' }
];

export default function Sidebar({ active, setActive }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logoText">goodcents</div>
        <div className="appName">Content Promotional Calendar</div>
      </div>
      <nav className="nav">
        {nav.map((item) => (
          <button key={item.id} className={active === item.id ? 'active' : ''} onClick={() => setActive(item.id)}>
            <span>{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
