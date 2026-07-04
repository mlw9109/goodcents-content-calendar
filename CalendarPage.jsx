'use client';

import { useMemo, useState } from 'react';
import { currentMonthDays, monthName, toISO } from '@/lib/dateUtils';
import { holidays, typeMeta } from '@/lib/constants';
import DayModal from './DayModal';

export default function CalendarPage({ campaigns, onCreateCampaign, onOpenCampaign, onEditCampaign, onDeleteCampaigns }) {
  const [month, setMonth] = useState(new Date());
  const [dayModal, setDayModal] = useState(null);
  const days = useMemo(() => currentMonthDays(month), [month]);
  const names = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const moveMonth = (amount) => {
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + amount, 1));
  };

  return (
    <div className="grid">
      <div className="headerRow">
        <div>
          <h1>{monthName(month)}</h1>
          <p className="subtle">Click a day to view, add, edit, or delete calendar items.</p>
        </div>
        <div className="cardActions">
          <button className="btn ghost" onClick={() => moveMonth(-1)}>← Previous</button>
          <button className="btn" onClick={() => setMonth(new Date())}>Current Month</button>
          <button className="btn ghost" onClick={() => moveMonth(1)}>Next →</button>
          <button className="btn primary" onClick={() => onCreateCampaign()}>+ Create Item</button>
        </div>
      </div>

      <div className="card">
        <div className="calendarScroll">
          <div className="calendarGrid">
            {names.map((name) => <div className="dayName" key={name}>{name}</div>)}
            {days.map((day, index) => {
              if (!day) return <div className="day empty" key={index} />;
              const iso = toISO(day);
              const dayCampaigns = campaigns.filter((c) => c.startDate === iso);
              const dayHolidays = holidays.filter((h) => h.date === iso);
              return (
                <button className="day" key={iso} onClick={() => setDayModal({ date: iso, campaigns: dayCampaigns })} style={{ textAlign:'left' }}>
                  <div className="dayNum">{day.getDate()}</div>
                  {dayHolidays.map((h) => <div className="eventChip holidayChip" key={h.name}>{h.name}</div>)}
                  {dayCampaigns.slice(0,4).map((campaign) => {
                    const meta = typeMeta[campaign.type] || typeMeta.Other;
                    return <div key={campaign.id} className="eventChip" style={{ background: meta.soft, color: meta.color }}>{campaign.name}</div>;
                  })}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {dayModal && (
        <DayModal
          day={dayModal}
          onClose={() => setDayModal(null)}
          onCreate={() => { onCreateCampaign(dayModal.date); setDayModal(null); }}
          onOpen={onOpenCampaign}
          onEdit={onEditCampaign}
          onDeleteCampaigns={onDeleteCampaigns}
        />
      )}
    </div>
  );
}
