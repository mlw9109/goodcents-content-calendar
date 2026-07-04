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
import { supabase, hasSupabaseConfig } from '@/lib/supabaseClient';

function dbCampaignToApp(row, assetRows = []) {
  return {
    id: row.id,
    name: row.title || '',
    type: row.campaign_type || 'Promotion',
    startDate: row.start_date,
    endDate: row.end_date || row.start_date,
    notes: row.notes || row.description || '',
    assets: assetRows.filter((asset) => asset.campaign_id === row.id).map((asset) => asset.asset_type),
    fields: {}
  };
}

function appCampaignToDb(campaign) {
  return {
    title: campaign.name,
    campaign_type: campaign.type,
    start_date: campaign.startDate,
    end_date: campaign.endDate || campaign.startDate,
    description: campaign.description || '',
    notes: campaign.notes || '',
    owner: 'Marketing',
    status: campaign.status || 'planned',
    color: campaign.color || null,
    updated_at: new Date().toISOString()
  };
}

function dbDocumentToApp(row) {
  return {
    id: row.id,
    name: row.title || '',
    url: row.url || '',
    description: row.description || ''
  };
}

function appLinkToDb(link) {
  return {
    title: link.name,
    url: link.url,
    description: link.description || '',
    updated_at: new Date().toISOString()
  };
}

export default function AppShell() {
  const [page, setPage] = useState('dashboard');
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [links, setLinks] = useState(initialLinks);
  const [campaignModal, setCampaignModal] = useState(null);
  const [linkModal, setLinkModal] = useState(null);
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState(hasSupabaseConfig ? 'Connecting to Supabase...' : 'Demo mode');

  const loadData = async () => {
    if (!hasSupabaseConfig || !supabase) {
      setLoading(false);
      setSyncStatus('Demo mode');
      return;
    }

    setLoading(true);
    const [campaignResult, assetResult, documentResult] = await Promise.all([
      supabase.from('campaigns').select('*').order('start_date', { ascending: true }),
      supabase.from('campaign_assets').select('*'),
      supabase.from('documents').select('*').order('created_at', { ascending: false })
    ]);

    if (campaignResult.error || assetResult.error || documentResult.error) {
      console.error('Supabase load error', campaignResult.error || assetResult.error || documentResult.error);
      setSyncStatus('Supabase connected, but database access needs policies.');
      setLoading(false);
      return;
    }

    const assetRows = assetResult.data || [];
    setCampaigns((campaignResult.data || []).map((row) => dbCampaignToApp(row, assetRows)));
    setLinks((documentResult.data || []).map(dbDocumentToApp));
    setSyncStatus('Synced with Supabase');
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const upsertCampaign = async (campaign) => {
    if (!hasSupabaseConfig || !supabase) {
      setCampaigns((items) => {
        const exists = items.some((item) => item.id === campaign.id);
        if (exists) return items.map((item) => (item.id === campaign.id ? campaign : item));
        return [{ ...campaign, id: `c-${Date.now()}` }, ...items];
      });
      setCampaignModal(null);
      return;
    }

    const payload = appCampaignToDb(campaign);
    const query = campaign.id
      ? supabase.from('campaigns').update(payload).eq('id', campaign.id).select().single()
      : supabase.from('campaigns').insert(payload).select().single();

    const { data, error } = await query;
    if (error) {
      console.error(error);
      alert('This item could not be saved. Check Supabase table policies.');
      return;
    }

    await supabase.from('campaign_assets').delete().eq('campaign_id', data.id);
    if (campaign.assets?.length) {
      await supabase.from('campaign_assets').insert(
        campaign.assets.map((asset) => ({ campaign_id: data.id, asset_type: asset }))
      );
    }

    setCampaignModal(null);
    await loadData();
  };

  const deleteCampaign = async (id) => {
    if (hasSupabaseConfig && supabase) {
      const { error } = await supabase.from('campaigns').delete().eq('id', id);
      if (error) {
        console.error(error);
        alert('This item could not be deleted. Check Supabase table policies.');
        return;
      }
      await loadData();
    } else {
      setCampaigns((items) => items.filter((item) => item.id !== id));
    }
    setActiveCampaign(null);
  };

  const deleteCampaigns = async (ids) => {
    if (hasSupabaseConfig && supabase) {
      const { error } = await supabase.from('campaigns').delete().in('id', ids);
      if (error) {
        console.error(error);
        alert('These items could not be deleted. Check Supabase table policies.');
        return;
      }
      await loadData();
    } else {
      setCampaigns((items) => items.filter((item) => !ids.includes(item.id)));
    }
  };

  const upsertLink = async (link) => {
    if (!hasSupabaseConfig || !supabase) {
      setLinks((items) => {
        const exists = items.some((item) => item.id === link.id);
        if (exists) return items.map((item) => (item.id === link.id ? link : item));
        return [{ ...link, id: `l-${Date.now()}` }, ...items];
      });
      setLinkModal(null);
      return;
    }

    const payload = appLinkToDb(link);
    const query = link.id
      ? supabase.from('documents').update(payload).eq('id', link.id).select().single()
      : supabase.from('documents').insert(payload).select().single();

    const { error } = await query;
    if (error) {
      console.error(error);
      alert('This link could not be saved. Check Supabase table policies.');
      return;
    }

    setLinkModal(null);
    await loadData();
  };

  const deleteLink = async (id) => {
    if (hasSupabaseConfig && supabase) {
      const { error } = await supabase.from('documents').delete().eq('id', id);
      if (error) {
        console.error(error);
        alert('This link could not be deleted. Check Supabase table policies.');
        return;
      }
      await loadData();
    } else {
      setLinks((items) => items.filter((item) => item.id !== id));
    }
  };

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
    goTo: setPage,
    loading,
    syncStatus
  }), [campaigns, links, loading, syncStatus]);

  return (
    <div className="app">
      <Sidebar active={page} setActive={setPage} />
      <main className="main">
        <div className="syncStatus">{syncStatus}</div>
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
