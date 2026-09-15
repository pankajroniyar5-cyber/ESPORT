-- ====================================================================
-- ESPORTS TOURNAMENT PLATFORM: POSTGRESQL & SUPABASE CLOUD SCHEMA
-- Run this script in the Supabase SQL Editor to provision all tables.
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tournament Settings Table
CREATE TABLE IF NOT EXISTS tournament_settings (
  id VARCHAR(64) PRIMARY KEY DEFAULT 'main-settings',
  tournament_name VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  season VARCHAR(64),
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  registration_status VARCHAR(32) DEFAULT 'OPEN',
  registration_fee NUMERIC(10, 2) DEFAULT 500,
  currency VARCHAR(16) DEFAULT 'Rs.',
  prize_pool VARCHAR(64) DEFAULT 'Rs. 50,000',
  max_teams INTEGER DEFAULT 64,
  team_size INTEGER DEFAULT 4,
  substitute_count INTEGER DEFAULT 1,
  registration_open_date DATE,
  registration_close_date DATE,
  tournament_start_date DATE,
  tournament_end_date DATE,
  match_dates VARCHAR(255),
  rules JSONB DEFAULT '[]'::jsonb,
  prizes JSONB DEFAULT '{}'::jsonb,
  contact_phone VARCHAR(64),
  contact_whatsapp VARCHAR(64),
  contact_email VARCHAR(255),
  socials JSONB DEFAULT '{}'::jsonb,
  announcement_text TEXT,
  announcement_active BOOLEAN DEFAULT true,
  hero_headline VARCHAR(255),
  hero_subtext TEXT,
  footer_text TEXT,
  theme_accent VARCHAR(32) DEFAULT '#f59e0b',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Payment QR Codes Table
CREATE TABLE IF NOT EXISTS payment_qr_codes (
  id VARCHAR(64) PRIMARY KEY DEFAULT 'qr-' || uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  qr_image_url TEXT NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  account_number VARCHAR(255) NOT NULL,
  payment_method VARCHAR(64) NOT NULL,
  instructions TEXT,
  is_active BOOLEAN DEFAULT false,
  uploaded_by VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Registrations Table
CREATE TABLE IF NOT EXISTS registrations (
  id VARCHAR(64) PRIMARY KEY DEFAULT 'reg-' || uuid_generate_v4(),
  registration_number VARCHAR(32) UNIQUE NOT NULL,
  team_name VARCHAR(255) NOT NULL,
  college VARCHAR(255) NOT NULL,
  city VARCHAR(128) NOT NULL,
  captain_name VARCHAR(255) NOT NULL,
  captain_phone VARCHAR(64) NOT NULL,
  captain_whatsapp VARCHAR(64) NOT NULL,
  captain_email VARCHAR(255) NOT NULL,
  team_logo_url TEXT,
  players JSONB NOT NULL DEFAULT '[]'::jsonb,
  payment JSONB NOT NULL DEFAULT '{}'::jsonb,
  registration_status VARCHAR(32) DEFAULT 'Submitted',
  payment_status VARCHAR(32) DEFAULT 'Pending',
  status_history JSONB DEFAULT '[]'::jsonb,
  admin_notes JSONB DEFAULT '[]'::jsonb,
  archived BOOLEAN DEFAULT false,
  archived_at TIMESTAMPTZ,
  archived_by VARCHAR(255),
  archive_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast searching and filtering
CREATE INDEX IF NOT EXISTS idx_reg_status ON registrations (registration_status);
CREATE INDEX IF NOT EXISTS idx_payment_status ON registrations (payment_status);
CREATE INDEX IF NOT EXISTS idx_reg_number ON registrations (registration_number);
CREATE INDEX IF NOT EXISTS idx_captain_phone ON registrations (captain_phone);
CREATE INDEX IF NOT EXISTS idx_captain_email ON registrations (captain_email);
CREATE INDEX IF NOT EXISTS idx_archived ON registrations (archived);

-- 5. Leaderboard Entries Table
CREATE TABLE IF NOT EXISTS leaderboard (
  id VARCHAR(64) PRIMARY KEY DEFAULT 'lb-' || uuid_generate_v4(),
  team_id VARCHAR(64),
  team_name VARCHAR(255) NOT NULL,
  college VARCHAR(255),
  matches_played INTEGER DEFAULT 0,
  placement_points INTEGER DEFAULT 0,
  kill_points INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  booyah_count INTEGER DEFAULT 0,
  rank INTEGER DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Match Schedule Table
CREATE TABLE IF NOT EXISTS matches (
  id VARCHAR(64) PRIMARY KEY DEFAULT 'match-' || uuid_generate_v4(),
  match_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  round VARCHAR(128) NOT NULL,
  date VARCHAR(64) NOT NULL,
  time VARCHAR(64) NOT NULL,
  map VARCHAR(64) DEFAULT 'Bermuda',
  room_status VARCHAR(64) DEFAULT 'Upcoming',
  room_id VARCHAR(128),
  room_password VARCHAR(128),
  live_stream_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Sponsors Table
CREATE TABLE IF NOT EXISTS sponsors (
  id VARCHAR(64) PRIMARY KEY DEFAULT 'sp-' || uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  tier VARCHAR(64) DEFAULT 'Gold',
  display_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id VARCHAR(64) PRIMARY KEY DEFAULT 'ann-' || uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  priority VARCHAR(32) DEFAULT 'normal',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(64) PRIMARY KEY DEFAULT 'log-' || uuid_generate_v4(),
  admin_name VARCHAR(255) NOT NULL,
  action VARCHAR(128) NOT NULL,
  record_id VARCHAR(128),
  details TEXT,
  previous_value TEXT,
  new_value TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  ip VARCHAR(64)
);

-- 10. Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id VARCHAR(64) PRIMARY KEY DEFAULT 'admin-' || uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(64) DEFAULT 'ADMIN',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Storage bucket configuration reminder:
-- In Supabase Dashboard -> Storage:
-- Create a public bucket named 'tournament-assets' for public display of logos and active QR codes.
