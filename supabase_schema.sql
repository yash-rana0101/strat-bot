-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Strat AI Discord Bot - Supabase Database Schema
-- Paste this script into your Supabase SQL Editor and run it.
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id bigint primary key generated always as identity,
  channel_id text not null unique,
  user_id text not null,
  category text not null,
  status text not null default 'open',
  subject text not null default '',
  claimed_by text,
  priority text not null default 'normal',
  created_at timestamp with time zone not null default now(),
  closed_at timestamp with time zone,
  closed_by text
);

-- Create ticket_messages table
CREATE TABLE IF NOT EXISTS ticket_messages (
  id bigint primary key generated always as identity,
  ticket_id bigint not null references tickets(id) on delete cascade,
  user_id text not null,
  content text not null,
  created_at timestamp with time zone not null default now()
);

-- Create members table
CREATE TABLE IF NOT EXISTS members (
  user_id text primary key,
  username text not null,
  joined_at timestamp with time zone not null default now(),
  verified_at timestamp with time zone,
  message_count bigint not null default 0,
  last_active timestamp with time zone,
  roles_snapshot text default '[]'
);

-- Create infractions table
CREATE TABLE IF NOT EXISTS infractions (
  id bigint primary key generated always as identity,
  user_id text not null,
  moderator_id text not null,
  type text not null,
  reason text not null,
  duration bigint,
  created_at timestamp with time zone not null default now(),
  expires_at timestamp with time zone,
  active integer not null default 1
);

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id bigint primary key generated always as identity,
  type text not null,
  user_id text,
  channel_id text,
  metadata jsonb,
  created_at timestamp with time zone not null default now()
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id bigint primary key generated always as identity,
  action text not null,
  actor_id text,
  target_id text,
  details text,
  created_at timestamp with time zone not null default now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tickets_user ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_infractions_user ON infractions(user_id);
CREATE INDEX IF NOT EXISTS idx_infractions_active ON infractions(active);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(type);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
