export type RegistrationStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Approved'
  | 'Rejected'
  | 'Waitlisted'
  | 'Cancelled';

export type PaymentStatus =
  | 'Pending'
  | 'Under Review'
  | 'Verified'
  | 'Rejected'
  | 'Refunded';

export type AdminRole = 'SUPER ADMIN' | 'ADMIN' | 'MODERATOR';

export interface Player {
  id?: string;
  fullName: string;
  inGameName: string;
  freeFireUid: string;
  phoneNumber?: string;
  role: 'Captain' | 'Assault' | 'Sniper' | 'Rusher' | 'Support' | 'Substitute';
  isCaptain?: boolean;
}

export interface PaymentDetails {
  method: string;
  transactionId: string;
  paymentDate: string;
  amountPaid: number;
  expectedAmount: number;
  screenshotUrl: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
}

export interface StatusHistoryItem {
  id: string;
  timestamp: string;
  previousStatus: string;
  newStatus: string;
  type: 'registration' | 'payment';
  changedBy: string;
  note?: string;
}

export interface AdminNote {
  id: string;
  createdAt: string;
  author: string;
  text: string;
}

export interface Registration {
  id: string;
  registrationNumber: string; // e.g. FFCC-2026-0001
  teamName: string;
  college: string;
  city: string;
  captainName: string;
  captainPhone: string;
  captainWhatsApp: string;
  captainEmail: string;
  teamLogoUrl?: string;
  players: Player[];
  payment: PaymentDetails;
  registrationStatus: RegistrationStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusHistoryItem[];
  adminNotes: AdminNote[];
  archived?: boolean;
  archivedAt?: string;
  archivedBy?: string;
  archiveReason?: string;
}

export interface PaymentQRCode {
  id: string;
  title: string;
  qrImageUrl: string;
  accountName: string;
  accountNumber: string;
  paymentMethod: string; // e.g., 'eSewa', 'Khalti', 'Bank Transfer', 'UPI'
  instructions: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  uploadedBy?: string;
  // Aliases for component ergonomics
  imageUrl?: string;
  method?: string;
  upiId?: string;
}

export type PaymentQrConfig = PaymentQRCode;

export type RegistrationStatusConfig = 'NOT STARTED' | 'OPEN' | 'CLOSING SOON' | 'FULL' | 'CLOSED';

export interface TournamentSettings {
  id: string;
  tournamentName: string;
  subtitle: string;
  season: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  registrationStatus: 'NOT STARTED' | 'OPEN' | 'CLOSING SOON' | 'FULL' | 'CLOSED';
  registrationFee: number;
  currency: string;
  prizePool: string;
  maxTeams: number;
  teamSize: number;
  substituteCount: number;
  registrationOpenDate: string;
  registrationCloseDate: string;
  tournamentStartDate: string;
  tournamentEndDate: string;
  matchDates: string;
  rules: string[];
  contactPhone: string;
  contactWhatsApp: string;
  contactEmail: string;
  socials: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    discord?: string;
  };
  prizes: {
    firstPlace: string;
    secondPlace: string;
    thirdPlace: string;
    mvp: string;
    highestKills: string;
    specialAwards?: string;
  };
  announcementText?: string;
  announcementActive?: boolean;
  heroHeadline?: string;
  heroSubtext?: string;
  footerText?: string;
  themeAccent?: string;
}

export interface LeaderboardTeam {
  id: string;
  teamId: string;
  teamName: string;
  college: string;
  matchesPlayed: number;
  placementPoints: number;
  killPoints: number;
  totalPoints: number;
  booyahCount: number;
  rank: number;
}

export interface MatchSchedule {
  id: string;
  matchNumber: number;
  title: string;
  round: string; // e.g. 'Qualifiers Round 1', 'Quarter-Finals', 'Grand Finals'
  date: string;
  time: string;
  map: 'Bermuda' | 'Purgatory' | 'Kalahari' | 'Alpine' | 'NexTerra';
  roomStatus: 'Upcoming' | 'ID Given' | 'Live' | 'Completed' | 'Delayed';
  roomId?: string;
  roomPassword?: string;
  liveStreamUrl?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  tier: 'Title Sponsor' | 'Powered By' | 'Platinum' | 'Gold' | 'Media Partner';
  order: number;
  isActive: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: 'low' | 'normal' | 'urgent';
  isActive: boolean;
  createdAt: string;
  startDate?: string;
  endDate?: string;
  // Aliases for component ergonomics
  content?: string;
  type?: 'info' | 'warning' | 'urgent';
}

export interface AuditLog {
  id: string;
  adminName: string;
  action: string;
  recordId?: string;
  details: string | any;
  previousValue?: string;
  newValue?: string;
  timestamp: string;
  ip?: string;
  // Aliases
  userName?: string;
  userEmail?: string;
  targetEntity?: string;
}

export type AuditLogEntry = AuditLog;

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  createdAt: string;
  lastLogin?: string;
  avatarUrl?: string;
}

export interface PublicTournamentData {
  settings: TournamentSettings;
  activeQR: PaymentQRCode | null;
  approvedTeamsCount: number;
  totalTeamsCount: number;
  sponsors: Sponsor[];
  announcements: Announcement[];
}
