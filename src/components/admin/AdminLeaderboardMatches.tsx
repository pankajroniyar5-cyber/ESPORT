import React, { useState } from 'react';
import { Trophy, Calendar, Plus, Edit2, Trash2, Check, X, Shield, MapPin, Tv, Key } from 'lucide-react';
import { LeaderboardTeam, MatchSchedule } from '../../types';

interface AdminLeaderboardMatchesProps {
  leaderboard: LeaderboardTeam[];
  matches: MatchSchedule[];
  onSaveLeaderboardTeam: (team: Partial<LeaderboardTeam>) => Promise<void>;
  onDeleteLeaderboardTeam: (id: string) => Promise<void>;
  onSaveMatch: (match: Partial<MatchSchedule>) => Promise<void>;
  onDeleteMatch: (id: string) => Promise<void>;
}

export const AdminLeaderboardMatches: React.FC<AdminLeaderboardMatchesProps> = ({
  leaderboard,
  matches,
  onSaveLeaderboardTeam,
  onDeleteLeaderboardTeam,
  onSaveMatch,
  onDeleteMatch,
}) => {
  const [subTab, setSubTab] = useState<'leaderboard' | 'matches'>('leaderboard');

  // Leaderboard state
  const [editingTeam, setEditingTeam] = useState<Partial<LeaderboardTeam> | null>(null);
  const [showAddTeam, setShowAddTeam] = useState(false);

  // Match state
  const [editingMatch, setEditingMatch] = useState<Partial<MatchSchedule> | null>(null);
  const [showAddMatch, setShowAddMatch] = useState(false);

  const handleSaveTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam) return;

    const total = (Number(editingTeam.killPoints) || 0) + (Number(editingTeam.placementPoints) || 0);
    await onSaveLeaderboardTeam({
      ...editingTeam,
      totalPoints: total
    });
    setEditingTeam(null);
    setShowAddTeam(false);
  };

  const handleSaveMatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMatch) return;
    await onSaveMatch(editingMatch);
    setEditingMatch(null);
    setShowAddMatch(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Sub tabs */}
      <div className="flex border-b border-neutral-800 space-x-4">
        <button
          onClick={() => setSubTab('leaderboard')}
          className={`pb-3 font-heading text-sm font-bold uppercase tracking-wider flex items-center space-x-2 transition-colors border-b-2 ${
            subTab === 'leaderboard'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Point Standings & Scores</span>
        </button>

        <button
          onClick={() => setSubTab('matches')}
          className={`pb-3 font-heading text-sm font-bold uppercase tracking-wider flex items-center space-x-2 transition-colors border-b-2 ${
            subTab === 'matches'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Matches, Lobbies & Room IDs</span>
        </button>
      </div>

      {/* LEADERBOARD VIEW */}
      {subTab === 'leaderboard' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-heading text-lg font-bold uppercase text-white">
                Live Point Standings Management
              </h4>
              <p className="text-xs text-neutral-400 font-tech">
                Update match kills, placement points, and WWCDs for championship calculation.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingTeam({
                  teamName: '',
                  college: '',
                  matchesPlayed: 1,
                  killPoints: 0,
                  placementPoints: 0,
                  totalPoints: 0,
                  booyahCount: 0
                });
                setShowAddTeam(true);
              }}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-heading text-xs font-bold uppercase rounded-lg flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Squad to Table</span>
            </button>
          </div>

          {/* Edit/Add Modal or Inline Box */}
          {(showAddTeam || editingTeam) && (
            <div className="esports-glass p-5 rounded-2xl border border-amber-500/50">
              <h5 className="font-heading text-sm font-bold uppercase text-amber-300 mb-3">
                {editingTeam?.id ? 'Edit Team Points' : 'Add New Team to Leaderboard'}
              </h5>

              <form onSubmit={handleSaveTeam} className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs font-tech">
                <div className="col-span-2">
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">Team Name</label>
                  <input
                    type="text"
                    value={editingTeam?.teamName || ''}
                    onChange={(e) => setEditingTeam({ ...editingTeam, teamName: e.target.value })}
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-neutral-100 uppercase"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">College</label>
                  <input
                    type="text"
                    value={editingTeam?.college || ''}
                    onChange={(e) => setEditingTeam({ ...editingTeam, college: e.target.value })}
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-neutral-100"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">Matches</label>
                  <input
                    type="number"
                    value={editingTeam?.matchesPlayed || 0}
                    onChange={(e) => setEditingTeam({ ...editingTeam, matchesPlayed: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-neutral-100"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">Booyahs</label>
                  <input
                    type="number"
                    value={editingTeam?.booyahCount || 0}
                    onChange={(e) => setEditingTeam({ ...editingTeam, booyahCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-neutral-100"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">Placement Pts</label>
                  <input
                    type="number"
                    value={editingTeam?.placementPoints || 0}
                    onChange={(e) => setEditingTeam({ ...editingTeam, placementPoints: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-neutral-100"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">Kill Pts</label>
                  <input
                    type="number"
                    value={editingTeam?.killPoints || 0}
                    onChange={(e) => setEditingTeam({ ...editingTeam, killPoints: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-neutral-100"
                  />
                </div>

                <div className="col-span-2 sm:col-span-4 flex items-end justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => { setEditingTeam(null); setShowAddTeam(false); }}
                    className="px-3 py-1.5 rounded bg-neutral-900 text-neutral-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded bg-amber-500 text-neutral-950 font-bold"
                  >
                    Save Team Points
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Table */}
          <div className="esports-glass rounded-2xl border border-neutral-800 overflow-hidden">
            <table className="w-full text-left border-collapse text-xs font-tech">
              <thead>
                <tr className="bg-neutral-900/80 border-b border-neutral-800 text-neutral-400 uppercase">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Team & College</th>
                  <th className="py-3 px-3 text-center">Matches</th>
                  <th className="py-3 px-3 text-center">Booyahs</th>
                  <th className="py-3 px-3 text-center">Placement</th>
                  <th className="py-3 px-3 text-center">Kills</th>
                  <th className="py-3 px-3 text-center font-bold text-amber-400">Total</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {leaderboard.map((t, idx) => (
                  <tr key={t.id} className="hover:bg-neutral-800/40">
                    <td className="py-3 px-4 font-bold text-neutral-400">#{idx + 1}</td>
                    <td className="py-3 px-4 font-heading font-bold text-white uppercase">
                      {t.teamName}
                      <span className="text-[11px] text-neutral-400 block font-tech lowercase">{t.college}</span>
                    </td>
                    <td className="py-3 px-3 text-center">{t.matchesPlayed}</td>
                    <td className="py-3 px-3 text-center text-emerald-400 font-bold">{t.booyahCount}</td>
                    <td className="py-3 px-3 text-center">{t.placementPoints}</td>
                    <td className="py-3 px-3 text-center text-amber-400 font-bold">{t.killPoints}</td>
                    <td className="py-3 px-3 text-center font-bold text-white font-heading text-sm">{t.totalPoints}</td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => setEditingTeam(t)}
                        className="p-1 rounded hover:bg-neutral-800 text-neutral-300"
                        title="Edit Points"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${t.teamName} from standings?`)) onDeleteLeaderboardTeam(t.id);
                        }}
                        className="p-1 rounded hover:bg-neutral-800 text-red-400"
                        title="Remove Team"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MATCHES VIEW */}
      {subTab === 'matches' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-heading text-lg font-bold uppercase text-white">
                Match Schedule & Custom Lobby Setup
              </h4>
              <p className="text-xs text-neutral-400 font-tech">
                Assign Bermuda/Purgatory maps, set match status, and broadcast custom Room IDs.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingMatch({
                  matchNumber: matches.length + 1,
                  title: `Match #${matches.length + 1}`,
                  round: 'Round of 16',
                  map: 'Bermuda',
                  date: new Date().toISOString().split('T')[0],
                  time: '18:00 IST',
                  roomStatus: 'Upcoming',
                  roomId: '',
                  roomPassword: ''
                });
                setShowAddMatch(true);
              }}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-heading text-xs font-bold uppercase rounded-lg flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule New Match</span>
            </button>
          </div>

          {/* Add/Edit Match */}
          {(showAddMatch || editingMatch) && (
            <div className="esports-glass p-5 rounded-2xl border border-amber-500/50">
              <h5 className="font-heading text-sm font-bold uppercase text-amber-300 mb-3">
                {editingMatch?.id ? 'Edit Match Parameters' : 'Schedule New Match'}
              </h5>

              <form onSubmit={handleSaveMatchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-tech">
                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">Match Number</label>
                  <input
                    type="number"
                    value={editingMatch?.matchNumber || 1}
                    onChange={(e) => setEditingMatch({ ...editingMatch, matchNumber: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-neutral-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">Title</label>
                  <input
                    type="text"
                    value={editingMatch?.title || ''}
                    onChange={(e) => setEditingMatch({ ...editingMatch, title: e.target.value })}
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-neutral-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">Tournament Round</label>
                  <input
                    type="text"
                    value={editingMatch?.round || ''}
                    onChange={(e) => setEditingMatch({ ...editingMatch, round: e.target.value })}
                    placeholder="e.g. Group A, Semi-Finals"
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-neutral-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">Map</label>
                  <select
                    value={editingMatch?.map || 'Bermuda'}
                    onChange={(e) => setEditingMatch({ ...editingMatch, map: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-neutral-100"
                  >
                    <option value="Bermuda">Bermuda</option>
                    <option value="Purgatory">Purgatory</option>
                    <option value="Kalahari">Kalahari</option>
                    <option value="Alpine">Alpine</option>
                    <option value="NexTerra">NexTerra</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    value={editingMatch?.date || ''}
                    onChange={(e) => setEditingMatch({ ...editingMatch, date: e.target.value })}
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-neutral-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">Time</label>
                  <input
                    type="text"
                    value={editingMatch?.time || ''}
                    onChange={(e) => setEditingMatch({ ...editingMatch, time: e.target.value })}
                    placeholder="e.g. 18:00 IST"
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-neutral-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">Lobby Status</label>
                  <select
                    value={editingMatch?.roomStatus || 'Upcoming'}
                    onChange={(e) => setEditingMatch({ ...editingMatch, roomStatus: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-neutral-100"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="ID Given">ID Given (Active Lobby)</option>
                    <option value="Live">🔴 Live</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">Room ID</label>
                  <input
                    type="text"
                    value={editingMatch?.roomId || ''}
                    onChange={(e) => setEditingMatch({ ...editingMatch, roomId: e.target.value })}
                    placeholder="e.g. 849201"
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-neutral-100 font-mono"
                  />
                </div>

                <div className="sm:col-span-4 flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => { setEditingMatch(null); setShowAddMatch(false); }}
                    className="px-3 py-1.5 rounded bg-neutral-900 text-neutral-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded bg-amber-500 text-neutral-950 font-bold"
                  >
                    Save Match Details
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Matches List */}
          <div className="space-y-3">
            {matches.map((m) => (
              <div
                key={m.id}
                className="esports-glass p-4 rounded-xl border border-neutral-800 flex items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center font-heading font-bold text-amber-400">
                    #{m.matchNumber}
                  </div>
                  <div>
                    <h5 className="font-heading text-sm font-bold text-white uppercase">{m.title}</h5>
                    <div className="text-[11px] font-tech text-neutral-400">
                      {m.round} • {m.map} • {m.date} at {m.time}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs font-tech px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-300">
                    {m.roomStatus}
                  </span>

                  {m.roomId && (
                    <span className="text-xs font-mono text-amber-300">
                      ID: {m.roomId}
                    </span>
                  )}

                  <button
                    onClick={() => setEditingMatch(m)}
                    className="p-1 text-neutral-400 hover:text-white"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this scheduled match?')) onDeleteMatch(m.id);
                    }}
                    className="p-1 text-neutral-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
