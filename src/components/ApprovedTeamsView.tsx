import React, { useState } from 'react';
import { ShieldCheck, Search, Users, MapPin, Award } from 'lucide-react';

interface PublicTeam {
  id: string;
  registrationNumber: string;
  teamName: string;
  college: string;
  city: string;
  teamLogoUrl?: string;
  captainName: string;
  players: { inGameName: string; role: string; isCaptain?: boolean }[];
  createdAt: string;
}

interface ApprovedTeamsViewProps {
  teams: PublicTeam[];
  maxTeams?: number;
}

export const ApprovedTeamsView: React.FC<ApprovedTeamsViewProps> = ({ teams, maxTeams = 64 }) => {
  const [search, setSearch] = useState('');

  const filteredTeams = teams.filter(
    (t) =>
      t.teamName.toLowerCase().includes(search.toLowerCase()) ||
      t.college.toLowerCase().includes(search.toLowerCase()) ||
      t.city.toLowerCase().includes(search.toLowerCase()) ||
      t.players.some((p) => p.inGameName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6">
      
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-xs font-tech font-bold uppercase tracking-widest text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
          Official Team Directory
        </span>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-neutral-100 uppercase tracking-wide mt-2">
          Qualified Squads ({teams.length} / {maxTeams})
        </h2>
        <p className="text-neutral-400 text-xs sm:text-sm mt-1">
          Squads with verified payment receipts and approved roster eligibility.
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by team, college, city, or player IGN..."
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-900/90 border border-neutral-800 rounded-xl text-xs text-neutral-100 placeholder-neutral-500 focus:border-amber-400 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Teams Grid */}
      {filteredTeams.length === 0 ? (
        <div className="esports-glass p-8 rounded-2xl border border-neutral-800 text-center text-neutral-400 text-sm">
          No teams found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeams.map((team) => (
            <div
              key={team.id}
              className="esports-glass p-5 rounded-2xl border border-neutral-800/90 hover:border-amber-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-neutral-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {team.teamLogoUrl ? (
                        <img
                          src={team.teamLogoUrl}
                          alt={team.teamName}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <Users className="w-5 h-5 text-amber-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-neutral-100 uppercase group-hover:text-amber-300 transition-colors">
                        {team.teamName}
                      </h3>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {team.registrationNumber}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-tech px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
                    Qualified
                  </span>
                </div>

                <div className="py-2.5 text-xs font-tech text-neutral-400 flex items-center justify-between">
                  <span className="truncate">{team.college}</span>
                  <span className="flex items-center space-x-1 text-neutral-500">
                    <MapPin className="w-3 h-3" />
                    <span>{team.city}</span>
                  </span>
                </div>

                {/* Roster IGNs */}
                <div className="pt-2 border-t border-neutral-800/60">
                  <span className="text-[10px] font-tech uppercase text-neutral-500 block mb-1.5 font-semibold">
                    Squad Lineup
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {team.players.map((p, pIdx) => (
                      <span
                        key={pIdx}
                        className={`text-[11px] font-tech px-2 py-0.5 rounded ${
                          p.isCaptain
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                            : 'bg-neutral-900 text-neutral-300 border border-neutral-800'
                        }`}
                      >
                        {p.inGameName} {p.isCaptain && '★'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-tech text-neutral-500">
                <span>Captain: <strong className="text-neutral-300">{team.captainName}</strong></span>
                <span>{new Date(team.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
