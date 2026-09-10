# PAGES_ROUTES — Ringkasan Route

> Route mana publik, mana protected. Proteksi dilakukan di `middleware.ts` + pengecekan role di server.

## Publik (tanpa login)

| Route | Halaman | Isi |
|---|---|---|
| `/` | Landing | Profil class (hero, tagline, deskripsi, sosmed/kontak), highlight anggota |
| `/members` | Daftar anggota | Grid/kartu semua anggota (foto, nama, role) |
| `/members/[id]` | Detail anggota | Profil & portofolio satu anggota |
| `/finance` | Keuangan publik | Ringkasan kas, tabel pemasukan/pengeluaran, grafik (Phase 2) |

## Auth

| Route | Halaman | Isi |
|---|---|---|
| `/login` | Login | Form email + password (session JWT sendiri) |
| `/logout` | (aksi) | Sign out lalu redirect ke `/` |

## Protected — Dashboard (wajib login)

| Route | Halaman | Role yang boleh | Isi |
|---|---|---|---|
| `/dashboard` | Home dashboard | semua peran | Ringkasan & quick links sesuai role |
| `/dashboard/profile` | Edit profil sendiri | semua peran | Upload foto, edit info pribadi + portofolio sendiri |
| `/dashboard/class` | Edit profil class | `super_admin`, `ketua_kelas`, `wakil_ketua_kelas`, `sekretaris` | Update heading/gambar/teks/sosmed/kontak class |
| `/dashboard/finance` | Manajemen keuangan | `super_admin`, `ketua_kelas`, `wakil_ketua_kelas`, `bendahara` | CRUD transaksi, kategori, ringkasan, bukti |
| `/dashboard/users` | Manajemen user | `super_admin` | Lihat/kelola user, ubah role |

## Diagram Proteksi

```
Request
  └─ proxy.ts (cek sesi)
       ├─ route publik            → diteruskan
       └─ route /dashboard/...    → wajib login
            ├─ /dashboard/users   → role super_admin
            ├─ /dashboard/class   → super_admin | ketua_kelas | wakil_ketua_kelas | sekretaris
            ├─ /dashboard/finance → super_admin | ketua_kelas | wakil_ketua_kelas | bendahara
            └─ /dashboard/profile → semua (hanya edit dirinya)
```

Server (server component / server action) **memeriksa ulang** role & kepemilikan data — middleware saja tidak cukup.

## Gagal Aman (fail-safe)

- Role tak dikenal / belum diisi → diperlakukan sebagai `anggota` (paling rendah).
- Akses ditolak → redirect ke `/login` atau tampilkan halaman "tidak berhak".
- Fetch gagal → tampilkan skeleton/placeholder, jangan crash.