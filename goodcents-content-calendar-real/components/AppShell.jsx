'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Sidebar from './v2/Sidebar';
import DashboardPage from './v2/DashboardPage';
import CalendarPage from './v2/CalendarPage';
import CampaignsPage from './v2/CampaignsPage';
import DocumentsPage from './v2/DocumentsPage';
import InsightsPage from './v2/InsightsPage';
import CampaignModal from './v2/CampaignModal';
import CampaignDrawer from './v2/CampaignDrawer';
import { dbCampaignToApp, appCampaignToDb, todayIso } from './v2/campaignUtils';

export default function AppShell() {
  const [page, setPage] = useState('dashboard');
  const [campaigns, setCampaigns] = useState([]);
  const [links, setLinks] = useState([]);
  const [campaignModal, setCampaignModal] = useState(null);
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const loadCampaigns = async () => {
    setLoading(true);
    setLoadError('');

    if (!supabase) {
      setLoadError('Supabase is not connected. Check .env.local.');
      setCampaigns([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) {
      console.error('Error loading campaigns:', error);
      setLoadError(error.message || 'Unable to load campaigns.');
      setCampaigns([]);
      setLoading(false);
      return;
    }

    setCampaigns((data || []).map(dbCampaignToApp));
    setLoading(false);
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const upcomingCampaigns = useMemo(() => {
    const today = todayIso();

    return campaigns
      .filter((campaign) => campaign.startDate >= today)
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [campaigns]);

  const saveCampaign = async (campaign) => {
    if (!campaign.name?.trim()) {
      alert('Item name is required.');
      return;
    }

    if (!supabase) {
      alert('Supabase is not connected.');
      return;
    }

    const payload = appCampaignToDb(campaign);

    if (campaign.id) {
      const { data, error } = await supabase
        .from('campaigns')
        .update(payload)
        .eq('id', campaign.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating campaign:', error);
        alert(`There was an error updating this item: ${error.message}`);
        return;
      }

      const updated = dbCampaignToApp(data);
      setCampaigns((items) => items.map((item) => (item.id === updated.id ? updated : item)));
      setActiveCampaign(updated);
    } else {
      const { data, error } = await supabase
        .from('campaigns')
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.error('Error saving campaign:', error);
        alert(`There was an error saving this item: ${error.message}`);
        return;
      }

      setCampaigns((items) => [...items, dbCampaignToApp(data)].sort((a, b) => a.startDate.localeCompare(b.startDate)));
    }

    setCampaignModal(null);
  };

  const deleteCampaign = async (id) => {
    if (!confirm('Delete this item?')) return;

    if (!supabase) {
      alert('Supabase is not connected.');
      return;
    }

    const { error } = await supabase.from('campaigns').delete().eq('id', id);

    if (error) {
      console.error('Error deleting campaign:', error);
      alert(`There was an error deleting this item: ${error.message}`);
      return;
    }

    setCampaigns((items) => items.filter((item) => item.id !== id));
    setActiveCampaign(null);
  };

  const commonProps = {
    campaigns,
    upcomingCampaigns,
    links,
    setLinks,
    loading,
    loadError,
    onRefresh: loadCampaigns,
    onCreateCampaign: (date) => setCampaignModal({ mode: 'create', date }),
    onEditCampaign: (campaign) => setCampaignModal({ mode: 'edit', campaign }),
    onViewCampaign: setActiveCampaign,
    setPage,
  };

  return (
    <div className="appShell">
      <Sidebar page={page} setPage={setPage} />

      <main className="mainContent">
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
          onSave={saveCampaign}
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
