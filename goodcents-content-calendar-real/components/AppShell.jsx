'use client';

import { useEffect, useMemo, useState } from 'react';
import Sidebar from './layout/Sidebar';
import DashboardPage from './dashboard/DashboardPage';
import CalendarPage from './calendar/CalendarPage';
import CampaignsPage from './campaigns/CampaignsPage';
import DocumentsPage from './documents/DocumentsPage';
import InsightsPage from './insights/InsightsPage';
import CampaignModal from './campaigns/CampaignModal';
import CampaignDrawer from './campaigns/CampaignDrawer';
import LinkModal from './documents/LinkModal';
import { initialCampaigns, initialLinks } from '@/lib/sampleData';

const storageKeys = {
  campaigns: 'gc_campaigns_v1',
  links: 'gc_links_v1'
};

export default function AppShell() {
  const [page, setPage] = useState('dashboard');
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [links, setLinks] = useState(initialLinks);
  const [campaignModal, setCampaignModal] = useState(null);
  const [linkModal, setLinkModal] = useState(null);
  const [activeCampaign, setActiveCampaign] = useState(null);

  useEffect(() => {
    const savedCampaigns = localStorage.getItem(storageKeys.campaigns);
    const savedLinks = localStorage.getItem(storageKeys.links);
    if (savedCampaigns) setCampaigns(JSON.parse(savedCampaigns));
    if (savedLinks) setLinks(JSON.parse(savedLinks));
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKeys.campaigns, JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem(storageKeys.links, JSON.stringify(links));
  }, [links]);

  const upsertCampaign = (campaign) => {
    setCampaigns((items) => {
      const exists = items.some((item) => item.id === campaign.id);
      if (exists) return items.map((item) => (item.id === campaign.id ? campaign : item));
      return [{ ...campaign, id: `c-${Date.now()}` }, ...items];
    });
    setCampaignModal(null);
  };

  const deleteCampaign = (id) => {
    setCampaigns((items) => items.filter((item) => item.id !== id));
    setActiveCampaign(null);
  };

  const deleteCampaigns = (ids) => {
    setCampaigns((items) => items.filter((item) => !ids.includes(item.id)));
  };

  const upsertLink = (link) => {
    setLinks((items) => {
      const exists = items.some((item) => item.id === link.id);
      if (exists) return items.map((item) => (item.id === link.id ? link : item));
      return [{ ...link, id: `l-${Date.now()}` }, ...items];
    });
    setLinkModal(null);
  };

  const deleteLink = (id) => setLinks((items) => items.filter((item) => item.id !== id));

  const commonProps = useMemo(() => ({
    campaigns,
    links,
    onCreateCampaign: (date) => setCampaignModal({ mode: 'create', date }),
    onEditCampaign: (campaign) => setCampaignModal({ mode: 'edit', campaign }),
    onOpenCampaign: setActiveCampaign,
    onDeleteCampaign: deleteCampaign,
    onDeleteCampaigns: deleteCampaigns,
    onCreateLink: () => setLinkModal({ mode: 'create' }),
    onEditLink: (link) => setLinkModal({ mode: 'edit', link }),
    onDeleteLink: deleteLink,
    goTo: setPage
  }), [campaigns, links]);

  return (
    <div className="app">
      <Sidebar active={page} setActive={setPage} />
      <main className="main">
        {page === 'dashboard' && <DashboardPage {...commonProps} />}
        {page === 'calendar' && <CalendarPage {...commonProps} />}
        {page === 'campaigns' && <CampaignsPage {...commonProps} />}
        {page === 'documents' && <DocumentsPage {...commonProps} />}
        {page === 'insights' && <InsightsPage {...commonProps} />}
      </main>

      {campaignModal && (
        <CampaignModal
          modal={campaignModal}
          onClose={() => setCampaignModal(null)}
          onSave={upsertCampaign}
        />
      )}

      {linkModal && (
        <LinkModal
          modal={linkModal}
          onClose={() => setLinkModal(null)}
          onSave={upsertLink}
        />
      )}

      {activeCampaign && (
        <CampaignDrawer
          campaign={activeCampaign}
          onClose={() => setActiveCampaign(null)}
          onEdit={() => setCampaignModal({ mode: 'edit', campaign: activeCampaign })}
          onDelete={() => deleteCampaign(activeCampaign.id)}
        />
      )}
    </div>
  );
}
