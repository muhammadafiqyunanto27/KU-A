# Website Kelas — KU-A

Website profil class untuk **KU-A**. Publik melihat hasil akhir (profil class, portofolio anggota, laporan keuangan), sementara setiap user login untuk mengedit hanya sesuai otoritas masing-masing.

## Stack

- **Next.js (App Router)** — frontend + backend (API / server actions)
- **Tailwind CSS** — styling + glassmorphism design system
- **Neon (PostgreSQL)** — database (+ session JWT + Vercel Blob untuk upload)
- **Vercel** — hosting (GitHub → Vercel autodeploy)

## Dokumentasi

Semua konteks & keputusan ada di `docs/` — baca ini dulu sebelum mulai ngoding:

| File | Isi |
|---|---|
| [`docs/PROJECT_BRIEF.md`](docs/PROJECT_BRIEF.md) | Tujuan, visi, non-goals aplikasi |
| [`docs/ROLES_PERMISSIONS.md`](docs/ROLES_PERMISSIONS.md) | 4 peran user + matriks izin |
| [`docs/TECH_STACK.md`](docs/TECH_STACK.md) | Kenapa Next.js / Supabase / Vercel |
| [`docs/DATABASE_SCHEMA.md`](docs/DATABASE_SCHEMA.md) | Tabel, kolom, relasi, RLS |
| [`docs/PAGES_ROUTES.md`](docs/PAGES_ROUTES.md) | Route publik vs protected |
| [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) | Tema glassmorphism, palet dark/light |
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | MVP (Phase 1) vs fitur lanjutan |

> Untuk AI agent: baca [`AGENTS.md`](AGENTS.md) dan `docs/` sebelum ngerjain tugas supaya tetap fokus dengan purpose aplikasi.

## Cara Mulai Dev

```bash
npm install
cp .env.example .env.local   # isi DATABASE_URL, AUTH_SECRET, BLOB_READ_WRITE_TOKEN
psql "$DATABASE_URL" -f db/0001_schema.sql   # sekali jalan
npm run dev
```

Environment variables (lihat `docs/TECH_STACK.md`):
```
DATABASE_URL=postgres://...
AUTH_SECRET=...
BLOB_READ_WRITE_TOKEN=...
```
