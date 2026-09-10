-- =============================================================
-- KU-A Website Kelas — Migration: tabel sertifikat per anggota
-- Jalankan: node db/apply.mjs 0003_certificates.sql
-- =============================================================

create table if not exists certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists certificates_user_id_idx on certificates (user_id, created_at desc);