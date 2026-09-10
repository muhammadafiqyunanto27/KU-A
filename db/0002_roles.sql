-- =============================================================
-- KU-A Website Kelas — Migration: perbaikan model role
-- Jalankan sekali di: Neon Console → SQL editor, atau
--   psql "$DATABASE_URL" -f db/0002_roles.sql
--
-- 1. Role baru: wakil_ketua_kelas & sekretaris.
-- 2. Hapus akun khusus ketua@ku-a.test & bendahara@ku-a.test
--    (pengurus sekarang adalah user nyata ber-role, bukan akun istimewa).
-- =============================================================

alter table profiles drop constraint if exists profiles_role_check;
alter table profiles add constraint profiles_role_check
  check (role in ('super_admin', 'ketua_kelas', 'wakil_ketua_kelas', 'bendahara', 'sekretaris', 'anggota'));

delete from profiles where email in ('ketua@ku-a.test', 'bendahara@ku-a.test');