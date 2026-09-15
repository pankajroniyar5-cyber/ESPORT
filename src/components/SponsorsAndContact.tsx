import React, { useState } from 'react';
import { MessageSquare, Phone, Mail, ChevronDown, ChevronUp, ExternalLink, HelpCircle, Shield, Globe } from 'lucide-react';
import { TournamentSettings, Sponsor } from '../types';

interface SponsorsAndContactProps {
  settings: TournamentSettings | null;
  sponsors: Sponsor[];
}

export const SponsorsAndContact: React.FC<SponsorsAndContactProps> = ({ settings, sponsors }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Who is eligible to participate in the championship?',
      a: 'Any collegiate squad consisting of enrolled university/college students or recognized institutional teams is eligible. All players must have a minimum Free Fire account level 40.'
    },
    {
      q: 'How are match room credentials (ID & password) delivered?',
      a: 'Room IDs and lobby access passwords will be transmitted directly to registered Captain WhatsApp numbers 15 minutes before official match times.'
    },
    {
      q: 'What if a team member is disconnected during a match?',
      a: 'Per official Free Fire esports rules, matches will continue uninterrupted unless a lobby-wide server crash occurs.'
    },
    {
      q: 'How fast is payment verified after uploading the screenshot?',
      a: 'Our referee admin team verifies transactions within 6 to 12 hours. You can check real-time verification using the "Track Status" button with your Registration ID.'
    },
    {
      q: 'Can we change a player or substitute after registration?',
      a: 'Roster changes can be requested up to 48 hours prior to the tournament start date by contacting the tournament director on WhatsApp.'
    }
  ];

  const whatsappClean = settings?.contactWhatsApp ? settings.contactWhatsApp.replace(/\D/g, '') : '9801234567';

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 space-y-16">
      
      {/* Sponsors Section */}
      {sponsors.length > 0 && (
        <div>
          <div className="text-center mb-8">
            <span className="text-xs font-tech font-bold uppercase tracking-widest text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
              Official Partners
            </span>
            <h2 className="text-3xl font-heading font-bold text-neutral-100 uppercase tracking-wide mt-2">
              Championship Sponsors
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1">
              Supported by leading gaming brands and collegiate partners.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {sponsors.map((sponsor) => (
              <a
                key={sponsor.id}
                href={sponsor.websiteUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="esports-glass p-6 rounded-2xl border border-neutral-800 hover:border-amber-500/40 transition-all flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 rounded-xl bg-neutral-900 border border-neutral-800 p-2 overflow-hidden flex items-center justify-center mb-3">
                  <img
                    src={sponsor.logoUrl}
                    alt={sponsor.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-[10px] font-tech uppercase text-amber-400 font-bold tracking-wider">
                  {sponsor.tier}
                </span>
                <h4 className="font-heading text-lg font-bold text-neutral-100 uppercase mt-1">
                  {sponsor.name}
                </h4>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <div>
        <div className="text-center mb-8">
          <span className="text-xs font-tech font-bold uppercase tracking-widest text-blue-400 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl font-heading font-bold text-neutral-100 uppercase tracking-wide mt-2">
            Tournament FAQ
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="esports-glass rounded-xl border border-neutral-800 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 text-sm font-heading font-bold uppercase text-neutral-200 hover:text-amber-400 transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
              </button>

              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs font-tech text-neutral-300 leading-relaxed border-t border-neutral-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact & Dynamic WhatsApp Action */}
      <div className="esports-glass-gold p-8 rounded-2xl border border-amber-500/40 text-center space-y-5">
        <h3 className="text-2xl font-heading font-bold text-white uppercase tracking-wide">
          Have Questions or Need Help?
        </h3>
        <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto">
          Our tournament organizers and referee support line are available on WhatsApp and phone for roster questions, payment queries, or sponsorship inquiries.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {settings?.contactWhatsApp && (
            <a
              href={`https://wa.me/${whatsappClean}?text=Hello%20Tournament%20Organizers,%20I%20have%20an%20inquiry%20regarding%20the%20Free%20Fire%20Campus%20Cup.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold uppercase tracking-wider text-sm rounded-xl shadow-lg shadow-emerald-600/25 transition-all hover:scale-105"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Chat on WhatsApp</span>
            </a>
          )}

          {settings?.contactPhone && (
            <a
              href={`tel:${settings.contactPhone}`}
              className="flex items-center space-x-2 px-5 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 font-heading font-semibold uppercase tracking-wider text-sm rounded-xl border border-neutral-700 transition-colors"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>{settings.contactPhone}</span>
            </a>
          )}

          {settings?.contactEmail && (
            <a
              href={`mailto:${settings.contactEmail}`}
              className="flex items-center space-x-2 px-5 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 font-heading font-semibold uppercase tracking-wider text-sm rounded-xl border border-neutral-700 transition-colors"
            >
              <Mail className="w-4 h-4 text-amber-400" />
              <span>{settings.contactEmail}</span>
            </a>
          )}
        </div>
      </div>

    </div>
  );
};
