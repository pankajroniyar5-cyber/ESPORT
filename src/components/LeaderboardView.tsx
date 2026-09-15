import React from 'react';
import { Trophy, Flame, Target, Award, Shield, Medal } from 'lucide-react';
import { LeaderboardTeam } from '../types';

interface LeaderboardViewProps {
  teams: LeaderboardTeam[];
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ teams }) => {
  const sortedTeams = [...teams].sort((a, b) => b.totalPoints - a.totalPoints || b.booyahCount - a.booyahCount);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6">
      
      {/* Title */}
      <div className="text-center mb-10">
        <span className="text-xs font-tech font-bold uppercase tracking-widest text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
          Official Standings
        </span>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-neutral-100 uppercase tracking-wide mt-2">
          Tournament Leaderboard
        </h2>
        <p className="text-neutral-400 text-xs sm:text-sm mt-1">
          Live point standings based on Placement Points + Kill Points across official championship lobbies.
        </p>
      </div>

      {/* Top 3 Podium Highlights */}
      {sortedTeams.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10 items-end">
          
          {/* #2 Second Place (Silver) */}
          <div className="order-2 md:order-1 esports-glass p-5 rounded-2xl border border-neutral-700/80 text-center relative hover:border-neutral-500 transition-all">
            <div className="w-12 h-12 rounded-full bg-neutral-800 border-2 border-slate-300 flex items-center justify-center mx-auto text-slate-200 shadow-md mb-3 font-heading font-bold text-xl">
              2
            </div>
            <span className="text-[10px] font-tech uppercase tracking-widest text-slate-400 font-bold">2nd Place • Silver</span>
            <h3 className="text-xl font-heading font-bold text-white uppercase mt-1 truncate">
              {sortedTeams[1].teamName}
            </h3>
            <p className="text-xs text-neutral-400 font-tech truncate">{sortedTeams[1].college}</p>
            
            <div className="mt-4 pt-3 border-t border-neutral-800 flex justify-around text-xs font-tech">
              <div>
                <span className="text-neutral-500 block text-[10px]">KILLS</span>
                <span className="font-bold text-amber-400">{sortedTeams[1].killPoints}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">WWCD</span>
                <span className="font-bold text-emerald-400">{sortedTeams[1].booyahCount}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">TOTAL PTS</span>
                <span className="font-heading text-lg font-bold text-white">{sortedTeams[1].totalPoints}</span>
              </div>
            </div>
          </div>

          {/* #1 First Place (Gold) - Elevated */}
          <div className="order-1 md:order-2 esports-glass-gold p-6 rounded-2xl border border-amber-500/50 text-center relative shadow-2xl shadow-amber-500/10 scale-105">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-neutral-950 font-tech text-[10px] font-bold uppercase tracking-wider shadow">
              Tournament Leader
            </div>
            <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mx-auto text-amber-300 shadow-lg shadow-amber-500/30 mb-3 font-heading font-bold text-2xl">
              1
            </div>
            <span className="text-[10px] font-tech uppercase tracking-widest text-amber-400 font-bold">Champion Rank • Gold</span>
            <h3 className="text-2xl font-heading font-bold text-white uppercase mt-1 truncate">
              {sortedTeams[0].teamName}
            </h3>
            <p className="text-xs text-neutral-300 font-tech truncate">{sortedTeams[0].college}</p>
            
            <div className="mt-5 pt-3 border-t border-amber-500/20 flex justify-around text-xs font-tech">
              <div>
                <span className="text-neutral-400 block text-[10px]">KILLS</span>
                <span className="font-bold text-amber-400 text-sm">{sortedTeams[0].killPoints}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px]">BOOYAH</span>
                <span className="font-bold text-emerald-400 text-sm">{sortedTeams[0].booyahCount}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px]">TOTAL PTS</span>
                <span className="font-heading text-2xl font-bold text-amber-300">{sortedTeams[0].totalPoints}</span>
              </div>
            </div>
          </div>

          {/* #3 Third Place (Bronze) */}
          <div className="order-3 esports-glass p-5 rounded-2xl border border-neutral-700/80 text-center relative hover:border-neutral-500 transition-all">
            <div className="w-12 h-12 rounded-full bg-neutral-800 border-2 border-amber-700 flex items-center justify-center mx-auto text-amber-600 shadow-md mb-3 font-heading font-bold text-xl">
              3
            </div>
            <span className="text-[10px] font-tech uppercase tracking-widest text-amber-600 font-bold">3rd Place • Bronze</span>
            <h3 className="text-xl font-heading font-bold text-white uppercase mt-1 truncate">
              {sortedTeams[2].teamName}
            </h3>
            <p className="text-xs text-neutral-400 font-tech truncate">{sortedTeams[2].college}</p>
            
            <div className="mt-4 pt-3 border-t border-neutral-800 flex justify-around text-xs font-tech">
              <div>
                <span className="text-neutral-500 block text-[10px]">KILLS</span>
                <span className="font-bold text-amber-400">{sortedTeams[2].killPoints}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">WWCD</span>
                <span className="font-bold text-emerald-400">{sortedTeams[2].booyahCount}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">TOTAL PTS</span>
                <span className="font-heading text-lg font-bold text-white">{sortedTeams[2].totalPoints}</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Complete Standings Table */}
      <div className="esports-glass rounded-2xl border border-neutral-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="font-heading text-base font-bold uppercase tracking-wider text-neutral-200">
              Overall Overall Rank Table
            </span>
          </div>
          <span className="text-xs font-tech text-neutral-400">
            {sortedTeams.length} Active Squads
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-tech">
            <thead>
              <tr className="bg-neutral-900/80 border-b border-neutral-800 text-neutral-400 uppercase">
                <th className="py-3 px-4 font-bold">Rank</th>
                <th className="py-3 px-4 font-bold">Team / College</th>
                <th className="py-3 px-3 text-center font-bold">Matches</th>
                <th className="py-3 px-3 text-center font-bold">Booyah (WWCD)</th>
                <th className="py-3 px-3 text-center font-bold">Placement Pts</th>
                <th className="py-3 px-3 text-center font-bold">Kill Pts</th>
                <th className="py-3 px-4 text-right font-bold text-amber-400">Total Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {sortedTeams.map((team, idx) => {
                const rank = idx + 1;
                return (
                  <tr 
                    key={team.id}
                    className={`hover:bg-neutral-800/40 transition-colors ${
                      rank === 1 ? 'bg-amber-500/5' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-md font-heading text-sm ${
                        rank === 1 ? 'bg-amber-500 text-neutral-950 font-bold' :
                        rank === 2 ? 'bg-slate-300 text-neutral-950 font-bold' :
                        rank === 3 ? 'bg-amber-700 text-white font-bold' :
                        'text-neutral-400'
                      }`}>
                        #{rank}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-heading text-sm font-bold text-neutral-100 uppercase">
                        {team.teamName}
                      </div>
                      <div className="text-[11px] text-neutral-400 truncate max-w-xs">
                        {team.college}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center text-neutral-300">
                      {team.matchesPlayed}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-emerald-400">
                      {team.booyahCount}
                    </td>
                    <td className="py-3.5 px-3 text-center text-neutral-300">
                      {team.placementPoints}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-amber-400">
                      {team.killPoints}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-heading text-base font-bold text-white">
                        {team.totalPoints}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
