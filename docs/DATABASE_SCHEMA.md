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
| `role` | text | `super_admin`/`ketua_kelas`/`wakil_ketua_kelas`/`bendahara`/`sekretaris`/`anggota` |
| `avatar_url` | text | foto profil (blob `avatar/<userId>/…`) |
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

### `certificates` — sertifikat per anggota

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK → profiles (cascade) | |
| `title` | text | |
| `image_url` | text | foto sertifikat (blob `certificate/<userId>/…`) |
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

- Schema + seed awal: `db/0001_schema.sql`.
- Migrasi `db/0002_roles.sql`: menambah role `wakil_ketua_kelas` & `sekretaris`, dan menghapus akun khusus `ketua@ku-a.test` / `bendahara@ku-a.test` (pengurus sekarang user nyata ber-role).
- Migrasi `db/0003_certificates.sql`: tabel `certificates` untuk upload sertifikat per anggota.
- `node db/apply.mjs <nama-file>` untuk menjalankan migrasi.

`db/0001_schema.sql` berisi:

- 30 siswa: NIS `4.43.26.0.01`–`0.30`, email `<NIS>@ku-a.test`, password = NIS, role `anggota`.
- 1 akun khusus:
  - `superadmin@ku-a.test` / `BintangTua#91` — role `super_admin`
- Pengurus (ketua/wakil/bendahara/sekretaris) dipilih dari siswa oleh Super Admin.

Kredensial seed dipakai untuk testing; jangan dipakai di produksi. Password wajib diganti setelah login.