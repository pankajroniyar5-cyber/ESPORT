import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  QrCode, 
  Settings, 
  Trophy, 
  Calendar, 
  Megaphone, 
  TrendingUp, 
  Archive, 
  ShieldCheck, 
  LogOut, 
  RefreshCw,
  FileSpreadsheet,
  Download,
  AlertCircle
} from 'lucide-react';
import { 
  AdminUser, 
  Registration, 
  TournamentSettings, 
  PaymentQrConfig, 
  LeaderboardTeam, 
  MatchSchedule, 
  Sponsor, 
  Announcement,
  AuditLogEntry,
  RegistrationStatus,
  PaymentStatus 
} from '../../types';

import { AdminDashboard } from './AdminDashboard';
import { AdminRegistrations } from './AdminRegistrations';
import { AdminPaymentVerification } from './AdminPaymentVerification';
import { AdminQRSettings } from './AdminQRSettings';
import { AdminTournamentSettings } from './AdminTournamentSettings';
import { AdminLeaderboardMatches } from './AdminLeaderboardMatches';
import { AdminSponsorsAnnouncements } from './AdminSponsorsAnnouncements';
import { AdminAnalytics } from './AdminAnalytics';
import { AdminArchived } from './AdminArchived';
import { AdminAuditLogs } from './AdminAuditLogs';
import { RegistrationDetailModal } from './RegistrationDetailModal';

interface AdminPortalProps {
  adminToken: string;
  adminUser: AdminUser;
  onLogout: () => void;
  onViewPublicSite: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  adminToken,
  adminUser,
  onLogout,
  onViewPublicSite,
}) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Core Data
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [archivedRegistrations, setArchivedRegistrations] = useState<Registration[]>([]);
  const [settings, setSettings] = useState<TournamentSettings | null>(null);
  const [qrConfigs, setQrConfigs] = useState<PaymentQrConfig[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardTeam[]>([]);
  const [matches, setMatches] = useState<MatchSchedule[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  // Detail modal state
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load all admin data
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    const headers = {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    };

    try {
      const [
        regsRes,
        archivedRes,
        settRes,
        qrRes,
        lbRes,
        matchRes,
        sponRes,
        annRes,
        analyticsRes,
        logsRes
      ] = await Promise.all([
        fetch('/api/admin/registrations', { headers }),
        fetch('/api/admin/registrations/archived', { headers }),
        fetch('/api/tournament/settings'),
        fetch('/api/tournament/payment-qr/all', { headers }),
        fetch('/api/tournament/leaderboard'),
        fetch('/api/tournament/schedule'),
        fetch('/api/tournament/sponsors'),
        fetch('/api/tournament/announcements'),
        fetch('/api/admin/analytics', { headers }),
        fetch('/api/admin/audit-logs', { headers })
      ]);

      if (regsRes.status === 401) {
        onLogout();
        return;
      }

      const safeJson = async (res: Response, defaultVal: any = {}) => {
        try {
          if (!res.ok) return defaultVal;
          const ct = res.headers.get('content-type');
          if (!ct || !ct.includes('application/json')) return defaultVal;
          return await res.json();
        } catch {
          return defaultVal;
        }
      };

      const regsData = await safeJson(regsRes, {});
      const archivedData = await safeJson(archivedRes, {});
      const settData = await safeJson(settRes, null);
      const qrData = await safeJson(qrRes, {});
      const lbData = await safeJson(lbRes, {});
      const matchData = await safeJson(matchRes, {});
      const sponData = await safeJson(sponRes, {});
      const annData = await safeJson(annRes, {});
      const analyticsData = await safeJson(analyticsRes, null);
      const logsData = await safeJson(logsRes, {});

      setRegistrations(regsData.registrations || regsData.items || []);
      setArchivedRegistrations(archivedData.archived || []);
      if (settData) setSettings(settData);
      setQrConfigs(qrData.qrConfigs || []);
      setLeaderboard(lbData.leaderboard || []);
      setMatches(matchData.matches || []);
      setSponsors(sponData.sponsors || []);
      setAnnouncements(annData.announcements || []);
      if (analyticsData) setAnalytics(analyticsData);
      setAuditLogs(logsData.logs || []);
    } catch (err: any) {
      setError(err.message || 'Error fetching admin records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [adminToken]);

  // Handler: Update status
  const handleUpdateStatus = async (
    id: string,
    regStatus?: RegistrationStatus,
    payStatus?: PaymentStatus,
    reason?: string
  ) => {
    try {
      const res = await fetch(`/api/admin/registrations/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          registrationStatus: regStatus,
          paymentStatus: payStatus,
          rejectionReason: reason
        })
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to update status');
      }

      const updated = await res.json();
      setRegistrations(prev => prev.map(r => r.id === id ? updated.registration : r));
      if (selectedReg && selectedReg.id === id) {
        setSelectedReg(updated.registration);
      }

      // Refresh analytics
      fetch('/api/admin/analytics', { headers: { 'Authorization': `Bearer ${adminToken}` } })
        .then(r => r.json())
        .then(d => setAnalytics(d));
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    }
  };

  // Handler: Add note
  const handleAddNote = async (id: string, text: string) => {
    try {
      const res = await fetch(`/api/admin/registrations/${id}/notes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });

      if (!res.ok) throw new Error('Failed to add note');
      const updated = await res.json();
      setRegistrations(prev => prev.map(r => r.id === id ? updated.registration : r));
      if (selectedReg && selectedReg.id === id) {
        setSelectedReg(updated.registration);
      }
    } catch (err: any) {
      alert(err.message || 'Error adding note');
    }
  };

  // Handler: Archive (soft-delete)
  const handleArchive = async (id: string, reason: string) => {
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });

      if (!res.ok) throw new Error('Failed to archive registration');
      fetchAllData();
    } catch (err: any) {
      alert(err.message || 'Error archiving registration');
    }
  };

  // Handler: Restore
  const handleRestore = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/registrations/${id}/restore`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) throw new Error('Failed to restore registration');
      fetchAllData();
    } catch (err: any) {
      alert(err.message || 'Error restoring registration');
    }
  };

  // Handler: Save Settings
  const handleSaveSettings = async (newSettings: Partial<TournamentSettings>) => {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newSettings)
    });

    if (!res.ok) throw new Error('Failed to save settings');
    const data = await res.json();
    setSettings(data.settings);
  };

  // Handler: Add QR
  const handleAddQr = async (qr: Partial<PaymentQrConfig>, file?: File) => {
    if (file) {
      const formData = new FormData();
      formData.append('qrFile', file);
      formData.append('method', qr.method || '');
      formData.append('accountName', qr.accountName || '');
      formData.append('upiId', qr.upiId || '');
      formData.append('instructions', qr.instructions || '');

      const res = await fetch('/api/admin/payment-qr/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${adminToken}` },
        body: formData
      });

      if (!res.ok) throw new Error('Failed to upload QR');
      const data = await res.json();
      setQrConfigs(prev => [...prev, data.qrConfig]);
    } else {
      const res = await fetch('/api/admin/payment-qr', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(qr)
      });

      if (!res.ok) throw new Error('Failed to save QR');
      const data = await res.json();
      setQrConfigs(prev => [...prev, data.qrConfig]);
    }
  };

  // Handler: Set Active QR
  const handleSetActiveQr = async (id: string) => {
    const res = await fetch(`/api/admin/payment-qr/${id}/active`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    if (!res.ok) throw new Error('Failed to activate QR');
    const data = await res.json();
    setQrConfigs(data.qrConfigs);
  };

  // Handler: Delete QR
  const handleDeleteQr = async (id: string) => {
    const res = await fetch(`/api/admin/payment-qr/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    if (!res.ok) throw new Error('Failed to delete QR');
    setQrConfigs(prev => prev.filter(q => q.id !== id));
  };

  // Handler: Save Leaderboard Team
  const handleSaveLeaderboardTeam = async (team: Partial<LeaderboardTeam>) => {
    const res = await fetch('/api/admin/leaderboard', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(team)
    });

    if (!res.ok) throw new Error('Failed to save leaderboard score');
    const data = await res.json();
    setLeaderboard(data.leaderboard);
  };

  // Handler: Delete Leaderboard Team
  const handleDeleteLeaderboardTeam = async (id: string) => {
    const res = await fetch(`/api/admin/leaderboard/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    if (!res.ok) throw new Error('Failed to delete team from leaderboard');
    setLeaderboard(prev => prev.filter(t => t.id !== id));
  };

  // Handler: Save Match
  const handleSaveMatch = async (match: Partial<MatchSchedule>) => {
    const res = await fetch('/api/admin/schedule', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(match)
    });

    if (!res.ok) throw new Error('Failed to save match schedule');
    const data = await res.json();
    setMatches(data.matches);
  };

  // Handler: Delete Match
  const handleDeleteMatch = async (id: string) => {
    const res = await fetch(`/api/admin/schedule/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    if (!res.ok) throw new Error('Failed to delete match');
    setMatches(prev => prev.filter(m => m.id !== id));
  };

  // Handler: Add Sponsor
  const handleAddSponsor = async (sponsor: Partial<Sponsor>) => {
    const res = await fetch('/api/admin/sponsors', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sponsor)
    });

    if (!res.ok) throw new Error('Failed to add sponsor');
    const data = await res.json();
    setSponsors(data.sponsors);
  };

  // Handler: Delete Sponsor
  const handleDeleteSponsor = async (id: string) => {
    const res = await fetch(`/api/admin/sponsors/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    if (!res.ok) throw new Error('Failed to delete sponsor');
    setSponsors(prev => prev.filter(s => s.id !== id));
  };

  // Handler: Add Announcement
  const handleAddAnnouncement = async (ann: Partial<Announcement>) => {
    const res = await fetch('/api/admin/announcements', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ann)
    });

    if (!res.ok) throw new Error('Failed to broadcast announcement');
    const data = await res.json();
    setAnnouncements(data.announcements);
  };

  // Handler: Delete Announcement
  const handleDeleteAnnouncement = async (id: string) => {
    const res = await fetch(`/api/admin/announcements/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    if (!res.ok) throw new Error('Failed to delete announcement');
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  // Handler: Export CSV
  const handleExportCsv = () => {
    window.open(`/api/admin/export/csv?token=${encodeURIComponent(adminToken)}`, '_blank');
  };

  // Handler: Export JSON
  const handleExportJson = () => {
    window.open(`/api/admin/export/json?token=${encodeURIComponent(adminToken)}`, '_blank');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'registrations', label: `Registrations (${registrations.length})`, icon: Users },
    { id: 'payments', label: `Payment Audit (${analytics?.pendingPayments || 0})`, icon: CreditCard },
    { id: 'qr', label: 'Payment QR', icon: QrCode },
    { id: 'settings', label: 'Tournament Settings', icon: Settings },
    { id: 'leaderboard', label: 'Scores & Matches', icon: Trophy },
    { id: 'announcements', label: 'Notices & Sponsors', icon: Megaphone },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'archived', label: `Archived (${archivedRegistrations.length})`, icon: Archive },
    { id: 'logs', label: 'Audit Trail', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-40 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-heading font-bold text-sm">
              FF
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading text-sm font-bold uppercase tracking-wider text-white">
                  Tournament Control Hub
                </span>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-tech font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {adminUser.role}
                </span>
              </div>
              <span className="text-[10px] font-tech text-neutral-400">
                Logged in as <strong className="text-neutral-200">{adminUser.name}</strong> ({adminUser.email})
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={fetchAllData}
              className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onViewPublicSite}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-tech transition-colors"
            >
              Public Site
            </button>

            <button
              onClick={onLogout}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-700/60 text-red-200 text-xs font-tech transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Body with Tabbed Nav */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex overflow-x-auto pb-2 border-b border-neutral-800 gap-1.5 scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-heading font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-neutral-950 shadow-md font-bold'
                    : 'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content View Switching */}
        <div>
          {activeTab === 'dashboard' && (
            <AdminDashboard
              analytics={analytics}
              recentRegistrations={registrations.slice(0, 5)}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenDetailModal={(reg) => { setSelectedReg(reg); setIsModalOpen(true); }}
              onVerifyPayment={(id) => handleUpdateStatus(id, undefined, 'Verified', 'Quick verified from dashboard')}
            />
          )}

          {activeTab === 'registrations' && (
            <AdminRegistrations
              registrations={registrations}
              onOpenDetailModal={(reg) => { setSelectedReg(reg); setIsModalOpen(true); }}
              onUpdateStatus={handleUpdateStatus}
              onArchive={handleArchive}
              onExportCsv={handleExportCsv}
              onExportJson={handleExportJson}
            />
          )}

          {activeTab === 'payments' && (
            <AdminPaymentVerification
              registrations={registrations}
              onVerifyPayment={(id) => handleUpdateStatus(id, undefined, 'Verified', 'Payment verified in audit queue')}
              onRejectPayment={(id, reason) => handleUpdateStatus(id, undefined, 'Rejected', reason)}
              onOpenDetailModal={(reg) => { setSelectedReg(reg); setIsModalOpen(true); }}
            />
          )}

          {activeTab === 'qr' && (
            <AdminQRSettings
              qrConfigs={qrConfigs}
              onAddQr={handleAddQr}
              onSetActive={handleSetActiveQr}
              onDeleteQr={handleDeleteQr}
            />
          )}

          {activeTab === 'settings' && (
            <AdminTournamentSettings
              settings={settings}
              onSaveSettings={handleSaveSettings}
            />
          )}

          {activeTab === 'leaderboard' && (
            <AdminLeaderboardMatches
              leaderboard={leaderboard}
              matches={matches}
              onSaveLeaderboardTeam={handleSaveLeaderboardTeam}
              onDeleteLeaderboardTeam={handleDeleteLeaderboardTeam}
              onSaveMatch={handleSaveMatch}
              onDeleteMatch={handleDeleteMatch}
            />
          )}

          {activeTab === 'announcements' && (
            <AdminSponsorsAnnouncements
              sponsors={sponsors}
              announcements={announcements}
              onAddSponsor={handleAddSponsor}
              onDeleteSponsor={handleDeleteSponsor}
              onAddAnnouncement={handleAddAnnouncement}
              onDeleteAnnouncement={handleDeleteAnnouncement}
            />
          )}

          {activeTab === 'analytics' && (
            <AdminAnalytics
              analytics={analytics}
              registrations={registrations}
            />
          )}

          {activeTab === 'archived' && (
            <AdminArchived
              archivedRegistrations={archivedRegistrations}
              onRestore={handleRestore}
            />
          )}

          {activeTab === 'logs' && (
            <AdminAuditLogs
              auditLogs={auditLogs}
            />
          )}
        </div>

      </div>

      {/* Registration Detail Modal */}
      <RegistrationDetailModal
        registration={selectedReg}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedReg(null); }}
        onUpdateStatus={handleUpdateStatus}
        onAddNote={handleAddNote}
        onArchive={handleArchive}
      />

    </div>
  );
};
