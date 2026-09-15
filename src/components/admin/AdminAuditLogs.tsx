import React from 'react';
import { Clock, Shield, User, Activity } from 'lucide-react';
import { AuditLogEntry } from '../../types';

interface AdminAuditLogsProps {
  auditLogs: AuditLogEntry[];
}

export const AdminAuditLogs: React.FC<AdminAuditLogsProps> = ({ auditLogs }) => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h3 className="font-heading text-xl font-bold uppercase tracking-wider text-white">
          System Security & Admin Audit Trail
        </h3>
        <p className="text-xs text-neutral-400 font-tech">
          Immutable log of all administrative operations, payment approvals, settings adjustments, and roster modifications.
        </p>
      </div>

      <div className="esports-glass rounded-2xl border border-neutral-800 overflow-hidden">
        <table className="w-full text-left border-collapse text-xs font-tech">
          <thead>
            <tr className="bg-neutral-900/90 border-b border-neutral-800 text-neutral-400 uppercase">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-3">Action</th>
              <th className="py-3 px-3">Admin</th>
              <th className="py-3 px-3">Target / Entity</th>
              <th className="py-3 px-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60">
            {auditLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-neutral-500">
                  No audit logs recorded yet.
                </td>
              </tr>
            ) : (
              auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-neutral-800/40">
                  <td className="py-3 px-4 text-neutral-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-semibold">
                    <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-amber-300">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-neutral-200">
                    {log.userName || log.userEmail || 'System'}
                  </td>
                  <td className="py-3 px-3 font-mono text-neutral-400">
                    {log.targetEntity || '-'}
                  </td>
                  <td className="py-3 px-4 text-neutral-300">
                    {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
