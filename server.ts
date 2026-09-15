import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { db, UPLOADS_DIR } from './server/db';
import { uploadMiddleware, persistFile } from './server/storage';
import { Registration, TournamentSettings } from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Static uploads directory serving
  app.use('/api/uploads', express.static(UPLOADS_DIR));

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // ==========================================
  // PUBLIC ROUTES
  // ==========================================

  // Public Tournament Details
  app.get('/api/tournament/public', (_req: Request, res: Response) => {
    const settings = db.getSettings();
    const activeQR = db.getActiveQRCode();
    const registrations = db.getRegistrations();
    const approvedTeams = registrations.filter(r => r.registrationStatus === 'Approved');
    const sponsors = db.getSponsors().filter(s => s.isActive);
    const announcements = db.getAnnouncements().filter(a => a.isActive);

    res.json({
      settings,
      activeQR,
      approvedTeamsCount: approvedTeams.length,
      totalTeamsCount: registrations.length,
      sponsors,
      announcements
    });
  });

  // Public Settings
  app.get('/api/tournament/settings', (_req: Request, res: Response) => {
    res.json(db.getSettings());
  });

  // Public Active QR Code
  app.get('/api/tournament/payment-qr/active', (_req: Request, res: Response) => {
    const activeQR = db.getActiveQRCode();
    res.json({ qrConfig: activeQR });
  });

  // Public Announcements
  app.get('/api/tournament/announcements', (_req: Request, res: Response) => {
    const announcements = db.getAnnouncements().filter(a => a.isActive);
    res.json({ announcements });
  });

  // Public Leaderboard
  app.get('/api/tournament/leaderboard', (_req: Request, res: Response) => {
    const leaderboard = db.getLeaderboard();
    res.json({ leaderboard });
  });

  // Public Schedule / Matches
  app.get(['/api/tournament/matches', '/api/tournament/schedule'], (_req: Request, res: Response) => {
    const matches = db.getMatches().map(m => {
      // Obscure passwords for public view unless match is live/room given
      return {
        ...m,
        roomPassword: m.roomPassword ? 'Protected (Given to captains on WhatsApp)' : undefined
      };
    });
    res.json({ matches });
  });

  // Public Approved Teams Directory (Sanitized for privacy)
  app.get(['/api/tournament/teams', '/api/tournament/teams/approved'], (_req: Request, res: Response) => {
    const approved = db.getRegistrations()
      .filter(r => r.registrationStatus === 'Approved')
      .map(r => ({
        id: r.id,
        registrationNumber: r.registrationNumber,
        teamName: r.teamName,
        college: r.college,
        city: r.city,
        teamLogoUrl: r.teamLogoUrl,
        captainName: r.captainName,
        players: r.players.map(p => ({
          inGameName: p.inGameName,
          role: p.role,
          isCaptain: p.isCaptain
        })),
        createdAt: r.createdAt
      }));
    res.json({ teams: approved });
  });

  // Public Sponsors
  app.get('/api/tournament/sponsors', (_req: Request, res: Response) => {
    const sponsors = db.getSponsors().filter(s => s.isActive);
    res.json({ sponsors });
  });

  // Public Duplicate Pre-check
  app.post('/api/register/check-duplicate', (req: Request, res: Response) => {
    const { captainPhone, captainEmail, freeFireUids, transactionId } = req.body;
    const check = db.checkDuplicates(
      captainPhone || '',
      captainEmail || '',
      Array.isArray(freeFireUids) ? freeFireUids : [],
      transactionId
    );
    res.json(check);
  });

  // Public Team Registration (handles optional screenshot upload or JSON)
  app.post(
    '/api/register',
    uploadMiddleware.single('screenshot'),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const settings = db.getSettings();

        // Check if registration is open or full
        if (settings.registrationStatus === 'CLOSED' || settings.registrationStatus === 'NOT STARTED') {
          res.status(400).json({ error: `Registration is currently ${settings.registrationStatus.toLowerCase()}.` });
          return;
        }

        const approvedTeamsCount = db.getRegistrations().filter(r => r.registrationStatus === 'Approved').length;
        if (approvedTeamsCount >= (settings.maxTeams || 64)) {
          res.status(400).json({ error: 'Tournament capacity has been reached. Please contact the administrator for waitlist options.' });
          return;
        }

        // Body parsing (may come as JSON or form-data)
        const body = req.body;
        let players = [];
        try {
          players = typeof body.players === 'string' ? JSON.parse(body.players) : (body.players || []);
        } catch {
          players = [];
        }

        if (!body.teamName || !body.captainName || !body.captainPhone || !body.captainEmail) {
          res.status(400).json({ error: 'Required fields missing: Team Name, Captain Name, Phone, and Email are mandatory.' });
          return;
        }

        if (players.length < 4) {
          res.status(400).json({ error: 'At least 4 roster players (Captain + 3 squad members) are required.' });
          return;
        }

        // Upload payment screenshot if file is attached
        let screenshotUrl = body.screenshotUrl || '';
        if (req.file) {
          screenshotUrl = await persistFile(req.file);
        }

        if (!screenshotUrl) {
          screenshotUrl = 'https://images.unsplash.com/photo-1556742049-0a67e5572293?w=600&auto=format&fit=crop&q=80'; // Fallback receipt placeholder
        }

        const expectedFee = Number(settings.registrationFee) || 500;
        const amountPaid = Number(body.amountPaid) || expectedFee;

        const newRegistration = db.createRegistration({
          teamName: body.teamName.trim(),
          college: body.college ? body.college.trim() : 'Independent College',
          city: body.city ? body.city.trim() : 'City',
          captainName: body.captainName.trim(),
          captainPhone: body.captainPhone.trim(),
          captainWhatsApp: body.captainWhatsApp ? body.captainWhatsApp.trim() : body.captainPhone.trim(),
          captainEmail: body.captainEmail.trim().toLowerCase(),
          teamLogoUrl: body.teamLogoUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80',
          players,
          payment: {
            method: body.paymentMethod || 'eSewa',
            transactionId: body.transactionId ? body.transactionId.trim() : `TXN-${Date.now()}`,
            paymentDate: body.paymentDate || new Date().toISOString().substring(0, 10),
            amountPaid,
            expectedAmount: expectedFee,
            screenshotUrl
          },
          registrationStatus: 'Submitted',
          paymentStatus: 'Pending'
        });

        res.status(201).json({
          success: true,
          message: 'Registration submitted successfully!',
          registration: newRegistration
        });
      } catch (err: any) {
        console.error('[Registration API Error]:', err);
        res.status(500).json({ error: err.message || 'Internal server error processing registration.' });
      }
    }
  );

  // Public Registration Tracking
  app.post('/api/register/track', (req: Request, res: Response): void => {
    const { registrationId, verifyField } = req.body;
    if (!registrationId || !verifyField) {
      res.status(400).json({ error: 'Please provide both Registration ID and Captain Phone/Email.' });
      return;
    }

    const cleanId = registrationId.trim().toUpperCase();
    const cleanVerify = verifyField.trim().toLowerCase().replace(/\D/g, '');

    const reg = db.getRegistrations(true).find(r => {
      const matchId = r.registrationNumber.toUpperCase() === cleanId || r.id === cleanId;
      if (!matchId) return false;
      const cleanPhone = r.captainPhone.replace(/\D/g, '');
      const matchPhone = cleanPhone.includes(cleanVerify) || cleanVerify.includes(cleanPhone);
      const matchEmail = r.captainEmail.toLowerCase() === verifyField.trim().toLowerCase();
      return matchPhone || matchEmail;
    });

    if (!reg) {
      res.status(404).json({ error: 'No matching registration found. Please verify your Registration ID and contact details.' });
      return;
    }

    // Return sanitized tracking view
    res.json({
      registrationNumber: reg.registrationNumber,
      teamName: reg.teamName,
      college: reg.college,
      city: reg.city,
      captainName: reg.captainName,
      registrationStatus: reg.registrationStatus,
      paymentStatus: reg.paymentStatus,
      paymentMethod: reg.payment.method,
      amountPaid: reg.payment.amountPaid,
      submittedAt: reg.createdAt,
      statusHistory: reg.statusHistory,
      archived: reg.archived,
      rejectionReason: reg.payment.rejectionReason
    });
  });

  // ==========================================
  // AUTHENTICATION & ADMIN SESSION
  // ==========================================

  app.post('/api/auth/login', (req: Request, res: Response): void => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const admins = db.getAdminUsers();
    const foundAdmin = admins.find(a => a.email.toLowerCase() === email.trim().toLowerCase());

    // Standard demo admin validation (accepts default admin123 or valid admin email)
    if (foundAdmin && (password === 'admin123' || password === 'esports2026!')) {
      const token = `adm_token_${foundAdmin.id}_${Date.now()}`;
      foundAdmin.lastLogin = new Date().toISOString();
      res.json({
        success: true,
        token,
        user: foundAdmin
      });
      return;
    }

    res.status(401).json({ error: 'Invalid email or password. Use admin@esports.io / admin123 for demo access.' });
  });

  // Admin Middleware for protected routes
  const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized. Admin authorization token required.' });
      return;
    }
    const token = authHeader.split(' ')[1];
    if (!token || !token.startsWith('adm_token_')) {
      res.status(401).json({ error: 'Invalid or expired session token.' });
      return;
    }
    // Attach admin name for audit logging
    (req as any).adminName = 'Chief Tournament Director';
    next();
  };

  // ==========================================
  // ADMIN CONTROL API
  // ==========================================

  // Dashboard Stats & KPIs
  app.get('/api/admin/dashboard', requireAdmin, (_req: Request, res: Response) => {
    const analytics = db.getAnalytics();
    const recentRegistrations = db.getRegistrations().slice(0, 5);
    res.json({
      analytics,
      recentRegistrations
    });
  });

  // Analytics endpoint
  app.get('/api/admin/analytics', requireAdmin, (_req: Request, res: Response) => {
    res.json(db.getAnalytics());
  });

  // Registrations Table (with search, filtering, pagination)
  app.get('/api/admin/registrations', requireAdmin, (req: Request, res: Response) => {
    const { search, regStatus, payStatus, college, page, limit, showArchived } = req.query;

    let items = db.getRegistrations(showArchived === 'true');

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      items = items.filter(
        r =>
          r.teamName.toLowerCase().includes(q) ||
          r.registrationNumber.toLowerCase().includes(q) ||
          r.captainName.toLowerCase().includes(q) ||
          r.captainPhone.includes(q) ||
          r.college.toLowerCase().includes(q) ||
          r.payment.transactionId.toLowerCase().includes(q)
      );
    }

    if (regStatus && typeof regStatus === 'string' && regStatus !== 'ALL') {
      items = items.filter(r => r.registrationStatus === regStatus);
    }

    if (payStatus && typeof payStatus === 'string' && payStatus !== 'ALL') {
      items = items.filter(r => r.paymentStatus === payStatus);
    }

    if (college && typeof college === 'string' && college !== 'ALL') {
      items = items.filter(r => r.college.toLowerCase().includes(college.toLowerCase()));
    }

    // Support both paginated and full list formats
    const total = items.length;
    if (page || limit) {
      const pageNum = parseInt(page as string, 10) || 1;
      const limitNum = parseInt(limit as string, 10) || 15;
      const startIndex = (pageNum - 1) * limitNum;
      const paginated = items.slice(startIndex, startIndex + limitNum);

      res.json({
        items: paginated,
        registrations: items,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum)
      });
      return;
    }

    res.json({
      registrations: items,
      items,
      total
    });
  });

  // Archived Registrations List
  app.get('/api/admin/registrations/archived', requireAdmin, (_req: Request, res: Response) => {
    const all = db.getRegistrations(true);
    const archived = all.filter(r => r.archived);
    res.json({ archived });
  });

  // Single Registration Detail
  app.get('/api/admin/registrations/:id', requireAdmin, (req: Request, res: Response): void => {
    const reg = db.getRegistrationById(req.params.id);
    if (!reg) {
      res.status(404).json({ error: 'Registration record not found.' });
      return;
    }
    res.json(reg);
  });

  // Update Registration Status
  app.post('/api/admin/registrations/:id/status', requireAdmin, (req: Request, res: Response): void => {
    const { registrationStatus, paymentStatus, reason } = req.body;
    const adminName = (req as any).adminName || 'Admin';

    const updated = db.updateRegistrationStatus(
      req.params.id,
      registrationStatus,
      paymentStatus,
      adminName,
      reason
    );

    if (!updated) {
      res.status(404).json({ error: 'Registration not found' });
      return;
    }
    res.json({ success: true, registration: updated });
  });

  // Verify Payment Direct Action
  app.post('/api/admin/registrations/:id/verify-payment', requireAdmin, (req: Request, res: Response): void => {
    const adminName = (req as any).adminName || 'Admin';
    const updated = db.updateRegistrationStatus(
      req.params.id,
      undefined,
      'Verified',
      adminName,
      'Payment verified by administrator'
    );
    if (!updated) {
      res.status(404).json({ error: 'Registration not found' });
      return;
    }
    res.json({ success: true, registration: updated });
  });

  // Reject Payment with Reason
  app.post('/api/admin/registrations/:id/reject-payment', requireAdmin, (req: Request, res: Response): void => {
    const { reason } = req.body;
    const adminName = (req as any).adminName || 'Admin';

    const updated = db.updateRegistrationStatus(
      req.params.id,
      undefined,
      'Rejected',
      adminName,
      reason || 'Payment screenshot or transaction ID does not match records.'
    );
    if (!updated) {
      res.status(404).json({ error: 'Registration not found' });
      return;
    }
    res.json({ success: true, registration: updated });
  });

  // Soft Delete / Archive Registration
  const handleArchiveRegistration = (req: Request, res: Response): void => {
    const { reason } = req.body || {};
    const adminName = (req as any).adminName || 'Admin';
    const success = db.archiveRegistration(req.params.id, reason || 'Archived by administrator', adminName);
    if (!success) {
      res.status(404).json({ error: 'Registration not found' });
      return;
    }
    res.json({ success: true, message: 'Registration archived safely without data loss.' });
  };

  app.post('/api/admin/registrations/:id/archive', requireAdmin, handleArchiveRegistration);
  app.delete('/api/admin/registrations/:id', requireAdmin, handleArchiveRegistration);

  // Restore Archived Registration
  app.post('/api/admin/registrations/:id/restore', requireAdmin, (req: Request, res: Response): void => {
    const adminName = (req as any).adminName || 'Admin';
    const success = db.restoreRegistration(req.params.id, adminName);
    if (!success) {
      res.status(404).json({ error: 'Registration not found' });
      return;
    }
    res.json({ success: true, message: 'Registration restored successfully.' });
  });

  // Add Admin Note
  app.post('/api/admin/registrations/:id/note', requireAdmin, (req: Request, res: Response): void => {
    const { text } = req.body;
    const adminName = (req as any).adminName || 'Admin';
    if (!text) {
      res.status(400).json({ error: 'Note text cannot be empty' });
      return;
    }
    const updated = db.addAdminNote(req.params.id, text, adminName);
    if (!updated) {
      res.status(404).json({ error: 'Registration not found' });
      return;
    }
    res.json({ success: true, registration: updated });
  });

  // Tournament Settings (Get & Update)
  app.get('/api/admin/settings', requireAdmin, (_req: Request, res: Response) => {
    res.json(db.getSettings());
  });

  app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
    const adminName = (req as any).adminName || 'Admin';
    const updated = db.updateSettings(req.body, adminName);
    res.json({ success: true, settings: updated });
  });

  // Payment QR Management
  app.get(['/api/admin/payment-qr', '/api/tournament/payment-qr/all'], (_req: Request, res: Response) => {
    res.json({ qrConfigs: db.getQRCodes() });
  });

  app.post(
    '/api/admin/payment-qr',
    requireAdmin,
    uploadMiddleware.single('qrImage'),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const body = req.body;
        const adminName = (req as any).adminName || 'Admin';

        let qrImageUrl = body.qrImageUrl || '';
        if (req.file) {
          qrImageUrl = await persistFile(req.file);
        }

        if (!qrImageUrl) {
          res.status(400).json({ error: 'QR Code image file or image URL is required.' });
          return;
        }

        const newQR = db.addQRCode(
          {
            title: body.title || 'Official Payment QR',
            qrImageUrl,
            accountName: body.accountName || 'Tournament Organizer',
            accountNumber: body.accountNumber || '',
            paymentMethod: body.paymentMethod || 'eSewa',
            instructions: body.instructions || 'Scan with your payment app and include Team Name in remarks.',
            isActive: body.isActive === 'true' || body.isActive === true
          },
          adminName
        );

        res.status(201).json({ success: true, qrCode: newQR });
      } catch (err: any) {
        res.status(500).json({ error: err.message || 'Failed to upload QR code.' });
      }
    }
  );

  app.put('/api/admin/payment-qr/:id/active', requireAdmin, (req: Request, res: Response): void => {
    const adminName = (req as any).adminName || 'Admin';
    const success = db.setActiveQRCode(req.params.id, adminName);
    if (!success) {
      res.status(404).json({ error: 'QR Code not found' });
      return;
    }
    res.json({ success: true, message: 'Active QR code updated. Public site reflects this immediately.' });
  });

  app.delete('/api/admin/payment-qr/:id', requireAdmin, (req: Request, res: Response): void => {
    const adminName = (req as any).adminName || 'Admin';
    const success = db.deleteQRCode(req.params.id, adminName);
    if (!success) {
      res.status(404).json({ error: 'QR Code not found' });
      return;
    }
    res.json({ success: true, message: 'QR Code deleted.' });
  });

  // Leaderboard Management
  app.post('/api/admin/leaderboard', requireAdmin, (req: Request, res: Response) => {
    const adminName = (req as any).adminName || 'Admin';
    const updated = db.updateLeaderboardEntry(req.body, adminName);
    res.json({ success: true, entry: updated, leaderboard: db.getLeaderboard() });
  });

  app.delete('/api/admin/leaderboard/:id', requireAdmin, (req: Request, res: Response): void => {
    const adminName = (req as any).adminName || 'Admin';
    const success = db.deleteLeaderboardEntry(req.params.id, adminName);
    if (!success) {
      res.status(404).json({ error: 'Entry not found' });
      return;
    }
    res.json({ success: true, leaderboard: db.getLeaderboard() });
  });

  // Matches Management
  app.post('/api/admin/matches', requireAdmin, (req: Request, res: Response) => {
    const adminName = (req as any).adminName || 'Admin';
    const created = db.addMatch(req.body, adminName);
    res.status(201).json({ success: true, match: created });
  });

  app.put('/api/admin/matches/:id', requireAdmin, (req: Request, res: Response): void => {
    const adminName = (req as any).adminName || 'Admin';
    const updated = db.updateMatch(req.params.id, req.body, adminName);
    if (!updated) {
      res.status(404).json({ error: 'Match not found' });
      return;
    }
    res.json({ success: true, match: updated });
  });

  app.delete('/api/admin/matches/:id', requireAdmin, (req: Request, res: Response): void => {
    const adminName = (req as any).adminName || 'Admin';
    const success = db.deleteMatch(req.params.id, adminName);
    if (!success) {
      res.status(404).json({ error: 'Match not found' });
      return;
    }
    res.json({ success: true });
  });

  // Sponsors Management
  app.post('/api/admin/sponsors', requireAdmin, (req: Request, res: Response) => {
    const adminName = (req as any).adminName || 'Admin';
    const created = db.addSponsor(req.body, adminName);
    res.status(201).json({ success: true, sponsor: created });
  });

  app.put('/api/admin/sponsors/:id', requireAdmin, (req: Request, res: Response): void => {
    const adminName = (req as any).adminName || 'Admin';
    const updated = db.updateSponsor(req.params.id, req.body, adminName);
    if (!updated) {
      res.status(404).json({ error: 'Sponsor not found' });
      return;
    }
    res.json({ success: true, sponsor: updated });
  });

  app.delete('/api/admin/sponsors/:id', requireAdmin, (req: Request, res: Response): void => {
    const adminName = (req as any).adminName || 'Admin';
    const success = db.deleteSponsor(req.params.id, adminName);
    if (!success) {
      res.status(404).json({ error: 'Sponsor not found' });
      return;
    }
    res.json({ success: true });
  });

  // Announcements Management
  app.post('/api/admin/announcements', requireAdmin, (req: Request, res: Response) => {
    const adminName = (req as any).adminName || 'Admin';
    const created = db.addAnnouncement(req.body, adminName);
    res.status(201).json({ success: true, announcement: created });
  });

  app.put('/api/admin/announcements/:id', requireAdmin, (req: Request, res: Response): void => {
    const adminName = (req as any).adminName || 'Admin';
    const updated = db.updateAnnouncement(req.params.id, req.body, adminName);
    if (!updated) {
      res.status(404).json({ error: 'Announcement not found' });
      return;
    }
    res.json({ success: true, announcement: updated });
  });

  app.delete('/api/admin/announcements/:id', requireAdmin, (req: Request, res: Response): void => {
    const adminName = (req as any).adminName || 'Admin';
    const success = db.deleteAnnouncement(req.params.id, adminName);
    if (!success) {
      res.status(404).json({ error: 'Announcement not found' });
      return;
    }
    res.json({ success: true });
  });

  // Audit Logs
  app.get('/api/admin/audit-logs', requireAdmin, (_req: Request, res: Response) => {
    res.json(db.getAuditLogs(200));
  });

  // Admin Users
  app.get('/api/admin/users', requireAdmin, (_req: Request, res: Response) => {
    res.json(db.getAdminUsers());
  });

  app.post('/api/admin/users', requireAdmin, (req: Request, res: Response) => {
    const adminName = (req as any).adminName || 'Super Admin';
    const newUser = db.addAdminUser(req.body, adminName);
    res.status(201).json({ success: true, user: newUser });
  });

  // Data Export (CSV or JSON)
  app.get('/api/admin/export/:format', requireAdmin, (req: Request, res: Response): void => {
    const format = req.params.format.toLowerCase();
    const registrations = db.getRegistrations(true);

    if (format === 'csv') {
      const headers = [
        'Registration ID',
        'Team Name',
        'College',
        'City',
        'Captain Name',
        'Captain Phone',
        'Captain Email',
        'Reg Status',
        'Payment Status',
        'Amount Paid',
        'Transaction ID',
        'Submitted At'
      ];
      const rows = registrations.map(r => [
        `"${r.registrationNumber}"`,
        `"${r.teamName.replace(/"/g, '""')}"`,
        `"${r.college.replace(/"/g, '""')}"`,
        `"${r.city.replace(/"/g, '""')}"`,
        `"${r.captainName.replace(/"/g, '""')}"`,
        `"${r.captainPhone}"`,
        `"${r.captainEmail}"`,
        `"${r.registrationStatus}"`,
        `"${r.paymentStatus}"`,
        r.payment.amountPaid,
        `"${r.payment.transactionId}"`,
        `"${r.createdAt}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=esports-registrations-${Date.now()}.csv`);
      res.send(csvContent);
      return;
    }

    // Default JSON Full Backup
    const backup = db.getFullBackup();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=esports-tournament-backup-${Date.now()}.json`);
    res.json(backup);
  });

  // ==========================================
  // VITE & STATIC PRODUCTION SERVING
  // ==========================================

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[EsportsHub Server] Running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[EsportsHub Server] Fatal error during startup:', err);
});
