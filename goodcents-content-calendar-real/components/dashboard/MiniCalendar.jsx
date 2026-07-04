import { currentMonthDays, toISO } from '@/lib/dateUtils';
import { holidays, typeMeta } from '@/lib/constants';

export default function MiniCalendar({ campaigns, onOpenCampaign }) {
  const now = new Date();
  const days = currentMonthDays(now);
  const names = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  return (
    <div className="card">
      <div className="calendarTop"><h2>{now.toLocaleDateString('en-US', { month:'long', year:'numeric' })}</h2></div>
      <div className="calendarScroll">
        <div className="calendarGrid">
          {names.map((name) => <div className="dayName" key={name}>{name}</div>)}
          {days.map((day, index) => {
            if (!day) return <div className="day empty" key={index} />;
            const iso = toISO(day);
            const dayCampaigns = campaigns.filter((c) => c.startDate === iso);
            const dayHolidays = holidays.filter((h) => h.date === iso);
            return (
              <div className="day" key={iso}>
                <div className="dayNum">{day.getDate()}</div>
                {dayHolidays.map((h) => <div className="eventChip holidayChip" key={h.name}>{h.name}</div>)}
                {dayCampaigns.slice(0,3).map((campaign) => {
                  const meta = typeMeta[campaign.type] || typeMeta.Other;
                  return <button key={campaign.id} onClick={() => onOpenCampaign(campaign)} className="eventChip" style={{ background: meta.soft, color: meta.color }}>{campaign.name}</button>;
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
