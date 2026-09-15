import React from 'react';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  CreditCard, 
  DollarSign, 
  Trophy, 
  ArrowRight, 
  AlertCircle, 
  FileSpreadsheet, 
  QrCode, 
  PlusCircle, 
  ShieldCheck,
  TrendingUp,
  Database,
  HardDrive,
  Cpu
} from 'lucide-react';
import { Registration } from '../../types';

interface AdminDashboardProps {
  analytics: any;
  recentRegistrations: Registration[];
  onNavigateTab: (tab: string) => void;
  onOpenDetailModal: (reg: Registration) => void;
  onVerifyPayment: (regId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  analytics,
  recentRegistrations,
  onNavigateTab,
  onOpenDetailModal,
  onVerifyPayment,
}) => {
  const currency = analytics?.currency || 'Rs.';

  return (
    <div className="space-y-8">
      
      {/* Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Teams & Capacity */}
        <div className="esports-glass p-5 rounded-2xl border border-neutral-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-tech uppercase text-neutral-400">Total Registrations</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-heading font-bold text-white">
              {analytics?.totalRegistrations || 0}
            </span>
            <span className="text-xs font-tech text-neutral-400">
              / {analytics?.maxTeams || 64} Max
            </span>
          </div>
          <div className="mt-2 text-[11px] font-tech text-emerald-400 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{analytics?.approvedTeams || 0} Officially Qualified</span>
          </div>
        </div>

        {/* Pending Payment Reviews */}
        <div className="esports-glass p-5 rounded-2xl border border-amber-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-tech uppercase text-amber-300">Pending Payments</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-heading font-bold text-amber-400">
              {analytics?.pendingPayments || 0}
            </span>
            <span className="text-xs font-tech text-neutral-400">Awaiting Verification</span>
          </div>
          <button
            onClick={() => onNavigateTab('payments')}
            className="mt-2 text-[11px] font-tech text-amber-300 hover:text-amber-200 underline flex items-center space-x-1"
          >
            <span>Review verification queue →</span>
          </button>
        </div>

        {/* Total Verified Revenue */}
        <div className="esports-glass p-5 rounded-2xl border border-emerald-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-tech uppercase text-emerald-300">Verified Revenue</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-heading font-bold text-emerald-400">
              {currency} {(analytics?.totalRevenue || 0).toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-[11px] font-tech text-neutral-400">
            Expected: {currency} {(analytics?.expectedRevenue || 0).toLocaleString()}
          </div>
        </div>

        {/* Remaining Slots */}
        <div className="esports-glass p-5 rounded-2xl border border-neutral-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-tech uppercase text-neutral-400">Available Slots</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-heading font-bold text-white">
              {analytics?.remainingSlots || 0}
            </span>
            <span className="text-xs font-tech text-neutral-400">Slots Left</span>
          </div>
          <div className="mt-2 text-[11px] font-tech text-neutral-400">
            {analytics?.pendingRegistrations || 0} Under Review
          </div>
        </div>

      </div>

      {/* Admin Quick Action Shortcuts */}
      <div className="esports-glass p-5 rounded-2xl border border-neutral-800">
        <h3 className="text-xs font-tech uppercase text-neutral-400 font-bold tracking-wider mb-3">
          Organizer Quick Action Center
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          <button
            onClick={() => onNavigateTab('payments')}
            className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-amber-500/30 text-amber-300 flex flex-col items-center justify-center text-center transition-all hover:scale-105"
          >
            <CreditCard className="w-5 h-5 mb-1.5" />
            <span className="text-[11px] font-tech font-bold uppercase leading-tight">Verify Payments</span>
          </button>

          <button
            onClick={() => onNavigateTab('registrations')}
            className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 flex flex-col items-center justify-center text-center transition-all hover:scale-105"
          >
            <Users className="w-5 h-5 mb-1.5 text-blue-400" />
            <span className="text-[11px] font-tech font-bold uppercase leading-tight">All Squads</span>
          </button>

          <button
            onClick={() => onNavigateTab('qr')}
            className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 flex flex-col items-center justify-center text-center transition-all hover:scale-105"
          >
            <QrCode className="w-5 h-5 mb-1.5 text-emerald-400" />
            <span className="text-[11px] font-tech font-bold uppercase leading-tight">Payment QR</span>
          </button>

          <button
            onClick={() => onNavigateTab('settings')}
            className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 flex flex-col items-center justify-center text-center transition-all hover:scale-105"
          >
            <Trophy className="w-5 h-5 mb-1.5 text-amber-400" />
            <span className="text-[11px] font-tech font-bold uppercase leading-tight">Settings</span>
          </button>

          <button
            onClick={() => onNavigateTab('matches')}
            className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 flex flex-col items-center justify-center text-center transition-all hover:scale-105"
          >
            <PlusCircle className="w-5 h-5 mb-1.5 text-purple-400" />
            <span className="text-[11px] font-tech font-bold uppercase leading-tight">Add Match</span>
          </button>

          <button
            onClick={() => onNavigateTab('leaderboard')}
            className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 flex flex-col items-center justify-center text-center transition-all hover:scale-105"
          >
            <TrendingUp className="w-5 h-5 mb-1.5 text-emerald-400" />
            <span className="text-[11px] font-tech font-bold uppercase leading-tight">Scores</span>
          </button>

          <button
            onClick={() => onNavigateTab('announcements')}
            className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 flex flex-col items-center justify-center text-center transition-all hover:scale-105"
          >
            <AlertCircle className="w-5 h-5 mb-1.5 text-orange-400" />
            <span className="text-[11px] font-tech font-bold uppercase leading-tight">Broadcast</span>
          </button>

          <button
            onClick={() => onNavigateTab('exports')}
            className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 flex flex-col items-center justify-center text-center transition-all hover:scale-105"
          >
            <FileSpreadsheet className="w-5 h-5 mb-1.5 text-cyan-400" />
            <span className="text-[11px] font-tech font-bold uppercase leading-tight">Export Data</span>
          </button>
        </div>
      </div>

      {/* Database & Infrastructure Command Telemetry */}
      <div className="esports-glass p-4 rounded-2xl border border-neutral-800/80 bg-neutral-950/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-tech">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-neutral-400 uppercase tracking-wider font-bold">System Infrastructure & Data Integrity:</span>
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-4 text-[11px]">
            <div className="flex items-center space-x-1.5 text-neutral-300">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dedicated Storage Engine: <strong className="text-emerald-400 font-mono">ONLINE</strong></span>
            </div>
            <div className="flex items-center space-x-1.5 text-neutral-300">
              <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
              <span>Uploads Store: <strong className="text-cyan-400 font-mono">ACTIVE</strong></span>
            </div>
            <div className="flex items-center space-x-1.5 text-neutral-300">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>Records Protected: <strong className="text-amber-300 font-mono">{analytics?.totalRegistrations || 0} Squads</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Incoming Registrations Table */}
      <div className="esports-glass rounded-2xl border border-neutral-800 overflow-hidden">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <h4 className="font-heading text-base font-bold uppercase tracking-wider text-neutral-100">
              Latest Incoming Registrations
            </h4>
            <p className="text-[11px] font-tech text-neutral-400">Review newly submitted squads and payment receipts</p>
          </div>

          <button
            onClick={() => onNavigateTab('registrations')}
            className="text-xs font-tech text-amber-400 hover:text-amber-300 flex items-center space-x-1"
          >
            <span>View All Registrations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-tech">
            <thead>
              <tr className="bg-neutral-900/80 border-b border-neutral-800 text-neutral-400 uppercase">
                <th className="py-3 px-4">Reg ID</th>
                <th className="py-3 px-4">Team & College</th>
                <th className="py-3 px-3">Captain Contact</th>
                <th className="py-3 px-3">Payment Status</th>
                <th className="py-3 px-3">Reg Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {recentRegistrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">
                    {reg.registrationNumber}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-heading text-sm font-bold text-neutral-100 uppercase">{reg.teamName}</div>
                    <div className="text-[11px] text-neutral-400">{reg.college}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-neutral-200">{reg.captainName}</div>
                    <div className="text-neutral-500 font-mono text-[10px]">{reg.captainPhone}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      reg.paymentStatus === 'Verified' ? 'bg-emerald-950 text-emerald-400 border border-emerald-700' :
                      reg.paymentStatus === 'Rejected' ? 'bg-red-950 text-red-400 border border-red-700' :
                      'bg-amber-950 text-amber-400 border border-amber-700'
                    }`}>
                      {reg.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      reg.registrationStatus === 'Approved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-700' :
                      reg.registrationStatus === 'Rejected' ? 'bg-red-950 text-red-400 border border-red-700' :
                      'bg-blue-950 text-blue-400 border border-blue-700'
                    }`}>
                      {reg.registrationStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => onOpenDetailModal(reg)}
                      className="px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-[11px]"
                    >
                      Details
                    </button>
                    {reg.paymentStatus !== 'Verified' && (
                      <button
                        onClick={() => onVerifyPayment(reg.id)}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                      >
                        Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
