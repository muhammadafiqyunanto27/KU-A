# TECH_STACK — Keputusan Teknologi

## Pilihan

| Layer | Teknologi | Alasan |
|---|---|---|
| Frontend + Backend | **Next.js (App Router)** | Modern, mutakhir, SSR, API routes + server actions, integrasi sempurna dengan Vercel |
| Styling | **Tailwind CSS** | Enteng, utility-first, mudah konsisten dengan design system |
| Database | **Neon (PostgreSQL)** | Serverless Postgres, free tier besar, relational (cocok untuk profil+keuangan) |
| Auth | **Session JWT custom (`jose`)** | Cookie httpOnly + HS256. Ringan, tanpa dependensi framework auth, cek role di server + middleware |
| Storage | **Vercel Blob** | Upload foto background, gratis, terintegrasi Vercel |
| Hosting | **Vercel** | Autodeploy dari GitHub, domain `.vercel.app` gratis, siap custom domain |

> Migrasi dari Supabase (kena limit jumlah project): DB → Neon, Auth → session JWT,
> Storage → Vercel Blob. Peran & hak akses dikontrol **di server (Next.js)**, bukan RLS.

## Kenapa Next.js

- Satu codebase untuk UI + server logic (server components, server actions).
- `middleware` (proxy) dipakai untuk proteksi route berbasis role.
- Deploy ke Vercel = sangat mudah & gratis.

## Keamanan (pengganti RLS)

- Semua query data melewati **server component / server action** — tidak ada Supabase client di browser.
- Setiap server action **cek sesi + role** sebelum menulis data.
- Middleware memblokir route dashboard yang bukan otoritasnya.
- Kolom `email` & `password_hash` **tidak pernah** ikut query publik.

## Versi & Tooling

- Node.js ≥ 20 LTS
- npm (package manager)
- TypeScript strict mode
- `next` 16, `react` 19, Tailwind v4
- `@neondatabase/serverless`, `@vercel/blob`, `bcryptjs`, `jose`

## Environment Variables

Di `.env.local` (jangan pernah commit):

```
DATABASE_URL=postgres://…            # connection string Neon
AUTH_SECRET=…                        # generate: openssl rand -base64 32
BLOB_READ_WRITE_TOKEN=…              # dari dashboard Vercel Blob
```

## Struktur Direktori (ringkas)

```
src/
├── app/            # Route (App Router)
├── components/     # ui/, public/, dashboard/
├── lib/            # db, session, auth, data, actions/, types.ts
└── proxy.ts        # proteksi route + role (middleware)
db/                 # schema + seed (0001_schema.sql)
```