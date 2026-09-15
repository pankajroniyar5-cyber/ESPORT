import React, { useState, useEffect } from 'react';
import { Trophy, Users, ShieldAlert, ArrowRight, Clock, Award, CheckCircle2, Zap, AlertCircle, Share2, Sparkles } from 'lucide-react';
import { TournamentSettings, Announcement } from '../types';

interface HeroSectionProps {
  settings: TournamentSettings | null;
  approvedCount?: number;
  totalCount?: number;
  registeredCount?: number;
  announcements?: Announcement[];
  onRegisterClick: () => void;
  onExploreClick?: () => void;
  onViewRules?: () => void;
  onTrackClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  approvedCount = 0,
  totalCount = 0,
  registeredCount,
  announcements = [],
  onRegisterClick,
  onExploreClick,
  onViewRules,
  onTrackClick
}) => {
  const displayTotalCount = totalCount || registeredCount || 0;
  const displayApprovedCount = approvedCount || registeredCount || 0;
  const handleExplore = onExploreClick || onViewRules || (() => {});
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Calculate live countdown to registration deadline or tournament start
  useEffect(() => {
    const targetDate = settings?.registrationCloseDate 
      ? new Date(`${settings.registrationCloseDate}T23:59:59`).getTime()
      : new Date('2026-10-05T23:59:59').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [settings?.registrationCloseDate]);

  const maxTeams = settings?.maxTeams || 64;
  const percentageFilled = Math.min(100, Math.round((displayTotalCount / maxTeams) * 100));
  const activeAnnouncement = (announcements || []).find(a => a?.isActive) || null;

  return (
    <section className="relative overflow-hidden pt-6 pb-16 lg:pb-24 tactical-grid">
      {/* Background glow radial highlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-[400px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dynamic Urgent Announcement Banner */}
        {activeAnnouncement && (
          <div className="mb-6 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-sm animate-fade-in">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <span className="flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-tech font-bold uppercase tracking-wider bg-amber-500 text-neutral-950">
                {(activeAnnouncement.priority || activeAnnouncement.type || 'INFO').toUpperCase()} ALERT
              </span>
              <p className="text-amber-200 truncate font-medium">
                <strong className="font-semibold text-white">{activeAnnouncement.title}:</strong> {activeAnnouncement.message || activeAnnouncement.content}
              </p>
            </div>
            <span className="text-xs text-amber-400/80 font-tech whitespace-nowrap hidden sm:inline">Live Bulletin</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Hero Content & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Status & Season Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-tech font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{settings?.registrationStatus || 'REGISTRATION OPEN'}</span>
              </span>

              <span className="px-3 py-1 rounded-full text-xs font-tech text-neutral-400 bg-neutral-900 border border-neutral-800">
                Season: <span className="text-amber-400 font-semibold">{settings?.season || 'Season 4'}</span>
              </span>

              <span className="px-3 py-1 rounded-full text-xs font-tech text-neutral-400 bg-neutral-900 border border-neutral-800 hidden sm:inline-block">
                Collegiate Battle Royale
              </span>
            </div>

            {/* Dynamic Headline */}
            <div>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-wide text-neutral-100 leading-[1.08]">
                {settings?.heroHeadline || settings?.tournamentName || 'FREE FIRE CAMPUS CHAMPIONSHIP'}
              </h1>
              <p className="mt-3 text-lg sm:text-xl font-heading text-amber-400/90 tracking-wide uppercase font-semibold">
                {settings?.subtitle || 'National Inter-College Esports Showdown'}
              </p>
            </div>

            {/* Description */}
            <p className="text-neutral-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              {settings?.description || 
                'Assemble your 5-member roster and claim victory on the battlegrounds of Bermuda, Purgatory, and Kalahari. Official collegiate verified brackets with real-time kill-points tracking.'}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="hero-register-btn"
                onClick={onRegisterClick}
                className="flex items-center space-x-2 px-7 py-3.5 text-base font-heading font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-neutral-950 rounded-lg shadow-xl shadow-amber-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <span>Register Your Team</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                id="hero-track-btn"
                onClick={onTrackClick}
                className="flex items-center space-x-2 px-5 py-3.5 text-base font-heading font-semibold uppercase tracking-wider text-neutral-200 hover:text-white bg-neutral-900/90 hover:bg-neutral-800/90 border border-neutral-700/80 rounded-lg transition-all"
              >
                <span>Track Registration</span>
              </button>

              <button
                id="hero-explore-btn"
                onClick={handleExplore}
                className="flex items-center space-x-1.5 px-4 py-3.5 text-sm font-tech text-amber-400/90 hover:text-amber-300 transition-colors"
              >
                <span>View Rules & Schedule</span>
                <span>→</span>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-4 border-t border-neutral-800/70 flex flex-wrap items-center gap-6 text-xs text-neutral-400 font-tech">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Anti-Cheat & Emulator Verification</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Live WhatsApp Lobby Link</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Instant Verified Certificates</span>
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Countdown & Tournament Snapshot Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl esports-glass-gold p-6 sm:p-7 shadow-2xl space-y-6">
              
              {/* Header inside Card */}
              <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-heading font-bold uppercase tracking-wider text-neutral-200">
                      Registration Countdown
                    </h3>
                    <p className="text-xs text-amber-400/80 font-tech">Deadline Closes Soon</p>
                  </div>
                </div>

                <span className="text-xs font-tech px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                  {settings?.matchDates || 'Oct 2026'}
                </span>
              </div>

              {/* 4-Box Digital Countdown */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-3">
                  <span className="font-heading text-2xl sm:text-3xl font-bold text-amber-400">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="block text-[10px] uppercase font-tech text-neutral-400 mt-1">Days</span>
                </div>
                <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-3">
                  <span className="font-heading text-2xl sm:text-3xl font-bold text-amber-400">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="block text-[10px] uppercase font-tech text-neutral-400 mt-1">Hours</span>
                </div>
                <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-3">
                  <span className="font-heading text-2xl sm:text-3xl font-bold text-amber-400">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="block text-[10px] uppercase font-tech text-neutral-400 mt-1">Mins</span>
                </div>
                <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-3">
                  <span className="font-heading text-2xl sm:text-3xl font-bold text-amber-400">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="block text-[10px] uppercase font-tech text-neutral-400 mt-1">Secs</span>
                </div>
              </div>

              {/* Capacity Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-tech">
                  <span className="text-neutral-400">Team Slots Fill Rate</span>
                  <span className="text-amber-300 font-bold font-heading">
                    {displayTotalCount} / {maxTeams} Squads ({percentageFilled}%)
                  </span>
                </div>
                <div className="w-full bg-neutral-950 rounded-full h-2.5 overflow-hidden border border-neutral-800">
                  <div 
                    className="bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 h-full rounded-full transition-all duration-700 shadow-sm"
                    style={{ width: `${Math.min(100, Math.max(5, percentageFilled))}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-neutral-400 font-tech">
                  <span>{displayApprovedCount} Verified Squads</span>
                  <span className="text-emerald-400">{Math.max(0, maxTeams - displayTotalCount)} Remaining</span>
                </div>
              </div>

              {/* Tournament Key Specs Grid */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-lg bg-neutral-900/70 border border-neutral-800">
                  <span className="block text-[11px] font-tech text-neutral-400 uppercase">Prize Pool</span>
                  <span className="font-heading text-xl font-bold text-neutral-100">
                    {settings?.prizePool || 'Rs. 50,000'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-neutral-900/70 border border-neutral-800">
                  <span className="block text-[11px] font-tech text-neutral-400 uppercase">Registration Fee</span>
                  <span className="font-heading text-xl font-bold text-emerald-400">
                    {settings?.currency || 'Rs.'} {settings?.registrationFee || 500}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-neutral-900/70 border border-neutral-800">
                  <span className="block text-[11px] font-tech text-neutral-400 uppercase">Team Format</span>
                  <span className="font-heading text-sm font-bold text-neutral-100">
                    4 Players + 1 Sub
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-neutral-900/70 border border-neutral-800">
                  <span className="block text-[11px] font-tech text-neutral-400 uppercase">Mode / Maps</span>
                  <span className="font-heading text-sm font-bold text-neutral-100">
                    BR Squad (Custom)
                  </span>
                </div>
              </div>

              {/* Direct Quick Action Banner */}
              <button
                onClick={onRegisterClick}
                className="w-full py-3 text-center text-xs font-heading font-bold uppercase tracking-widest text-amber-300 hover:text-white bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-lg transition-all"
              >
                Claim Remaining Slot Now →
              </button>

            </div>
          </div>

        </div>

        {/* Dynamic Bottom Animated Stats Strip */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="esports-glass p-4 rounded-xl border border-neutral-800 flex items-center space-x-3.5">
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <span className="block font-tech text-xs text-neutral-400 uppercase tracking-wider">Total Cash Pool</span>
              <span className="font-heading text-2xl font-bold text-neutral-100">{settings?.prizePool || 'Rs. 50,000'}</span>
            </div>
          </div>

          <div className="esports-glass p-4 rounded-xl border border-neutral-800 flex items-center space-x-3.5">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="block font-tech text-xs text-neutral-400 uppercase tracking-wider">Registered Teams</span>
              <span className="font-heading text-2xl font-bold text-neutral-100">{totalCount} / {maxTeams}</span>
            </div>
          </div>

          <div className="esports-glass p-4 rounded-xl border border-neutral-800 flex items-center space-x-3.5">
            <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="block font-tech text-xs text-neutral-400 uppercase tracking-wider">Colleges Competing</span>
              <span className="font-heading text-2xl font-bold text-neutral-100">18+ Campuses</span>
            </div>
          </div>

          <div className="esports-glass p-4 rounded-xl border border-neutral-800 flex items-center space-x-3.5">
            <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <span className="block font-tech text-xs text-neutral-400 uppercase tracking-wider">Format & Maps</span>
              <span className="font-heading text-xl font-bold text-neutral-100">BR Bermuda / Kalahari</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
