import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Archive, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  MessageSquare,
  ShieldAlert,
  FileText,
  UserCheck
} from 'lucide-react';
import { Registration, RegistrationStatus, PaymentStatus } from '../../types';

interface AdminRegistrationsProps {
  registrations: Registration[];
  onOpenDetailModal: (reg: Registration) => void;
  onUpdateStatus: (id: string, regStatus?: RegistrationStatus, payStatus?: PaymentStatus, reason?: string) => void;
  onArchive: (id: string, reason: string) => void;
  onExportCsv: () => void;
  onExportJson: () => void;
}

export const AdminRegistrations: React.FC<AdminRegistrationsProps> = ({
  registrations,
  onOpenDetailModal,
  onUpdateStatus,
  onArchive,
  onExportCsv,
  onExportJson,
}) => {
  const [search, setSearch] = useState('');
  const [regFilter, setRegFilter] = useState('ALL');
  const [payFilter, setPayFilter] = useState('ALL');
  const [collegeFilter, setCollegeFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Extract unique colleges
  const uniqueColleges = Array.from(new Set(registrations.map(r => r.college).filter(Boolean)));

  // Filter items
  const filtered = registrations.filter((r) => {
    const matchSearch =
      r.teamName.toLowerCase().includes(search.toLowerCase()) ||
      r.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.captainName.toLowerCase().includes(search.toLowerCase()) ||
      r.captainPhone.includes(search) ||
      r.payment.transactionId.toLowerCase().includes(search.toLowerCase());

    const matchReg = regFilter === 'ALL' || r.registrationStatus === regFilter;
    const matchPay = payFilter === 'ALL' || r.paymentStatus === payFilter;
    const matchCollege = collegeFilter === 'ALL' || r.college === collegeFilter;

    return matchSearch && matchReg && matchPay && matchCollege;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-5">
      
      {/* Search and Filters Bar */}
      <div className="esports-glass p-4 rounded-2xl border border-neutral-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search by team, reg ID, captain, phone, or transaction ID..."
              className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-700/80 rounded-lg text-xs text-neutral-100 placeholder-neutral-500 focus:border-amber-400 focus:outline-none font-tech"
            />
          </div>

          {/* Export Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onExportCsv}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-tech transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onExportJson}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-tech transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Full JSON Backup</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-neutral-800/80 text-xs font-tech">
          <div>
            <label className="block text-[10px] text-neutral-400 uppercase mb-1">Registration Status</label>
            <select
              value={regFilter}
              onChange={(e) => { setRegFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-md text-neutral-200 focus:outline-none"
            >
              <option value="ALL">All Registration Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Waitlisted">Waitlisted</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-neutral-400 uppercase mb-1">Payment Status</label>
            <select
              value={payFilter}
              onChange={(e) => { setPayFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-md text-neutral-200 focus:outline-none"
            >
              <option value="ALL">All Payment Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-neutral-400 uppercase mb-1">Filter by College</label>
            <select
              value={collegeFilter}
              onChange={(e) => { setCollegeFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-md text-neutral-200 focus:outline-none"
            >
              <option value="ALL">All Colleges ({uniqueColleges.length})</option>
              {uniqueColleges.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="esports-glass rounded-2xl border border-neutral-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-tech">
            <thead>
              <tr className="bg-neutral-900/90 border-b border-neutral-800 text-neutral-400 uppercase">
                <th className="py-3 px-4">Reg ID</th>
                <th className="py-3 px-4">Team Name</th>
                <th className="py-3 px-3">College / City</th>
                <th className="py-3 px-3">Captain & Phone</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-500">
                    No registrations found matching the criteria.
                  </td>
                </tr>
              ) : (
                currentItems.map((reg) => (
                  <tr key={reg.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      {reg.registrationNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-heading text-sm font-bold text-neutral-100 uppercase">
                        {reg.teamName}
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        {reg.players.length} Roster Players
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-neutral-200 truncate max-w-[150px]">{reg.college}</div>
                      <div className="text-[10px] text-neutral-500">{reg.city}</div>
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
                        reg.registrationStatus === 'Waitlisted' ? 'bg-purple-950 text-purple-400 border border-purple-700' :
                        'bg-blue-950 text-blue-400 border border-blue-700'
                      }`}>
                        {reg.registrationStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">
                      Rs. {reg.payment.amountPaid}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => onOpenDetailModal(reg)}
                        className="px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-[11px] transition-colors"
                        title="View Full Registration Dossier"
                      >
                        <Eye className="w-3.5 h-3.5 inline mr-1" />
                        <span>View</span>
                      </button>

                      {reg.paymentStatus !== 'Verified' && (
                        <button
                          onClick={() => onUpdateStatus(reg.id, undefined, 'Verified')}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors"
                          title="Verify Payment"
                        >
                          Verify
                        </button>
                      )}

                      {reg.registrationStatus !== 'Approved' && (
                        <button
                          onClick={() => onUpdateStatus(reg.id, 'Approved', undefined)}
                          className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] transition-colors"
                          title="Approve Team into Tournament"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="p-3.5 border-t border-neutral-800/80 bg-neutral-950/60 flex items-center justify-between text-xs font-tech text-neutral-400">
          <div>
            Showing {filtered.length === 0 ? 0 : startIndex + 1} to {Math.min(filtered.length, startIndex + itemsPerPage)} of {filtered.length} squads
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
