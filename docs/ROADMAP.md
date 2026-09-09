# ROADMAP — Rencana Pembangunan

> Fokus **MVP (Phase 1)** dulu. Fitur Phase 2+ hanya dikerjakan setelah MVP stabil & live.

## Status

- [x] Documents & planning (docs/)
- [x] Scaffold project (Next.js + Tailwind + Supabase clients)
- [x] Migrasi stack: Supabase → **Neon DB + session JWT (jose) + Vercel Blob**
- [ ] Neon setup + apply schema/seed (`db/0001_schema.sql`)
- [ ] Deploy awal

## Phase 1 — MVP

### 1. Foundation
- Scaffold Next.js + Tailwind.
- Setup Supabase client (browser & server), env variables, generate types.
- Layout dasar publik (navbar, footer) + dashboard (sidebar).

### 2. Auth & Roles
- Login email+password (session JWT custom, cookie httpOnly), sign-out.
- Middleware (proxy) proteksi route berdasarkan role.
- Seed 33 akun (30 siswa + 3 admin) di `db/0001_schema.sql`.
- (Future) ganti password, lupa password.

### 3. Halaman Publik
- Landing `/` — profil class dari `class_profile` (responsive, glassmorphism).
- `/members` — grid anggota.
- `/members/[id]` — profil + portofolio individu.
- `/finance` — laporan keuangan publik (ringkasan + tabel).

### 4. Dashboard
- `/dashboard` — home sesuai role.
- `/dashboard/profile` — edit profil sendiri + kelola portofolio sendiri.
- `/dashboard/class` — edit profil class (admin).
- `/dashboard/finance` — CRUD transaksi (bendahara), ringkasan kas.
- `/dashboard/users` — kelola user & role (super admin).

### 5. Polish & Deploy
- Dark/light mode + toggle.
- Empty states, skeleton loading, error states.
- Responsive audit (mobile-first).
- Push ke GitHub → deploy Vercel → cek env vars → live.

## Phase 2 — Lanjutan (setelah MVP)

- [ ] Grafik keuangan (Recharts / Chart.js) di halaman publik & dashboard.
- [ ] Export laporan PDF / CSV.
- [ ] Upload avatar/bukti transaksi via Vercel Blob (sekarang baru class background).
- [ ] Search & filter anggota / transaksi.
- [ ] Galeri foto class.
- [ ] Pengumuman / agenda class (CRUD oleh ketua kelas).
- [ ] Custom domain (dari `.vercel.app` ke domain sendiri).

## Phase 3 — Opsional

- [ ] Dark/light mode persist di localStorage (sudah di MVP kalau sempat).
- [ ] Notification / reminder iuran.
- [ ] Statistik kehadiran & iuran per anggota.
- [ ] i18n (Indonesia/English).

## Prinsip Penentuan Prioritas

"Kalau ragu antara fitur tambahan vs ngerampungin MVP, **pilih MVP**."