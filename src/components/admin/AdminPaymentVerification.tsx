import React, { useState } from 'react';
import { CreditCard, CheckCircle2, XCircle, ZoomIn, ShieldCheck, AlertCircle, Eye } from 'lucide-react';
import { Registration, RegistrationStatus, PaymentStatus } from '../../types';

interface AdminPaymentVerificationProps {
  registrations: Registration[];
  onVerifyPayment: (id: string) => void;
  onRejectPayment: (id: string, reason: string) => void;
  onOpenDetailModal: (reg: Registration) => void;
}

export const AdminPaymentVerification: React.FC<AdminPaymentVerificationProps> = ({
  registrations,
  onVerifyPayment,
  onRejectPayment,
  onOpenDetailModal
}) => {
  const [filter, setFilter] = useState<'Pending' | 'Verified' | 'Rejected' | 'ALL'>('Pending');
  const [activeReceipt, setActiveReceipt] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [reason, setReason] = useState('Transaction reference cannot be verified in bank ledger.');

  const filtered = registrations.filter((r) => {
    if (filter === 'ALL') return true;
    return r.paymentStatus === filter;
  });

  const handleConfirmReject = () => {
    if (!rejectId) return;
    onRejectPayment(rejectId, reason);
    setRejectId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-xl font-bold uppercase tracking-wider text-white">
            Payment Verification Queue
          </h3>
          <p className="text-xs text-neutral-400 font-tech">
            Audit proof of payment screenshots against collegiate team transaction IDs.
          </p>
        </div>

        <div className="flex p-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-tech">
          {(['Pending', 'Verified', 'Rejected', 'ALL'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                filter === tab
                  ? 'bg-amber-500 text-neutral-950 font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tab === 'Pending' ? `Pending (${registrations.filter(r => r.paymentStatus === 'Pending').length})` : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div className="esports-glass p-12 rounded-2xl border border-neutral-800 text-center text-neutral-400 space-y-2">
          <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
          <h4 className="font-heading text-lg font-bold text-white uppercase">All Payments Audited</h4>
          <p className="text-xs">No payment records found in the "{filter}" filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((reg) => (
            <div
              key={reg.id}
              className="esports-glass p-5 rounded-2xl border border-neutral-800 flex flex-col justify-between hover:border-neutral-700 transition-all space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-neutral-800">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 font-bold">{reg.registrationNumber}</span>
                    <h4 className="font-heading text-base font-bold text-white uppercase truncate">{reg.teamName}</h4>
                    <span className="text-[11px] text-neutral-400 font-tech truncate block">{reg.college}</span>
                  </div>

                  <span className={`text-[10px] font-tech uppercase px-2 py-0.5 rounded font-bold ${
                    reg.paymentStatus === 'Verified' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                    reg.paymentStatus === 'Rejected' ? 'bg-red-950 text-red-300 border border-red-700' :
                    'bg-amber-950 text-amber-300 border border-amber-700'
                  }`}>
                    {reg.paymentStatus}
                  </span>
                </div>

                {/* Financial meta */}
                <div className="py-2.5 space-y-1 text-xs font-tech">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Method:</span>
                    <span className="text-neutral-200">{reg.payment.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Txn ID:</span>
                    <span className="text-amber-300 font-mono font-bold">{reg.payment.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Amount:</span>
                    <span className="text-emerald-400 font-bold">Rs. {reg.payment.amountPaid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Date:</span>
                    <span className="text-neutral-400 text-[11px]">{reg.payment.paymentDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Captain:</span>
                    <span className="text-neutral-300">{reg.captainName} ({reg.captainPhone})</span>
                  </div>
                </div>

                {/* Screenshot Preview */}
                <div className="mt-2">
                  <span className="text-[10px] font-tech text-neutral-400 block mb-1 uppercase font-semibold">Payment Receipt:</span>
                  {reg.payment.screenshotUrl ? (
                    <div
                      onClick={() => setActiveReceipt(reg.payment.screenshotUrl)}
                      className="relative h-36 rounded-lg bg-neutral-950 border border-neutral-800 overflow-hidden cursor-pointer group flex items-center justify-center"
                    >
                      <img
                        src={reg.payment.screenshotUrl}
                        alt="Receipt"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[11px] font-tech">
                        <ZoomIn className="w-4 h-4 mr-1" />
                        <span>Click to Enlarge</span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-28 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs text-neutral-500">
                      No screenshot uploaded
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenDetailModal(reg)}
                  className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 text-xs font-tech"
                >
                  <Eye className="w-3.5 h-3.5 inline mr-1" />
                  <span>Dossier</span>
                </button>

                <div className="flex items-center space-x-1.5">
                  {reg.paymentStatus !== 'Verified' && (
                    <button
                      onClick={() => onVerifyPayment(reg.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-tech text-xs font-bold transition-all shadow"
                    >
                      Verify
                    </button>
                  )}

                  {reg.paymentStatus !== 'Rejected' && (
                    <button
                      onClick={() => { setRejectId(reg.id); }}
                      className="px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-700/60 font-tech text-xs transition-all"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeReceipt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95"
          onClick={() => setActiveReceipt(null)}
        >
          <div className="relative max-w-2xl max-h-[85vh] bg-neutral-950 rounded-xl border border-neutral-700 p-2">
            <img
              src={activeReceipt}
              alt="Receipt Screenshot"
              className="max-h-[80vh] w-auto mx-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}

      {/* Rejection Prompt */}
      {rejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
          <div className="esports-glass p-6 rounded-2xl border border-red-500/40 max-w-md w-full space-y-4">
            <h3 className="font-heading text-lg font-bold text-white uppercase flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span>Reject Proof of Payment</span>
            </h3>
            <p className="text-xs text-neutral-300">
              Provide the captain with a clear reason why the payment was marked rejected:
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-red-400"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setRejectId(null)}
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

    </div>
  );
};
