import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Flame, 
  Calendar, 
  ShieldCheck, 
  Users, 
  Search, 
  MessageSquare, 
  AlertCircle, 
  Clock, 
  Award,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Zap,
  HelpCircle,
  Megaphone
} from 'lucide-react';

import { 
  TournamentSettings, 
  PaymentQrConfig, 
  Announcement, 
  LeaderboardTeam, 
  MatchSchedule, 
  Sponsor,
  AdminUser 
} from './types';

import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { RegistrationWizard } from './components/RegistrationWizard';
import { TrackRegistration } from './components/TrackRegistration';
import { LeaderboardView } from './components/LeaderboardView';
import { ScheduleView } from './components/ScheduleView';
import { ApprovedTeamsView } from './components/ApprovedTeamsView';
import { PrizesAndRules } from './components/PrizesAndRules';
import { SponsorsAndContact } from './components/SponsorsAndContact';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminPortal } from './components/admin/AdminPortal';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [trackInitialId, setTrackInitialId] = useState<string>('');
  const [trackInitialVerify, setTrackInitialVerify] = useState<string>('');

  // Data State
  const [settings, setSettings] = useState<TournamentSettings | null>(null);
  const [activeQr, setActiveQr] = useState<PaymentQrConfig | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardTeam[]>([]);
  const [matches, setMatches] = useState<MatchSchedule[]>([]);
  const [approvedTeams, setApprovedTeams] = useState<any[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  // Admin Auth State
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(() => localStorage.getItem('esports_admin_token'));
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('esports_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [inAdminMode, setInAdminMode] = useState<boolean>(false);

  // Safe JSON fetch helper to prevent unexpected HTML/DOCTYPE parsing errors
  const safeFetchJson = async (url: string) => {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return null;
      }
      return await res.json();
    } catch {
      return null;
    }
  };

  // Fetch initial public tournament data
  const fetchPublicData = async () => {
    try {
      // First try combined /api/tournament/public endpoint
      const combined = await safeFetchJson('/api/tournament/public');
      if (combined && combined.settings) {
        setSettings(combined.settings);
        setActiveQr(combined.activeQR || null);
        setAnnouncements(combined.announcements || []);
        setSponsors(combined.sponsors || []);
      }

      const [settData, qrData, annData, lbData, matchData, teamsData, sponData] = await Promise.all([
        safeFetchJson('/api/tournament/settings'),
        safeFetchJson('/api/tournament/payment-qr/active'),
        safeFetchJson('/api/tournament/announcements'),
        safeFetchJson('/api/tournament/leaderboard'),
        safeFetchJson('/api/tournament/schedule'),
        safeFetchJson('/api/tournament/teams/approved'),
        safeFetchJson('/api/tournament/sponsors')
      ]);

      if (settData) setSettings(settData);
      if (qrData && qrData.qrConfig) setActiveQr(qrData.qrConfig);
      if (annData && Array.isArray(annData.announcements)) setAnnouncements(annData.announcements);
      if (lbData && Array.isArray(lbData.leaderboard)) setLeaderboard(lbData.leaderboard);
      if (matchData && Array.isArray(matchData.matches)) setMatches(matchData.matches);
      if (teamsData && Array.isArray(teamsData.teams)) setApprovedTeams(teamsData.teams);
      if (sponData && Array.isArray(sponData.sponsors)) setSponsors(sponData.sponsors);
    } catch (err) {
      console.error('Failed to load public tournament data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicData();
  }, []);

  // Admin Login Handler
  const handleAdminLoginSuccess = (token: string, user: AdminUser) => {
    setAdminToken(token);
    setAdminUser(user);
    localStorage.setItem('esports_admin_token', token);
    localStorage.setItem('esports_admin_user', JSON.stringify(user));
    setInAdminMode(true);
  };

  // Admin Logout Handler
  const handleAdminLogout = () => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem('esports_admin_token');
    localStorage.removeItem('esports_admin_user');
    setInAdminMode(false);
  };

  const navigateToTrack = (regId?: string, verify?: string) => {
    if (regId) setTrackInitialId(regId);
    if (verify) setTrackInitialVerify(verify);
    setCurrentView('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in Admin Mode and valid token exists, render the Admin Portal
  if (inAdminMode && adminToken && adminUser) {
    return (
      <AdminPortal
        adminToken={adminToken}
        adminUser={adminUser}
        onLogout={handleAdminLogout}
        onViewPublicSite={() => {
          setInAdminMode(false);
          fetchPublicData();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0c10] text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-neutral-950">
      
      {/* Global Live Announcements Bar */}
      {announcements.length > 0 && announcements.some(a => a?.isActive) && (
        <div className="bg-gradient-to-r from-amber-600/30 via-neutral-900 to-amber-600/30 border-b border-amber-500/40 py-2 px-4 text-center">
          <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2 text-xs font-tech text-amber-200">
            <Megaphone className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 animate-bounce" />
            <span className="font-bold uppercase tracking-wider text-amber-400">Notice:</span>
            <span className="truncate">
              {(() => {
                const first = announcements.find(a => a?.isActive);
                return first ? `${first.title} — ${first.content || first.message || ''}` : '';
              })()}
            </span>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <Navbar
        currentView={currentView}
        onSelectView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdminModal={() => {
          if (adminToken && adminUser) {
            setInAdminMode(true);
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
        registeredCount={approvedTeams.length}
        maxTeams={settings?.maxTeams || 64}
        tournamentName={settings?.tournamentName || 'Free Fire Campus Cup'}
      />

      {/* Main Page Content Body */}
      <main className="flex-1">
        {currentView === 'home' && (
          <div className="space-y-16 pb-20">
            
            {/* Hero Banner Section */}
            <HeroSection
              settings={settings}
              approvedCount={approvedTeams.length}
              totalCount={approvedTeams.length}
              registeredCount={approvedTeams.length}
              announcements={announcements}
              onRegisterClick={() => {
                setCurrentView('register');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onTrackClick={() => {
                setCurrentView('track');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onViewRules={() => {
                setCurrentView('rules');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreClick={() => {
                setCurrentView('rules');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Quick Registration / Tracking Strip */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="esports-glass p-6 rounded-2xl border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="space-y-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-tech font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/40">
                      Already Registered?
                    </span>
                    <span className="text-xs font-tech text-neutral-400">Live Status Audit</span>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-white uppercase">
                    Track Squad Verification & Bracket Status
                  </h3>
                  <p className="text-xs text-neutral-400 font-tech">
                    Check if your payment receipt has been verified and your squad roster approved.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setCurrentView('track');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-amber-400 hover:text-amber-300 font-heading font-bold uppercase tracking-wider text-xs rounded-xl border border-amber-500/40 shadow-md flex items-center space-x-2 transition-all hover:scale-105 whitespace-nowrap"
                >
                  <Search className="w-4 h-4" />
                  <span>Track Your Squad Now</span>
                </button>
              </div>
            </section>

            {/* Prize Highlights Grid */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
              <div className="text-center space-y-1">
                <span className="text-xs font-tech uppercase tracking-widest text-amber-400 font-bold">
                  High Stakes Competition
                </span>
                <h2 className="text-3xl font-heading font-bold uppercase text-white">
                  Championship Prize Breakdown
                </h2>
                <p className="text-xs text-neutral-400 font-tech">
                  Guaranteed rewards, official trophies, and national collegiate recognition.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1st Place */}
                <div className="esports-glass-gold p-6 rounded-2xl border border-amber-500/50 relative text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-heading font-bold text-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/20">
                    1st
                  </div>
                  <span className="text-xs font-tech font-bold uppercase text-amber-400 tracking-wider">
                    Grand Champions
                  </span>
                  <div className="font-heading text-2xl font-bold text-white mt-1">
                    {settings?.prizes?.firstPlace || 'Rs. 25,000 + Trophy'}
                  </div>
                  <p className="text-xs text-neutral-300 font-tech mt-2">
                    Winner's trophy, gold medals & official campus championship certificate.
                  </p>
                </div>

                {/* 2nd Place */}
                <div className="esports-glass p-6 rounded-2xl border border-neutral-700 relative text-center">
                  <div className="w-12 h-12 rounded-full bg-neutral-800 border border-slate-400 text-slate-200 font-heading font-bold text-xl flex items-center justify-center mx-auto mb-3">
                    2nd
                  </div>
                  <span className="text-xs font-tech font-bold uppercase text-slate-300 tracking-wider">
                    1st Runners-Up
                  </span>
                  <div className="font-heading text-2xl font-bold text-white mt-1">
                    {settings?.prizes?.secondPlace || 'Rs. 15,000 + Trophy'}
                  </div>
                  <p className="text-xs text-neutral-400 font-tech mt-2">
                    Runners-up trophy & silver medals for the squad.
                  </p>
                </div>

                {/* 3rd Place */}
                <div className="esports-glass p-6 rounded-2xl border border-neutral-700 relative text-center">
                  <div className="w-12 h-12 rounded-full bg-neutral-800 border border-amber-700 text-amber-600 font-heading font-bold text-xl flex items-center justify-center mx-auto mb-3">
                    3rd
                  </div>
                  <span className="text-xs font-tech font-bold uppercase text-amber-600 tracking-wider">
                    2nd Runners-Up
                  </span>
                  <div className="font-heading text-2xl font-bold text-white mt-1">
                    {settings?.prizes?.thirdPlace || 'Rs. 6,000 + Medals'}
                  </div>
                  <p className="text-xs text-neutral-400 font-tech mt-2">
                    Bronze medals & certificate of championship merit.
                  </p>
                </div>
              </div>

              {/* Special Awards Pill Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="esports-glass p-4 rounded-xl border border-neutral-800 flex items-center space-x-3">
                  <Award className="w-8 h-8 text-purple-400 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] font-tech uppercase text-purple-400 font-bold block">
                      MVP (Most Valuable Player)
                    </span>
                    <span className="font-heading text-sm font-bold text-white">
                      {settings?.prizes?.mvp || 'Rs. 2,500 + Gaming Headset'}
                    </span>
                  </div>
                </div>

                <div className="esports-glass p-4 rounded-xl border border-neutral-800 flex items-center space-x-3">
                  <Zap className="w-8 h-8 text-red-400 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] font-tech uppercase text-red-400 font-bold block">
                      Top Fragger (Most Kills)
                    </span>
                    <span className="font-heading text-sm font-bold text-white">
                      {settings?.prizes?.highestKills || 'Rs. 1,500'}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Leaderboard Snapshot */}
            {leaderboard.length > 0 && (
              <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-heading font-bold uppercase text-white">
                      Current Point Standings Preview
                    </h3>
                    <p className="text-xs text-neutral-400 font-tech">Top 5 leading squads in the championship</p>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentView('leaderboard');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs font-tech text-amber-400 hover:text-amber-300 flex items-center space-x-1"
                  >
                    <span>View Complete Table</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="esports-glass rounded-2xl border border-neutral-800 overflow-hidden shadow-lg">
                  <table className="w-full text-left border-collapse text-xs font-tech">
                    <thead>
                      <tr className="bg-neutral-900/80 border-b border-neutral-800 text-neutral-400 uppercase">
                        <th className="py-3 px-4">Rank</th>
                        <th className="py-3 px-4">Squad</th>
                        <th className="py-3 px-3 text-center">Kills</th>
                        <th className="py-3 px-3 text-center">WWCD</th>
                        <th className="py-3 px-4 text-right text-amber-400">Total Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      {leaderboard.slice(0, 5).map((t, idx) => (
                        <tr key={t.id} className="hover:bg-neutral-800/40">
                          <td className="py-3 px-4 font-bold text-neutral-300">#{idx + 1}</td>
                          <td className="py-3 px-4 font-heading font-bold uppercase text-white">
                            {t.teamName}
                            <span className="text-[10px] text-neutral-400 block font-tech lowercase">{t.college}</span>
                          </td>
                          <td className="py-3 px-3 text-center text-amber-400 font-bold">{t.killPoints}</td>
                          <td className="py-3 px-3 text-center text-emerald-400 font-bold">{t.booyahCount}</td>
                          <td className="py-3 px-4 text-right font-heading text-sm font-bold text-white">{t.totalPoints}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Contact & Dynamic WhatsApp Action */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6">
              <SponsorsAndContact settings={settings} sponsors={sponsors} />
            </section>

          </div>
        )}

        {/* REGISTRATION WIZARD VIEW */}
        {currentView === 'register' && (
          <RegistrationWizard
            settings={settings}
            activeQr={activeQr}
            onCompleteRegistration={(reg) => {
              fetchPublicData();
            }}
            onTrackClick={navigateToTrack}
          />
        )}

        {/* TRACK REGISTRATION VIEW */}
        {currentView === 'track' && (
          <TrackRegistration
            initialRegId={trackInitialId}
            initialVerify={trackInitialVerify}
            onGoBack={() => setCurrentView('home')}
            whatsappNumber={settings?.contactWhatsApp}
          />
        )}

        {/* LEADERBOARD VIEW */}
        {currentView === 'leaderboard' && (
          <LeaderboardView teams={leaderboard} />
        )}

        {/* MATCH SCHEDULE VIEW */}
        {currentView === 'schedule' && (
          <ScheduleView matches={matches} />
        )}

        {/* APPROVED TEAMS DIRECTORY */}
        {currentView === 'teams' && (
          <ApprovedTeamsView
            teams={approvedTeams}
            maxTeams={settings?.maxTeams || 64}
          />
        )}

        {/* PRIZES & RULES */}
        {currentView === 'rules' && (
          <PrizesAndRules settings={settings} />
        )}

        {/* SPONSORS & CONTACT */}
        {currentView === 'contact' && (
          <SponsorsAndContact settings={settings} sponsors={sponsors} />
        )}
      </main>

      {/* Global Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-800/80 py-10 px-4 sm:px-6 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <div className="w-6 h-6 rounded bg-amber-500 text-neutral-950 font-heading font-bold text-xs flex items-center justify-center">
                FF
              </div>
              <span className="font-heading font-bold text-sm uppercase tracking-wider text-white">
                {settings?.tournamentName || 'Free Fire Campus Cup 2026'}
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 font-tech">
              Official Collegiate Battle Royale Championship Series • Season 4
            </p>
            <p className="text-[10px] text-neutral-600 font-tech">
              Disclaimer: This is an independent community collegiate tournament platform and is not sponsored, endorsed, or affiliated with Garena.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs font-tech text-neutral-400">
            <button
              onClick={() => {
                setCurrentView('rules');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-amber-400 transition-colors"
            >
              Rulebook & Anti-Cheat
            </button>
            <span className="hidden sm:inline text-neutral-700">•</span>
            <button
              onClick={() => {
                setCurrentView('track');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-amber-400 transition-colors"
            >
              Track Registration
            </button>
            <span className="hidden sm:inline text-neutral-700">•</span>
            <button
              onClick={() => {
                if (adminToken && adminUser) {
                  setInAdminMode(true);
                } else {
                  setIsAdminLoginOpen(true);
                }
              }}
              className="px-3 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 hover:border-amber-500/40 transition-colors"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </footer>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

    </div>
  );
}
