import React from 'react';
import { Calendar, Clock, MapPin, Tv, ShieldCheck, AlertCircle } from 'lucide-react';
import { MatchSchedule } from '../types';

interface ScheduleViewProps {
  matches: MatchSchedule[];
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ matches }) => {
  const getMapColor = (map: string) => {
    switch (map) {
      case 'Bermuda':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Purgatory':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Kalahari':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      default:
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Live':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-tech font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">🔴 LIVE NOW</span>;
      case 'Completed':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-tech font-medium bg-neutral-800 text-neutral-400 border border-neutral-700">COMPLETED</span>;
      case 'ID Given':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-tech font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">ROOM ID SENT</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-tech font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">UPCOMING</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6">
      
      {/* Title */}
      <div className="text-center mb-10">
        <span className="text-xs font-tech font-bold uppercase tracking-widest text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
          Match Calendar
        </span>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-neutral-100 uppercase tracking-wide mt-2">
          Official Tournament Schedule
        </h2>
        <p className="text-neutral-400 text-xs sm:text-sm mt-1">
          Custom lobby schedule across Bermuda, Purgatory, and Kalahari.
        </p>
      </div>

      {/* Match Cards List */}
      <div className="space-y-4">
        {matches.map((match) => (
          <div
            key={match.id}
            className="esports-glass p-5 rounded-2xl border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col items-center justify-center font-heading text-neutral-200 flex-shrink-0">
                <span className="text-[10px] text-neutral-500 font-tech">MATCH</span>
                <span className="text-lg font-bold text-amber-400">#{match.matchNumber}</span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-heading text-lg font-bold text-neutral-100 uppercase">
                    {match.title}
                  </h3>
                  <span className="text-[10px] font-tech uppercase px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                    {match.round}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-tech text-neutral-400 mt-2">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>{match.date}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{match.time}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span className={`px-1.5 py-0.2 rounded border text-[10px] ${getMapColor(match.map)}`}>
                      {match.map}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-800">
              {getStatusBadge(match.roomStatus)}
              
              {match.roomId && (
                <div className="text-[11px] font-tech text-neutral-400">
                  Room: <span className="font-mono text-amber-300 font-bold">{match.roomId}</span>
                </div>
              )}

              {match.liveStreamUrl && (
                <a
                  href={match.liveStreamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-xs font-tech text-red-400 hover:text-red-300"
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>Watch Stream</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
