import React, { useState } from 'react';
import { Settings, Trophy, Shield, Calendar, Phone, Save, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { TournamentSettings, RegistrationStatusConfig } from '../../types';

interface AdminTournamentSettingsProps {
  settings: TournamentSettings | null;
  onSaveSettings: (settings: Partial<TournamentSettings>) => Promise<void>;
}

export const AdminTournamentSettings: React.FC<AdminTournamentSettingsProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<TournamentSettings>(settings || {
    id: 'default_settings',
    tournamentName: 'Free Fire Campus Cup 2026',
    subtitle: 'National Collegiate Championship Series',
    season: 'Season 4',
    description: 'The premier collegiate Free Fire esports tournament.',
    logoUrl: '',
    bannerUrl: '',
    registrationStatus: 'OPEN',
    registrationFee: 500,
    currency: 'Rs.',
    maxTeams: 64,
    teamSize: 4,
    substitutesAllowed: 2,
    registrationDeadline: '2026-10-20T23:59:59Z',
    tournamentStartDate: '2026-10-25',
    tournamentEndDate: '2026-10-28',
    prizePool: 'Rs. 50,000',
    prizes: {
      firstPlace: 'Rs. 25,000 + Champion Trophy',
      secondPlace: 'Rs. 15,000 + Silver Trophy',
      thirdPlace: 'Rs. 6,000 + Bronze Medals',
      mvp: 'Rs. 2,500 + Headset',
      highestKills: 'Rs. 1,500'
    },
    rules: [
      'Strict No-Emulator Policy: All matches must be played on handheld mobile phones.',
      'All players must have a minimum Free Fire level 40.'
    ],
    contactWhatsApp: '+91 98012 34567',
    contactPhone: '+91 98012 34567',
    contactEmail: 'esports@campuscup.org',
    updatedAt: new Date().toISOString(),
    updatedBy: 'Admin'
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [newRule, setNewRule] = useState('');

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePrizeChange = (prizeField: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      prizes: {
        ...prev.prizes,
        [prizeField]: value
      }
    }));
  };

  const handleAddRule = () => {
    if (!newRule.trim()) return;
    setFormData((prev) => ({
      ...prev,
      rules: [...prev.rules, newRule.trim()]
    }));
    setNewRule('');
  };

  const handleRemoveRule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, idx) => idx !== index)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await onSaveSettings(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      alert(err.message || 'Error updating tournament settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      
      {/* Save action bar top */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h3 className="font-heading text-xl font-bold uppercase tracking-wider text-white">
            Tournament System Settings
          </h3>
          <p className="text-xs text-neutral-400 font-tech">
            Control global branding, registration caps, fees, prize pool, and WhatsApp contact details.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {savedSuccess && (
            <span className="text-xs font-tech text-emerald-400 flex items-center space-x-1 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings Saved & Applied Live!</span>
            </span>
          )}

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-heading text-xs font-bold uppercase tracking-wider rounded-xl flex items-center space-x-2 transition-all shadow-lg shadow-amber-500/20"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>

      {/* 1. General Tournament Identity */}
      <div className="esports-glass p-6 rounded-2xl border border-neutral-800 space-y-4">
        <h4 className="font-heading text-sm font-bold uppercase text-amber-400 tracking-wider flex items-center space-x-2">
          <Trophy className="w-4 h-4" />
          <span>General Identity & Branding</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-tech uppercase text-neutral-300 mb-1">
              Tournament Name
            </label>
            <input
              type="text"
              value={formData.tournamentName}
              onChange={(e) => handleChange('tournamentName', e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-tech uppercase text-neutral-300 mb-1">
              Subtitle / Edition
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-tech uppercase text-neutral-300 mb-1">
              Season Identifier
            </label>
            <input
              type="text"
              value={formData.season}
              onChange={(e) => handleChange('season', e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-tech uppercase text-neutral-300 mb-1">
            Tournament Synopsis / Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={2}
            className="w-full p-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* 2. Registration Controls & Limits */}
      <div className="esports-glass p-6 rounded-2xl border border-neutral-800 space-y-4">
        <h4 className="font-heading text-sm font-bold uppercase text-amber-400 tracking-wider flex items-center space-x-2">
          <Shield className="w-4 h-4" />
          <span>Registration Rules & Financial Parameters</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-tech uppercase text-neutral-300 mb-1">
              Registration Status
            </label>
            <select
              value={formData.registrationStatus}
              onChange={(e) => handleChange('registrationStatus', e.target.value as RegistrationStatusConfig)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
            >
              <option value="OPEN">🟢 OPEN (Accepting Squads)</option>
              <option value="CLOSED">🔴 CLOSED</option>
              <option value="FULL">🟡 FULL (Capacity Reached)</option>
              <option value="NOT_STARTED">⚪ NOT STARTED (Coming Soon)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-tech uppercase text-neutral-300 mb-1">
              Registration Fee ({formData.currency || 'Rs.'})
            </label>
            <input
              type="number"
              value={formData.registrationFee}
              onChange={(e) => handleChange('registrationFee', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400 font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-tech uppercase text-neutral-300 mb-1">
              Maximum Squad Capacity
            </label>
            <input
              type="number"
              value={formData.maxTeams}
              onChange={(e) => handleChange('maxTeams', parseInt(e.target.value) || 64)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400 font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-tech uppercase text-neutral-300 mb-1">
              Total Prize Pool
            </label>
            <input
              type="text"
              value={formData.prizePool}
              onChange={(e) => handleChange('prizePool', e.target.value)}
              placeholder="e.g. Rs. 50,000"
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-tech uppercase text-neutral-300 mb-1">
              Registration Deadline
            </label>
            <input
              type="date"
              value={formData.registrationDeadline ? formData.registrationDeadline.split('T')[0] : ''}
              onChange={(e) => handleChange('registrationDeadline', `${e.target.value}T23:59:59Z`)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-tech uppercase text-neutral-300 mb-1">
              Tournament Start Date
            </label>
            <input
              type="date"
              value={formData.tournamentStartDate || ''}
              onChange={(e) => handleChange('tournamentStartDate', e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-tech uppercase text-neutral-300 mb-1">
              Tournament Grand Finals Date
            </label>
            <input
              type="date"
              value={formData.tournamentEndDate || ''}
              onChange={(e) => handleChange('tournamentEndDate', e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* 3. Prize Breakdown */}
      <div className="esports-glass p-6 rounded-2xl border border-neutral-800 space-y-4">
        <h4 className="font-heading text-sm font-bold uppercase text-amber-400 tracking-wider">
          Prize Distribution Breakdown
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-tech uppercase text-neutral-300 mb-1">1st Place Award</label>
            <input
              type="text"
              value={formData.prizes?.firstPlace || ''}
              onChange={(e) => handlePrizeChange('firstPlace', e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-tech uppercase text-neutral-300 mb-1">2nd Place Award</label>
            <input
              type="text"
              value={formData.prizes?.secondPlace || ''}
              onChange={(e) => handlePrizeChange('secondPlace', e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-tech uppercase text-neutral-300 mb-1">3rd Place Award</label>
            <input
              type="text"
              value={formData.prizes?.thirdPlace || ''}
              onChange={(e) => handlePrizeChange('thirdPlace', e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-tech uppercase text-neutral-300 mb-1">MVP Award</label>
            <input
              type="text"
              value={formData.prizes?.mvp || ''}
              onChange={(e) => handlePrizeChange('mvp', e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-tech uppercase text-neutral-300 mb-1">Top Fragger (Highest Kills)</label>
            <input
              type="text"
              value={formData.prizes?.highestKills || ''}
              onChange={(e) => handlePrizeChange('highestKills', e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-tech uppercase text-neutral-300 mb-1">Special Clutch Award</label>
            <input
              type="text"
              value={formData.prizes?.specialAwards || ''}
              onChange={(e) => handlePrizeChange('specialAwards', e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* 4. Official Contacts */}
      <div className="esports-glass p-6 rounded-2xl border border-neutral-800 space-y-4">
        <h4 className="font-heading text-sm font-bold uppercase text-amber-400 tracking-wider flex items-center space-x-2">
          <Phone className="w-4 h-4" />
          <span>Organizer Contacts & Dynamic WhatsApp Links</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-tech uppercase text-neutral-300 mb-1">
              WhatsApp Helpline Number (with country code)
            </label>
            <input
              type="text"
              value={formData.contactWhatsApp || ''}
              onChange={(e) => handleChange('contactWhatsApp', e.target.value)}
              placeholder="+91 98012 34567"
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-tech uppercase text-neutral-300 mb-1">
              Support Phone
            </label>
            <input
              type="text"
              value={formData.contactPhone || ''}
              onChange={(e) => handleChange('contactPhone', e.target.value)}
              placeholder="+91 98012 34567"
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-tech uppercase text-neutral-300 mb-1">
              Official Email
            </label>
            <input
              type="email"
              value={formData.contactEmail || ''}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
              placeholder="esports@campuscup.org"
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* 5. Tournament Rulebook Items */}
      <div className="esports-glass p-6 rounded-2xl border border-neutral-800 space-y-4">
        <h4 className="font-heading text-sm font-bold uppercase text-amber-400 tracking-wider">
          Official Rules & Regulations
        </h4>

        <div className="space-y-2">
          {formData.rules.map((rule, idx) => (
            <div key={idx} className="flex items-center space-x-2 p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-tech text-neutral-200">
              <span className="w-5 h-5 rounded-full bg-neutral-800 text-amber-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                {idx + 1}
              </span>
              <span className="flex-1">{rule}</span>
              <button
                type="button"
                onClick={() => handleRemoveRule(idx)}
                className="p-1 text-neutral-500 hover:text-red-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <input
            type="text"
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            placeholder="Type a new rule and press Add Rule..."
            className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
          />
          <button
            type="button"
            onClick={handleAddRule}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded-lg text-xs font-tech font-bold uppercase tracking-wider"
          >
            Add Rule
          </button>
        </div>
      </div>

      {/* Bottom Save Action */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-heading text-sm font-bold uppercase tracking-wider rounded-xl flex items-center space-x-2 transition-all shadow-xl shadow-amber-500/20"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Apply Changes Globally'}</span>
        </button>
      </div>

    </form>
  );
};
