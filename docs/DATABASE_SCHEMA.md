# DATABASE_SCHEMA — Struktur Database (Neon / Postgres)

> Postgres di **Neon**. Akses dikontrol **di server Next.js** (server action + cek role),
> TIDAK pakai RLS. Pastikan type di `src/lib/types.ts` sinkron dengan tabel ini.

## Catatan penting

- Kolom `email` & `password_hash` di `profiles` **hanya untuk login** — semua query publik
  (lihat `PROFILE_COLUMNS` di `src/lib/data.ts`) tidak boleh menyertakan kolom ini.
- Password di-hash dengan `crypt(bf)` / bcrypt (`bcryptjs.compare` untuk verifikasi).
- Schema + seed dijalankan sekali lewat `db/0001_schema.sql`.

## Tabel

### `profiles` — user & akun login

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid PK | `gen_random_uuid()` |
| `email` | text, unique | dipakai untuk login |
| `password_hash` | text | hash bcrypt (pgcrypto `crypt`) |
| `full_name` | text | |
| `nickname` | text | |
| `role` | text | `super_admin`/`ketua_kelas`/`bendahara`/`anggota` |
| `avatar_url` | text | |
| `bio` | text | |
| `skills` | text[] | |
| `socials` | jsonb | `{instagram, github, linkedin, whatsapp, email}` |
| `created_at` / `updated_at` | timestamptz | |

### `class_profile` — konten halaman utama (single row)

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid PK | |
| `class_name` / `tagline` / `description` | text | |
| `banner_url` / `logo_url` | text | |
| `socials` | jsonb | `{instagram, github, tiktok, youtube}` |
| `contact` | jsonb | `{email, phone, address, schedule}` |
| `updated_by` | uuid FK → profiles | |
| `updated_at` | timestamptz | |

### `class_backgrounds` — foto latar slideshow

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid PK | |
| `url` | text | URL publik Vercel Blob |
| `path` | text | path di Blob (untuk delete) |
| `position` | int | urutan tampil |
| `created_at` | timestamptz | |

### `portfolios` — portofolio per anggota

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK → profiles (cascade) | |
| `title` | text | |
| `description` / `image_url` / `project_url` | text | |
| `tags` | text[] | |
| `created_at` / `updated_at` | timestamptz | |

### `finance_transactions` — kas class

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid PK | |
| `type` | text | `income` / `expense` |
| `amount` | numeric | ≥ 0 |
| `description` / `category` | text | |
| `date` | date | |
| `receipt_url` | text | |
| `created_by` | uuid FK → profiles | |
| `created_at` | timestamptz | |

## Seed

`db/0001_schema.sql` berisi:

- 30 siswa: NIS `4.43.26.0.01`–`0.30`, email `<NIS>@ku-a.test`, password = NIS, role `anggota`.
- 3 akun khusus:
  - `superadmin@ku-a.test` / `BintangTua#91` — role `super_admin`
  - `ketua@ku-a.test` / `PantaiSenja@33` — role `ketua_kelas`
  - `bendahara@ku-a.test` / `GunungSalju$17` — role `bendahara`
- Seluruh akun hasil seed WAJIB ganti password setelah login (belum ada fitur ganti password — awaiting future or handled via SQL).

Kredensial seed dipakai untuk testing; jangan dipakai di produksi.