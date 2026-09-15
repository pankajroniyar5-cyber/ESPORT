import React, { useState } from 'react';
import { Shield, Lock, Mail, X, AlertCircle, ArrowRight, KeyRound } from 'lucide-react';
import { AdminUser } from '../../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string, user: AdminUser) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('admin@esports.io');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onLoginSuccess(data.token, data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md esports-glass-gold p-6 sm:p-8 rounded-2xl border border-amber-500/40 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center mx-auto text-amber-400 mb-3 shadow-lg shadow-amber-500/20">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-heading font-bold uppercase tracking-wider text-white">
            Admin Console Access
          </h3>
          <p className="text-xs text-neutral-400 font-tech">
            Secure tournament director & referee control portal.
          </p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-tech text-amber-300 space-y-1">
          <div className="flex items-center space-x-1.5 font-bold">
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>Pre-Configured Demo Credentials</span>
          </div>
          <div className="text-[11px] text-neutral-300 flex justify-between pt-0.5">
            <span>Email: <strong className="text-amber-200">admin@esports.io</strong></span>
            <span>Pass: <strong className="text-amber-200">admin123</strong></span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/50 text-red-200 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-tech uppercase text-neutral-300 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@esports.io"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-100 focus:border-amber-400 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-tech uppercase text-neutral-300 mb-1.5">
              Secure Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-100 focus:border-amber-400 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-heading font-bold uppercase tracking-wider text-sm rounded-lg shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Enter Management Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
