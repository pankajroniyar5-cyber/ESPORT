import React, { useState } from 'react';
import { 
  X, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Archive, 
  MessageSquare, 
  CreditCard, 
  Users, 
  Calendar, 
  FileText, 
  ZoomIn, 
  AlertTriangle,
  Send
} from 'lucide-react';
import { Registration, RegistrationStatus, PaymentStatus } from '../../types';

interface RegistrationDetailModalProps {
  registration: Registration | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, regStatus?: RegistrationStatus, payStatus?: PaymentStatus, reason?: string) => void;
  onAddNote: (id: string, text: string) => void;
  onArchive: (id: string, reason: string) => void;
}

export const RegistrationDetailModal: React.FC<RegistrationDetailModalProps> = ({
  registration,
  isOpen,
  onClose,
  onUpdateStatus,
  onAddNote,
  onArchive
}) => {
  const [noteText, setNoteText] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('Transaction ID does not match account records.');
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [archiveReason, setArchiveReason] = useState('Squad requested withdrawal or failed document verification.');

  if (!isOpen || !registration) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    onAddNote(registration.id, noteText.trim());
    setNoteText('');
  };

  const handleConfirmReject = () => {
    onUpdateStatus(registration.id, undefined, 'Rejected', rejectionReason);
    setRejectModalOpen(false);
  };

  const handleConfirmArchive = () => {
    onArchive(registration.id, archiveReason);
    setArchiveModalOpen(false);
    onClose();
  };

  const cleanPhone = registration.captainWhatsApp
    ? registration.captainWhatsApp.replace(/\D/g, '')
    : registration.captainPhone.replace(/\D/g, '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl esports-glass p-6 sm:p-8 rounded-2xl border border-neutral-700 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-neutral-800">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="font-mono text-xs font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                {registration.registrationNumber}
              </span>
              <span className={`text-[10px] font-tech uppercase px-2 py-0.5 rounded font-bold ${
                registration.registrationStatus === 'Approved' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                registration.registrationStatus === 'Rejected' ? 'bg-red-950 text-red-300 border border-red-700' :
                'bg-blue-950 text-blue-300 border border-blue-700'
              }`}>
                {registration.registrationStatus}
              </span>
              <span className={`text-[10px] font-tech uppercase px-2 py-0.5 rounded font-bold ${
                registration.paymentStatus === 'Verified' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                registration.paymentStatus === 'Rejected' ? 'bg-red-950 text-red-300 border border-red-700' :
                'bg-amber-950 text-amber-300 border border-amber-700'
              }`}>
                Payment: {registration.paymentStatus}
              </span>
            </div>
            <h2 className="text-2xl font-heading font-bold text-white uppercase mt-1">
              {registration.teamName}
            </h2>
            <p className="text-xs text-neutral-400 font-tech">
              {registration.college} • {registration.city} • Registered on {new Date(registration.createdAt).toLocaleString()}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Decision Action Bar */}
        <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-tech text-neutral-400 uppercase">Quick Actions:</span>
            
            {registration.paymentStatus !== 'Verified' && (
              <button
                onClick={() => onUpdateStatus(registration.id, undefined, 'Verified', 'Payment verified by administrator')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-tech text-xs font-bold transition-all shadow"
              >
                Verify Payment
              </button>
            )}

            {registration.paymentStatus !== 'Rejected' && (
              <button
                onClick={() => setRejectModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 border border-red-700/60 text-red-200 font-tech text-xs transition-all"
              >
                Reject Payment
              </button>
            )}

            {registration.registrationStatus !== 'Approved' && (
              <button
                onClick={() => onUpdateStatus(registration.id, 'Approved', undefined)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-tech text-xs font-bold transition-all shadow"
              >
                Approve Team
              </button>
            )}

            {registration.registrationStatus !== 'Waitlisted' && (
              <button
                onClick={() => onUpdateStatus(registration.id, 'Waitlisted', undefined)}
                className="px-3 py-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800 border border-purple-700/60 text-purple-200 font-tech text-xs"
              >
                Waitlist
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={`https://wa.me/${cleanPhone}?text=Hello%20Captain%20*${encodeURIComponent(registration.captainName)}*%20(${encodeURIComponent(registration.teamName)}),%20this%20is%20the%20Free%20Fire%20Tournament%20Committee.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-700/60 text-xs font-tech flex items-center space-x-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Captain</span>
            </a>

            <button
              onClick={() => setArchiveModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-red-950/40 text-neutral-400 hover:text-red-300 border border-neutral-800 text-xs font-tech flex items-center space-x-1 transition-colors"
              title="Soft-delete without losing data"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Archive</span>
            </button>
          </div>
        </div>

        {/* 2-Column Grid: Team Info & Payment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left: Captain & Squad Roster */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-2">
              <h4 className="text-xs font-tech uppercase text-amber-400 font-bold tracking-wider flex items-center space-x-1.5">
                <Users className="w-4 h-4" />
                <span>Captain Details</span>
              </h4>
              <div className="text-xs font-tech space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Full Name:</span>
                  <span className="text-neutral-200 font-semibold">{registration.captainName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Phone:</span>
                  <span className="text-neutral-200 font-mono">{registration.captainPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">WhatsApp:</span>
                  <span className="text-neutral-200 font-mono">{registration.captainWhatsApp || registration.captainPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Email:</span>
                  <span className="text-neutral-200">{registration.captainEmail}</span>
                </div>
              </div>
            </div>

            {/* Roster Table */}
            <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-2">
              <h4 className="text-xs font-tech uppercase text-amber-400 font-bold tracking-wider">
                Roster & Free Fire UIDs ({registration.players.length} Players)
              </h4>
              <div className="space-y-2">
                {registration.players.map((p, idx) => (
                  <div key={idx} className="p-2 rounded bg-neutral-900/60 border border-neutral-800/80 text-xs font-tech flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-neutral-200">
                        {p.fullName} <span className="text-amber-400">({p.inGameName})</span>
                      </div>
                      <span className="text-[10px] text-neutral-500">{p.role}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-amber-300 font-bold">UID: {p.freeFireUid}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Payment Details & Screenshot */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-2">
              <h4 className="text-xs font-tech uppercase text-amber-400 font-bold tracking-wider flex items-center space-x-1.5">
                <CreditCard className="w-4 h-4" />
                <span>Financial Transaction Record</span>
              </h4>

              <div className="text-xs font-tech space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Method:</span>
                  <span className="text-neutral-200 font-semibold">{registration.payment.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Transaction ID:</span>
                  <span className="text-amber-300 font-mono font-bold">{registration.payment.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Amount Paid:</span>
                  <span className="text-emerald-400 font-bold text-sm">Rs. {registration.payment.amountPaid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Payment Date:</span>
                  <span className="text-neutral-300">{registration.payment.paymentDate}</span>
                </div>
                {registration.payment.verifiedAt && (
                  <div className="flex justify-between pt-1 border-t border-neutral-800/60 text-emerald-400">
                    <span>Verified By:</span>
                    <span>{registration.payment.verifiedBy} ({new Date(registration.payment.verifiedAt).toLocaleDateString()})</span>
                  </div>
                )}
                {registration.payment.rejectionReason && (
                  <div className="pt-1 text-red-400">
                    <span className="block font-bold">Rejection Note:</span>
                    <span>{registration.payment.rejectionReason}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Screenshot Box with Zoom */}
            <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-tech uppercase text-neutral-400 font-bold">Payment Receipt Screenshot</span>
                {registration.payment.screenshotUrl && (
                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="text-[11px] font-tech text-amber-400 hover:text-amber-300 flex items-center space-x-1"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Expand</span>
                  </button>
                )}
              </div>

              {registration.payment.screenshotUrl ? (
                <div 
                  onClick={() => setLightboxOpen(true)}
                  className="relative h-44 rounded-lg overflow-hidden border border-neutral-800 cursor-pointer group bg-neutral-900 flex items-center justify-center"
                >
                  <img
                    src={registration.payment.screenshotUrl}
                    alt="Payment Screenshot"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-tech">
                    Click to Open Fullscreen Lightbox
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-neutral-500 font-tech">
                  No payment screenshot uploaded.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Admin Notes & Status Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-neutral-800">
          
          {/* Notes */}
          <div className="space-y-3">
            <h4 className="text-xs font-tech uppercase text-neutral-400 font-bold tracking-wider">
              Internal Admin Notes ({registration.adminNotes.length})
            </h4>

            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {registration.adminNotes.length === 0 ? (
                <span className="text-xs text-neutral-500 font-tech">No notes added yet.</span>
              ) : (
                registration.adminNotes.map((n) => (
                  <div key={n.id} className="p-2.5 rounded bg-neutral-900 border border-neutral-800 text-xs font-tech">
                    <div className="flex justify-between text-[10px] text-neutral-500">
                      <span className="text-amber-400 font-semibold">{n.author}</span>
                      <span>{new Date(n.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-neutral-200 mt-1">{n.text}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
              <input
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add confidential admin note..."
                className="flex-1 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg text-xs font-bold"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-tech uppercase text-neutral-400 font-bold tracking-wider">
              Audit & Status Transition History
            </h4>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {registration.statusHistory.map((sh) => (
                <div key={sh.id} className="p-2 rounded bg-neutral-900/60 border border-neutral-800 text-[11px] font-tech text-neutral-300 flex justify-between items-start">
                  <div>
                    <span className="text-neutral-400">{sh.type === 'payment' ? 'Payment' : 'Roster'}:</span>{' '}
                    <span className="font-bold text-white">{sh.previousStatus} → {sh.newStatus}</span>
                    {sh.note && <p className="text-neutral-500 text-[10px]">{sh.note}</p>}
                  </div>
                  <span className="text-neutral-500 text-[10px] whitespace-nowrap">
                    {new Date(sh.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Lightbox Modal */}
        {lightboxOpen && registration.payment.screenshotUrl && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95"
            onClick={() => setLightboxOpen(false)}
          >
            <div className="relative max-w-3xl max-h-[90vh] overflow-hidden rounded-xl border border-neutral-700 bg-neutral-950 p-2">
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-800"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={registration.payment.screenshotUrl}
                alt="Full Payment Screenshot"
                className="max-h-[85vh] w-auto mx-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        )}

        {/* Rejection Reason Modal */}
        {rejectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
            <div className="esports-glass p-6 rounded-2xl border border-red-500/40 max-w-md w-full space-y-4">
              <h3 className="font-heading text-lg font-bold text-white uppercase flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span>Reject Payment Verification</span>
              </h3>
              <p className="text-xs text-neutral-300">
                Specify the exact reason for rejecting this payment receipt so the captain can see it when tracking status.
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-red-400"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setRejectModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 text-neutral-400 text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReject}
                  className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Archive Modal */}
        {archiveModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
            <div className="esports-glass p-6 rounded-2xl border border-amber-500/40 max-w-md w-full space-y-4">
              <h3 className="font-heading text-lg font-bold text-white uppercase flex items-center space-x-2">
                <Archive className="w-5 h-5 text-amber-400" />
                <span>Archive Team Registration</span>
              </h3>
              <p className="text-xs text-neutral-300">
                This safely removes the team from active tables without permanently deleting any data. You can restore it anytime from the Archived Registrations tab.
              </p>
              <textarea
                value={archiveReason}
                onChange={(e) => setArchiveReason(e.target.value)}
                rows={3}
                className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setArchiveModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 text-neutral-400 text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmArchive}
                  className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs"
                >
                  Archive Team
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
