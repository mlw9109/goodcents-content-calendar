import PageHeader from './PageHeader';

export default function CalendarPage({ campaigns, onCreateCampaign, onViewCampaign, onRefresh }) {
  const days = Array.from({ length: 31 }, (_, index) => index + 1);

  return (
    <>
      <PageHeader title="Calendar" onCreateCampaign={onCreateCampaign} onRefresh={onRefresh} />
      <section className="card">
        <h2>July 2026</h2>
        <p className="helperText">Double click any day to create an item on that date.</p>
        <div className="calendarGrid large">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="weekday">{day}</div>
          ))}
          {days.map((day) => {
            const date = `2026-07-${String(day).padStart(2, '0')}`;
            const items = campaigns.filter((campaign) => campaign.startDate === date);

            return (
              <div key={date} className="calendarDay big" onDoubleClick={() => onCreateCampaign(date)}>
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
    </>
  );
}
