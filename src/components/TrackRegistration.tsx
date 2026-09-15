import React, { useState, useEffect } from 'react';
import { Search, Shield, CheckCircle2, Clock, XCircle, AlertCircle, Calendar, MessageSquare, ArrowLeft } from 'lucide-react';
import { RegistrationStatus, PaymentStatus, StatusHistoryItem } from '../types';

interface TrackRegistrationProps {
  initialRegId?: string;
  initialVerify?: string;
  onGoBack: () => void;
  whatsappNumber?: string;
}

export const TrackRegistration: React.FC<TrackRegistrationProps> = ({
  initialRegId = '',
  initialVerify = '',
  onGoBack,
  whatsappNumber
}) => {
  const [regId, setRegId] = useState(initialRegId);
  const [verifyField, setVerifyField] = useState(initialVerify);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  useEffect(() => {
    if (initialRegId && initialVerify) {
      handleSearch();
    }
  }, [initialRegId, initialVerify]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!regId.trim() || !verifyField.trim()) {
      setError('Please provide both your Registration ID and Captain Phone/Email.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/register/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId: regId.trim(), verifyField: verifyField.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'No matching registration found.');
      }
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Error tracking registration.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: RegistrationStatus) => {
    switch (status) {
      case 'Approved':
        return <span className="px-3 py-1 rounded-full text-xs font-tech font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">🟢 Approved & Qualified</span>;
      case 'Under Review':
        return <span className="px-3 py-1 rounded-full text-xs font-tech font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/40">🟡 Under Review</span>;
      case 'Rejected':
        return <span className="px-3 py-1 rounded-full text-xs font-tech font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/40">🔴 Rejected</span>;
      case 'Waitlisted':
        return <span className="px-3 py-1 rounded-full text-xs font-tech font-bold uppercase bg-purple-500/20 text-purple-400 border border-purple-500/40">🟣 Waitlisted</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-tech font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/40">🔵 Submitted</span>;
    }
  };

  const getPaymentBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'Verified':
        return <span className="px-2.5 py-0.5 rounded text-xs font-tech font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700">Payment Verified</span>;
      case 'Rejected':
        return <span className="px-2.5 py-0.5 rounded text-xs font-tech font-semibold bg-red-950 text-red-300 border border-red-700">Payment Rejected</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded text-xs font-tech font-semibold bg-amber-950 text-amber-300 border border-amber-700">Payment Under Review</span>;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6">
      
      <button
        onClick={onGoBack}
        className="flex items-center space-x-1.5 text-xs font-tech text-neutral-400 hover:text-amber-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Tournament Portal</span>
      </button>

      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-xs font-tech uppercase tracking-widest text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
          Live Verification
        </span>
        <h2 className="text-3xl font-heading font-bold text-neutral-100 uppercase tracking-wide mt-2">
          Track Squad Registration
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Verify your squad's payment status, roster validation, and official bracket qualification.
        </p>
      </div>

      {/* Search Card */}
      <div className="esports-glass p-6 rounded-2xl border border-neutral-800 shadow-xl mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-tech uppercase text-neutral-300 mb-1.5">
                Registration ID
              </label>
              <input
                type="text"
                value={regId}
                onChange={(e) => setRegId(e.target.value)}
                placeholder="e.g. FFCC-2026-0001"
                className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-neutral-100 focus:border-amber-400 focus:outline-none uppercase font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-tech uppercase text-neutral-300 mb-1.5">
                Captain Phone or Email
              </label>
              <input
                type="text"
                value={verifyField}
                onChange={(e) => setVerifyField(e.target.value)}
                placeholder="Phone or Email used during registration"
                className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-neutral-100 focus:border-amber-400 focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-heading font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Looking up record...</span>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Search Registration Record</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error View */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-sm flex items-start space-x-3 mb-6">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block">Record Not Found</strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Result View */}
      {result && (
        <div className="esports-glass p-6 sm:p-8 rounded-2xl border border-neutral-800 space-y-6 animate-fade-in shadow-2xl">
          
          {/* Top Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-800">
            <div>
              <span className="text-[10px] font-tech text-amber-400 font-bold uppercase tracking-wider">
                Registration ID: {result.registrationNumber}
              </span>
              <h3 className="text-2xl font-heading font-bold text-white uppercase mt-0.5">
                {result.teamName}
              </h3>
              <p className="text-xs text-neutral-400 font-tech">
                {result.college} • {result.city}
              </p>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-1.5">
              {getStatusBadge(result.registrationStatus)}
              {getPaymentBadge(result.paymentStatus)}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-neutral-950/80 border border-neutral-800/80 text-xs font-tech">
            <div>
              <span className="text-neutral-500 block">Captain Name:</span>
              <span className="text-neutral-200 font-semibold">{result.captainName}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Payment Method:</span>
              <span className="text-neutral-200">{result.paymentMethod}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Fee Paid:</span>
              <span className="text-emerald-400 font-bold">Rs. {result.amountPaid}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Submission Date:</span>
              <span className="text-neutral-300">
                {new Date(result.submittedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Rejection Warning if applicable */}
          {result.paymentStatus === 'Rejected' && result.rejectionReason && (
            <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 text-xs text-red-200 space-y-1">
              <strong className="font-semibold block text-red-400">Payment Issue Reported by Admin:</strong>
              <p>{result.rejectionReason}</p>
              <p className="text-neutral-400 pt-1">Please reach out to the tournament organizer on WhatsApp to resolve this.</p>
            </div>
          )}

          {/* Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-tech uppercase text-neutral-400 font-bold tracking-wider">
              Registration Lifecycle History
            </h4>
            
            <div className="space-y-2.5">
              {result.statusHistory && result.statusHistory.map((item: StatusHistoryItem) => (
                <div key={item.id} className="flex items-start space-x-3 text-xs font-tech p-3 rounded-lg bg-neutral-900/60 border border-neutral-800">
                  <Clock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-200 font-medium">
                        {item.type === 'payment' ? 'Payment Status' : 'Roster Review'}: {item.previousStatus} → <strong className="text-amber-300">{item.newStatus}</strong>
                      </span>
                      <span className="text-neutral-500 text-[11px]">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {item.note && (
                      <p className="text-neutral-400 text-[11px] mt-0.5">{item.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp Action */}
          {whatsappNumber && (
            <div className="pt-2">
              <a
                href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=Hello%20Organizer,%20inquiring%20about%20my%20registration%20ID%20*${result.registrationNumber}*%20(Team%20${encodeURIComponent(result.teamName)}).`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white font-heading font-semibold uppercase tracking-wider text-xs flex items-center justify-center space-x-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact Organizer on WhatsApp</span>
              </a>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
