import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  CreditCard, 
  CheckCircle2, 
  Upload, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  QrCode, 
  Copy, 
  Check, 
  Printer, 
  Share2, 
  MessageSquare,
  HelpCircle,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TournamentSettings, PaymentQRCode, Player, Registration } from '../types';

interface RegistrationWizardProps {
  settings: TournamentSettings | null;
  activeQR: PaymentQRCode | null;
  onViewTrack: (regId: string, phone: string) => void;
  onGoHome: () => void;
}

export const RegistrationWizard: React.FC<RegistrationWizardProps> = ({
  settings,
  activeQR,
  onViewTrack,
  onGoHome
}) => {
  const [step, setStep] = useState<number>(1);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Step 1: Team & Captain
  const [teamName, setTeamName] = useState('');
  const [college, setCollege] = useState('');
  const [city, setCity] = useState('');
  const [captainName, setCaptainName] = useState('');
  const [captainPhone, setCaptainPhone] = useState('');
  const [captainWhatsApp, setCaptainWhatsApp] = useState('');
  const [captainEmail, setCaptainEmail] = useState('');
  const [teamLogoUrl, setTeamLogoUrl] = useState('');

  // Step 2: Players Roster
  const [players, setPlayers] = useState<Player[]>([
    { fullName: '', inGameName: '', freeFireUid: '', role: 'Captain', isCaptain: true },
    { fullName: '', inGameName: '', freeFireUid: '', role: 'Rusher' },
    { fullName: '', inGameName: '', freeFireUid: '', role: 'Sniper' },
    { fullName: '', inGameName: '', freeFireUid: '', role: 'Assault' },
    { fullName: '', inGameName: '', freeFireUid: '', role: 'Substitute' },
  ]);

  // Step 3: Payment
  const expectedFee = settings?.registrationFee || 500;
  const currency = settings?.currency || 'Rs.';
  const [paymentMethod, setPaymentMethod] = useState('eSewa');
  const [transactionId, setTransactionId] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().substring(0, 10));
  const [amountPaid, setAmountPaid] = useState<number>(expectedFee);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdRegistration, setCreatedRegistration] = useState<Registration | null>(null);

  // Sync Captain info to Player 0
  const handleCaptainNameChange = (val: string) => {
    setCaptainName(val);
    setPlayers(prev => {
      const copy = [...prev];
      copy[0].fullName = val;
      return copy;
    });
  };

  const handlePlayerChange = (index: number, field: keyof Player, value: any) => {
    setPlayers(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      if (index === 0 && field === 'fullName') {
        setCaptainName(value);
      }
      return copy;
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 8 * 1024 * 1024) {
        setSubmitError('File size exceeds 8MB. Please select a smaller screenshot.');
        return;
      }
      setScreenshotFile(file);
      const url = URL.createObjectURL(file);
      setScreenshotPreview(url);
      setSubmitError(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  // Validation
  const validateStep1 = () => {
    if (!teamName.trim()) return 'Team Name is required';
    if (!college.trim()) return 'College / University name is required';
    if (!city.trim()) return 'City is required';
    if (!captainName.trim()) return 'Captain Name is required';
    if (!captainPhone.trim() || captainPhone.trim().length < 8) return 'Valid Captain Phone Number is required';
    if (!captainEmail.trim() || !captainEmail.includes('@')) return 'Valid Captain Email is required';
    return null;
  };

  const validateStep2 = () => {
    // Check main 4 players
    for (let i = 0; i < 4; i++) {
      const p = players[i];
      if (!p.fullName.trim()) return `Player ${i + 1} (${p.role}) Full Name is required`;
      if (!p.inGameName.trim()) return `Player ${i + 1} (${p.role}) In-Game Name (IGN) is required`;
      if (!p.freeFireUid.trim() || p.freeFireUid.trim().length < 6) return `Player ${i + 1} Free Fire UID must be at least 6 digits`;
    }

    // Check duplicate UIDs
    const uids = players.map(p => p.freeFireUid.trim()).filter(Boolean);
    const uniqueUids = new Set(uids);
    if (uniqueUids.size !== uids.length) {
      return 'Each player must have a unique Free Fire UID. Duplicate UIDs detected in roster.';
    }

    return null;
  };

  const validateStep3 = () => {
    if (!transactionId.trim()) return 'Payment Transaction ID / Reference Number is required';
    if (!screenshotFile && !screenshotPreview) return 'Please upload a clear screenshot of your completed payment receipt';
    return null;
  };

  const handleNext = () => {
    setSubmitError(null);
    if (step === 1) {
      const err = validateStep1();
      if (err) {
        setSubmitError(err);
        return;
      }
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 2) {
      const err = validateStep2();
      if (err) {
        setSubmitError(err);
        return;
      }
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 3) {
      const err = validateStep3();
      if (err) {
        setSubmitError(err);
        return;
      }
      setStep(4); // Review
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    setSubmitError(null);
    setStep(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitRegistration = async () => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append('teamName', teamName);
      formData.append('college', college);
      formData.append('city', city);
      formData.append('captainName', captainName);
      formData.append('captainPhone', captainPhone);
      formData.append('captainWhatsApp', captainWhatsApp || captainPhone);
      formData.append('captainEmail', captainEmail);
      formData.append('teamLogoUrl', teamLogoUrl);
      formData.append('players', JSON.stringify(players));
      formData.append('paymentMethod', paymentMethod);
      formData.append('transactionId', transactionId);
      formData.append('paymentDate', paymentDate);
      formData.append('amountPaid', String(amountPaid));

      if (screenshotFile) {
        formData.append('screenshot', screenshotFile);
      }

      const res = await fetch('/api/register', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit registration');
      }

      setCreatedRegistration(data.registration);
      setStep(5); // Success step
      
      // Trigger confetti effect
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Registration error:', err);
      setSubmitError(err.message || 'An error occurred while submitting. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6">
      
      {/* Title & Step Tracker */}
      <div className="text-center mb-8">
        <span className="text-xs font-tech font-bold uppercase tracking-widest text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
          Official Team Registration
        </span>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-neutral-100 uppercase tracking-wide mt-2">
          {step === 5 ? 'Registration Confirmed' : 'Squad Registration Portal'}
        </h2>
        <p className="text-neutral-400 text-sm mt-1">
          {settings?.tournamentName} — Season {settings?.season}
        </p>

        {/* Step Indicator Progress Bar */}
        {step < 5 && (
          <div className="mt-8 flex items-center justify-between max-w-2xl mx-auto relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-800 -translate-y-1/2 -z-10" />
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-amber-500 -translate-y-1/2 -z-10 transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />

            {[
              { num: 1, label: 'Team Info' },
              { num: 2, label: 'Player UIDs' },
              { num: 3, label: 'Payment' },
              { num: 4, label: 'Review' },
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center bg-neutral-950 px-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-tech text-xs font-bold transition-all ${
                    step === s.num
                      ? 'bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/30 scale-110'
                      : step > s.num
                      ? 'bg-emerald-500 text-neutral-950'
                      : 'bg-neutral-900 text-neutral-500 border border-neutral-800'
                  }`}
                >
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className={`text-[11px] font-tech uppercase mt-1.5 ${step >= s.num ? 'text-neutral-200 font-semibold' : 'text-neutral-500'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error alert */}
      {submitError && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start space-x-3 text-red-200 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block">Validation Alert</strong>
            <span>{submitError}</span>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 1: TEAM & CAPTAIN DETAILS */}
      {/* ======================================================== */}
      {step === 1 && (
        <div className="esports-glass p-6 sm:p-8 rounded-2xl border border-neutral-800 space-y-6">
          <div className="border-b border-neutral-800 pb-4">
            <h3 className="text-lg font-heading font-bold text-neutral-100 uppercase tracking-wide flex items-center space-x-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <span>Step 1: Team & Captain Information</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-1">Provide your squad identity and captain primary contact details.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-tech uppercase text-neutral-300 mb-1.5">
                Team Name <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. Apex Predators, Crimson Wolves"
                className="w-full px-4 py-2.5 bg-neutral-900/90 border border-neutral-700/80 rounded-lg text-sm text-neutral-100 focus:border-amber-400 focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-tech uppercase text-neutral-300 mb-1.5">
                College / Institution / Org <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. Kathmandu Institute of Tech, St. Xavier"
                className="w-full px-4 py-2.5 bg-neutral-900/90 border border-neutral-700/80 rounded-lg text-sm text-neutral-100 focus:border-amber-400 focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-tech uppercase text-neutral-300 mb-1.5">
                City / District <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Kathmandu, Pokhara, Lalitpur"
                className="w-full px-4 py-2.5 bg-neutral-900/90 border border-neutral-700/80 rounded-lg text-sm text-neutral-100 focus:border-amber-400 focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-tech uppercase text-neutral-300 mb-1.5">
                Team Logo URL (Optional)
              </label>
              <input
                type="text"
                value={teamLogoUrl}
                onChange={(e) => setTeamLogoUrl(e.target.value)}
                placeholder="https://... image link"
                className="w-full px-4 py-2.5 bg-neutral-900/90 border border-neutral-700/80 rounded-lg text-sm text-neutral-100 focus:border-amber-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800">
            <h4 className="text-sm font-heading font-bold text-amber-400 uppercase tracking-wider mb-4">
              Captain Contact Information (Confidential)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-tech uppercase text-neutral-300 mb-1.5">
                  Captain Full Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  value={captainName}
                  onChange={(e) => handleCaptainNameChange(e.target.value)}
                  placeholder="e.g. Aayush Thapa"
                  className="w-full px-4 py-2.5 bg-neutral-900/90 border border-neutral-700/80 rounded-lg text-sm text-neutral-100 focus:border-amber-400 focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-tech uppercase text-neutral-300 mb-1.5">
                  Captain Phone Number <span className="text-amber-400">*</span>
                </label>
                <input
                  type="tel"
                  value={captainPhone}
                  onChange={(e) => setCaptainPhone(e.target.value)}
                  placeholder="e.g. +977 9801234567"
                  className="w-full px-4 py-2.5 bg-neutral-900/90 border border-neutral-700/80 rounded-lg text-sm text-neutral-100 focus:border-amber-400 focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-tech uppercase text-neutral-300 mb-1.5">
                  Captain WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={captainWhatsApp}
                  onChange={(e) => setCaptainWhatsApp(e.target.value)}
                  placeholder="Leave empty if same as phone"
                  className="w-full px-4 py-2.5 bg-neutral-900/90 border border-neutral-700/80 rounded-lg text-sm text-neutral-100 focus:border-amber-400 focus:outline-none transition-colors"
                />
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Match room ID & password will be broadcasted to this number.
                </span>
              </div>

              <div>
                <label className="block text-xs font-tech uppercase text-neutral-300 mb-1.5">
                  Captain Email Address <span className="text-amber-400">*</span>
                </label>
                <input
                  type="email"
                  value={captainEmail}
                  onChange={(e) => setCaptainEmail(e.target.value)}
                  placeholder="captain@college.edu"
                  className="w-full px-4 py-2.5 bg-neutral-900/90 border border-neutral-700/80 rounded-lg text-sm text-neutral-100 focus:border-amber-400 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-heading font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-amber-500/25 transition-all"
            >
              <span>Next: Player UIDs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 2: PLAYER INFORMATION & UIDS */}
      {/* ======================================================== */}
      {step === 2 && (
        <div className="esports-glass p-6 sm:p-8 rounded-2xl border border-neutral-800 space-y-6">
          <div className="border-b border-neutral-800 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-heading font-bold text-neutral-100 uppercase tracking-wide flex items-center space-x-2">
                <Users className="w-5 h-5 text-amber-400" />
                <span>Step 2: 5-Player Squad Roster</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Enter accurate Free Fire UIDs for all players. In-game names will be checked in the lobby.
              </p>
            </div>
            <span className="text-xs font-tech px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-amber-400 rounded">
              4 Starters + 1 Sub
            </span>
          </div>

          <div className="space-y-4">
            {players.map((player, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center font-tech text-xs text-neutral-300 font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-heading font-bold text-sm text-neutral-200 uppercase">
                      {idx === 0 ? 'Team Captain' : idx === 4 ? 'Substitute Player (Optional)' : `Player ${idx + 1}`}
                    </span>
                  </div>

                  <span className="text-[10px] font-tech uppercase px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                    {player.role}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-tech text-neutral-400 uppercase mb-1">
                      Full Legal Name {idx < 4 && <span className="text-amber-400">*</span>}
                    </label>
                    <input
                      type="text"
                      value={player.fullName}
                      onChange={(e) => handlePlayerChange(idx, 'fullName', e.target.value)}
                      placeholder="e.g. Rohan Shrestha"
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-md text-xs text-neutral-100 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-tech text-neutral-400 uppercase mb-1">
                      In-Game Name (IGN) {idx < 4 && <span className="text-amber-400">*</span>}
                    </label>
                    <input
                      type="text"
                      value={player.inGameName}
                      onChange={(e) => handlePlayerChange(idx, 'inGameName', e.target.value)}
                      placeholder="e.g. APEX_VIPER"
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-md text-xs text-neutral-100 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-tech text-neutral-400 uppercase mb-1">
                      Free Fire UID {idx < 4 && <span className="text-amber-400">*</span>}
                    </label>
                    <input
                      type="text"
                      value={player.freeFireUid}
                      onChange={(e) => handlePlayerChange(idx, 'freeFireUid', e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 1098273645"
                      maxLength={12}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-md text-xs text-amber-300 font-tech focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-neutral-800">
            <button
              onClick={handlePrevious}
              className="flex items-center space-x-2 px-5 py-2.5 text-xs font-heading font-semibold uppercase text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-heading font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-amber-500/25 transition-all"
            >
              <span>Next: Payment Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 3: PAYMENT & ACTIVE QR CODE (FROM DB) */}
      {/* ======================================================== */}
      {step === 3 && (
        <div className="esports-glass p-6 sm:p-8 rounded-2xl border border-neutral-800 space-y-6">
          <div className="border-b border-neutral-800 pb-4">
            <h3 className="text-lg font-heading font-bold text-neutral-100 uppercase tracking-wide flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-amber-400" />
              <span>Step 3: Registration Fee & Payment QR</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Scan the active QR code below, complete payment, and upload the transaction screenshot.
            </p>
          </div>

          {/* Payment QR Presentation Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-5 rounded-2xl bg-neutral-950/70 border border-amber-500/30">
            
            {/* QR Image Frame */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-neutral-900/90 rounded-xl border border-neutral-800">
              <div className="relative p-2 bg-white rounded-xl shadow-lg">
                {activeQR?.qrImageUrl ? (
                  <img
                    src={activeQR.qrImageUrl}
                    alt="Active Tournament Payment QR"
                    className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center bg-neutral-200 text-neutral-800 font-tech text-xs text-center p-4">
                    QR Code Loading...
                  </div>
                )}
              </div>
              <span className="text-[11px] font-tech text-amber-400 mt-2 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Active Payment QR Code</span>
              </span>
            </div>

            {/* Payment Instructions & Account Info */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <span className="text-[10px] font-tech uppercase tracking-widest text-neutral-400">Total Entry Fee</span>
                <div className="text-3xl font-heading font-bold text-emerald-400">
                  {currency} {expectedFee} <span className="text-xs font-normal text-neutral-400">per squad</span>
                </div>
              </div>

              <div className="space-y-2 text-xs font-tech bg-neutral-900/60 p-3.5 rounded-lg border border-neutral-800">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Account Name:</span>
                  <span className="text-neutral-100 font-semibold">{activeQR?.accountName || 'Campus Esports Committee'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Account / Wallet No:</span>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-amber-300 font-bold">{activeQR?.accountNumber || '9801234567'}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(activeQR?.accountNumber || '9801234567')}
                      className="p-1 text-neutral-400 hover:text-white rounded bg-neutral-800"
                      title="Copy Account Number"
                    >
                      {copiedAccount ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Accepted Wallets:</span>
                  <span className="text-neutral-200">{activeQR?.paymentMethod || 'eSewa, Khalti, Bank Transfer'}</span>
                </div>
              </div>

              <div className="text-xs text-neutral-300 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20 leading-relaxed">
                <strong className="text-amber-300 block mb-1">Important Instruction:</strong>
                {activeQR?.instructions || 
                  'In your payment remarks/memo, write your Team Name (e.g., "' + (teamName || 'YourTeam') + '"). Save the receipt screenshot immediately.'}
              </div>
            </div>
          </div>

          {/* User Payment Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-tech uppercase text-neutral-300 mb-1.5">
                Payment Method Used <span className="text-amber-400">*</span>
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-neutral-100 focus:border-amber-400 focus:outline-none"
              >
                <option value="eSewa">eSewa Mobile Wallet</option>
                <option value="Khalti">Khalti Digital Wallet</option>
                <option value="Bank Transfer">Direct Bank Transfer / IPS</option>
                <option value="UPI">UPI / QR Code</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-tech uppercase text-neutral-300 mb-1.5">
                Transaction ID / Ref # <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g. TXN-98411234 or Ref No"
                className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-amber-300 font-tech focus:border-amber-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-tech uppercase text-neutral-300 mb-1.5">
                Payment Date <span className="text-amber-400">*</span>
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-neutral-100 focus:border-amber-400 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Screenshot Upload Area */}
          <div>
            <label className="block text-xs font-tech uppercase text-neutral-300 mb-2">
              Upload Payment Screenshot <span className="text-amber-400">*</span>
            </label>

            <div className="relative border-2 border-dashed border-neutral-700 hover:border-amber-500/60 rounded-xl p-6 text-center bg-neutral-950/60 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="payment-screenshot-input"
              />

              {screenshotPreview ? (
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative max-w-xs max-h-44 rounded-lg overflow-hidden border border-amber-500/40 shadow-lg">
                    <img
                      src={screenshotPreview}
                      alt="Payment Receipt Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-tech text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Receipt selected ({screenshotFile?.name})</span>
                  </span>
                  <span className="text-[11px] text-neutral-400">Click or drag another image to replace</span>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-3 rounded-full bg-neutral-900 text-neutral-400 border border-neutral-800">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-neutral-200 font-medium">
                    Drag and drop payment receipt screenshot, or <span className="text-amber-400 font-semibold underline">browse file</span>
                  </p>
                  <p className="text-[11px] text-neutral-500 font-tech">Supports PNG, JPG, JPEG, WEBP up to 8MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-neutral-800">
            <button
              onClick={handlePrevious}
              className="flex items-center space-x-2 px-5 py-2.5 text-xs font-heading font-semibold uppercase text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-heading font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-amber-500/25 transition-all"
            >
              <span>Review Summary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 4: REVIEW & CONFIRM */}
      {/* ======================================================== */}
      {step === 4 && (
        <div className="esports-glass p-6 sm:p-8 rounded-2xl border border-neutral-800 space-y-6">
          <div className="border-b border-neutral-800 pb-4">
            <h3 className="text-lg font-heading font-bold text-neutral-100 uppercase tracking-wide flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Step 4: Review Registration Details</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-1">Please confirm all information before submitting to the championship committee.</p>
          </div>

          {/* Team Snapshot */}
          <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
            <span className="text-[10px] font-tech uppercase text-amber-400 block mb-2 font-bold tracking-wider">Team Details</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-tech">
              <div>
                <span className="text-neutral-500 block">Team Name:</span>
                <span className="text-neutral-100 font-heading text-base font-bold">{teamName}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">College / Org:</span>
                <span className="text-neutral-200">{college}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">City:</span>
                <span className="text-neutral-200">{city}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Captain:</span>
                <span className="text-neutral-200 font-semibold">{captainName}</span>
              </div>
            </div>
          </div>

          {/* Roster Snapshot */}
          <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
            <span className="text-[10px] font-tech uppercase text-amber-400 block mb-2 font-bold tracking-wider">Squad Roster & Free Fire UIDs</span>
            <div className="space-y-2">
              {players.filter(p => p.fullName && p.freeFireUid).map((p, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-neutral-800/60 last:border-0 font-tech">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded bg-neutral-800 text-neutral-400 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="text-neutral-200 font-medium">{p.fullName}</span>
                    <span className="text-neutral-400">({p.inGameName})</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">{p.role}</span>
                    <span className="text-amber-400 font-bold font-mono">UID: {p.freeFireUid}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Snapshot */}
          <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
            <span className="text-[10px] font-tech uppercase text-amber-400 block mb-2 font-bold tracking-wider">Payment Information</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-tech">
              <div>
                <span className="text-neutral-500 block">Method:</span>
                <span className="text-neutral-200 font-semibold">{paymentMethod}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Amount:</span>
                <span className="text-emerald-400 font-bold text-sm">{currency} {amountPaid}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-neutral-500 block">Transaction ID:</span>
                <span className="text-amber-300 font-mono font-bold truncate block">{transactionId}</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-neutral-950/80 border border-neutral-800 text-xs text-neutral-400 font-tech flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Upon submission, your team receives a permanent Registration ID to track review & lobby approval status.</span>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-neutral-800">
            <button
              onClick={handlePrevious}
              disabled={submitting}
              className="flex items-center space-x-2 px-5 py-2.5 text-xs font-heading font-semibold uppercase text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleSubmitRegistration}
              disabled={submitting}
              className="flex items-center space-x-2 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-neutral-950 font-heading font-bold uppercase tracking-wider rounded-lg shadow-xl shadow-emerald-500/25 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Registration...</span>
                </>
              ) : (
                <>
                  <span>Confirm & Submit Squad</span>
                  <CheckCircle2 className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 5: REGISTRATION CONFIRMED SUCCESS VIEW */}
      {/* ======================================================== */}
      {step === 5 && createdRegistration && (
        <div className="esports-glass p-8 rounded-2xl border border-emerald-500/30 text-center space-y-6 animate-fade-in shadow-2xl">
          
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/30">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>

          <div>
            <span className="text-xs font-tech text-emerald-400 uppercase tracking-widest font-bold">
              Official Registration Submitted
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white uppercase tracking-wide mt-1">
              Welcome, {createdRegistration.teamName}!
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto mt-2">
              Your squad registration has been recorded in the tournament database. Payment verification is currently underway.
            </p>
          </div>

          {/* Registration Key Badge */}
          <div className="max-w-md mx-auto p-4 rounded-xl bg-neutral-950/90 border border-amber-500/40 space-y-2">
            <span className="text-[11px] font-tech text-neutral-400 uppercase">Your Unique Registration ID</span>
            <div className="text-2xl sm:text-3xl font-heading font-bold text-amber-400 tracking-wider">
              {createdRegistration.registrationNumber}
            </div>
            <div className="flex items-center justify-center space-x-2 text-xs font-tech text-neutral-400 pt-1 border-t border-neutral-800">
              <span>Status:</span>
              <span className="text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                Payment Under Review
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onViewTrack(createdRegistration.registrationNumber, captainPhone)}
              className="flex items-center space-x-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-heading font-bold uppercase tracking-wider rounded-lg shadow-md shadow-amber-500/20 transition-all"
            >
              <span>Track Registration Status</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {settings?.contactWhatsApp && (
              <a
                href={`https://wa.me/${settings.contactWhatsApp.replace(/\D/g, '')}?text=Hello%20Tournament%20Organizer,%20my%20team%20*${encodeURIComponent(createdRegistration.teamName)}*%20has%20submitted%20registration%20ID%20*${createdRegistration.registrationNumber}*.%20Transaction%20Ref:%20${transactionId}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-5 py-3 bg-emerald-600/90 hover:bg-emerald-500 text-white font-heading font-semibold uppercase tracking-wider rounded-lg border border-emerald-500/40 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact Organizer on WhatsApp</span>
              </a>
            )}

            <button
              onClick={() => window.print()}
              className="flex items-center space-x-2 px-4 py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 rounded-lg text-xs font-tech transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
          </div>

          <div className="pt-4 text-xs font-tech text-neutral-500">
            Keep your Registration ID and Captain Phone Number secure to track real-time bracket approval.
          </div>
        </div>
      )}

    </div>
  );
};
