import React, { useState, useRef } from 'react';
import { QrCode, Upload, CheckCircle, Trash2, Plus, Sparkles, Image as ImageIcon } from 'lucide-react';
import { PaymentQrConfig } from '../../types';

interface AdminQRSettingsProps {
  qrConfigs: PaymentQrConfig[];
  onAddQr: (qr: Partial<PaymentQrConfig>, file?: File) => Promise<void>;
  onSetActive: (id: string) => Promise<void>;
  onDeleteQr: (id: string) => Promise<void>;
}

export const AdminQRSettings: React.FC<AdminQRSettingsProps> = ({
  qrConfigs,
  onAddQr,
  onSetActive,
  onDeleteQr,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [method, setMethod] = useState('UPI / GPay / PhonePe');
  const [accountName, setAccountName] = useState('Campus Esports Committee');
  const [upiId, setUpiId] = useState('tournament.ff@okaxis');
  const [instructions, setInstructions] = useState('Scan with any UPI app. Enter Team Name in payment remarks and save the screenshot.');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onAddQr({
        method,
        accountName,
        upiId,
        instructions,
        imageUrl: imageUrl.trim() || undefined,
        isActive: qrConfigs.length === 0 // If first one, make it active
      }, selectedFile || undefined);

      setShowAddForm(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setImageUrl('');
    } catch (err: any) {
      alert(err.message || 'Failed to save QR configuration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-xl font-bold uppercase tracking-wider text-white">
            Payment QR Code Management
          </h3>
          <p className="text-xs text-neutral-400 font-tech">
            Configure the dynamic QR code and bank account instructions displayed to squads during Step 3 of registration.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-heading text-xs font-bold uppercase tracking-wider rounded-xl flex items-center space-x-1.5 transition-all shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Close Form' : 'Upload New QR Code'}</span>
        </button>
      </div>

      {/* Add QR Form */}
      {showAddForm && (
        <div className="esports-glass p-6 rounded-2xl border border-amber-500/40 animate-fade-in shadow-xl">
          <h4 className="font-heading text-base font-bold uppercase text-amber-300 mb-4 flex items-center space-x-2">
            <QrCode className="w-5 h-5" />
            <span>Upload or Configure Official Payment QR</span>
          </h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-tech uppercase text-neutral-300 mb-1">
                  Payment Method Title
                </label>
                <input
                  type="text"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  placeholder="e.g. UPI / PhonePe / Google Pay / eSewa"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-tech uppercase text-neutral-300 mb-1">
                  Account / Payee Name
                </label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="e.g. Campus Esports Committee"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-tech uppercase text-neutral-300 mb-1">
                  UPI ID / Wallet Number
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. tournament.ff@okaxis or 9801234567"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-tech uppercase text-neutral-300 mb-1">
                  Direct Image URL (Alternative to File Upload)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... (Optional if uploading file below)"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-tech uppercase text-neutral-300 mb-1">
                Instructions for Registrants
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={2}
                className="w-full p-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* File Upload Zone */}
            <div className="pt-2">
              <label className="block text-xs font-tech uppercase text-neutral-300 mb-1">
                Upload QR Code Image File
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-700 hover:border-amber-400/70 rounded-xl p-5 text-center cursor-pointer bg-neutral-900/60 transition-colors"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                {previewUrl ? (
                  <div className="flex flex-col items-center">
                    <img src={previewUrl} alt="QR Preview" className="w-28 h-28 object-contain rounded-lg border border-neutral-700 mb-2" />
                    <span className="text-xs text-amber-400 font-tech">Click to choose a different QR file</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-neutral-400 mb-1" />
                    <span className="text-xs text-neutral-200 font-tech">Click to browse QR code file (PNG, JPG, WebP)</span>
                    <span className="text-[10px] text-neutral-500 mt-0.5 font-tech">Max 5MB • Automatically scaled</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-neutral-900 text-neutral-400 rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-heading text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all"
              >
                {loading ? 'Saving QR...' : 'Save & Publish QR'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* QR List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {qrConfigs.map((qr) => (
          <div
            key={qr.id}
            className={`esports-glass p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              qr.isActive
                ? 'border-amber-500/60 shadow-lg shadow-amber-500/10'
                : 'border-neutral-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <span className="font-heading text-sm font-bold text-white uppercase truncate">
                  {qr.method}
                </span>

                {qr.isActive ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-tech font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Active in Wizard</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-tech text-neutral-500 bg-neutral-900 border border-neutral-800">
                    Inactive
                  </span>
                )}
              </div>

              {/* QR Image */}
              <div className="my-4 flex justify-center">
                <div className="w-40 h-40 bg-white p-2 rounded-xl shadow-md border border-neutral-300 flex items-center justify-center">
                  <img
                    src={qr.imageUrl}
                    alt={qr.accountName}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="text-xs font-tech space-y-1.5 p-3 rounded-xl bg-neutral-950/80 border border-neutral-800">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Payee:</span>
                  <span className="text-neutral-200 font-semibold">{qr.accountName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">UPI/Wallet:</span>
                  <span className="text-amber-300 font-mono font-bold">{qr.upiId}</span>
                </div>
                <p className="text-[11px] text-neutral-400 pt-1 border-t border-neutral-800/60 leading-tight">
                  {qr.instructions}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 mt-4 border-t border-neutral-800 flex items-center justify-between">
              {!qr.isActive && (
                <button
                  onClick={() => onSetActive(qr.id)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-tech font-bold transition-colors"
                >
                  Set as Active QR
                </button>
              )}

              {qrConfigs.length > 1 && (
                <button
                  onClick={() => {
                    if (confirm('Delete this QR configuration?')) onDeleteQr(qr.id);
                  }}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 transition-colors ml-auto"
                  title="Delete QR"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
