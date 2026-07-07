export default function MiniCalendar({ campaigns, onViewCampaign }) {
  const days = Array.from({ length: 31 }, (_, index) => index + 1);

  return (
    <section className="card miniCalendarCard">
      <h2>July 2026</h2>
      <div className="calendarGrid small">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="weekday">{day}</div>
        ))}
        {days.map((day) => {
          const date = `2026-07-${String(day).padStart(2, '0')}`;
          const items = campaigns.filter((campaign) => campaign.startDate === date);

          return (
            <div key={date} className="calendarDay">
              <strong>{day}</strong>
              {date === '2026-07-04' && <span className="holiday">Independence Day</span>}
              {items.map((item) => (
                <button key={item.id} className="miniEvent" onClick={() => onViewCampaign(item)}>
                  {item.name}
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}
