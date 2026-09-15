import React from 'react';
import { Trophy, Award, ShieldCheck, AlertTriangle, FileText, CheckCircle } from 'lucide-react';
import { TournamentSettings } from '../types';

interface PrizesAndRulesProps {
  settings: TournamentSettings | null;
}

export const PrizesAndRules: React.FC<PrizesAndRulesProps> = ({ settings }) => {
  const prizes = settings?.prizes || {
    firstPlace: 'Rs. 25,000 + Champion Trophy + Gold Medals',
    secondPlace: 'Rs. 15,000 + Runners-Up Trophy + Silver Medals',
    thirdPlace: 'Rs. 6,000 + Bronze Medals',
    mvp: 'Rs. 2,500 + MVP Gaming Headset',
    highestKills: 'Rs. 1,500 + Top Fragger Certificate',
    specialAwards: 'Rs. 1,000 Best Clutch Play'
  };

  const defaultRules = [
    'Only registered collegiate squads with valid student IDs are permitted to participate in official brackets.',
    'Strict No-Emulator Policy: All matches must be played on standard Android/iOS handheld smartphones. Tablets, iPads, triggers, key-mappers, and PC emulators are strictly forbidden.',
    'Free Fire account level must be 40 or higher, with Diamond III or higher rank in Battle Royale mode.',
    'Teams must assemble in the designated lobby room 15 minutes before scheduled match start. Room IDs & passwords will be shared exclusively to captains on WhatsApp.',
    'Scoring: 1st place awards 12 points, 2nd awards 9 points, 3rd awards 8 points. Each team kill adds 1 point.',
    'Any team caught teaming, hacking, exploiting glitches, or using foul language in lobby will face immediate disqualification and forfeiture of registration fee.'
  ];

  const rulesList = settings?.rules && settings.rules.length > 0 ? settings.rules : defaultRules;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 space-y-12">
      
      {/* Title */}
      <div className="text-center">
        <span className="text-xs font-tech font-bold uppercase tracking-widest text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
          Rewards & Regulations
        </span>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-neutral-100 uppercase tracking-wide mt-2">
          Prize Distribution & Official Rulebook
        </h2>
        <p className="text-neutral-400 text-xs sm:text-sm mt-1">
          Complete breakdown of cash rewards, trophies, and tournament code of conduct.
        </p>
      </div>

      {/* Prize Cards Grid */}
      <div>
        <h3 className="font-heading text-xl font-bold uppercase text-neutral-200 mb-5 flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span>Championship Prize Pool ({settings?.prizePool || 'Rs. 50,000'})</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1st Place */}
          <div className="esports-glass-gold p-6 rounded-2xl border border-amber-500/50 relative shadow-xl">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-heading text-lg font-bold mb-3">
              1st
            </div>
            <span className="text-[10px] font-tech uppercase tracking-wider text-amber-400 font-bold block">
              Grand Champions
            </span>
            <div className="font-heading text-xl font-bold text-white mt-1">
              {prizes.firstPlace}
            </div>
          </div>

          {/* 2nd Place */}
          <div className="esports-glass p-6 rounded-2xl border border-neutral-700 relative">
            <div className="w-10 h-10 rounded-full bg-neutral-800 text-slate-300 flex items-center justify-center font-heading text-lg font-bold mb-3">
              2nd
            </div>
            <span className="text-[10px] font-tech uppercase tracking-wider text-slate-400 font-bold block">
              1st Runners-Up
            </span>
            <div className="font-heading text-xl font-bold text-white mt-1">
              {prizes.secondPlace}
            </div>
          </div>

          {/* 3rd Place */}
          <div className="esports-glass p-6 rounded-2xl border border-neutral-700 relative">
            <div className="w-10 h-10 rounded-full bg-neutral-800 text-amber-600 flex items-center justify-center font-heading text-lg font-bold mb-3">
              3rd
            </div>
            <span className="text-[10px] font-tech uppercase tracking-wider text-amber-600 font-bold block">
              2nd Runners-Up
            </span>
            <div className="font-heading text-xl font-bold text-white mt-1">
              {prizes.thirdPlace}
            </div>
          </div>

          {/* MVP */}
          <div className="esports-glass p-5 rounded-xl border border-neutral-800">
            <span className="text-[10px] font-tech uppercase text-purple-400 font-bold block">Most Valuable Player (MVP)</span>
            <div className="font-heading text-lg font-bold text-white mt-1">{prizes.mvp}</div>
          </div>

          {/* Highest Kills */}
          <div className="esports-glass p-5 rounded-xl border border-neutral-800">
            <span className="text-[10px] font-tech uppercase text-red-400 font-bold block">Top Fragger (Most Kills)</span>
            <div className="font-heading text-lg font-bold text-white mt-1">{prizes.highestKills}</div>
          </div>

          {/* Special Awards */}
          <div className="esports-glass p-5 rounded-xl border border-neutral-800">
            <span className="text-[10px] font-tech uppercase text-emerald-400 font-bold block">Special Recognition</span>
            <div className="font-heading text-lg font-bold text-white mt-1">{prizes.specialAwards || 'Clutch King Award'}</div>
          </div>
        </div>
      </div>

      {/* Rules Section */}
      <div>
        <h3 className="font-heading text-xl font-bold uppercase text-neutral-200 mb-5 flex items-center space-x-2">
          <FileText className="w-5 h-5 text-amber-400" />
          <span>Official Tournament Rulebook & Anti-Cheat Protocols</span>
        </h3>

        <div className="esports-glass rounded-2xl border border-neutral-800 p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Strict Integrity Notice:</strong> All players must maintain screen recordings during semi-finals and grand finals if requested by match referees.
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {rulesList.map((rule, idx) => (
              <div key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-neutral-300 leading-relaxed font-tech">
                <span className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-[10px] text-amber-400 font-bold flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
