import React, { useState } from 'react';
import { Shield, Menu, X, Trophy, UserCheck, Calendar, Flame, Award, PhoneCall, LogIn, ExternalLink } from 'lucide-react';
import { TournamentSettings } from '../types';

interface NavbarProps {
  settings: TournamentSettings | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAdminLogin: () => void;
  isAdminLoggedIn: boolean;
  onOpenAdminPortal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  activeTab,
  setActiveTab,
  onOpenAdminLogin,
  isAdminLoggedIn,
  onOpenAdminPortal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'register', label: 'Register Squad', badge: 'OPEN' },
    { id: 'track', label: 'Track Status' },
    { id: 'teams', label: 'Teams' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'prizes', label: 'Prizes & Rules' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 esports-glass border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Dynamic Tournament Name */}
          <div 
            id="nav-brand"
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="relative w-11 h-11 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all">
              <div className="w-full h-full bg-neutral-950 rounded-[7px] flex items-center justify-center overflow-hidden">
                {settings?.logoUrl ? (
                  <img 
                    src={settings.logoUrl} 
                    alt="Logo" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Flame className="w-6 h-6 text-amber-400" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-neutral-950 rounded-full animate-pulse" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading text-xl font-bold tracking-wider text-neutral-100 group-hover:text-amber-400 transition-colors uppercase">
                  {settings?.tournamentName || 'FREE FIRE CAMPUS CUP'}
                </span>
                <span className="text-[10px] font-tech font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  {settings?.season || 'S4'}
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-medium hidden sm:block">
                {settings?.subtitle || 'Inter-Collegiate Esports Championship'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3.5 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'text-amber-400 bg-amber-500/10 font-semibold'
                      : 'text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800/60'
                  }`}
                >
                  <span className="relative z-10 flex items-center space-x-1.5">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-tech font-extrabold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        {item.badge}
                      </span>
                    )}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-amber-400 rounded-full shadow-sm shadow-amber-400" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Register CTA & Admin Portal Access */}
          <div className="hidden md:flex items-center space-x-3">
            {activeTab !== 'register' && (
              <button
                id="nav-quick-register"
                onClick={() => handleNavClick('register')}
                className="px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 rounded-md shadow-md shadow-amber-500/25 transition-all hover:scale-105 active:scale-95"
              >
                Register Squad
              </button>
            )}

            {isAdminLoggedIn ? (
              <button
                id="nav-admin-dashboard"
                onClick={onOpenAdminPortal}
                className="flex items-center space-x-2 px-3.5 py-2 text-xs font-tech font-semibold bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-600/40 rounded-md transition-all shadow-sm"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Console</span>
              </button>
            ) : (
              <button
                id="nav-admin-login-btn"
                onClick={onOpenAdminLogin}
                className="flex items-center space-x-1.5 px-3 py-2 text-xs font-tech text-neutral-400 hover:text-neutral-200 bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 rounded-md transition-all"
                title="Tournament Organizer / Admin Access"
              >
                <Shield className="w-3.5 h-3.5 text-neutral-400" />
                <span>Admin</span>
              </button>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden esports-glass border-b border-neutral-800 px-4 pt-2 pb-6 space-y-2">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center justify-between p-2.5 rounded-lg text-sm text-left ${
                  activeTab === item.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                    : 'bg-neutral-900/60 text-neutral-300 border border-neutral-800/50'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-tech px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (isAdminLoggedIn) onOpenAdminPortal();
                else onOpenAdminLogin();
              }}
              className="flex items-center space-x-2 text-xs font-tech text-neutral-400 hover:text-amber-400 p-2"
            >
              <Shield className="w-4 h-4" />
              <span>{isAdminLoggedIn ? 'Open Admin Console' : 'Admin Login'}</span>
            </button>

            <button
              onClick={() => handleNavClick('register')}
              className="px-4 py-2 text-xs font-heading font-bold uppercase bg-amber-500 text-neutral-950 rounded shadow"
            >
              Register Team
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
