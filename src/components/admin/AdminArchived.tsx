import React from 'react';
import { Archive, RotateCcw, ShieldAlert, Calendar } from 'lucide-react';
import { Registration } from '../../types';

interface AdminArchivedProps {
  archivedRegistrations: Registration[];
  onRestore: (id: string) => Promise<void>;
}

export const AdminArchived: React.FC<AdminArchivedProps> = ({
  archivedRegistrations,
  onRestore,
}) => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h3 className="font-heading text-xl font-bold uppercase tracking-wider text-white">
          Archived & Soft-Deleted Registrations ({archivedRegistrations.length})
        </h3>
        <p className="text-xs text-neutral-400 font-tech">
          Squads removed from active rosters. They remain in the database for financial reconciliation and can be restored anytime with full history.
        </p>
      </div>

      {archivedRegistrations.length === 0 ? (
        <div className="esports-glass p-12 rounded-2xl border border-neutral-800 text-center text-neutral-500">
          <Archive className="w-8 h-8 mx-auto mb-2 text-neutral-600" />
          <p className="text-sm">No archived registrations found. All active squads are listed in the main registrations view.</p>
        </div>
      ) : (
        <div className="esports-glass rounded-2xl border border-neutral-800 overflow-hidden">
          <table className="w-full text-left border-collapse text-xs font-tech">
            <thead>
              <tr className="bg-neutral-900/90 border-b border-neutral-800 text-neutral-400 uppercase">
                <th className="py-3 px-4">Reg ID</th>
                <th className="py-3 px-4">Team & College</th>
                <th className="py-3 px-3">Captain Contact</th>
                <th className="py-3 px-4">Archive Reason</th>
                <th className="py-3 px-3">Archived At</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {archivedRegistrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-neutral-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">
                    {reg.registrationNumber}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-heading text-sm font-bold text-neutral-200 uppercase">{reg.teamName}</div>
                    <div className="text-[11px] text-neutral-500">{reg.college}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-neutral-300">{reg.captainName}</div>
                    <div className="text-neutral-500 font-mono text-[10px]">{reg.captainPhone}</div>
                  </td>
                  <td className="py-3 px-4 text-amber-300">
                    {reg.archiveReason || 'No reason provided'}
                  </td>
                  <td className="py-3 px-3 text-neutral-400">
                    {reg.archivedAt ? new Date(reg.archivedAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onRestore(reg.id)}
                      className="px-3 py-1.5 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-tech flex items-center space-x-1 ml-auto"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore Squad</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
