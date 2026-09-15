import fs from 'fs';
import path from 'path';
import {
  TournamentSettings,
  Registration,
  PaymentQRCode,
  LeaderboardTeam,
  MatchSchedule,
  Sponsor,
  Announcement,
  AuditLog,
  AdminUser,
} from '../src/types';

// Ensure persistent data directory exists
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'tournament_database.json');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export { DATA_DIR, UPLOADS_DIR };

console.log('[Database] Running with dedicated embedded self-hosted persistent storage engine at data/tournament_database.json.');

// Initial Data Seed
const initialSettings: TournamentSettings = {
  id: 'main-settings',
  tournamentName: 'Free Fire Campus Championship',
  subtitle: 'Inter-College Esports Battle 2026',
  season: 'Season 4',
  description: 'The ultimate battleground for collegiate esports athletes. 64 elite squads fight across Bermuda, Purgatory, and Kalahari for the national championship trophy and Rs. 50,000 cash pool.',
  logoUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&auto=format&fit=crop&q=80',
  bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
  registrationStatus: 'OPEN',
  registrationFee: 500,
  currency: 'Rs.',
  prizePool: 'Rs. 50,000',
  maxTeams: 64,
  teamSize: 4,
  substituteCount: 1,
  registrationOpenDate: '2026-09-01',
  registrationCloseDate: '2026-10-05',
  tournamentStartDate: '2026-10-10',
  tournamentEndDate: '2026-10-18',
  matchDates: 'Oct 10 - Oct 18, 2026',
  rules: [
    'Only registered collegiate teams with valid student IDs or institutional affiliations are eligible.',
    'Emulators, iPads, triggers, macro peripherals, and third-party script injectors are strictly prohibited.',
    'All players must have a minimum Free Fire level of 40 and Diamond rank in Battle Royale.',
    'Teams must join the custom match lobby 15 minutes prior to scheduled match time with given Room ID & Password.',
    'Point System: 1st (12 pts), 2nd (9 pts), 3rd (8 pts), 4th (7 pts), 5th (6 pts), 6th (5 pts), 7th (4 pts), 8th (3 pts), 9th (2 pts), 10th (1 pt). Each kill awards 1 point.',
    'Disconnection policy: No lobby rematches will be conducted due to individual player network dropouts.'
  ],
  contactPhone: '+977 9801234567',
  contactWhatsApp: '9801234567',
  contactEmail: 'esports.contact@campuscup.org',
  socials: {
    facebook: 'https://facebook.com/esportschampionship',
    instagram: 'https://instagram.com/freefire_championship',
    tiktok: 'https://tiktok.com/@ff_esports',
    youtube: 'https://youtube.com/@ff_esports_live',
    discord: 'https://discord.gg/esports'
  },
  prizes: {
    firstPlace: 'Rs. 25,000 + Champion Trophy + Gold Medals',
    secondPlace: 'Rs. 15,000 + Runners-Up Trophy + Silver Medals',
    thirdPlace: 'Rs. 6,000 + Bronze Medals',
    mvp: 'Rs. 2,500 + MVP Gaming Headset',
    highestKills: 'Rs. 1,500 + Top Fragger Certificate',
    specialAwards: 'Rs. 1,000 Best Clutch Play'
  },
  announcementText: '🔥 Registrations for Season 4 are OPEN! 18 slots remaining. Verify your payment screenshot within 24 hours of submission.',
  announcementActive: true,
  heroHeadline: 'FREE FIRE CAMPUS CHAMPIONSHIP',
  heroSubtext: 'The premier collegiate battle royale championship. Form your squad, lock in your spot, and seize the grand glory.',
  footerText: 'Official Free Fire Collegiate Esports Association. All trademarks belong to their respective holders.',
  themeAccent: '#f59e0b'
};

const initialQRCodes: PaymentQRCode[] = [
  {
    id: 'qr-esewa-01',
    title: 'eSewa Direct Payment QR',
    qrImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=esewa://payment?id=9801234567&amount=500&name=FreeFireCampusCup',
    accountName: 'Campus Esports Organization',
    accountNumber: '9801234567',
    paymentMethod: 'eSewa',
    instructions: 'Scan this QR code using the eSewa app. In remarks, enter your Team Name. Take a screenshot of the completed payment receipt and upload below.',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    uploadedBy: 'System Admin'
  },
  {
    id: 'qr-khalti-02',
    title: 'Khalti Merchant QR',
    qrImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=khalti://payment?id=9801234567&amount=500',
    accountName: 'Campus Esports Organization',
    accountNumber: '9801234567',
    paymentMethod: 'Khalti',
    instructions: 'Scan with Khalti App. Mention Team Name in payment remarks.',
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    uploadedBy: 'System Admin'
  }
];

const initialAdmins: AdminUser[] = [
  {
    id: 'admin-super-01',
    name: 'Chief Tournament Director',
    email: 'admin@esports.io',
    role: 'SUPER ADMIN',
    createdAt: '2026-08-01T00:00:00.000Z',
    lastLogin: new Date().toISOString()
  },
  {
    id: 'admin-mod-02',
    name: 'Match Referee Alex',
    email: 'alex@esports.io',
    role: 'ADMIN',
    createdAt: '2026-08-15T00:00:00.000Z',
    lastLogin: new Date().toISOString()
  }
];

const initialRegistrations: Registration[] = [
  {
    id: 'reg-ffcc-0001',
    registrationNumber: 'FFCC-2026-0001',
    teamName: 'Total Gaming Apex',
    college: 'Tribhuvan Institute of Technology',
    city: 'Kathmandu',
    captainName: 'Aayush Thapa',
    captainPhone: '+977 9841122334',
    captainWhatsApp: '9841122334',
    captainEmail: 'aayush.apex@gmail.com',
    teamLogoUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=150&auto=format&fit=crop&q=80',
    players: [
      { fullName: 'Aayush Thapa', inGameName: 'APEX_AAYUSH', freeFireUid: '1098273645', role: 'Captain', isCaptain: true },
      { fullName: 'Rohan Shrestha', inGameName: 'APEX_RONIX', freeFireUid: '1098273646', role: 'Rusher' },
      { fullName: 'Bikash Karki', inGameName: 'APEX_VIPER', freeFireUid: '1098273647', role: 'Sniper' },
      { fullName: 'Sunil Gurung', inGameName: 'APEX_BLAZE', freeFireUid: '1098273648', role: 'Support' },
      { fullName: 'Deepak Magar', inGameName: 'APEX_SHADOW', freeFireUid: '1098273649', role: 'Substitute' }
    ],
    payment: {
      method: 'eSewa',
      transactionId: 'TXN-984112-ESW01',
      paymentDate: '2026-09-02',
      amountPaid: 500,
      expectedAmount: 500,
      screenshotUrl: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?w=600&auto=format&fit=crop&q=80',
      verifiedAt: '2026-09-02T14:30:00.000Z',
      verifiedBy: 'Chief Tournament Director'
    },
    registrationStatus: 'Approved',
    paymentStatus: 'Verified',
    createdAt: '2026-09-02T10:15:00.000Z',
    updatedAt: '2026-09-02T14:30:00.000Z',
    statusHistory: [
      { id: 'sh-1', timestamp: '2026-09-02T10:15:00.000Z', previousStatus: 'Draft', newStatus: 'Submitted', type: 'registration', changedBy: 'System' },
      { id: 'sh-2', timestamp: '2026-09-02T14:28:00.000Z', previousStatus: 'Pending', newStatus: 'Verified', type: 'payment', changedBy: 'Chief Tournament Director', note: 'Transaction ID matches bank log' },
      { id: 'sh-3', timestamp: '2026-09-02T14:30:00.000Z', previousStatus: 'Submitted', newStatus: 'Approved', type: 'registration', changedBy: 'Chief Tournament Director', note: 'All players eligible and verified' }
    ],
    adminNotes: [
      { id: 'note-1', createdAt: '2026-09-02T14:29:00.000Z', author: 'Chief Tournament Director', text: 'Verified student IDs from college sports council.' }
    ]
  },
  {
    id: 'reg-ffcc-0002',
    registrationNumber: 'FFCC-2026-0002',
    teamName: 'Crimson Ravens',
    college: 'Patan Engineering College',
    city: 'Lalitpur',
    captainName: 'Sujan Maharjan',
    captainPhone: '+977 9812345678',
    captainWhatsApp: '9812345678',
    captainEmail: 'sujan.ravens@gmail.com',
    teamLogoUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=150&auto=format&fit=crop&q=80',
    players: [
      { fullName: 'Sujan Maharjan', inGameName: 'CR_SUJAN', freeFireUid: '2087349182', role: 'Captain', isCaptain: true },
      { fullName: 'Manish Shakya', inGameName: 'CR_RAVEN', freeFireUid: '2087349183', role: 'Assault' },
      { fullName: 'Prabesh Joshi', inGameName: 'CR_FROST', freeFireUid: '2087349184', role: 'Rusher' },
      { fullName: 'Anil Tamang', inGameName: 'CR_NEXUS', freeFireUid: '2087349185', role: 'Support' }
    ],
    payment: {
      method: 'Khalti',
      transactionId: 'KHLT-7729103-X',
      paymentDate: '2026-09-03',
      amountPaid: 500,
      expectedAmount: 500,
      screenshotUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
      verifiedAt: '2026-09-03T16:00:00.000Z',
      verifiedBy: 'Match Referee Alex'
    },
    registrationStatus: 'Approved',
    paymentStatus: 'Verified',
    createdAt: '2026-09-03T11:20:00.000Z',
    updatedAt: '2026-09-03T16:00:00.000Z',
    statusHistory: [
      { id: 'sh-4', timestamp: '2026-09-03T11:20:00.000Z', previousStatus: 'Draft', newStatus: 'Submitted', type: 'registration', changedBy: 'System' },
      { id: 'sh-5', timestamp: '2026-09-03T16:00:00.000Z', previousStatus: 'Pending', newStatus: 'Verified', type: 'payment', changedBy: 'Match Referee Alex' },
      { id: 'sh-6', timestamp: '2026-09-03T16:00:00.000Z', previousStatus: 'Submitted', newStatus: 'Approved', type: 'registration', changedBy: 'Match Referee Alex' }
    ],
    adminNotes: []
  },
  {
    id: 'reg-ffcc-0003',
    registrationNumber: 'FFCC-2026-0003',
    teamName: 'Cyber Samurai',
    college: 'Kathmandu University (KU)',
    city: 'Dhulikhel',
    captainName: 'Bibek Bhattarai',
    captainPhone: '+977 9865432109',
    captainWhatsApp: '9865432109',
    captainEmail: 'bibek.samurai@ku.edu.np',
    teamLogoUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=150&auto=format&fit=crop&q=80',
    players: [
      { fullName: 'Bibek Bhattarai', inGameName: 'CS_RONIN', freeFireUid: '3182901234', role: 'Captain', isCaptain: true },
      { fullName: 'Kushal Adhikari', inGameName: 'CS_KATANA', freeFireUid: '3182901235', role: 'Rusher' },
      { fullName: 'Sandesh Giri', inGameName: 'CS_GHOST', freeFireUid: '3182901236', role: 'Sniper' },
      { fullName: 'Prakash Poudel', inGameName: 'CS_ZENITH', freeFireUid: '3182901237', role: 'Support' }
    ],
    payment: {
      method: 'eSewa',
      transactionId: 'TXN-ESW-882190',
      paymentDate: '2026-09-05',
      amountPaid: 500,
      expectedAmount: 500,
      screenshotUrl: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?w=600&auto=format&fit=crop&q=80'
    },
    registrationStatus: 'Submitted',
    paymentStatus: 'Pending',
    createdAt: '2026-09-05T09:40:00.000Z',
    updatedAt: '2026-09-05T09:40:00.000Z',
    statusHistory: [
      { id: 'sh-7', timestamp: '2026-09-05T09:40:00.000Z', previousStatus: 'Draft', newStatus: 'Submitted', type: 'registration', changedBy: 'System' }
    ],
    adminNotes: []
  }
];

const initialLeaderboard: LeaderboardTeam[] = [
  { id: 'lb-1', teamId: 'reg-ffcc-0001', teamName: 'Total Gaming Apex', college: 'Tribhuvan Inst. of Tech', matchesPlayed: 6, placementPoints: 54, killPoints: 48, totalPoints: 102, booyahCount: 3, rank: 1 },
  { id: 'lb-2', teamId: 'reg-ffcc-0002', teamName: 'Crimson Ravens', college: 'Patan Engineering College', matchesPlayed: 6, placementPoints: 46, killPoints: 41, totalPoints: 87, booyahCount: 2, rank: 2 },
  { id: 'lb-3', teamId: 'lb-team-3', teamName: 'Neon Strikers', college: 'Pulchowk Campus', matchesPlayed: 6, placementPoints: 38, killPoints: 34, totalPoints: 72, booyahCount: 1, rank: 3 },
  { id: 'lb-4', teamId: 'lb-team-4', teamName: 'Shadow Monarchs', college: 'Nepal Commerce Campus', matchesPlayed: 6, placementPoints: 30, killPoints: 29, totalPoints: 59, booyahCount: 0, rank: 4 },
  { id: 'lb-5', teamId: 'lb-team-5', teamName: 'Vortex Esports', college: 'St. Xavier College', matchesPlayed: 6, placementPoints: 28, killPoints: 24, totalPoints: 52, booyahCount: 0, rank: 5 }
];

const initialMatches: MatchSchedule[] = [
  {
    id: 'match-01',
    matchNumber: 1,
    title: 'Group Stage Match 1',
    round: 'Group A Qualifiers',
    date: '2026-10-10',
    time: '18:00 NST',
    map: 'Bermuda',
    roomStatus: 'Completed',
    roomId: 'FF-ROOM-8821',
    roomPassword: '****'
  },
  {
    id: 'match-02',
    matchNumber: 2,
    title: 'Group Stage Match 2',
    round: 'Group A Qualifiers',
    date: '2026-10-10',
    time: '19:00 NST',
    map: 'Purgatory',
    roomStatus: 'Completed',
    roomId: 'FF-ROOM-8822',
    roomPassword: '****'
  },
  {
    id: 'match-03',
    matchNumber: 3,
    title: 'Semi-Finals Bout 1',
    round: 'Semi-Finals',
    date: '2026-10-14',
    time: '18:30 NST',
    map: 'Kalahari',
    roomStatus: 'Upcoming'
  },
  {
    id: 'match-04',
    matchNumber: 4,
    title: 'Grand Finals - Championship Showdown',
    round: 'Grand Finals',
    date: '2026-10-18',
    time: '19:00 NST',
    map: 'Bermuda',
    roomStatus: 'Upcoming',
    liveStreamUrl: 'https://youtube.com'
  }
];

const initialSponsors: Sponsor[] = [
  { id: 'sp-1', name: 'Predator Gaming Gear', logoUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=120&auto=format&fit=crop&q=80', websiteUrl: 'https://predatorgaming.com', tier: 'Title Sponsor', order: 1, isActive: true },
  { id: 'sp-2', name: 'CyberByte High-Speed Fiber', logoUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&auto=format&fit=crop&q=80', websiteUrl: 'https://cyberbyte.net', tier: 'Powered By', order: 2, isActive: true },
  { id: 'sp-3', name: 'Monster Energy Drink', logoUrl: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=120&auto=format&fit=crop&q=80', websiteUrl: 'https://monsterenergy.com', tier: 'Platinum', order: 3, isActive: true }
];

const initialAnnouncements: Announcement[] = [
  { id: 'ann-1', title: 'Tournament Rulebook Updated', message: 'Version 2.1 of the rulebook is now active. Please note emulator checks will be strictly enforced during lobby verifications.', priority: 'urgent', isActive: true, createdAt: '2026-09-10T12:00:00.000Z' },
  { id: 'ann-2', title: 'Payment Verification SLA', message: 'All pending payment screenshots are verified within 6 to 12 hours by our review referee team.', priority: 'normal', isActive: true, createdAt: '2026-09-08T09:00:00.000Z' }
];

const initialAuditLogs: AuditLog[] = [
  { id: 'log-1', adminName: 'System', action: 'DATABASE_INITIALIZED', details: 'Persistent database storage initialized with default schemas and championship configuration.', timestamp: new Date().toISOString() }
];

export interface DatabaseState {
  settings: TournamentSettings;
  qrCodes: PaymentQRCode[];
  registrations: Registration[];
  leaderboard: LeaderboardTeam[];
  matches: MatchSchedule[];
  sponsors: Sponsor[];
  announcements: Announcement[];
  auditLogs: AuditLog[];
  adminUsers: AdminUser[];
}

class DatabaseService {
  private state: DatabaseState;

  constructor() {
    this.state = this.loadFromDisk();
  }

  private loadFromDisk(): DatabaseState {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        console.log(`[Database] Loaded persistent database from ${DB_FILE}`);
        return {
          settings: parsed.settings || initialSettings,
          qrCodes: parsed.qrCodes || initialQRCodes,
          registrations: parsed.registrations || initialRegistrations,
          leaderboard: parsed.leaderboard || initialLeaderboard,
          matches: parsed.matches || initialMatches,
          sponsors: parsed.sponsors || initialSponsors,
          announcements: parsed.announcements || initialAnnouncements,
          auditLogs: parsed.auditLogs || initialAuditLogs,
          adminUsers: parsed.adminUsers || initialAdmins,
        };
      }
    } catch (err) {
      console.error('[Database] Failed to read database file, initializing default:', err);
    }

    const defaultState: DatabaseState = {
      settings: initialSettings,
      qrCodes: initialQRCodes,
      registrations: initialRegistrations,
      leaderboard: initialLeaderboard,
      matches: initialMatches,
      sponsors: initialSponsors,
      announcements: initialAnnouncements,
      auditLogs: initialAuditLogs,
      adminUsers: initialAdmins,
    };
    this.saveToDisk(defaultState);
    return defaultState;
  }

  private saveToDisk(state: DatabaseState): void {
    try {
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(state, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('[Database] Critical error saving state to disk:', err);
    }
  }

  private logAudit(adminName: string, action: string, details: string, recordId?: string, previousValue?: string, newValue?: string) {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      adminName: adminName || 'Admin',
      action,
      details,
      recordId,
      previousValue,
      newValue,
      timestamp: new Date().toISOString()
    };
    this.state.auditLogs.unshift(log);
    if (this.state.auditLogs.length > 500) {
      this.state.auditLogs = this.state.auditLogs.slice(0, 500);
    }
  }

  // Settings
  public getSettings(): TournamentSettings {
    return this.state.settings;
  }

  public updateSettings(updates: Partial<TournamentSettings>, adminName: string): TournamentSettings {
    const prev = JSON.stringify(this.state.settings);
    this.state.settings = {
      ...this.state.settings,
      ...updates,
      id: 'main-settings'
    };
    this.logAudit(adminName, 'UPDATE_TOURNAMENT_SETTINGS', 'Updated tournament global configuration and rules.', 'main-settings', prev, JSON.stringify(this.state.settings));
    this.saveToDisk(this.state);
    return this.state.settings;
  }

  // QR Codes
  public getQRCodes(): PaymentQRCode[] {
    return this.state.qrCodes;
  }

  public getActiveQRCode(): PaymentQRCode | null {
    return this.state.qrCodes.find(q => q.isActive) || this.state.qrCodes[0] || null;
  }

  public addQRCode(data: Omit<PaymentQRCode, 'id' | 'createdAt' | 'updatedAt'>, adminName: string): PaymentQRCode {
    const newQR: PaymentQRCode = {
      ...data,
      id: `qr-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      uploadedBy: adminName
    };

    if (newQR.isActive) {
      this.state.qrCodes.forEach(q => { q.isActive = false; });
    }

    this.state.qrCodes.unshift(newQR);
    this.logAudit(adminName, 'UPLOAD_PAYMENT_QR', `Uploaded new payment QR code: ${newQR.title}`, newQR.id);
    this.saveToDisk(this.state);
    return newQR;
  }

  public setActiveQRCode(qrId: string, adminName: string): boolean {
    const found = this.state.qrCodes.find(q => q.id === qrId);
    if (!found) return false;
    this.state.qrCodes.forEach(q => { q.isActive = (q.id === qrId); });
    this.logAudit(adminName, 'SET_ACTIVE_PAYMENT_QR', `Set QR '${found.title}' as the primary public active QR code.`, qrId);
    this.saveToDisk(this.state);
    return true;
  }

  public deleteQRCode(qrId: string, adminName: string): boolean {
    const index = this.state.qrCodes.findIndex(q => q.id === qrId);
    if (index === -1) return false;
    const removed = this.state.qrCodes.splice(index, 1)[0];
    this.logAudit(adminName, 'DELETE_PAYMENT_QR', `Deleted payment QR code: ${removed.title}`, qrId);
    this.saveToDisk(this.state);
    return true;
  }

  // Registrations
  public getRegistrations(includeArchived: boolean = false): Registration[] {
    if (includeArchived) return this.state.registrations;
    return this.state.registrations.filter(r => !r.archived);
  }

  public getArchivedRegistrations(): Registration[] {
    return this.state.registrations.filter(r => r.archived);
  }

  public getRegistrationById(id: string): Registration | null {
    return this.state.registrations.find(r => r.id === id || r.registrationNumber === id) || null;
  }

  public checkDuplicates(captainPhone: string, captainEmail: string, freeFireUids: string[], transactionId?: string): { isDuplicate: boolean; reasons: string[] } {
    const reasons: string[] = [];
    const active = this.state.registrations.filter(r => !r.archived);

    for (const reg of active) {
      if (reg.captainPhone.replace(/\D/g, '') === captainPhone.replace(/\D/g, '')) {
        reasons.push(`Captain phone ${captainPhone} is already registered under Team "${reg.teamName}" (${reg.registrationNumber})`);
      }
      if (reg.captainEmail.toLowerCase() === captainEmail.toLowerCase()) {
        reasons.push(`Captain email ${captainEmail} is already registered under Team "${reg.teamName}" (${reg.registrationNumber})`);
      }
      if (transactionId && reg.payment.transactionId && reg.payment.transactionId.toLowerCase() === transactionId.toLowerCase()) {
        reasons.push(`Transaction ID "${transactionId}" was already submitted by Team "${reg.teamName}"`);
      }

      // Check player UIDs
      for (const uid of freeFireUids) {
        if (!uid) continue;
        const matchedPlayer = reg.players.find(p => p.freeFireUid === uid);
        if (matchedPlayer) {
          reasons.push(`Free Fire UID ${uid} (${matchedPlayer.inGameName}) is already registered in Team "${reg.teamName}"`);
        }
      }
    }

    return {
      isDuplicate: reasons.length > 0,
      reasons
    };
  }

  public createRegistration(data: Omit<Registration, 'id' | 'registrationNumber' | 'createdAt' | 'updatedAt' | 'statusHistory' | 'adminNotes'>): Registration {
    const count = this.state.registrations.length + 1;
    const regNum = `FFCC-2026-${String(count).padStart(4, '0')}`;
    const id = `reg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const newReg: Registration = {
      ...data,
      id,
      registrationNumber: regNum,
      createdAt: now,
      updatedAt: now,
      statusHistory: [
        {
          id: `sh-${Date.now()}-1`,
          timestamp: now,
          previousStatus: 'Draft',
          newStatus: data.registrationStatus || 'Submitted',
          type: 'registration',
          changedBy: 'System',
          note: 'Public team registration submitted.'
        }
      ],
      adminNotes: []
    };

    this.state.registrations.unshift(newReg);
    this.logAudit('System', 'REGISTRATION_SUBMITTED', `New registration submitted by ${newReg.teamName} (${newReg.captainName})`, newReg.id);
    this.saveToDisk(this.state);
    return newReg;
  }

  public updateRegistrationStatus(
    id: string,
    regStatus: Registration['registrationStatus'] | undefined,
    payStatus: Registration['paymentStatus'] | undefined,
    adminName: string,
    reason?: string
  ): Registration | null {
    const reg = this.state.registrations.find(r => r.id === id);
    if (!reg) return null;

    const now = new Date().toISOString();

    if (payStatus && payStatus !== reg.paymentStatus) {
      const prevPay = reg.paymentStatus;
      reg.paymentStatus = payStatus;
      if (payStatus === 'Verified') {
        reg.payment.verifiedAt = now;
        reg.payment.verifiedBy = adminName;
        reg.payment.rejectionReason = undefined;
      } else if (payStatus === 'Rejected') {
        reg.payment.rejectionReason = reason;
      }
      reg.statusHistory.push({
        id: `sh-${Date.now()}-p`,
        timestamp: now,
        previousStatus: prevPay,
        newStatus: payStatus,
        type: 'payment',
        changedBy: adminName,
        note: reason || `Payment status changed to ${payStatus}`
      });
      this.logAudit(adminName, 'UPDATE_PAYMENT_STATUS', `Payment status changed to ${payStatus} for team ${reg.teamName}`, reg.id, prevPay, payStatus);
    }

    if (regStatus && regStatus !== reg.registrationStatus) {
      const prevReg = reg.registrationStatus;
      reg.registrationStatus = regStatus;
      reg.statusHistory.push({
        id: `sh-${Date.now()}-r`,
        timestamp: now,
        previousStatus: prevReg,
        newStatus: regStatus,
        type: 'registration',
        changedBy: adminName,
        note: reason || `Registration status changed to ${regStatus}`
      });
      this.logAudit(adminName, 'UPDATE_REGISTRATION_STATUS', `Registration status changed to ${regStatus} for team ${reg.teamName}`, reg.id, prevReg, regStatus);
    }

    reg.updatedAt = now;
    this.saveToDisk(this.state);
    return reg;
  }

  public addAdminNote(id: string, text: string, adminName: string): Registration | null {
    const reg = this.state.registrations.find(r => r.id === id);
    if (!reg) return null;

    reg.adminNotes.push({
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString(),
      author: adminName,
      text
    });
    reg.updatedAt = new Date().toISOString();
    this.logAudit(adminName, 'ADD_ADMIN_NOTE', `Added note to team ${reg.teamName}: "${text.slice(0, 40)}..."`, reg.id);
    this.saveToDisk(this.state);
    return reg;
  }

  public archiveRegistration(id: string, reason: string, adminName: string): boolean {
    const reg = this.state.registrations.find(r => r.id === id);
    if (!reg) return false;

    reg.archived = true;
    reg.archivedAt = new Date().toISOString();
    reg.archivedBy = adminName;
    reg.archiveReason = reason;
    reg.updatedAt = new Date().toISOString();

    this.logAudit(adminName, 'ARCHIVE_REGISTRATION', `Soft-deleted/archived team ${reg.teamName}. Reason: ${reason}`, reg.id);
    this.saveToDisk(this.state);
    return true;
  }

  public restoreRegistration(id: string, adminName: string): boolean {
    const reg = this.state.registrations.find(r => r.id === id);
    if (!reg) return false;

    reg.archived = false;
    reg.archivedAt = undefined;
    reg.archivedBy = undefined;
    reg.archiveReason = undefined;
    reg.updatedAt = new Date().toISOString();

    this.logAudit(adminName, 'RESTORE_REGISTRATION', `Restored archived team ${reg.teamName} to active list.`, reg.id);
    this.saveToDisk(this.state);
    return true;
  }

  // Leaderboard
  public getLeaderboard(): LeaderboardTeam[] {
    return [...this.state.leaderboard].sort((a, b) => b.totalPoints - a.totalPoints || b.booyahCount - a.booyahCount);
  }

  public updateLeaderboardEntry(entry: LeaderboardTeam, adminName: string): LeaderboardTeam {
    const index = this.state.leaderboard.findIndex(e => e.id === entry.id || e.teamName === entry.teamName);
    entry.totalPoints = (Number(entry.placementPoints) || 0) + (Number(entry.killPoints) || 0);

    if (index >= 0) {
      this.state.leaderboard[index] = entry;
    } else {
      entry.id = `lb-${Date.now()}`;
      this.state.leaderboard.push(entry);
    }

    // Recalculate ranks
    this.state.leaderboard.sort((a, b) => b.totalPoints - a.totalPoints || b.booyahCount - a.booyahCount);
    this.state.leaderboard.forEach((t, i) => { t.rank = i + 1; });

    this.logAudit(adminName, 'UPDATE_LEADERBOARD', `Updated scores for team ${entry.teamName} (Total: ${entry.totalPoints} pts)`);
    this.saveToDisk(this.state);
    return entry;
  }

  public deleteLeaderboardEntry(id: string, adminName: string): boolean {
    const index = this.state.leaderboard.findIndex(e => e.id === id);
    if (index === -1) return false;
    const removed = this.state.leaderboard.splice(index, 1)[0];
    this.state.leaderboard.forEach((t, i) => { t.rank = i + 1; });
    this.logAudit(adminName, 'DELETE_LEADERBOARD_ENTRY', `Deleted leaderboard entry for ${removed.teamName}`);
    this.saveToDisk(this.state);
    return true;
  }

  // Matches
  public getMatches(): MatchSchedule[] {
    return this.state.matches;
  }

  public addMatch(matchData: Omit<MatchSchedule, 'id'>, adminName: string): MatchSchedule {
    const newMatch: MatchSchedule = {
      ...matchData,
      id: `match-${Date.now()}`
    };
    this.state.matches.push(newMatch);
    this.state.matches.sort((a, b) => a.matchNumber - b.matchNumber);
    this.logAudit(adminName, 'ADD_MATCH', `Scheduled match #${newMatch.matchNumber} (${newMatch.round})`);
    this.saveToDisk(this.state);
    return newMatch;
  }

  public updateMatch(id: string, updates: Partial<MatchSchedule>, adminName: string): MatchSchedule | null {
    const match = this.state.matches.find(m => m.id === id);
    if (!match) return null;
    Object.assign(match, updates);
    this.logAudit(adminName, 'UPDATE_MATCH', `Updated match #${match.matchNumber} details`, id);
    this.saveToDisk(this.state);
    return match;
  }

  public deleteMatch(id: string, adminName: string): boolean {
    const index = this.state.matches.findIndex(m => m.id === id);
    if (index === -1) return false;
    const removed = this.state.matches.splice(index, 1)[0];
    this.logAudit(adminName, 'DELETE_MATCH', `Removed match #${removed.matchNumber}`, id);
    this.saveToDisk(this.state);
    return true;
  }

  // Sponsors
  public getSponsors(): Sponsor[] {
    return this.state.sponsors;
  }

  public addSponsor(data: Omit<Sponsor, 'id'>, adminName: string): Sponsor {
    const sponsor: Sponsor = {
      ...data,
      id: `sp-${Date.now()}`
    };
    this.state.sponsors.push(sponsor);
    this.state.sponsors.sort((a, b) => a.order - b.order);
    this.logAudit(adminName, 'ADD_SPONSOR', `Added sponsor ${sponsor.name} (${sponsor.tier})`);
    this.saveToDisk(this.state);
    return sponsor;
  }

  public updateSponsor(id: string, updates: Partial<Sponsor>, adminName: string): Sponsor | null {
    const sp = this.state.sponsors.find(s => s.id === id);
    if (!sp) return null;
    Object.assign(sp, updates);
    this.logAudit(adminName, 'UPDATE_SPONSOR', `Updated sponsor ${sp.name}`, id);
    this.saveToDisk(this.state);
    return sp;
  }

  public deleteSponsor(id: string, adminName: string): boolean {
    const index = this.state.sponsors.findIndex(s => s.id === id);
    if (index === -1) return false;
    const removed = this.state.sponsors.splice(index, 1)[0];
    this.logAudit(adminName, 'DELETE_SPONSOR', `Removed sponsor ${removed.name}`, id);
    this.saveToDisk(this.state);
    return true;
  }

  // Announcements
  public getAnnouncements(): Announcement[] {
    return this.state.announcements;
  }

  public addAnnouncement(data: Omit<Announcement, 'id' | 'createdAt'>, adminName: string): Announcement {
    const ann: Announcement = {
      ...data,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.state.announcements.unshift(ann);
    this.logAudit(adminName, 'CREATE_ANNOUNCEMENT', `Created announcement: ${ann.title}`);
    this.saveToDisk(this.state);
    return ann;
  }

  public updateAnnouncement(id: string, updates: Partial<Announcement>, adminName: string): Announcement | null {
    const ann = this.state.announcements.find(a => a.id === id);
    if (!ann) return null;
    Object.assign(ann, updates);
    this.logAudit(adminName, 'UPDATE_ANNOUNCEMENT', `Updated announcement: ${ann.title}`, id);
    this.saveToDisk(this.state);
    return ann;
  }

  public deleteAnnouncement(id: string, adminName: string): boolean {
    const index = this.state.announcements.findIndex(a => a.id === id);
    if (index === -1) return false;
    const removed = this.state.announcements.splice(index, 1)[0];
    this.logAudit(adminName, 'DELETE_ANNOUNCEMENT', `Deleted announcement: ${removed.title}`, id);
    this.saveToDisk(this.state);
    return true;
  }

  // Audit Logs
  public getAuditLogs(limit: number = 100): AuditLog[] {
    return this.state.auditLogs.slice(0, limit);
  }

  // Admin Users
  public getAdminUsers(): AdminUser[] {
    return this.state.adminUsers;
  }

  public addAdminUser(user: Omit<AdminUser, 'id' | 'createdAt'>, performedBy: string): AdminUser {
    const newAdmin: AdminUser = {
      ...user,
      id: `admin-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.state.adminUsers.push(newAdmin);
    this.logAudit(performedBy, 'CREATE_ADMIN_USER', `Added new administrator: ${newAdmin.name} (${newAdmin.email}) with role ${newAdmin.role}`);
    this.saveToDisk(this.state);
    return newAdmin;
  }

  // Analytics
  public getAnalytics() {
    const active = this.state.registrations.filter(r => !r.archived);
    const totalRegistrations = active.length;
    const approvedTeams = active.filter(r => r.registrationStatus === 'Approved').length;
    const pendingRegistrations = active.filter(r => r.registrationStatus === 'Submitted' || r.registrationStatus === 'Under Review').length;
    const rejectedRegistrations = active.filter(r => r.registrationStatus === 'Rejected').length;

    const pendingPayments = active.filter(r => r.paymentStatus === 'Pending' || r.paymentStatus === 'Under Review').length;
    const verifiedPayments = active.filter(r => r.paymentStatus === 'Verified').length;

    const totalRevenue = active
      .filter(r => r.paymentStatus === 'Verified')
      .reduce((sum, r) => sum + (Number(r.payment.amountPaid) || 0), 0);

    const expectedRevenue = active.length * (this.state.settings.registrationFee || 500);

    const maxTeams = this.state.settings.maxTeams || 64;
    const remainingSlots = Math.max(0, maxTeams - approvedTeams);

    // College distribution
    const collegeMap: Record<string, number> = {};
    const cityMap: Record<string, number> = {};
    active.forEach(r => {
      const col = r.college ? r.college.trim() : 'Independent';
      collegeMap[col] = (collegeMap[col] || 0) + 1;
      const city = r.city ? r.city.trim() : 'Other';
      cityMap[city] = (cityMap[city] || 0) + 1;
    });

    const colleges = Object.entries(collegeMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 8);
    const cities = Object.entries(cityMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 8);

    // Registrations by date (last 7 days)
    const dateMap: Record<string, number> = {};
    active.forEach(r => {
      const dateKey = r.createdAt ? r.createdAt.substring(0, 10) : 'Recent';
      dateMap[dateKey] = (dateMap[dateKey] || 0) + 1;
    });
    const timeline = Object.entries(dateMap).map(([date, count]) => ({ date, count }));

    return {
      totalRegistrations,
      approvedTeams,
      pendingRegistrations,
      rejectedRegistrations,
      pendingPayments,
      verifiedPayments,
      totalRevenue,
      expectedRevenue,
      maxTeams,
      remainingSlots,
      colleges,
      cities,
      timeline,
      currency: this.state.settings.currency || 'Rs.'
    };
  }

  // Backup & Export
  public getFullBackup(): DatabaseState {
    return JSON.parse(JSON.stringify(this.state));
  }
}

export const db = new DatabaseService();
