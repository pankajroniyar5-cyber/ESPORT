import React, { useState } from 'react';
import { Megaphone, Award, Plus, Trash2, Globe, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Sponsor, Announcement } from '../../types';

interface AdminSponsorsAnnouncementsProps {
  sponsors: Sponsor[];
  announcements: Announcement[];
  onAddSponsor: (sponsor: Partial<Sponsor>) => Promise<void>;
  onDeleteSponsor: (id: string) => Promise<void>;
  onAddAnnouncement: (announcement: Partial<Announcement>) => Promise<void>;
  onDeleteAnnouncement: (id: string) => Promise<void>;
}

export const AdminSponsorsAnnouncements: React.FC<AdminSponsorsAnnouncementsProps> = ({
  sponsors,
  announcements,
  onAddSponsor,
  onDeleteSponsor,
  onAddAnnouncement,
  onDeleteAnnouncement,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'announcements' | 'sponsors'>('announcements');

  // Announcement state
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annType, setAnnType] = useState<'info' | 'warning' | 'urgent'>('info');

  // Sponsor state
  const [spName, setSpName] = useState('');
  const [spLogo, setSpLogo] = useState('');
  const [spTier, setSpTier] = useState<'Title Sponsor' | 'Powered By' | 'Platinum' | 'Gold' | 'Official Partner'>('Powered By');
  const [spUrl, setSpUrl] = useState('');

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    await onAddAnnouncement({
      title: annTitle.trim(),
      content: annContent.trim(),
      type: annType,
      isActive: true,
      createdAt: new Date().toISOString()
    });

    setAnnTitle('');
    setAnnContent('');
  };

  const handleCreateSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spName.trim() || !spLogo.trim()) return;

    await onAddSponsor({
      name: spName.trim(),
      logoUrl: spLogo.trim(),
      tier: spTier,
      websiteUrl: spUrl.trim() || undefined
    });

    setSpName('');
    setSpLogo('');
    setSpUrl('');
  };

  return (
    <div className="space-y-6">
      
      {/* Tabs */}
      <div className="flex border-b border-neutral-800 space-x-4">
        <button
          onClick={() => setActiveSubTab('announcements')}
          className={`pb-3 font-heading text-sm font-bold uppercase tracking-wider flex items-center space-x-2 transition-colors border-b-2 ${
            activeSubTab === 'announcements'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Live Broadcast Announcements</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sponsors')}
          className={`pb-3 font-heading text-sm font-bold uppercase tracking-wider flex items-center space-x-2 transition-colors border-b-2 ${
            activeSubTab === 'sponsors'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Official Tournament Sponsors</span>
        </button>
      </div>

      {/* Announcements */}
      {activeSubTab === 'announcements' && (
        <div className="space-y-6">
          {/* New Broadcast Form */}
          <div className="esports-glass p-5 rounded-2xl border border-neutral-800">
            <h4 className="font-heading text-sm font-bold uppercase text-amber-400 mb-3 flex items-center space-x-2">
              <Megaphone className="w-4 h-4" />
              <span>Broadcast New Tournament Notice</span>
            </h4>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-tech uppercase text-neutral-400 mb-1">Headline</label>
                  <input
                    type="text"
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    placeholder="e.g. Round 1 Room IDs will be published at 5:45 PM"
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-xs text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-tech uppercase text-neutral-400 mb-1">Urgency Priority</label>
                  <select
                    value={annType}
                    onChange={(e) => setAnnType(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-xs text-white"
                  >
                    <option value="info">🔵 Information</option>
                    <option value="warning">🟡 Warning / Reminder</option>
                    <option value="urgent">🔴 Urgent / Live Alert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-tech uppercase text-neutral-400 mb-1">Notice Details</label>
                <textarea
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Provide complete instructions for participating captains..."
                  rows={2}
                  className="w-full p-2 bg-neutral-900 border border-neutral-700 rounded text-xs text-white"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-heading text-xs font-bold uppercase rounded-lg"
                >
                  Publish Broadcast
                </button>
              </div>
            </form>
          </div>

          {/* Announcements List */}
          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
                  ann.type === 'urgent'
                    ? 'bg-red-950/30 border-red-500/40 text-red-200'
                    : ann.type === 'warning'
                    ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                    : 'bg-blue-950/30 border-blue-500/40 text-blue-200'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-heading text-sm font-bold uppercase">{ann.title}</span>
                    <span className="text-[10px] font-tech uppercase px-2 py-0.2 rounded bg-black/40">
                      {ann.type}
                    </span>
                  </div>
                  <p className="text-xs font-tech mt-1 text-neutral-300">{ann.content}</p>
                  <span className="text-[10px] font-tech text-neutral-500 mt-1 block">
                    Posted on {new Date(ann.createdAt).toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => onDeleteAnnouncement(ann.id)}
                  className="p-1 text-neutral-400 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sponsors */}
      {activeSubTab === 'sponsors' && (
        <div className="space-y-6">
          {/* Add Sponsor Form */}
          <div className="esports-glass p-5 rounded-2xl border border-neutral-800">
            <h4 className="font-heading text-sm font-bold uppercase text-amber-400 mb-3 flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>Add Tournament Partner / Sponsor</span>
            </h4>

            <form onSubmit={handleCreateSponsor} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-tech">
              <div>
                <label className="block text-[10px] text-neutral-400 uppercase mb-1">Sponsor Brand Name</label>
                <input
                  type="text"
                  value={spName}
                  onChange={(e) => setSpName(e.target.value)}
                  placeholder="e.g. HyperX"
                  className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-neutral-400 uppercase mb-1">Logo Image URL</label>
                <input
                  type="url"
                  value={spLogo}
                  onChange={(e) => setSpLogo(e.target.value)}
                  placeholder="https://... logo.png"
                  className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-neutral-400 uppercase mb-1">Sponsorship Tier</label>
                <select
                  value={spTier}
                  onChange={(e) => setSpTier(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-white"
                >
                  <option value="Title Sponsor">Title Sponsor</option>
                  <option value="Powered By">Powered By</option>
                  <option value="Platinum">Platinum Partner</option>
                  <option value="Gold">Gold Partner</option>
                  <option value="Official Partner">Official Partner</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-neutral-400 uppercase mb-1">Website URL (Optional)</label>
                <input
                  type="url"
                  value={spUrl}
                  onChange={(e) => setSpUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-white"
                />
              </div>

              <div className="sm:col-span-4 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-heading text-xs font-bold uppercase rounded-lg"
                >
                  Add Partner
                </button>
              </div>
            </form>
          </div>

          {/* Sponsors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {sponsors.map((sp) => (
              <div
                key={sp.id}
                className="esports-glass p-4 rounded-xl border border-neutral-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded bg-neutral-900 border border-neutral-800 p-1 flex items-center justify-center">
                    <img src={sp.logoUrl} alt={sp.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <span className="text-[10px] font-tech uppercase text-amber-400 font-bold block">{sp.tier}</span>
                    <h5 className="font-heading text-sm font-bold text-white uppercase">{sp.name}</h5>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteSponsor(sp.id)}
                  className="p-1 text-neutral-500 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
